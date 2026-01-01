import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============= IMAGE SIZE VALIDATION =============
const MAX_BASE64_SIZE_BYTES = 10 * 1024 * 1024; // 10MB max per image
const MAX_BASE64_SIZE_CHARS = Math.ceil(MAX_BASE64_SIZE_BYTES * 1.37); // Base64 overhead ~37%

function getBase64SizeInBytes(base64String: string): number {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
  // Calculate actual byte size from base64 length
  const padding = (base64Data.match(/=+$/) || [""])[0].length;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

function validateImageSize(imageData: string, fieldName: string): { valid: boolean; error?: string; sizeBytes?: number } {
  if (imageData.startsWith("https://")) {
    return { valid: true }; // URL references don't need size validation
  }
  
  if (imageData.length > MAX_BASE64_SIZE_CHARS) {
    return { 
      valid: false, 
      error: `${fieldName} exceeds maximum size. Image must be under 10MB.`,
      sizeBytes: getBase64SizeInBytes(imageData)
    };
  }
  
  const sizeBytes = getBase64SizeInBytes(imageData);
  if (sizeBytes > MAX_BASE64_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `${fieldName} is ${(sizeBytes / 1024 / 1024).toFixed(2)}MB, exceeds 10MB limit.`,
      sizeBytes
    };
  }
  
  return { valid: true, sizeBytes };
}

// ============= REQUEST LOGGING & ANALYTICS =============
interface RequestLog {
  timestamp: string;
  requestId: string;
  clientIP: string;
  method: string;
  userAgent: string;
  params: {
    ratio?: string;
    frameCount?: number;
    scene?: string;
    style?: string;
    swapPositions?: boolean;
    image1SizeKB?: number;
    image2SizeKB?: number;
  };
  rateLimitRemaining: number;
  durationMs?: number;
  status: "started" | "success" | "error" | "rate_limited" | "validation_failed" | "image_too_large";
  errorMessage?: string;
  framesGenerated?: number;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function logRequest(log: RequestLog) {
  // Structured logging for analytics and monitoring
  console.log(JSON.stringify({
    type: "edge_function_request",
    function: "generate-snap",
    ...log,
    // Mask IP for privacy in logs
    clientIP: log.clientIP ? log.clientIP.substring(0, 8) + "***" : "unknown"
  }));
}

// ============= RATE LIMITING =============
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per minute per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
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

// ============= INPUT VALIDATION =============
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
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client info for logging
  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || req.headers.get("x-real-ip") 
    || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // ============= AUTHENTICATION =============
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.error("Missing Authorization header");
    return new Response(
      JSON.stringify({
        error: "Authentication required. Please sign in to use this feature.",
        success: false,
      }),
      { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } 
      }
    );
  }

  // Create Supabase client with user's auth token
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  // Verify the user is authenticated
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    console.error("Authentication failed:", authError?.message || "No user found");
    return new Response(
      JSON.stringify({
        error: "Invalid or expired session. Please sign in again.",
        success: false,
      }),
      { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } 
      }
    );
  }

  console.log(`Authenticated user: ${user.id}`);

  try {
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      logRequest({
        timestamp: new Date().toISOString(),
        requestId,
        clientIP,
        method: req.method,
        userAgent,
        params: {},
        rateLimitRemaining: 0,
        durationMs: Date.now() - startTime,
        status: "rate_limited"
      });
      
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
            "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000)),
            "X-Request-Id": requestId
          } 
        }
      );
    }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      logRequest({
        timestamp: new Date().toISOString(),
        requestId,
        clientIP,
        method: req.method,
        userAgent,
        params: {},
        rateLimitRemaining: rateLimitResult.remaining,
        durationMs: Date.now() - startTime,
        status: "validation_failed",
        errorMessage: "Invalid JSON in request body"
      });
      
      return new Response(
        JSON.stringify({
          error: "Invalid JSON in request body",
          success: false,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
      );
    }

    // Validate input with Zod schema
    const validationResult = requestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => ({
        field: e.path.join("."),
        message: e.message
      }));
      
      logRequest({
        timestamp: new Date().toISOString(),
        requestId,
        clientIP,
        method: req.method,
        userAgent,
        params: {},
        rateLimitRemaining: rateLimitResult.remaining,
        durationMs: Date.now() - startTime,
        status: "validation_failed",
        errorMessage: `Validation failed: ${errors.map(e => e.message).join(", ")}`
      });
      
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: errors,
          success: false,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
      );
    }

    const { image1, image2, ratio, frameCount, scene, swapPositions, style } = validationResult.data;

    // Validate image sizes
    const image1Validation = validateImageSize(image1, "image1");
    if (!image1Validation.valid) {
      logRequest({
        timestamp: new Date().toISOString(),
        requestId,
        clientIP,
        method: req.method,
        userAgent,
        params: { ratio, frameCount, scene, style, swapPositions, image1SizeKB: image1Validation.sizeBytes ? Math.round(image1Validation.sizeBytes / 1024) : undefined },
        rateLimitRemaining: rateLimitResult.remaining,
        durationMs: Date.now() - startTime,
        status: "image_too_large",
        errorMessage: image1Validation.error
      });
      
      return new Response(
        JSON.stringify({
          error: image1Validation.error,
          success: false,
        }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
      );
    }

    const image2Validation = validateImageSize(image2, "image2");
    if (!image2Validation.valid) {
      logRequest({
        timestamp: new Date().toISOString(),
        requestId,
        clientIP,
        method: req.method,
        userAgent,
        params: { ratio, frameCount, scene, style, swapPositions, image2SizeKB: image2Validation.sizeBytes ? Math.round(image2Validation.sizeBytes / 1024) : undefined },
        rateLimitRemaining: rateLimitResult.remaining,
        durationMs: Date.now() - startTime,
        status: "image_too_large",
        errorMessage: image2Validation.error
      });
      
      return new Response(
        JSON.stringify({
          error: image2Validation.error,
          success: false,
        }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Log request start with analytics
    logRequest({
      timestamp: new Date().toISOString(),
      requestId,
      clientIP,
      method: req.method,
      userAgent,
      params: {
        ratio,
        frameCount,
        scene,
        style,
        swapPositions,
        image1SizeKB: image1Validation.sizeBytes ? Math.round(image1Validation.sizeBytes / 1024) : undefined,
        image2SizeKB: image2Validation.sizeBytes ? Math.round(image2Validation.sizeBytes / 1024) : undefined
      },
      rateLimitRemaining: rateLimitResult.remaining,
      status: "started"
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
        const imagePrompt = `Combine these two selfie photos into ONE natural-looking photo where both people appear together as if the photo was taken of them at the same time. Place them ${variation}. 
                    
IMPORTANT: 
- Keep both people's faces and features exactly as they appear in their original photos
- Make it look like a real photo taken together, not a collage
- Background: ${sceneDescription}
- Visual style: ${styleDescription}
- Natural lighting that matches both subjects and the scene
- Aspect ratio: ${ratio}
- High quality, professional looking combined photograph
- Apply the visual style consistently to the entire image`;

        console.log(`Frame ${i + 1} - Sending request to AI gateway...`);
        
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
                    text: imagePrompt
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

        console.log(`Frame ${i + 1} - Response status: ${editResponse.status}`);

        if (editResponse.ok) {
          const editData = await editResponse.json();
          console.log(`Frame ${i + 1} - Response data keys:`, Object.keys(editData));
          
          const imageUrl = editData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            frames.push(imageUrl);
            console.log(`Frame ${i + 1} generated successfully - Image URL length: ${imageUrl.length}`);
            continue;
          } else {
            console.log(`Frame ${i + 1} - No image URL in response. Message:`, JSON.stringify(editData.choices?.[0]?.message).substring(0, 500));
          }
        } else {
          const errorText = await editResponse.text();
          console.error(`Frame ${i + 1} generation failed with status ${editResponse.status}:`, errorText.substring(0, 500));
          
          // Check if it's a rate limit error
          if (editResponse.status === 429) {
            console.log(`Frame ${i + 1} - Rate limited, waiting 2 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Retry once
            const retryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
                      { type: "text", text: imagePrompt },
                      { type: "image_url", image_url: { url: image1 } },
                      { type: "image_url", image_url: { url: image2 } }
                    ]
                  }
                ],
                modalities: ["image", "text"]
              }),
            });

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              const retryImageUrl = retryData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
              if (retryImageUrl) {
                frames.push(retryImageUrl);
                console.log(`Frame ${i + 1} generated successfully on retry`);
                continue;
              }
            }
          }
        }

        // Fallback to placeholder
        console.log(`Frame ${i + 1} using placeholder fallback`);
        frames.push(`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=${dimensions.width}&h=${dimensions.height}&fit=crop&seed=${i}`);

      } catch (frameError) {
        console.error(`Error generating frame ${i + 1}:`, frameError);
        frames.push(`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=${dimensions.width}&h=${dimensions.height}&fit=crop&seed=${i}`);
      }
    }

    // Log successful completion
    logRequest({
      timestamp: new Date().toISOString(),
      requestId,
      clientIP,
      method: req.method,
      userAgent,
      params: { ratio, frameCount, scene, style, swapPositions },
      rateLimitRemaining: rateLimitResult.remaining,
      durationMs: Date.now() - startTime,
      status: "success",
      framesGenerated: frames.length
    });

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
          "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000)),
          "X-Request-Id": requestId
        } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    logRequest({
      timestamp: new Date().toISOString(),
      requestId,
      clientIP,
      method: req.method,
      userAgent,
      params: {},
      rateLimitRemaining: 0,
      durationMs: Date.now() - startTime,
      status: "error",
      errorMessage
    });
    
    if (error instanceof Error && error.message.includes("429")) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again in a moment.",
          success: false,
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
      );
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Request-Id": requestId } }
    );
  }
});
