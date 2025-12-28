import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired rate limit entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Check and update rate limit for a given identifier
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetIn: record.resetTime - now };
}

// Input validation schema using Zod
const requestSchema = z.object({
  image1: z.string()
    .min(1, "image1 is required")
    .refine((val) => val.startsWith("data:image/") || val.startsWith("https://"), {
      message: "image1 must be a valid data URL or HTTPS URL"
    }),
  image2: z.string()
    .min(1, "image2 is required")
    .refine((val) => val.startsWith("data:image/") || val.startsWith("https://"), {
      message: "image2 must be a valid data URL or HTTPS URL"
    }),
  ratio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"], {
    errorMap: () => ({ message: "ratio must be one of: 1:1, 3:4, 4:3, 9:16, 16:9" })
  }),
  frameCount: z.number()
    .int("frameCount must be an integer")
    .min(1, "frameCount must be at least 1")
    .max(5, "frameCount must be at most 5"),
  scene: z.enum(["natural", "beach", "city", "mountains", "studio", "party"], {
    errorMap: () => ({ message: "scene must be one of: natural, beach, city, mountains, studio, party" })
  }),
  swapPositions: z.boolean({
    errorMap: () => ({ message: "swapPositions must be a boolean" })
  }),
  style: z.enum(["natural", "vintage", "cinematic", "vibrant", "neon", "bw", "sepia", "hdr", "dreamy", "warm"], {
    errorMap: () => ({ message: "style must be one of: natural, vintage, cinematic, vibrant, neon, bw, sepia, hdr, dreamy, warm" })
  })
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client identifier for rate limiting (use forwarded IP or fallback)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("x-real-ip") 
      || "unknown";
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(rateLimitResult.resetIn / 1000),
          success: false,
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(rateLimitResult.resetIn / 1000)),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000))
          } 
        }
      );
    }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      console.error("Failed to parse JSON body");
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          success: false,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input with Zod schema
    const validationResult = requestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }));
      console.error("Validation failed:", errors);
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: errors,
          success: false,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { image1, image2, ratio, frameCount, scene, swapPositions, style } = validationResult.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating combined snap with validated params:", { 
      ratio, 
      frameCount, 
      scene, 
      swapPositions, 
      style,
      clientIP: clientIP.substring(0, 8) + "***", // Log partial IP for debugging
      rateLimitRemaining: rateLimitResult.remaining
    });

    // Scene descriptions for the AI
    const sceneDescriptions: Record<string, string> = {
      natural: "a natural, realistic background that fits both people well",
      beach: "a beautiful sunny tropical beach with palm trees and ocean waves in the background",
      city: "a modern urban cityscape with tall buildings and city lights in the background",
      mountains: "majestic mountain peaks with scenic views and natural wilderness in the background",
      studio: "a professional photography studio with soft lighting and elegant backdrop",
      party: "a fun party atmosphere with colorful decorations, lights, and celebratory mood"
    };

    const sceneDescription = sceneDescriptions[scene];

    // Style descriptions for different visual filters
    const styleDescriptions: Record<string, string> = {
      natural: "Natural lighting and colors, clean and realistic look",
      vintage: "Vintage film look with warm sepia tones, slight grain, faded colors, nostalgic 70s/80s aesthetic",
      cinematic: "Cinematic movie-like look with dramatic lighting, deep shadows, desaturated colors with teal and orange color grading",
      vibrant: "Bold and vibrant colors, high saturation, punchy contrast, vivid and eye-catching",
      neon: "Cyberpunk neon aesthetic with glowing colors, purple and cyan lighting, futuristic atmosphere",
      bw: "Classic black and white photography, high contrast, dramatic shadows, timeless monochrome look with rich grayscale tones",
      sepia: "Warm sepia-toned photograph with brownish vintage coloring, reminiscent of old antique photographs from the early 1900s",
      hdr: "High Dynamic Range look with enhanced details in shadows and highlights, vibrant colors, hyper-realistic clarity and sharpness",
      dreamy: "Soft, ethereal dreamy look with gentle pastel colors, soft focus bloom effect, romantic and whimsical atmosphere",
      warm: "Warm golden hour lighting with rich amber and orange tones, cozy sunset vibes, flattering warm skin tones"
    };

    const styleDescription = styleDescriptions[style];

    // Get aspect ratio dimensions
    const ratioDimensions: Record<string, { width: number; height: number }> = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 576, height: 1024 },
      "16:9": { width: 1024, height: 576 }
    };

    const dimensions = ratioDimensions[ratio];

    // Generate narrative caption
    const narrativePrompt = `Create a one-sentence fun caption for a photo of two people appearing together in a combined snapshot. Make it playful and exciting. Keep it under 15 words.`;

    console.log("Generating narrative...");
    const narrativeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a creative writer who crafts fun, playful photo captions." },
          { role: "user", content: narrativePrompt }
        ],
      }),
    });

    let narrative = "Two worlds collided in one perfect shot!";
    if (narrativeResponse.ok) {
      const narrativeData = await narrativeResponse.json();
      narrative = narrativeData.choices?.[0]?.message?.content || narrative;
      console.log("Generated narrative:", narrative);
    } else {
      console.error("Narrative generation failed:", await narrativeResponse.text());
    }

    // Generate combined frames
    const frames: string[] = [];
    console.log(`Generating ${frameCount} combined frames...`);

    for (let i = 0; i < frameCount; i++) {
      const positionDesc = swapPositions 
        ? "with the second person on the LEFT and the first person on the RIGHT"
        : "with the first person on the LEFT and the second person on the RIGHT";
      
      const variationPrompts = [
        `${positionDesc}, looking at each other or the camera naturally`,
        `${positionDesc}, one slightly behind the other, both facing forward with friendly expressions`
      ];
      
      const variation = variationPrompts[i % variationPrompts.length];

      console.log(`Generating frame ${i + 1}/${frameCount}...`);

      try {
        const editResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Combine these two selfie photos into ONE natural-looking photo where both people appear together as if the photo was taken of them at the same time. Place them ${variation}. 
                    
IMPORTANT: 
- Keep both people's faces and features exactly as they appear in their original photos
- Make it look like a real photo taken together, not a collage
- Background: ${sceneDescription}
- Visual style: ${styleDescription}
- Natural lighting that matches both subjects and the scene
- Aspect ratio: ${ratio}
- High quality, professional looking combined photograph
- Apply the visual style consistently to the entire image`
                  },
                  {
                    type: "image_url",
                    image_url: { url: image1 }
                  },
                  {
                    type: "image_url", 
                    image_url: { url: image2 }
                  }
                ]
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (editResponse.ok) {
          const editData = await editResponse.json();
          const imageUrl = editData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            frames.push(imageUrl);
            console.log(`Frame ${i + 1} generated successfully`);
            continue;
          }
        } else {
          console.error(`Frame ${i + 1} generation failed:`, await editResponse.text());
        }

        // Fallback to placeholder
        console.log(`Frame ${i + 1} using placeholder fallback`);
        frames.push(`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=${dimensions.width}&h=${dimensions.height}&fit=crop&seed=${i}`);

      } catch (frameError) {
        console.error(`Error generating frame ${i + 1}:`, frameError);
        frames.push(`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=${dimensions.width}&h=${dimensions.height}&fit=crop&seed=${i}`);
      }
    }

    console.log(`Generated ${frames.length} frames successfully`);

    return new Response(
      JSON.stringify({
        frames,
        narrative,
        success: true,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000))
        } 
      }
    );
  } catch (error) {
    console.error("Error in generate-snap:", error);
    
    if (error instanceof Error && error.message.includes("429")) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again in a moment.",
          success: false,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
