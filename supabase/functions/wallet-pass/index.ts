// MCC "Add to Apple Wallet" — Supabase Edge Function.
//
// The website sends: the ticket code, the banner picture it drew (event poster + name), and the
// event's time and place. This function looks the ticket up in the database, asks WalletWallet to
// make the pass, saves the link on the registration (so each ticket only ever uses ONE pass from
// the WalletWallet quota), and sends the link back.
//
// The WalletWallet key lives only here, as the secret WW_KEY. It is never in the website's code.
//
// Setup (Supabase dashboard): Edge Functions → Deploy a new function → name it  wallet-pass
// → paste this file → turn OFF "Verify JWT" for it → Edge Functions → Secrets → add WW_KEY.

import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://uoftmcc.ca",
  "https://www.uoftmcc.ca",
  "https://moarznainglinkhant-cloud.github.io",
];
const LOGO_URL = "https://uoftmcc.ca/images/wallet/logo-wide.png";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function clean(s: unknown, max: number) {
  return String(s ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

// "2026-11-21" -> "Sat, Nov 21"
function shortDate(iso: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return "";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[+m[2] - 1]} ${+m[3]}`;
}

// The pass expires at the end of the day after the event (Toronto time).
function expiry(iso: string | null) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return null;
  const next = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + 1));
  const ymd = next.toISOString().slice(0, 10);
  const stamp = `${ymd}T23:59:00-05:00`;
  return new Date(stamp).getTime() > Date.now() + 3600_000 ? stamp : null;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return reply(origin, 405, { error: "Use POST." });

  const key = Deno.env.get("WW_KEY");
  if (!key) return reply(origin, 500, { error: "Wallet passes aren't set up yet (missing WW_KEY)." });

  let input: Record<string, unknown>;
  try { input = await req.json(); } catch { return reply(origin, 400, { error: "Bad request." }); }

  const ticket = clean(input.ticket, 40).toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(ticket)) {
    return reply(origin, 400, { error: "That ticket code doesn't look right." });
  }

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  const { data: reg, error } = await db
    .from("event_registrations")
    .select("id, event_name, event_date, guest_name, wallet_url, members(full_name)")
    .eq("ticket_code", ticket)
    .maybeSingle();
  if (error) return reply(origin, 500, { error: "Couldn't look up the ticket." });
  if (!reg) return reply(origin, 404, { error: "We couldn't find that ticket." });

  // Already made a pass for this ticket? Hand back the same one (doesn't use the quota again).
  if (reg.wallet_url) return reply(origin, 200, { url: reg.wallet_url, reused: true });

  const banner = String(input.banner ?? "");
  if (!banner.startsWith("data:image/png;base64,") || banner.length > 1_350_000) {
    return reply(origin, 400, { error: "The ticket picture couldn't be made. Please try again." });
  }

  // deno-lint-ignore no-explicit-any
  const member = (reg as any).members;
  const holder = clean((Array.isArray(member) ? member[0]?.full_name : member?.full_name) || reg.guest_name, 120);
  const eventName = clean(reg.event_name, 200) || "MCC event";
  const date = shortDate(reg.event_date);
  const time = clean(input.time, 40);
  const place = clean(input.place, 60);
  const code = ticket.replace(/-/g, "").slice(0, 8).toUpperCase();

  const secondary = [
    date && { label: "DATE", value: date },
    time && { label: "TIME", value: time },
    place && { label: "PLACE", value: place },
  ].filter(Boolean);

  const pass: Record<string, unknown> = {
    logoText: "​", // the club name is drawn into the logo picture instead
    organizationName: "Myanmar Culture Club",
    description: `MCC ticket: ${eventName}`.slice(0, 128),
    color: "#1C2440",
    logoURL: LOGO_URL,
    stripURL: banner,
    secondaryFields: secondary,
    backFields: [
      { label: "Event", value: eventName },
      { label: "Guest", value: holder },
      { label: "Ticket code", value: code },
      { label: "Check-in", value: "Show this pass at the door. Exec will look up your ticket code." },
      { label: "Website", value: "https://uoftmcc.ca" },
      { label: "Instagram", value: "@mcc_uoft" },
    ],
  };
  const exp = expiry(reg.event_date);
  if (exp) pass.expirationDate = exp; else pass.expirationDays = 30;

  let res: Response;
  try {
    res = await fetch("https://api.walletwallet.dev/api/passes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        "User-Agent": "MCC-Website/1.0 (+https://uoftmcc.ca)",
      },
      body: JSON.stringify(pass),
    });
  } catch {
    return reply(origin, 502, { error: "Couldn't reach the Wallet service. Please try again." });
  }
  const text = await res.text();
  let out: Record<string, unknown> = {};
  try { out = JSON.parse(text); } catch { /* not JSON */ }
  if (!res.ok || !out.shareUrl) {
    console.error("WalletWallet error", res.status, text.slice(0, 500));
    const msg = res.status === 429 ? "We've hit this month's Wallet pass limit. Your ticket above still works." :
      "The Wallet pass couldn't be made right now. Your ticket above still works.";
    return reply(origin, 502, { error: msg });
  }

  await db.from("event_registrations")
    .update({ wallet_serial: String(out.serialNumber ?? ""), wallet_url: String(out.shareUrl) })
    .eq("id", reg.id);

  return reply(origin, 200, { url: out.shareUrl });
});
