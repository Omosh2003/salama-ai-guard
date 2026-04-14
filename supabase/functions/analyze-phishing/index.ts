import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { inputText, inputType } = await req.json();
    if (!inputText || typeof inputText !== "string" || inputText.length > 5000) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a cybersecurity expert specializing in phishing detection. Analyze the provided text (email content or URL) for phishing indicators. Return a JSON analysis with these fields:
- risk_score: number 0-100 (0=safe, 100=definitely phishing)
- risk_level: "info" | "low" | "medium" | "high" | "critical"
- indicators: array of objects {indicator: string, severity: "safe"|"suspicious"|"dangerous", detail: string}
- summary: a brief human-readable summary
- recommendation: what action to take

Be thorough. Check for: suspicious URLs, urgency tactics, impersonation, credential harvesting, domain spoofing, typosquatting, unusual sender patterns, social engineering cues.`,
          },
          {
            role: "user",
            content: `Analyze this ${inputType === "url" ? "URL" : "email/text"} for phishing:\n\n${inputText}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "phishing_analysis",
              description: "Return structured phishing analysis results",
              parameters: {
                type: "object",
                properties: {
                  risk_score: { type: "number", minimum: 0, maximum: 100 },
                  risk_level: { type: "string", enum: ["info", "low", "medium", "high", "critical"] },
                  indicators: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        indicator: { type: "string" },
                        severity: { type: "string", enum: ["safe", "suspicious", "dangerous"] },
                        detail: { type: "string" },
                      },
                      required: ["indicator", "severity", "detail"],
                    },
                  },
                  summary: { type: "string" },
                  recommendation: { type: "string" },
                },
                required: ["risk_score", "risk_level", "indicators", "summary", "recommendation"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "phishing_analysis" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", status, await aiResponse.text());
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let analysis;
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store the scan result
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await serviceClient.from("phishing_scans").insert({
      user_id: userId,
      input_text: inputText.slice(0, 2000),
      input_type: inputType || "text",
      risk_score: analysis.risk_score,
      risk_level: analysis.risk_level,
      analysis,
    });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-phishing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
