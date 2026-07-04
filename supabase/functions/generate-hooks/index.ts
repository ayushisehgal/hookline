import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a viral short-form video strategist (TikTok, Reels, Shorts).
Given a raw video idea, respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:

{
  "hooks": [
    { "text": "the hook line, under 15 words, spoken as the first line of the video", "style": "a 2-4 word label like 'curiosity gap' or 'bold claim'" }
  ],
  "captions": ["a short on-screen caption / post caption option", "..."],
  "fit_score": {
    "score": 0,
    "label": "a short verdict like 'Strong Fit' or 'Needs Work'",
    "reasoning": "one or two sentences explaining the estimated audience fit score, referencing specifics of THIS idea"
  }
}

Rules for hooks:
- Always return exactly 10 items, each a distinct angle (curiosity gap, bold claim, relatable pain point, contrarian take, numbers/stat, direct callout, story cold-open, question hook, transformation tease, controversy).

Rules for captions:
- Always return exactly 5 items.

Rules for fit_score — this is the part that matters most, read carefully:
- Score honestly using this rubric, don't default to a safe middle number:
  - 90-100: Extremely specific idea, clear novel angle, strong built-in curiosity or stakes, fits a proven short-form format
  - 75-89: Good concept, but somewhat generic execution or a crowded niche with no clear differentiator
  - 55-74: Workable idea, but vague, missing a concrete hook angle, or low rewatch/share potential
  - 30-54: Idea is too broad, abstract, or has no obvious visual/emotional hook for short-form
  - 0-29: Not suited to short-form video, or too little information to hook an audience in the first 2 seconds
- Two different ideas should rarely land on the same score unless they are genuinely comparable in specificity and hook potential. Vary your scores meaningfully based on the actual content of the idea, not a default.
- "reasoning" must reference something concrete and specific from the idea itself, not generic praise.
- Do not wrap the JSON in backticks or add any text outside the JSON object.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'idea' string in body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Video idea: ${idea}` },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    if (SUPABASE_URL && SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
      await supabase.from("generations").insert({
        idea,
        hooks: parsed.hooks ?? [],
        captions: parsed.captions ?? [],
        fit_score: parsed.fit_score ?? {},
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});