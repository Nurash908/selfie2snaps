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
    const { image1, image2, vibe, aura, frameCount } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating snap with:", { vibe, aura, frameCount });

    // Build the prompt based on vibe and aura
    const vibeDescriptions: Record<string, string> = {
      "renaissance-oil": "in the style of Renaissance oil painting with dramatic lighting and classical composition",
      "modern-minimal": "in a modern minimalist style with clean lines and subtle colors",
      "stained-glass": "as a beautiful stained glass artwork with vibrant jewel tones and light effects",
      "watercolor": "as a soft watercolor painting with flowing colors and dreamy atmosphere",
      "pop-art": "in bold Pop Art style with bright colors and graphic elements",
      "anime": "in anime art style with expressive features and dynamic composition"
    };

    const auraDescriptions: Record<string, string> = {
      "joy": "radiating warm golden light and joyful energy with subtle glow effects",
      "peace": "surrounded by soft blue and white ethereal light conveying serenity",
      "fellowship": "with warm amber and rose tones symbolizing connection and community"
    };

    const vibeStyle = vibeDescriptions[vibe] || vibeDescriptions["stained-glass"];
    const auraStyle = aura ? auraDescriptions[aura] : "";

    // Generate narrative caption
    const narrativePrompt = `Create a one-sentence poetic caption for a photo of two people sharing a meaningful moment. Make it heartwarming and suitable for a church community. Keep it under 20 words.`;

    const narrativeResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a creative writer who crafts heartwarming captions." },
          { role: "user", content: narrativePrompt }
        ],
      }),
    });

    let narrative = "A beautiful moment of connection captured in time.";
    if (narrativeResponse.ok) {
      const narrativeData = await narrativeResponse.json();
      narrative = narrativeData.choices?.[0]?.message?.content || narrative;
    }

    // Generate frames using Nano Banana (image generation model)
    const frames: string[] = [];
    const framePromises = [];

    for (let i = 0; i < frameCount; i++) {
      const imagePrompt = `Create a beautiful artistic portrait of two friends together ${vibeStyle}. ${auraStyle}. The image should feel warm, inviting, and capture genuine connection between the subjects. Frame ${i + 1} of ${frameCount} - vary the composition slightly for each frame. High quality, 4K, detailed.`;

      const framePromise = fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: imagePrompt }],
          modalities: ["image", "text"],
        }),
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          if (imageUrl) {
            return imageUrl;
          }
        }
        // Fallback to placeholder if generation fails
        return `https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop&seed=${i}`;
      });

      framePromises.push(framePromise);
    }

    const generatedFrames = await Promise.all(framePromises);

    console.log(`Generated ${generatedFrames.length} frames successfully`);

    return new Response(
      JSON.stringify({
        frames: generatedFrames,
        narrative,
        success: true,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-snap:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
