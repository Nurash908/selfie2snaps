import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image1, image2, ratio, frameCount, scene } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating combined snap with:", { ratio, frameCount, scene });

    // Scene descriptions for the AI
    const sceneDescriptions: Record<string, string> = {
      natural: "a natural, realistic background that fits both people well",
      beach: "a beautiful sunny tropical beach with palm trees and ocean waves in the background",
      city: "a modern urban cityscape with tall buildings and city lights in the background",
      mountains: "majestic mountain peaks with scenic views and natural wilderness in the background",
      studio: "a professional photography studio with soft lighting and elegant backdrop",
      party: "a fun party atmosphere with colorful decorations, lights, and celebratory mood"
    };

    const sceneDescription = sceneDescriptions[scene] || sceneDescriptions.natural;

    // Get aspect ratio dimensions
    const ratioDimensions: Record<string, { width: number; height: number }> = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 576, height: 1024 },
      "16:9": { width: 1024, height: 576 }
    };

    const dimensions = ratioDimensions[ratio] || ratioDimensions["16:9"];

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
      const variationPrompts = [
        "side by side, looking at each other or the camera naturally",
        "one slightly behind the other, both facing forward with friendly expressions"
      ];
      
      const variation = variationPrompts[i % variationPrompts.length];

      console.log(`Generating frame ${i + 1}/${frameCount}...`);

      try {
        if (image1 && image2) {
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
- Natural lighting that matches both subjects and the scene
- Aspect ratio: ${ratio}
- High quality, professional looking combined photograph`
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
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
