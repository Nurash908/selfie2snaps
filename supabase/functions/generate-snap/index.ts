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
    const { image1, image2, vibe, ratio, frameCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating snap with:", { vibe, ratio, frameCount });

    // Vibe style descriptions matching the VibeSelector component
    const vibeDescriptions: Record<string, string> = {
      "renaissance": "in the style of Renaissance oil painting by masters like Raphael or Vermeer, with dramatic chiaroscuro lighting, rich warm colors, classical composition, and soft sfumato technique",
      "minimalist": "in a modern minimalist style with clean geometric lines, muted neutral colors, plenty of negative space, and elegant simplicity",
      "stained-glass": "as a beautiful stained glass artwork with vibrant jewel tones, bold black lead lines, luminous backlit effect, and sacred geometric patterns reminiscent of cathedral windows",
      "golden-hour": "bathed in warm golden hour sunlight with soft lens flare, amber and honey tones, romantic bokeh background, and dreamy cinematic atmosphere",
      "ethereal": "in an ethereal dreamlike style with soft pastel colors, magical floating particles, gentle diffused lighting, and an otherworldly celestial glow",
      "neon": "in vibrant neon cyberpunk style with electric pink, purple and cyan colors, dramatic rim lighting, glowing effects, and futuristic urban aesthetic",
      "ocean": "with deep ocean color palette featuring rich teals, navy blues, and aquamarine tones, with flowing water-like textures and serene underwater atmosphere",
      "majestic": "in a majestic epic style with dramatic mountain landscapes, moody atmospheric fog, rich deep blues and grays, and cinematic wide-angle composition"
    };

    // Get aspect ratio dimensions
    const ratioDimensions: Record<string, { width: number; height: number }> = {
      "1:1": { width: 1024, height: 1024 },
      "3:4": { width: 768, height: 1024 },
      "4:3": { width: 1024, height: 768 },
      "9:16": { width: 576, height: 1024 },
      "16:9": { width: 1024, height: 576 }
    };

    const dimensions = ratioDimensions[ratio] || ratioDimensions["3:4"];
    const vibeStyle = vibeDescriptions[vibe] || vibeDescriptions["renaissance"];

    // Generate narrative caption
    const narrativePrompt = `Create a one-sentence poetic caption for a photo of two people sharing a meaningful moment. The artistic style is "${vibe}". Make it heartwarming and evocative. Keep it under 20 words.`;

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
          { role: "system", content: "You are a creative writer who crafts heartwarming, poetic captions." },
          { role: "user", content: narrativePrompt }
        ],
      }),
    });

    let narrative = "A beautiful moment of connection captured in time.";
    if (narrativeResponse.ok) {
      const narrativeData = await narrativeResponse.json();
      narrative = narrativeData.choices?.[0]?.message?.content || narrative;
      console.log("Generated narrative:", narrative);
    } else {
      console.error("Narrative generation failed:", await narrativeResponse.text());
    }

    // Generate frames using image generation model
    const frames: string[] = [];
    console.log(`Generating ${frameCount} frames with vibe: ${vibe}...`);

    for (let i = 0; i < frameCount; i++) {
      const variationPrompts = [
        "close-up portrait composition with soft focus background",
        "medium shot capturing natural interaction and body language", 
        "candid moment with genuine expressions and emotion",
        "artistic angle with interesting perspective and depth"
      ];
      
      const variation = variationPrompts[i % variationPrompts.length];
      
      // Build image generation prompt with reference images
      const imagePrompt = `Create a stunning artistic portrait of two friends together ${vibeStyle}. 
      
Composition: ${variation}.
Aspect ratio: ${ratio}.
The image should feel warm, inviting, and capture genuine connection between the subjects.
High quality, professional photography level, detailed textures, perfect lighting.`;

      console.log(`Generating frame ${i + 1}/${frameCount}...`);

      try {
        // If we have reference images, use image editing
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
                      text: `Transform these two portrait photos into a beautiful combined artistic image ${vibeStyle}. Create a scene where these two people appear together naturally in a ${variation}. The final image should maintain their likeness while applying the artistic style. Make it look like a professional ${vibe} artwork.`
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
              console.log(`Frame ${i + 1} generated successfully with reference images`);
              continue;
            }
          } else {
            console.error(`Frame ${i + 1} edit failed:`, await editResponse.text());
          }
        }

        // Fallback: Generate without reference images
        const genResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: imagePrompt }],
            modalities: ["image", "text"],
          }),
        });

        if (genResponse.ok) {
          const genData = await genResponse.json();
          const imageUrl = genData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            frames.push(imageUrl);
            console.log(`Frame ${i + 1} generated successfully`);
            continue;
          }
        } else {
          console.error(`Frame ${i + 1} generation failed:`, await genResponse.text());
        }

        // Final fallback to placeholder
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
        vibe,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-snap:", error);
    
    // Check for rate limiting
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
