// MCC "speak" — Supabase Edge Function. Burmese text -> an MP3 read by Azure's Burmese voice (Nilar).
//
// Used by the Learn page ("Hear your name") and by Ask MCC's phrase cards ("Hear it",
// "Slowly, by syllable"). Each clip is made once and kept in the public Storage bucket `speech`;
// after that every visitor gets the stored file straight from Supabase's CDN, so Azure is only
// called for text nobody has asked for before.
//
// POST { text: "ကျေးဇူးတင်ပါတယ်" }                                  -> { url } (natural speed)
// POST { text: "...", syllables: ["ကျေး","ဇူး","တင်","ပါ","တယ်"] }  -> { url } (slow, a pause
//      after every syllable; the widget finds the pauses to light up each syllable as it's said)
//
// The Azure key lives only here, as secrets AZURE_SPEECH_KEY + AZURE_SPEECH_REGION.
// Setup: run supabase/speech.sql once, then Edge Functions -> Deploy a new function -> name it
// exactly  speak  -> paste this file -> turn OFF "Verify JWT" -> Secrets -> add the two secrets.

import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://uoftmcc.ca",
  "https://www.uoftmcc.ca",
  "https://moarznainglinkhant-cloud.github.io",
  "https://ask-mcc.onrender.com",
];
const VOICE = "my-MM-NilarNeural";
const BUCKET = "speech";
const PER_VISITOR_PER_DAY = 60; // new clips (stored ones are free and unlimited)
const ALL_PER_DAY = 1500;
const BURMESE = /^[က-႟ꩠ-ꩿꧠ-꧿ ]+$/;

function cors(origin: string | null) {
  const ok = origin && (ALLOWED_ORIGINS.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  return {
    "Access-Control-Allow-Origin": ok ? origin! : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Vary": "Origin",
  };
}

function reply(origin: string | null, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });
}

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function ssml(text: string, syllables: string[] | null) {
  const body = syllables
    ? syllables.map(esc).join('<break time="550ms"/>')
    : esc(text);
  const rate = syllables ? "-20%" : "-5%";
  return `<speak version="1.0" xml:lang="my-MM"><voice name="${VOICE}"><prosody rate="${rate}">` +
    `${body}</prosody></voice></speak>`;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return reply(origin, 405, { error: "POST only" });

  let body: { text?: unknown; syllables?: unknown };
  try { body = await req.json(); } catch { return reply(origin, 400, { error: "Bad request" }); }

  const text = String(body.text ?? "").replace(/\s+/g, " ").trim();
  if (!text || text.length > 80 || !BURMESE.test(text)) return reply(origin, 400, { error: "Burmese text only, up to 80 characters" });
  let syllables: string[] | null = null;
  if (Array.isArray(body.syllables)) {
    syllables = body.syllables.map((s) => String(s).trim()).filter(Boolean);
    if (!syllables.length || syllables.length > 16 || syllables.some((s) => s.length > 12 || !BURMESE.test(s))) {
      return reply(origin, 400, { error: "Bad syllables" });
    }
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const path = `${await sha256(`v1|${VOICE}|${syllables ? "slow:" + syllables.join("|") : "normal:" + text}`)}.mp3`;
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  // Already made? Then it's free.
  const head = await fetch(publicUrl, { method: "HEAD" }).catch(() => null);
  if (head && head.ok) return reply(origin, 200, { url: publicUrl, stored: true });

  const db = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const who = (await sha256("mcc-speak|" + ip)).slice(0, 24); // no raw IPs stored
  const { data: allowed, error: bumpErr } = await db.rpc("speech_bump", {
    p_who: who, p_per_visitor: PER_VISITOR_PER_DAY, p_total: ALL_PER_DAY,
  });
  if (bumpErr) return reply(origin, 500, { error: "Couldn't check today's limit" });
  if (!allowed) return reply(origin, 429, { error: "That's enough new audio for today. Please try again tomorrow." });

  const key = Deno.env.get("AZURE_SPEECH_KEY"), region = Deno.env.get("AZURE_SPEECH_REGION");
  if (!key || !region) return reply(origin, 500, { error: "The voice isn't set up yet" });
  const az = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "MCC-Website/1.0",
    },
    body: ssml(text, syllables),
  }).catch(() => null);
  if (!az || !az.ok) {
    // 429 = Azure's free tier allows about 20 clips a minute
    return reply(origin, 503, { error: az?.status === 429 ? "The voice is busy. Try again in a minute." : "The voice isn't available right now." });
  }
  const mp3 = new Uint8Array(await az.arrayBuffer());
  const { error: upErr } = await db.storage.from(BUCKET).upload(path, mp3, {
    contentType: "audio/mpeg", upsert: true, cacheControl: "31536000",
  });
  if (upErr) {
    // Couldn't store it: still play it this once.
    return new Response(mp3, { status: 200, headers: { ...cors(origin), "Content-Type": "audio/mpeg" } });
  }
  return reply(origin, 200, { url: publicUrl, stored: false });
});
