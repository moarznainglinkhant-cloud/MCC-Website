/* ============================================================
   MCC site data engine
   ------------------------------------------------------------
   This is the ONLY file you need to touch to change where the
   site's live data comes from.

   HOW TO GO LIVE WITH YOUR GOOGLE SHEET:
   1. Build your sheet with two tabs: "Events" and "Hero" (see
      data/events.csv and data/hero.csv in this folder for the
      exact column headers to use — you can File > Import each
      CSV straight into a new Google Sheet tab to start).
   2. File > Share > Publish to web. Pick the "Events" tab,
      format "Comma-separated values (.csv)", click Publish.
      Copy the URL it gives you and paste it below as
      EVENTS_CSV_URL. Repeat for the "Hero" tab -> HERO_CSV_URL.
   3. Save this file. That's it — no code changes needed again.
      Every future edit just happens in the Sheet.

   Until you do that, the site quietly uses the bundled CSV
   files in /data as sample content, so nothing ever breaks.
   ============================================================ */

const EVENTS_CSV_URL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxO5v71ESuKwpeYifkgqyfUDE_Gt0rc1E5y4rrefr0jKC-HnSF7qEAmu0baxHehAxwrgCkGVUPGH--/pub?gid=1409409640&single=true&output=csv";
const HERO_CSV_URL     = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxO5v71ESuKwpeYifkgqyfUDE_Gt0rc1E5y4rrefr0jKC-HnSF7qEAmu0baxHehAxwrgCkGVUPGH--/pub?gid=1259347518&single=true&output=csv";
// About page roster: publish the "Team" tab as CSV and paste its link here (see README-SETUP.md).
const TEAM_CSV_URL     = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTxO5v71ESuKwpeYifkgqyfUDE_Gt0rc1E5y4rrefr0jKC-HnSF7qEAmu0baxHehAxwrgCkGVUPGH--/pub?gid=1969873983&single=true&output=csv";

/* ============================================================
   "I'M FEELING LUCKY" FUN FACTS (fun-fact.html)
   ------------------------------------------------------------
   Random trivia about Myanmar shown when someone clicks the
   footer's "Feeling Lucky?" link. English-only for now, same as
   the live event descriptions. Add more any time as { icon, text }.
   icon is the inside of a 40x40 SVG (see putFactIcon).
   ============================================================ */
// Each fact's small illustration (40x40): navy outlines (currentColor) with flat fills in the site palette.
function putFactIcon(el, f) {
  if (!el) return;
  el.innerHTML = f.icon ? `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${f.icon}</svg>` : "";
}
const MYANMAR_FUN_FACTS = [
  { icon: '<path d="M2.5 34c0-5.8 3.4-10.4 7.6-10.4s7.6 4.6 7.6 10.4z" fill="#C2452F"/><circle cx="10.1" cy="20.5" r="3.7" fill="#E5BE94"/> <path d="M6.4 20c.3-2.7 1.8-4 3.7-4s3.4 1.3 3.7 4c-2.4-.9-5-.9-7.4 0z" fill="#3A3550"/><circle cx="13.6" cy="17.2" r="1.5" fill="#3A3550"/> <path d="M22.3 34c0-5.8 3.4-10.4 7.6-10.4s7.6 4.6 7.6 10.4z" fill="#5E8C4A"/><circle cx="29.9" cy="20.5" r="3.7" fill="#E5BE94"/> <path d="M26.2 19.6c.4-2.4 1.9-3.6 3.7-3.6s3.3 1.2 3.7 3.6c-2.4-.6-5-.6-7.4 0z" fill="#3A3550"/> <path d="M10.5 36c0-7.2 4.3-12.5 9.5-12.5s9.5 5.3 9.5 12.5z" fill="#6F9CC4"/><path d="M17.6 24.2l2.4 3.4 2.4-3.4"/> <circle cx="20" cy="19.4" r="4.8" fill="#E5BE94"/><path d="M15.4 17c0-3.2 2-5.2 4.6-5.2s4.6 2 4.6 5.2c-3-1-6.2-1-9.2 0z" fill="#D9A441"/><path d="M24.4 14.4c1.8-.8 3.2-.1 3 1.3-.9.3-2 .1-2.8-.4" fill="#D9A441"/>',
    text: "Myanmar officially counts 135 ethnic groups, and many have a language of their own. One country, a lot of ways to say hello." },
  { icon: '<path d="M15 9.5c-1.6 1.8 1.6 3.2 0 5M20.5 7.5c-1.6 1.8 1.6 3.2 0 5M26 9.5c-1.6 1.8 1.6 3.2 0 5" opacity=".5"/> <path d="M4.5 19.5h31c0 8.2-6.9 13.5-15.5 13.5S4.5 27.7 4.5 19.5z" fill="#FFFDF7"/><path d="M5.6 23.4c3.6 1.7 25.2 1.7 28.8 0" stroke="#6F9CC4" stroke-width="1.8"/> <path d="M15.5 33h9l.8 2.6h-10.6z" fill="#FFFDF7"/> <ellipse cx="20" cy="19.5" rx="15.5" ry="3.4" fill="#DB8B3A"/> <path d="M9 18.4c1-1.7 3.6-1.9 4.9-.6 1.5-.3 2.7.7 2.2 1.9-1.1 1-4.9 1-7.1.2z" fill="#EDB548"/><path d="M11 18.6h.01M13.6 18.4h.01M12.4 19.6h.01" stroke="#9A6B40" stroke-width="1.2"/> <circle cx="20" cy="20.2" r="1.7" fill="#FFFDF7"/><circle cx="20" cy="20.2" r=".6" stroke="#D9B486" stroke-width=".8"/> <circle cx="23.4" cy="18.4" r="1.3" fill="#FFFDF7"/><circle cx="23.4" cy="18.4" r=".45" stroke="#D9B486" stroke-width=".8"/> <ellipse cx="27.6" cy="20" rx="2.3" ry="1.4" fill="#FFFDF7"/><ellipse cx="27.6" cy="20" rx="1" ry=".7" fill="#D9A441" stroke="none"/> <path d="M16.2 21.3l.9-.9.9.9M24.6 21.2l.9-.9.9.9" stroke="#5E8C4A" stroke-width="1.1"/> <path d="M29.4 16.8a3.1 3.1 0 0 1 6.2 0z" fill="#B9D29C"/><path d="M32.5 16.8l-1.6-2.2M32.5 16.8v-2.8M32.5 16.8l1.6-2.2" stroke="#5E8C4A" stroke-width=".8"/> <path d="M4.4 6.2c1.2-.9 2.6-.4 3 .6l5.2 9.4-1.8 1-5.4-9.2c-.6-1-.8-1.5-1-1.8z" fill="#FFFDF7"/>',
    text: "Mohinga is fish noodle soup, and yes, it's breakfast. Ask anyone from Myanmar to name the national dish and this is the answer you'll get." },
  { icon: '<path d="M11.5 37c0-4.6 3.8-7.4 8.5-7.4s8.5 2.8 8.5 7.4z" fill="#C2452F"/> <circle cx="20" cy="7" r="3.4" fill="#3A3550"/><circle cx="23.2" cy="5.8" r="1.5" fill="#F4C21F" stroke-width=".9"/> <circle cx="20" cy="19.5" r="10" fill="#E5BE94"/> <path d="M10 19.2C10 13 14.5 9.2 20 9.2s10 3.8 10 10c-2.2-3.4-5.6-5.2-10-5.2s-7.8 1.8-10 5.2z" fill="#3A3550"/> <path d="M11.8 21.8c0-2.2 1.6-3.6 3.6-3.6s3.6 1.4 3.4 3.6c-.2 2.2-1.8 3.6-3.5 3.6s-3.5-1.4-3.5-3.6zM21.2 21.8c-.2-2.2 1.4-3.6 3.4-3.6s3.6 1.4 3.6 3.6-1.8 3.6-3.5 3.6-3.3-1.4-3.5-3.6z" fill="#F1DFA8" stroke="none"/> <path d="M13.2 23.6c1-1.4 2.2-1.6 3.6-.8M23.2 22.8c1.4-.8 2.6-.6 3.6.8" stroke="#D9B486" stroke-width=".9"/> <path d="M14.6 18.4c.8.7 1.9.7 2.7 0M22.7 18.4c.8.7 1.9.7 2.7 0"/><path d="M18.2 25.2c1.1.8 2.5.8 3.6 0"/>',
    text: "Thanaka is tree bark, ground on a wet stone and worn on the face. It's been Myanmar's sunscreen for about 2,000 years, long before SPF was a thing." },
  { icon: '<circle cx="31" cy="9" r="3.4" fill="#F2D899" stroke="none"/> <path d="M20 2.2v5" /><circle cx="20" cy="3.2" r="1.1" fill="#FFFDF7"/> <path d="M18.6 7.2h2.8l.5 2h-3.8z" fill="#D9A441"/> <path d="M20 9.2c-.9 3-1.8 5.2-1.8 8 0 2.4-1.9 3.9-4.1 5.3-2.3 1.4-3.9 3.4-3.9 5.9h19.6c0-2.5-1.6-4.5-3.9-5.9-2.2-1.4-4.1-2.9-4.1-5.3 0-2.8-.9-5-1.8-8z" fill="#D9A441"/> <path d="M17.9 15.5h4.2M17.6 19h4.8" stroke="#FFFDF7" stroke-width="1.1"/><path d="M15 23.6c-1.6 1.2-2.4 2.5-2.6 3.8" stroke="#F2D899" stroke-width="1.3"/> <path d="M8 28.4h24v3.2H8z" fill="#F2D899"/><path d="M5 31.6h30v3.2H5z" fill="#D9A441"/><path d="M2.5 34.8h35" />',
    text: "Legend says Shwedagon Pagoda holds eight hairs of the Buddha. The gold isn't paint: it's real gold plating, and the very top is set with thousands of diamonds." },
  { icon: '<path d="M13.5 37c.8-9.6 4.4-18 11.6-26" stroke="#5E8C4A" stroke-width="1.7"/> <path d="M15.6 26.4c-2.6-1.2-4.6-3.6-6-6.6M18.4 19c2.6-.6 5 .2 7.2 2.4" stroke="#5E8C4A" stroke-width="1.3"/> <ellipse cx="12.6" cy="28.4" rx="3" ry="1.3" fill="#B9D29C" transform="rotate(-25 12.6 28.4)"/><ellipse cx="20.6" cy="25.4" rx="3" ry="1.3" fill="#B9D29C" transform="rotate(25 20.6 25.4)"/> <ellipse cx="16.4" cy="14.6" rx="2.8" ry="1.2" fill="#B9D29C" transform="rotate(-40 16.4 14.6)"/><ellipse cx="28.4" cy="13.8" rx="2.8" ry="1.2" fill="#B9D29C" transform="rotate(30 28.4 13.8)"/><circle cx="9.4" cy="18.0" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="7.5" cy="17.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="11.3" cy="17.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="8.3" cy="19.7" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="10.5" cy="19.7" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="9.4" cy="15.8" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="27.0" cy="21.4" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="25.1" cy="20.5" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="28.9" cy="20.5" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="25.9" cy="23.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="28.1" cy="23.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="27.0" cy="19.2" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="25.8" cy="9.0" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="23.9" cy="8.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="27.7" cy="8.1" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="24.7" cy="10.7" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="26.9" cy="10.7" r="1.35" fill="#F4C21F" stroke-width=".8"/><circle cx="25.8" cy="6.8" r="1.35" fill="#F4C21F" stroke-width=".8"/><path d="M32.5 25.5c-1.70 2.30-2.60 3.60-2.60 4.90a2.60 2.60 0 0 0 5.20 0c0-1.30-0.90-2.60-2.60-4.90z" fill="#6F9CC4"/><path d="M6.4 27c-1.36 1.84-2.08 2.88-2.08 3.92a2.08 2.08 0 0 0 4.16 0c0-1.04-0.72-2.08-2.08-3.92z" fill="#CFE0EE"/><path d="M33 4.5c-1.19 1.61-1.82 2.52-1.82 3.43a1.82 1.82 0 0 0 3.64 0c0-0.91-0.63-1.82-1.82-3.43z" fill="#CFE0EE"/>',
    text: "Thingyan is Burmese New Year, and it's basically a nationwide water fight. For a few days in April, stepping outside means getting soaked, and nobody minds." },
  { icon: '<circle cx="20" cy="22" r="10" fill="#F2D899" stroke="none"/> <circle cx="8.5" cy="8.4" r="3.2" fill="#C2452F"/><path d="M6.6 11l1.2 3M10.4 11l-1.2 3" stroke-width=".9"/><rect x="7.4" y="13.9" width="2.2" height="1.5" rx=".3" fill="#9A6B40"/> <circle cx="31.5" cy="6.4" r="2.4" fill="#D9A441"/><path d="M30.1 8.4l.9 2.1M32.9 8.4l-.9 2.1" stroke-width=".8"/><rect x="30.7" y="10.4" width="1.6" height="1.1" rx=".3" fill="#9A6B40"/> <path d="M4.5 30v-3.4h5.4V30" fill="#DB9A7C"/><path d="M5.2 26.6c0-1.8 1.2-3.2 2-5 .8 1.8 2 3.2 2 5z" fill="#DB9A7C"/> <path d="M30.4 30v-3.8h5.6V30" fill="#DB9A7C"/><path d="M31.2 26.2c0-1.9 1.2-3.4 2-5.2.8 1.8 2 3.3 2 5.2z" fill="#DB9A7C"/> <path d="M11.5 31.5V25h17v6.5" fill="#C8694A"/><path d="M13.5 25v-3.6h13V25" fill="#C8694A"/> <path d="M15.6 21.4c0-4.2 2.6-7.4 4.4-11.2 1.8 3.8 4.4 7 4.4 11.2z" fill="#C8694A"/><path d="M20 10.2V6.6"/><path d="M17.4 18h5.2" stroke="#F2D899" stroke-width="1"/> <path d="M18.6 31.5v-3.4a1.4 1.4 0 0 1 2.8 0v3.4z" fill="currentColor"/><path d="M13.8 28.4h.01M26.2 28.4h.01" stroke-width="1.8"/> <path d="M2.5 31.5h35V36h-35z" fill="#D9B486" stroke="none"/> <path d="M2.6 31.5c.4-2.4 3.6-2.6 4.4-.8.6-1.8 3.4-1.6 3.8.8M29.4 31.5c.4-2.4 3.4-2.6 4.2-.6.8-1.6 3.6-1.2 3.8.6" fill="#5E8C4A"/> <path d="M2.5 31.5h35"/>',
    text: "Over 2,000 temples still stand on the plains of Bagan, most of them more than 700 years old. At sunrise, hot-air balloons drift right over them." },
  { icon: '<path d="M11 6h18l3 29H8z" fill="#6F9CC4" stroke="none"/> <path d="M15.4 6.3L14 34.7M24.6 6.3L26 34.7M10.2 14.5h19.6M9.4 21h21.2" stroke="#CFE0EE" stroke-width="1.2"/> <path d="M8.8 27h22.4l.5 4.6H8.3z" fill="#C2452F" stroke="none"/> <path d="M9.3 29.3c1.2-1.4 2.4-1.4 3.6 0s2.4 1.4 3.6 0 2.4-1.4 3.6 0 2.4 1.4 3.6 0 2.4-1.4 3.6 0 2.4 1.4 3.2 0" stroke="#F2D899" stroke-width="1.2"/> <path d="M11 6h18l.3 2.6H10.7z" fill="#4C7AA6" stroke="none"/> <path d="M11 6h18l3 29H8z"/><path d="M10.7 8.6h18.6" stroke-width="1"/> <path d="M19 11.4c-.3 1.6-.8 3-1.4 4.2M21 11.4c.3 1.6.8 3 1.4 4.2" stroke="#3F6890" stroke-width="1"/> <rect x="17.6" y="6.6" width="4.8" height="5" rx="2.2" fill="#4C7AA6" transform="rotate(-12 20 9)"/><path d="M18.4 8.8c1-.5 2.2-.6 3.2-.4" stroke="#3F6890" stroke-width=".9"/>',
    text: "The longyi is one tube of cloth with no buttons, no zip and no belt. Men knot it at the front, women tuck it at the side, and somehow it stays up all day." },
  { icon: '<path d="M2 31.5h36V37H2z" fill="#CFE0EE" stroke="none"/><path d="M2 34c2-1 4-1 6 0s4 1 6 0 4-1 6 0 4 1 6 0 4-1 6 0 4 1 6 0" stroke="#6F9CC4"/> <path d="M27.5 4L20.5 33" stroke="#9A6B40" stroke-width="1.8"/><path d="M21.3 29.5l-1.6 6.4" stroke="#9A6B40" stroke-width="3.4"/> <path d="M9 5.5L3.5 26h11z" fill="#F1DFA8"/><path d="M9 5.5L7 26M9 5.5l2 20.5M5.2 19.6h7.6M6.8 12.8h4.4" stroke-width="1"/> <path d="M18 17.5l-1 9.5" /><path d="M19.6 17.5l3.6 2.4-2.2 2.4"/> <path d="M16.4 10.5h4l.8 7.4h-5.6z" fill="#C2452F"/><path d="M16.6 12.6l-4.6 1M21 12.4l4.6-2.4"/> <circle cx="18.4" cy="7.6" r="2.4" fill="#FFFDF7"/> <path d="M3 27h34l-3.4 4.2H6.4z" fill="#9A6B40"/>',
    text: "Fishermen on Inle Lake row standing on one leg, with the other leg wrapped around the oar. It keeps their hands free for the net, and it looks impossible until you watch them do it." },
  { icon: '<path d="M7.6 26.5C4.4 18 6 9 13.2 5.4c2.1-1 3.7 1.1 2 2.6" stroke="#C2452F" stroke-width="3.4"/> <path d="M7.6 26.5C4.4 18 6 9 13.2 5.4c2.1-1 3.7 1.1 2 2.6" stroke="#D9A441" stroke-width="1"/> <path d="M8.3 18.6L15.6 26.5M9.8 13.4L21 26.5M12.3 9L26.4 26.5" stroke="#D9A441" stroke-width="1"/> <path d="M5 26.5h30c-3.2 7.4-26.8 7.4-30 0z" fill="#C2452F"/><path d="M5 26.5h30" stroke="#D9A441" stroke-width="1.6"/> <circle cx="12" cy="29.6" r=".9" fill="#D9A441" stroke="none"/><circle cx="20" cy="30.6" r=".9" fill="#D9A441" stroke="none"/><circle cx="28" cy="29.6" r=".9" fill="#D9A441" stroke="none"/> <path d="M15.3 8.2c.9 1.6.6 3.2-.4 4" stroke="#C2452F"/>',
    text: "The saung is a harp shaped like a boat, and it's Myanmar's national instrument. It's also the last arched harp still being played anywhere in Asia." },
  { icon: '<path d="M20 18.5L6.4 9.6C10 4.4 15 2.6 20 2.6s10 1.8 13.6 7z" fill="#5E8C4A"/> <path d="M20 18.5L10.4 5.6M20 18.5l-5.2-14.8M20 18.5V2.8M20 18.5l5.2-14.8M20 18.5l9.6-12.9" stroke="#B9D29C" stroke-width="1"/> <path d="M20 18.5L6.4 9.6C10 4.4 15 2.6 20 2.6s10 1.8 13.6 7z"/> <rect x="3" y="27.8" width="34" height="2.8" rx="1" fill="#9A6B40"/> <rect x="4" y="22.9" width="32" height="5" rx="1.2" fill="#E2C98E"/> <rect x="4" y="17.9" width="32" height="5" rx="1.2" fill="#EBD7A6"/> <rect x="3" y="15.6" width="34" height="2.8" rx="1" fill="#9A6B40"/> <circle cx="15.6" cy="20.4" r="1.1" stroke="#9A6B40" stroke-width=".9"/><circle cx="18.2" cy="20.4" r="1.1" stroke="#9A6B40" stroke-width=".9"/><circle cx="21.4" cy="20.4" r="1.3" stroke="#9A6B40" stroke-width=".9"/><circle cx="25" cy="20.4" r="1.1" stroke="#9A6B40" stroke-width=".9"/><circle cx="27.6" cy="20.4" r="1.1" stroke="#9A6B40" stroke-width=".9"/><circle cx="30.8" cy="20.4" r="1.3" stroke="#9A6B40" stroke-width=".9"/><circle cx="15.6" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><circle cx="18" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><circle cx="21.2" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><circle cx="23.6" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><circle cx="27" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><circle cx="29.4" cy="25.4" r="1" stroke="#9A6B40" stroke-width=".9" opacity=".7"/><path d="M11 14v18.2" stroke="#C2452F" stroke-width="1.4"/><path d="M11 32.2c-1 1.4-2.4 2.2-3.8 2.4M11 32.2c.8 1.6 2 2.6 3.4 3" stroke="#C2452F" stroke-width="1.2"/>',
    text: "Why are Burmese letters so round? The usual answer: scribes scratched them onto palm leaves, and straight lines would split the leaf. Circles were safer." },
  { icon: '<path d="M8.5 31.5h23M10 28.8h20" stroke="#9A6B40"/><path d="M12.5 26.5l-4.5 8M27.5 26.5l4.5 8"/> <rect x="7" y="4.5" width="26" height="22" rx="5" fill="#FFFDF7"/> <path d="M7 18h26v3.5a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5z" fill="#C2452F"/> <rect x="10.5" y="8.5" width="19" height="7" rx="1.5" fill="#CFE0EE"/><path d="M20 8.5v7"/> <circle cx="12.5" cy="22" r="1.4" fill="#F2D899"/><circle cx="27.5" cy="22" r="1.4" fill="#F2D899"/><path d="M17 22h6" stroke="#FFFDF7"/>',
    text: "Yangon's Circular Railway takes about three hours to loop the city. Vendors hop on with snacks, and the view goes from busy markets to rice fields and back." },
  { icon: '<rect x="7.5" y="2.8" width="25" height="2.6" rx="1.3" fill="#9A6B40"/> <path d="M11 5.4v13M29 5.4v13M20 5.4v3.6" stroke-width="1" opacity=".6"/> <path d="M17 15.5l-6 2.9M23 15.5l6 2.9"/><circle cx="11" cy="18.4" r="1.1" fill="#FFFDF7"/><circle cx="29" cy="18.4" r="1.1" fill="#FFFDF7"/> <path d="M16 23h8l1.8 8.4H14.2z" fill="#D9A441"/><path d="M15 27.2c1.7-1.1 3.3-1.1 5 0s3.3 1.1 5 0" stroke="#FFFDF7" stroke-width="1"/> <path d="M17 14.6h6l1.1 8.6h-8.2z" fill="#C2452F"/><path d="M20 14.6v8.6" stroke="#F2D899" stroke-width="1"/> <path d="M18 31.4v3.4M22 31.4v3.4"/> <circle cx="20" cy="11.6" r="2.9" fill="#FFFDF7"/><path d="M17.2 10l.6-3.3 1.3 1.6.9-2.6.9 2.6 1.3-1.6.6 3.3z" fill="#D9A441"/>',
    text: "In old Burmese puppet theatre, a marionette could tease the king in ways no human actor would dare. Being made of wood had its perks." },
  { icon: '<rect x="6" y="5" width="24" height="29" rx="1" stroke-dasharray="1.2 1.6" stroke-width="1"/> <rect x="7.5" y="6.5" width="21" height="26" rx=".6" fill="#FFFDF7"/> <rect x="10" y="9" width="16" height="18" fill="#CFE0EE"/><circle cx="22.5" cy="13" r="1.8" fill="#D9A441" stroke="none"/> <path d="M10 22.5h16V27H10z" fill="#B9D29C" stroke="none"/> <path d="M15.6 22.5c0-3 1.4-5 2.4-8.4 1 3.4 2.4 5.4 2.4 8.4z" fill="#D9A441"/><path d="M18 14.1v-2.4"/> <rect x="10" y="9" width="16" height="18"/><path d="M11.5 30h13" stroke-width="1" opacity=".5"/> <circle cx="30" cy="27" r="5.6" stroke="#C2452F" stroke-width="1.4"/><path d="M27.6 26.2h4.8M27.6 28h4.8" stroke="#C2452F" stroke-width="1"/> <path d="M23 35c1.6-1.1 3.2-1.1 4.8 0s3.2 1.1 4.8 0 3.2-1.1 4.8 0" stroke="#C2452F" stroke-width="1.2"/>',
    text: "Burma or Myanmar? In written Burmese the country has long been Myanma. Only the official English name changed, in 1989." },
  { icon: '<path d="M20 3c4.6 2.5 6.1 8 0 14.5-6.1-6.5-4.6-12 0-14.5z" fill="#B9D29C"/><path d="M20 5.5v11M20 9.5l-2.2-1.6M20 13l2.2-1.6" stroke-width="1"/> <ellipse cx="20" cy="27.5" rx="16.5" ry="5.8" fill="#FFFDF7"/><ellipse cx="20" cy="27.5" rx="12.5" ry="4" stroke="#D9B486" stroke-width="1"/> <path d="M8.5 26.4c1.2-4.2 5.4-6.4 11.5-6.4s10.3 2.2 11.5 6.4c-3.2 1.8-19.8 1.8-23 0z" fill="#5E8C4A"/> <ellipse cx="13.5" cy="24.4" rx="1.4" ry="1" fill="#D9B486"/><ellipse cx="17.6" cy="22.4" rx="1.4" ry="1" fill="#D9B486"/><ellipse cx="26.8" cy="24.6" rx="1.4" ry="1" fill="#D9B486"/> <circle cx="22.4" cy="23.6" r="1.8" fill="#C2452F"/><path d="M15.8 25.6h.01M20 25.8h.01M24.2 21.8h.01" stroke="#FFFDF7" stroke-width="1.6"/>',
    text: "Most of the world drinks tea. Myanmar eats it too: laphet is fermented tea leaves tossed into a salad with crunchy fried beans, peanuts and sesame." },
  { icon: '<path d="M12.5 35h15l-2.2-3.4h-10.6z" fill="#C2452F"/> <path d="M7 21.5h26c0 6.8-5.8 10.6-13 10.6S7 28.3 7 21.5z" fill="#2C3352"/><path d="M10.6 24.6c1 2.5 3.4 4.2 6.4 4.8" stroke="#FFFDF7" stroke-width="1.1" opacity=".7"/> <path d="M9.5 21.5c0-5.3 4.7-8.8 10.5-8.8s10.5 3.5 10.5 8.8z" fill="#2C3352"/><path d="M13 17.6c1.4-1.6 3.6-2.5 5.8-2.6" stroke="#FFFDF7" stroke-width="1.1" opacity=".7"/> <path d="M8.6 21.5h22.8" stroke="#D9A441" stroke-width="1.8"/> <path d="M17.8 12.8l.7-3.4h3l.7 3.4z" fill="#D9A441"/><circle cx="20" cy="7.6" r="1.6" fill="#D9A441"/>',
    text: "Many boys in Myanmar spend time as novice monks. It starts with shinbyu, a ceremony where the boy is dressed up as a prince before his head is shaved." },
  { icon: '<rect x="5.5" y="8" width="29" height="27" rx="3" fill="#FFFDF7"/> <path d="M5.5 11a3 3 0 0 1 3-3h23a3 3 0 0 1 3 3v4h-29z" fill="#C2452F"/> <path d="M13 5v6M27 5v6" stroke-width="1.8"/> <circle cx="11" cy="21" r="2" fill="#D9A441" stroke="none"/><circle cx="17" cy="21" r="2" fill="#C2452F" stroke="none"/><circle cx="23" cy="21" r="2" fill="#5E8C4A" stroke="none"/> <path d="M29 19a2 2 0 0 0 0 4z" fill="#6F9CC4" stroke="none"/><path d="M29 19a2 2 0 0 1 0 4z" fill="#CFE0EE" stroke="none"/> <circle cx="11" cy="28" r="2" fill="#D9B486" stroke="none"/><circle cx="17" cy="28" r="2" fill="#F0B5A0" stroke="none"/><circle cx="23" cy="28" r="2" fill="#2C3352" stroke="none"/> <circle cx="29" cy="21" r="3.6" stroke-width="1.2"/>',
    text: "In Myanmar, your name can hint at the day you were born. Each weekday has its own letters, and there are eight days, because Wednesday gets split in two." },
];

/* ============================================================
   BILINGUAL SWITCH (English / Burmese)
   ------------------------------------------------------------
   Covers the site's fixed chrome (nav, buttons, headings, footer)
   — event names/dates/descriptions come from the Sheet and stay
   English-only, so posting an event never requires writing it twice.

   Draft translations below were written by Claude, not a native
   speaker — have someone fluent skim them before you consider this
   "done." To fix a string, just edit the "mm" value for its key.
   ============================================================ */
const I18N = {
  en: {
    label_welcome: "Welcome",
    label_next_event: "Next Event",
    label_all_events: "Events",
    label_about: "About",
    label_gallery: "Gallery",
    label_learn: "Learn",
    label_newsletter: "Newsletter",
    label_connect: "Connect",
    label_join_newsletter_nav: "Join Newsletter",
    label_join_club: "Join the Club",
    label_join_newsletter_footer: "Join the Newsletter",
    footer_nl_placeholder: "Join our newsletter",
    footer_nl_subscribe: "Subscribe",

    hero_h1: "Mingalabar",
    hero_lede: "The Myanmar Culture Club brings the food, festivals, and stories of Myanmar to the University of Toronto. Whether you grew up with these traditions or are discovering them for the first time, there's always a seat for you at our table.",
    hero_cta_next: "See Our Next Event",


    event_h2: "See what MCC is hosting",
    countdown_days: "Days",
    countdown_hours: "Hours",
    countdown_mins: "Min",
    countdown_secs: "Sec",
    countdown_now: "Happening now!",
    register_now: "Register Now",
    add_to_calendar: "Add to calendar",
    stay_tuned_tag: "Stay tuned",
    no_event_h3: "New event coming soon",
    wcal_soon: "next event coming soon",
    no_event_p: "We're always planning something — keep checking back, and in the meantime take a look at everything we've hosted so far.",
    visit_all_previous: "Visit All Previous Events",
    rsvp: "RSVP",

    footer_h2: "Let's stay in touch.",
    contact_email_label: "Email",
    contact_email_copied: "Copied to clipboard!",
    contact_linktree_label: "Everything else",
    contact_lucky_label: "Feeling lucky?",
    contact_lucky_value: "Get a random fun fact",

    fun_fact_eyebrow: "Fun Fact",
    fun_fact_another: "Another Fact",
    fun_fact_back: "Back Home",

    footer_analytics: "This site uses Google Analytics to understand visitor traffic.",
    footer_map_open: "Open in Google Maps",

    events_eyebrow: "MCC Calendar",
    events_h1: "Our Gatherings",
    events_lede: "From food nights to festival celebrations, here's what the Myanmar Culture Club has coming up — and what we've hosted before. Can't make it in person? Follow along on Instagram so you never miss the next one.",
    coming_up_eyebrow: "Coming Up",
    coming_up_h2: "More on the calendar",
    past_events_eyebrow: "Past Events",
    past_events_h2: "What we've hosted",
    tl_end_kicker: "To be continued",
    tl_end_title: "Come be part of the next one.",
    tl_end_cta: "See what's next",
    snake_count: "{n} events since {y}",
    snake_count_done: "{n} events and counting",
    snake_skip: "Skip",
    snake_show_all: "Show all",
    snake_hint: "Scroll to follow the line",
    snake_wall_hint: "Click any poster to see it up close",
    snake_open: "Open poster",
    snake_close: "Close",
    reg_soon: "Website registration for this event isn't open yet — we're still setting it up. Check back soon!",
    bento_eyebrow: "Explore MCC",
    bento_h2: "Everything MCC, at a glance",
    bento_events_kicker: "Events",
    bento_events_big: "{n} events since {y}",
    bento_events_link: "See them all",
    bento_about_kicker: "The people",
    bento_about_title: "Meet the team",
    bento_about_sub: "{n} people across {d} teams",
    bento_gallery_kicker: "Gallery",
    bento_gallery_title: "Moments from our events",
    bento_news_kicker: "Newsletter",
    bento_news_link: "Read",
    bento_learn_kicker: "Learn Burmese",
    bento_learn_title: "Write your first letter",
    bento_learn_link: "Start tracing",
    bento_fact_kicker: "Did you know?",
    bento_fact_btn: "Another one",

    about_eyebrow: "The People",
    about_h1: "The team behind MCC",
    about_close_h: "There's always a seat for you at our table.",
    gallery_eyebrow: "Gallery",
    gallery_h1: "Moments from our events",
    gallery_hint: "Drag to explore · tap a photo to open it",
    gallery_shape_on: "Surprise Me",
    gallery_shape_off: "Back to photos",
    newsletter_eyebrow: "MCC Newsletter",
    newsletter_h1: "What's new with MCC.",
    newsletter_lede: "Club updates, upcoming events, and stories from the community, published every couple of weeks.",
  },
  mm: {
    label_welcome: "ကြိုဆိုပါသည်",
    label_next_event: "လာမည့်အခမ်းအနား",
    label_all_events: "အခမ်းအနားများ",
    label_about: "အကြောင်း",
    label_gallery: "ဓာတ်ပုံပြခန်း",
    label_learn: "သင်ယူရန်",
    label_newsletter: "သတင်းလွှာ",
    label_connect: "ဆက်သွယ်ရန်",
    label_join_newsletter_nav: "သတင်းလွှာစာရင်းသွင်းရန်",
    label_join_club: "အသင်းဝင်ရန်",
    label_join_newsletter_footer: "သတင်းလွှာတွင် စာရင်းသွင်းရန်",
    footer_nl_placeholder: "သတင်းလွှာတွင် စာရင်းသွင်းပါ",
    footer_nl_subscribe: "စာရင်းသွင်းရန်",

    hero_h1: "မင်္ဂလာပါ",
    hero_lede: "Myanmar Culture Club သည် တိုရွန်တိုတက္ကသိုလ်သို့ မြန်မာ့အစားအစာ၊ ပွဲတော်များ၊ ဘာသာစကားနှင့် ဇာတ်လမ်းများကို ယူဆောင်လာပါသည်။ ဤအစဉ်အလာများကြားတွင် ကြီးပြင်းခဲ့သူဖြစ်စေ၊ ယခုမှစတင်၍ ရှာဖွေလေ့လာနေသူဖြစ်စေ၊ ကျွန်ုပ်တို့စားပွဲတွင် သင့်အတွက် နေရာတစ်နေရာ ရှိပါသည်။",
    hero_cta_next: "လာမည့်အခမ်းအနားကြည့်ရန်",


    event_h2: "MCC ၏ လာမည့်အစီအစဉ်များကြည့်ရန်",
    countdown_days: "ရက်",
    countdown_hours: "နာရီ",
    countdown_mins: "မိနစ်",
    countdown_secs: "စက္ကန့်",
    countdown_now: "ယခုလက်ရှိ ဖြစ်ပျက်နေသည်!",
    register_now: "အခုပင်စာရင်းသွင်းပါ",
    add_to_calendar: "ပြက္ခဒိန်ထဲ ထည့်ရန်",
    stay_tuned_tag: "စောင့်ကြည့်ပါ",
    no_event_h3: "အခမ်းအနားအသစ် မကြာမီလာမည်",
    wcal_soon: "နောက်အခမ်းအနား မကြာမီလာမည်",
    no_event_p: "ကျွန်ုပ်တို့ အမြဲတမ်းစီစဉ်နေပါသည် — ဆက်လက်ကြည့်ရှုပေးပါ၊ ယခုအချိန်တွင် ကျွန်ုပ်တို့ယခင်ကျင်းပခဲ့သော အခမ်းအနားများကို ကြည့်ရှုနိုင်ပါသည်။",
    visit_all_previous: "ယခင်အခမ်းအနားများအားလုံးကြည့်ရန်",
    rsvp: "စာရင်းသွင်းရန်",

    footer_h2: "ဆက်သွယ်နေကြပါစို့။",
    contact_email_label: "အီးမေးလ်",
    contact_email_copied: "ကူးယူပြီးပါပြီ!",
    contact_linktree_label: "အခြားအရာများ",
    contact_lucky_label: "ကံစမ်းချင်လား?",
    contact_lucky_value: "စိတ်ဝင်စားစရာ အချက်အလက်တစ်ခု ရယူပါ",

    fun_fact_eyebrow: "စိတ်ဝင်စားစရာ",
    fun_fact_another: "နောက်တစ်ခု",
    fun_fact_back: "ပင်မစာမျက်နှာသို့",

    footer_analytics: "ဤဝဘ်ဆိုက်သည် ဧည့်သည်များ၏ အသုံးပြုမှုကို နားလည်ရန် Google Analytics ကို အသုံးပြုပါသည်။",
    footer_map_open: "Google Maps တွင် ဖွင့်ရန်",

    events_eyebrow: "MCC ပြက္ခဒိန်",
    events_h1: "စုစည်းပွဲအားလုံး တစ်နေရာတည်းတွင်။",
    events_lede: "အစားအသောက်ညများမှ ပွဲတော်ကျင်းပမှုများအထိ၊ Myanmar Culture Club ၏ လာမည့်အခမ်းအနားများနှင့် ယခင်ကကျင်းပခဲ့သည့်အခမ်းအနားများကို ဤနေရာတွင် တွေ့နိုင်ပါသည်။ တကယ်လာရောက်၍မရပါက Instagram တွင် လိုက်နာပါ၊ နောက်တစ်ကြိမ် လွတ်မသွားပါစေနှင့်။",
    coming_up_eyebrow: "လာမည့်အစီအစဉ်များ",
    coming_up_h2: "ပြက္ခဒိန်ပေါ်ရှိ နောက်ထပ်များ",
    past_events_eyebrow: "ယခင်အခမ်းအနားများ",
    past_events_h2: "ကျွန်ုပ်တို့ ကျင်းပခဲ့သည်များ",
    tl_end_kicker: "ဆက်လက်ရန်",
    tl_end_title: "နောက်ပွဲတွင် ပါဝင်ဆင်နွှဲလိုက်ပါ။",
    tl_end_cta: "လာမည့်ပွဲကို ကြည့်ရန်",
    snake_count: "{y} ခုနှစ်ကတည်းက အခမ်းအနား {n} ခု",
    snake_count_done: "အခမ်းအနား {n} ခု — ဆက်လက်ရှိနေဆဲ",
    snake_skip: "ကျော်ရန်",
    snake_show_all: "အားလုံးကြည့်ရန်",
    snake_hint: "မျဉ်းကြောင်းနောက်သို့ လိုက်ရန် အောက်သို့ ဆွဲချပါ",
    snake_wall_hint: "အကြီးကြည့်ရန် ပိုစတာကို နှိပ်ပါ",
    snake_open: "ပိုစတာ ဖွင့်ရန်",
    snake_close: "ပိတ်ရန်",
    reg_soon: "ဤပွဲအတွက် ဝက်ဘ်ဆိုက်မှ စာရင်းသွင်းခြင်းကို မဖွင့်ရသေးပါ — ပြင်ဆင်နေဆဲဖြစ်ပါသည်။ မကြာမီ ပြန်လာကြည့်ပါ။",
    bento_eyebrow: "MCC ကို လေ့လာပါ",
    bento_h2: "MCC အကြောင်း အားလုံး တစ်ချက်တည်းဖြင့်",
    bento_events_kicker: "အခမ်းအနားများ",
    bento_events_big: "{y} ခုနှစ်ကတည်းက အခမ်းအနား {n} ခု",
    bento_events_link: "အားလုံးကြည့်ရန်",
    bento_about_kicker: "အဖွဲ့ဝင်များ",
    bento_about_title: "အဖွဲ့နှင့် တွေ့ဆုံပါ",
    bento_about_sub: "အဖွဲ့ {d} ဖွဲ့တွင် လူ {n} ဦး",
    bento_gallery_kicker: "ဓာတ်ပုံပြခန်း",
    bento_gallery_title: "ကျွန်ုပ်တို့ ပွဲများမှ အမှတ်တရများ",
    bento_news_kicker: "သတင်းလွှာ",
    bento_news_link: "ဖတ်ရန်",
    bento_learn_kicker: "မြန်မာစာ သင်ယူရန်",
    bento_learn_title: "ပထမဆုံး စာလုံးကို ရေးကြည့်ပါ",
    bento_learn_link: "စတင်ရန်",
    bento_fact_kicker: "သင်သိပါသလား?",
    bento_fact_btn: "နောက်တစ်ခု",

    about_eyebrow: "အဖွဲ့ဝင်များ",
    about_h1: "MCC နောက်ကွယ်ရှိ အဖွဲ့",
    about_close_h: "ကျွန်ုပ်တို့စားပွဲတွင် သင့်အတွက် နေရာတစ်နေရာ ရှိပါသည်။",
    gallery_eyebrow: "ဓာတ်ပုံပြခန်း",
    gallery_h1: "ကျွန်ုပ်တို့၏ အခမ်းအနားများမှ အမှတ်တရများ",
    gallery_hint: "ရွှေ့၍ ကြည့်ရှုပါ · ဓာတ်ပုံကို နှိပ်၍ ဖွင့်ပါ",
    gallery_shape_on: "အံ့ဩစရာ ပြပါ",
    gallery_shape_off: "ဓာတ်ပုံများသို့ ပြန်မယ်",
    newsletter_eyebrow: "MCC သတင်းလွှာ",
    newsletter_h1: "MCC ၏ နောက်ဆုံးရ သတင်းများ။",
    newsletter_lede: "အသင်းသတင်းများ၊ လာမည့်အခမ်းအနားများနှင့် အသိုင်းအဝိုင်းမှ ဇာတ်လမ်းများ — နှစ်ပတ်တစ်ကြိမ်ခန့် ထုတ်ဝေပါသည်။",
  },
};

function getLang() {
  try { return localStorage.getItem("mcc_lang") === "mm" ? "mm" : "en"; }
  catch (e) { return "en"; }
}
function setLang(lang) {
  try { localStorage.setItem("mcc_lang", lang); } catch (e) {}
}
function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
}
// Placeholders; on phones a field can carry a shorter one (data-i18n-ph-short)
function applyPlaceholders() {
  const narrow = window.matchMedia && window.matchMedia("(max-width: 560px)").matches;
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = (narrow && el.getAttribute("data-i18n-ph-short")) || el.getAttribute("data-i18n-ph");
    el.placeholder = t(key);
  });
}
function applyTranslations() {
  const lang = getLang();
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "mm" ? "my" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
    el.classList.toggle("myanmar", lang === "mm");
  });
  applyPlaceholders();
  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  document.querySelectorAll(".lang-toggle").forEach(group => {
    group.setAttribute("data-active", lang);
  });
}
function initLangToggle() {
  const buttons = document.querySelectorAll(".lang-toggle button");
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === getLang()) return;
      setLang(btn.dataset.lang);
      applyTranslations();
      rerenderDynamicText();
    });
  });
}

// TESTING SWITCH — normally, when there's no upcoming event, the "Next
// Event" spot shows a "New event coming soon" message. Flip
// this to true to instead show your most recent past event in that spot
// (so you can preview/test how the "Next Event" card looks with real
// content, without needing an actual upcoming event in the sheet). It
// only kicks in when there is no genuine upcoming event — a real
// upcoming event always takes priority. Set back to false when you're
// done testing.
const TESTING_SHOW_LATEST_EVENT_AS_NEXT = false;

// All "is this event over yet" checks are done in Toronto time, regardless
// of the visitor's own timezone or device clock — see nowInToronto() below.
const CLUB_TIMEZONE = "America/Toronto";

const FALLBACK_EVENTS_CSV = `id,name,date,end_time,time,location,description,photo,link
taste-of-southeast-asia,Taste of Southeast Asia,2026-11-10,21:00,7–9 PM,William Doo Auditorium,"A multi-club celebration of Southeast Asian food and culture — MCC co-hosted with FSA, UTVSA, UofT MSSA, UofT ISA, UTTSA, and more. Tickets: $10 early bird, $12 walk-in — link in bio.",images/events/taste-of-southeast-asia.jpg,
mcc-run,MCC Run,2026-10-10,,10:30 AM,Convocation Hall to Evergreen Brickworks,"MCC's first-ever run: from Convocation Hall to Evergreen Brickworks, with a farmers market at the finish for lunch. Run, jog or walk — all paces welcome.",images/events/mcc-run.jpg,
home-away-from-home,Home Away From Home,2026-09-22,19:30,5:30–7:30 PM,"KP 208, Koffler House · 569 Spadina Cres","An evening celebrating Burmese culture — food, conversation, and community. Meet fellow Burmese students, and hear from representatives of the Embassy of Myanmar in Ottawa on consular services, including passport renewal.",images/events/home-away-from-home.jpg,https://forms.gle/wE9f6srzzx7xUEpq8
welcome-picnic,MCC Welcome Picnic,2026-09-20,,,Front Campus,,images/events/welcome-picnic.jpg,
toronto-ready,Toronto Ready,2026-08-24,,,Online · Zoom,,images/events/toronto-ready.jpg,
hihi-culture-exchange,HiHi Culture Exchange,2026-03-27,,,"Cumberland Room, CIE",,images/events/hihi-culture-exchange.jpg,
badminton-social,Badminton Social,2026-03-08,,,Vision Badminton Centre,,images/events/badminton-social.jpg,
sea-of-love,Sea of Love × UofT MSSA,2026-02-13,,,1080 Bay St,,images/events/sea-of-love.jpg,
thingyan-festival,Thingyan Festival,2026-04-18,20:00,3–8 PM,"1133 Leslie St #101, North York, ON","Myanmar New Year celebration with traditional performances, Thingyan music, delicious Burmese food, and raffle draws. Hosted by the Burmese Canadian Association of Ontario (BCAO); promoted by MCC UofT.",images/events/thingyan-festival.jpg,
origami-workshop,Origami Workshop,2026-01-28,19:00,5:00–7:00 PM,RW143,"UTFOLD and MCC present a Burmese-inspired origami workshop — a cozy evening of folding, snacks, and learning about Burmese culture. No experience needed.",images/events/origami-workshop.jpg,
condo-party,New Year's Condo Party,2026-01-17,23:00,7–11 PM,88 Cumberland,"Kickstart 2026 with MCC's New Year party — open bar with Burmese-inspired cocktails, snacks, games, and karaoke.",images/events/condo-party.jpg,
burmese-language-workshop,Burmese Language Workshop,2025-11-13,15:00,1–3 PM,OISE 5270,"A Burmese language workshop for all levels, beginner to advanced — learn the alphabet, writing, and useful phrases.",images/events/burmese-language-workshop.jpg,
back-to-school-picnic,Back to School Picnic,2025-09-13,,3 PM,King's College Circle,"MCC's first event of the school year — an afternoon picnic to meet the execs and make new friends in the Burmese community. Light refreshments provided.",images/events/back-to-school-picnic.jpg,
roll-and-shuffle,Roll & Shuffle with MCC,2025-04-30,17:00,1–5 PM,"Snakes & Lattes Annex, 600 Bloor St W","An afternoon of board games with MCC — free to attend, open to UofT students from all three campuses.",images/events/roll-and-shuffle.jpg,
intercultural-adventure,An Intercultural Adventure,2025-01-24,15:10,1:10–3:10 PM,"Cumberland House, Cumberland Room","MCC × UTChinese Network Student Association collab — snacks and fun games together.",images/events/intercultural-adventure.jpg,
pub-night,An MCC Pub Night,2024-12-27,19:30,7:30 PM,"Duke of York Pub, 39 Prince Arthur Ave","A holiday MCC pub night — mingling with friends and delicious platters on MCC.",images/events/pub-night.jpg,
mcc-mixer,MCC Mixer,2024-03-24,21:00,5–9 PM,"William Doo Auditorium, 45 Wilcocks St","MCC's first ever mixer — a night of food, music, and fun. Free to attend.",images/events/mcc-mixer.jpg,
sweet-taste-myanmar-china,A Sweet Taste of Myanmar & China,2024-03-22,15:30,1–3:30 PM,"Cumberland Room, Cumberland House","Free desserts and tea, hosted by MCC in collaboration with the UTChinese Network Student Association.",images/events/sweet-taste-myanmar-china.jpg,
savoury-taste-myanmar,A Savoury Taste of Myanmar: Ohn No Khao Swe,2024-03-08,,,Cumberland Room,"MCC shared Ohn No Khao Swe, a Burmese coconut noodle soup, sponsored by the Centre for International Experience (CIE).",images/events/savoury-taste-myanmar.jpg,
multicultural-munch,Multicultural Munch,2023-11-03,18:00,4–6 PM,"UTSU Student Commons, 5th Floor Lounge","MCC joined four other clubs sharing cultural foods, serving the Burmese dessert Shwe Yin Aye.",images/events/multicultural-munch.jpg,
buddhist-temple-visit,Mahādhammika Myanmar Buddhist Temple Visit,2023-09-17,16:00,9 AM–4 PM,"Mahādhammika Myanmar Buddhist Temple, North York, ON","A free trip to learn about Buddhism, practice guided meditation with a monk, and enjoy a Burmese lunch. Bus transportation provided.",images/events/buddhist-temple-visit.jpg,
hihi-culture-trivia-2023,"""Hi Hi"": UTCN × MCC Culture Exchange",2023-03-17,17:00,3–5 PM,Woodsworth Room 120,"Cross-ethnic networking session with Myanmar and Chinese culture trivia, a Myanmar makeup feature, and food and tea tasting. Co-hosted with UTChinese Network.",images/events/hihi-culture-trivia-2023.jpg,
multicultural-bazaar-giveaway,Multicultural Bazaar: Food Giveaway,2022-11-22,,,"Multicultural Bazaar, UofT Student Commons","MCC gave away traditional Burmese food — Ei Kyar Kway (deep-fried dough snack) and Laphat Yay (Burmese milk tea) — at the Multicultural Bazaar.",images/events/multicultural-bazaar-giveaway.jpg,`;

const FALLBACK_HERO_CSV = `slot,photo,alt
1,images/welcome_vertical.jpg,Welcome collage photo
2,images/welcome_top.jpg,Welcome collage photo
3,images/welcome_bottom.jpg,Welcome collage photo`;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// Returns the current wall-clock moment IN TORONTO as a sortable
// "YYYY-MM-DDTHH:MM:SS" string — computed from the club's timezone, not
// the visitor's device/browser timezone, so a member checking the site
// from Vancouver or overseas sees the same "is it over yet" answer as
// someone in Toronto.
function nowInToronto() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLUB_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

// Accepts "19:30" (24h), "7:30 PM" / "7:30PM" / "07:30 pm" (12h) and
// returns "HH:MM:SS", or null if it can't make sense of the input —
// callers should treat null as "no specific end time given."
function parseTimeToHHMMSS(raw) {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();
  let m = s.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = m[2];
    const isPM = m[3].toLowerCase() === "pm";
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
    return `${String(h).padStart(2, "0")}:${min}:00`;
  }
  m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const h = parseInt(m[1], 10);
    if (h > 23) return null;
    return `${String(h).padStart(2, "0")}:${m[2]}:00`;
  }
  return null;
}

// The moment (Toronto time) after which this event counts as "over."
// Uses the event's end_time when given; otherwise the event stays
// "upcoming" through the end of its calendar day.
function eventCutoff(ev) {
  const t = parseTimeToHHMMSS(ev.end_time) || "23:59:59";
  return `${ev.date}T${t}`;
}

function calendarIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9 L21 9"/><path d="M8 3 L8 7"/><path d="M16 3 L16 7"/></svg>`;
}
function pinIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21 C12 21 5 14 5 9 A7 7 0 0 1 19 9 C19 14 12 21 12 21 Z"/><circle cx="12" cy="9" r="2.4"/></svg>`;
}

// Small self-contained CSV parser (handles quoted fields, embedded commas,
// escaped quotes ("") and quoted newlines) — no external library needed,
// so this page has zero dependency on any CDN being reachable.
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\r") {
      // skip
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim());
  return rows
    .slice(1)
    .filter(r => r.some(c => c.trim() !== ""))
    .map(r => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = (r[idx] !== undefined ? r[idx] : "").trim(); });
      return obj;
    });
}

function safeParse(text) {
  try {
    return parseCSV(text);
  } catch (err) {
    console.warn("CSV parse failed:", err);
    return [];
  }
}

// Each browser keeps its last copy of the Sheets, so pages can show events instantly
// and refresh from Google in the background.
const CSV_CACHE_PREFIX = "mcc-csv-cache:";
function readCachedCSV(url) {
  try { return localStorage.getItem(CSV_CACHE_PREFIX + url); } catch (err) { return null; }
}
function writeCachedCSV(url, text) {
  try { localStorage.setItem(CSV_CACHE_PREFIX + url, text); } catch (err) {}
}

// Fresh text from a published Sheet, or null if it isn't set up / can't be reached.
async function fetchCSVText(url) {
  if (!url || url.includes("PASTE_") || url.includes("YOUR_")) return null;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!safeParse(text).length) throw new Error("empty sheet");
    writeCachedCSV(url, text);
    return text;
  } catch (err) {
    console.warn(`Couldn't refresh ${url}:`, err);
    return null;
  }
}

function splitEvents(rows) {
  const now = nowInToronto();
  const withDates = rows.filter(r => r.date && r.date.trim());
  const upcoming = withDates
    .filter(r => eventCutoff(r) >= now)
    .sort((a, b) => eventCutoff(a).localeCompare(eventCutoff(b)));
  const past = withDates
    .filter(r => eventCutoff(r) < now)
    .sort((a, b) => eventCutoff(b).localeCompare(eventCutoff(a)));
  return { upcoming, past };
}

function eventMetaRow(ev) {
  const dateBit = ev.time ? `${formatDate(ev.date)} · ${ev.time}` : formatDate(ev.date);
  return `
    <div class="meta-row">
      <span class="meta-item">${calendarIcon()}${dateBit}</span>
      ${ev.location ? (mapUrl(ev.location)
        ? `<span class="meta-item">${pinIcon()}<a class="meta-link" href="${mapUrl(ev.location)}" target="_blank" rel="noopener" title="Open in Google Maps">${ev.location}</a></span>`
        : `<span class="meta-item">${pinIcon()}${ev.location}</span>`) : ""}
    </div>`;
}

/* ---------- COUNTDOWN TO NEXT EVENT (homepage only) ----------
   `#js-countdown` only exists in index.html's markup, so initCountdown()
   is a safe no-op anywhere else (events.html included) -- same pattern
   as every other render function in this file. */

// Best-effort guess at the event's START time from the free-text `time`
// column (e.g. "7-9 PM", "5:30-7:30 PM", "10:30 AM"). Only makes the
// countdown feel precise -- if it can't confidently parse one, the
// countdown falls back to midnight on the event's date, which for an
// event that's still "upcoming" is never already in the past.
function parseEventStartHHMMSS(ev) {
  const raw = (ev.time || "").trim();
  if (!raw) return null;
  const first = raw.split(/[-–—]| to /i)[0].trim();

  // The first segment already carries its own AM/PM (e.g. the "9 AM" in
  // "9 AM-4 PM", or a plain "3 PM" with no range at all).
  let m = first.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
  if (m) return parseTimeToHHMMSS(`${m[1]}:${m[2] || "00"} ${m[3]}`);

  // No AM/PM on the first segment -- a bare hour or hour:minute, like the
  // "7" in "7-9 PM" or the "5:30" in "5:30-7:30 PM". Borrow whichever
  // AM/PM is named anywhere else in the string (ranges almost always
  // share one), rather than defaulting to a 24h reading that would turn
  // "5:30-7:30 PM" into 5:30 AM.
  const hourMin = first.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!hourMin) return null;
  const meridiem = raw.match(/([AaPp][Mm])/);
  if (meridiem) return parseTimeToHHMMSS(`${hourMin[1]}:${hourMin[2] || "00"} ${meridiem[1]}`);

  // No AM/PM anywhere in the field -- treat it as a plain 24h time.
  return parseTimeToHHMMSS(`${hourMin[1]}:${hourMin[2] || "00"}`);
}

// Converts a Toronto wall-clock "YYYY-MM-DDTHH:MM:SS" string into the real
// UTC instant it refers to -- correctly handling EST/EDT without a
// timezone library. Works by guessing, checking what that guess reads as
// in Toronto, then correcting by the difference; converges in one pass
// since the only error source is a whole-number-of-minutes DST offset.
function torontoWallToUTC(wallStr) {
  const guess = new Date(wallStr + "Z");
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLUB_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(guess);
  const get = type => parts.find(p => p.type === type).value;
  const guessWallMs = Date.parse(`${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`);
  const targetWallMs = Date.parse(wallStr + "Z");
  return new Date(guess.getTime() + (targetWallMs - guessWallMs));
}

// Rolling digits for the homepage countdown: each digit is a little reel that rolls down to the
// next number (like a flip clock / odometer) instead of just swapping.
// The reel runs 9→0 twice, so going from 0 back up to 9 (or 0→5 on the tens of seconds) keeps
// rolling the same way, then quietly snaps back to the first copy.
function setReels(el, str) {
  let reels = el.querySelectorAll(".reel-s");
  if (reels.length !== str.length) {
    const strip = "9876543210".repeat(2).split("").map(d => `<span>${d}</span>`).join("");
    el.innerHTML = str.split("").map(() => `<span class="reel"><span class="reel-s">${strip}</span></span>`).join("");
    el.setAttribute("aria-label", str);
    reels = el.querySelectorAll(".reel-s");
    reels.forEach((r, i) => { r.style.transition = "none"; r.dataset.d = str[i]; r.style.transform = `translateY(-${(9 - Number(str[i])) * 5}%)`; });
    void el.offsetWidth;
    reels.forEach(r => { r.style.transition = ""; });
    return;
  }
  el.setAttribute("aria-label", str);
  reels.forEach((r, i) => {
    const d = Number(str[i]), prev = Number(r.dataset.d);
    if (d === prev) return;
    r.dataset.d = String(d);
    const idx = 9 - d;
    if (d > prev) {
      // wrapped around (e.g. 0 → 9): roll on into the second copy, then snap back
      r.style.transform = `translateY(-${(idx + 10) * 5}%)`;
      clearTimeout(r._snap);
      r._snap = setTimeout(() => {
        r.style.transition = "none";
        r.style.transform = `translateY(-${idx * 5}%)`;
        void r.offsetWidth;
        r.style.transition = "";
      }, 700);
    } else {
      r.style.transform = `translateY(-${idx * 5}%)`;
    }
  });
}

let _countdownTimer = null;

function initCountdown(ev) {
  const box = document.getElementById("js-countdown");
  const nowBox = document.getElementById("js-countdown-now");
  if (!box) return;

  clearInterval(_countdownTimer);
  _countdownTimer = null;

  if (!ev) { box.hidden = true; if (nowBox) nowBox.hidden = true; return; }

  const startHHMMSS = parseEventStartHHMMSS(ev) || "00:00:00";
  const target = torontoWallToUTC(`${ev.date}T${startHHMMSS}`);
  const nums = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs"),
  };
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tick() {
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) {
      clearInterval(_countdownTimer);
      _countdownTimer = null;
      box.hidden = true;
      if (nowBox) nowBox.hidden = false;
      return;
    }
    const totalSec = Math.floor(diffMs / 1000);
    const vals = {
      d: Math.floor(totalSec / 86400),
      h: Math.floor((totalSec % 86400) / 3600),
      m: Math.floor((totalSec % 3600) / 60),
      s: totalSec % 60,
    };
    Object.keys(vals).forEach(k => {
      const str = String(vals[k]).padStart(2, "0");
      if (nums[k].dataset.v === str) return;
      nums[k].dataset.v = str;
      if (reduceMotion) { nums[k].textContent = str; return; }
      setReels(nums[k], str);
    });
  }

  box.hidden = false;
  if (nowBox) nowBox.hidden = true;
  tick();
  _countdownTimer = setInterval(tick, 1000);
}

function renderFeaturedEvent(ev) {
  const visual = document.getElementById("js-event-visual");
  const body = document.getElementById("js-event-body");
  if (!body) return;
  initCountdown(ev);
  const mmClass = getLang() === "mm" ? "myanmar" : "";

  if (!ev) {
    if (visual) renderWallCalendar(visual);
    // On the events page itself the past gallery is further down this same
    // page; on the homepage it lives on events.html — point the link at
    // wherever it actually is.
    const pastHref = document.getElementById("js-past-gallery") ? "#past-events" : "events.html#past-events";
    body.innerHTML = `
      <h3 class="${mmClass}">${t("no_event_h3")}</h3>
      <p class="desc ${mmClass}">${t("no_event_p")}</p>
      <a class="btn ghost ${mmClass}" href="${pastHref}">${t("visit_all_previous")}</a>`;
    return;
  }

  if (visual) {
    removeWallCalendar(visual);
    visual.innerHTML = ev.photo
      ? `<img src="${safeUrl(ev.photo)}" alt="${escapeHtml(ev.name)} event photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : "";
  }
  body.innerHTML = `
    <span class="event-tag ${mmClass}">${t("label_next_event")}</span>
    <h3>${escapeHtml(ev.name)}</h3>
    ${eventMetaRow(ev)}
    ${ev.description ? `<p class="desc">${escapeHtml(ev.description)}</p>` : ""}
    ${calendarRow(ev, mmClass)}
    ${registerButton(ev, `btn ${mmClass}`, t("register_now"))}
  `;
}

/* ---------- Empty Next Event: a calendar ----------
   When nothing is coming up, the left half of the Next Event card becomes a calendar page (red
   strip across the top): this month (Toronto time), past days greyed out, today in red, and one of
   our best events as the picture. When it comes into view, "next event coming soon" is written and
   circled. The page keeps its designed layout (PAGE_W × PAGE_H at scale 1) and is scaled to the
   panel's height; its width stretches to fill the panel (kept between WCAL_MIN_W and WCAL_MAX_W).
   The picture alternates between these events: each page load shows the next one in the list
   (remembered in localStorage "mcc_wcal"). pos = which part of the poster shows in the frame: */
const WCAL_ART = [
  { photo: "images/events/burmese-language-workshop.jpg", name: "Burmese Language Workshop", pos: "center 40%" },
  { photo: "images/events/back-to-school-picnic.jpg", name: "Back to School Picnic", pos: "center 40%" },
];
const WCAL_BIND = 26, WCAL_PAGE_H = 298, WCAL_MIN_W = 360, WCAL_MAX_W = 540;   // design px at scale 1

const WCAL = { el: null, ro: null, io: null, i: 0 };

function wallCalendarHTML() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "numeric", day: "numeric" })
    .formatToParts(new Date()).reduce((o, x) => (o[x.type] = +x.value, o), {});
  const Y = p.year, M = p.month - 1, D = p.day;
  const first = new Date(Y, M, 1).getDay(), days = new Date(Y, M + 1, 0).getDate();
  let g = "SMTWTFS".split("").map(h => `<div class="h">${h}</div>`).join("") + "<div></div>".repeat(first);
  for (let d = 1; d <= days; d++) g += `<div class="d${d < D ? " past" : ""}${d === D ? " today" : ""}">${d}</div>`;
  const month = new Date(Y, M, 1).toLocaleString("en", { month: "long" });
  let last = -1;
  try { last = parseInt(localStorage.getItem("mcc_wcal"), 10); } catch (e) { /* storage blocked */ }
  WCAL.i = Number.isInteger(last) && last >= 0 ? (last + 1) % WCAL_ART.length : Math.floor(Math.random() * WCAL_ART.length);
  try { localStorage.setItem("mcc_wcal", String(WCAL.i)); } catch (e) { /* storage blocked */ }
  const art = WCAL_ART[WCAL.i];
  return `<div class="wcal-fit"><div class="wcal-hang">
    <span class="wcal-nail" aria-hidden="true"></span>
    <svg class="wcal-wire" viewBox="0 0 420 36" preserveAspectRatio="none" aria-hidden="true"><path d="M210 2 L170 35 M210 2 L250 35"/></svg>
    <div class="wcal-sway"><div class="wcal">
      <div class="wcal-bind"></div>
      <div class="wcal-page">
        <figure class="wcal-art"><div class="frame"><img class="on" src="${safeUrl(art.photo)}" alt="${escapeHtml(art.name)} poster" style="object-position:${art.pos}" decoding="async"></div><figcaption>${escapeHtml(art.name)}</figcaption></figure>
        <div class="wcal-side">
          <div class="wcal-head"><span class="wcal-m">${month}</span><span class="wcal-y">${Y}</span></div>
          <div class="wcal-grid" aria-label="${month} ${Y}">${g}</div>
          <div class="wcal-note"><span class="wcal-ring"><span class="wcal-txt"></span><svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M8 6 C 30 -2, 80 0, 95 9 C 104 16, 92 28, 55 29 C 20 30, -2 24, 3 14 C 6 7, 18 4, 30 3"/></svg></span></div>
        </div>
      </div>
    </div></div>
  </div></div>`;
}

function wallCalendarText(visual) {
  const note = visual.querySelector(".wcal-note"), txt = visual.querySelector(".wcal-txt");
  if (!note || !txt) return;
  txt.textContent = t("wcal_soon");
  note.classList.toggle("myanmar", getLang() === "mm");
}

function renderWallCalendar(visual) {
  if (visual.classList.contains("is-cal") && visual.querySelector(".wcal")) { wallCalendarText(visual); return; }  // already up: don't replay
  visual.innerHTML = wallCalendarHTML();
  visual.classList.add("is-cal");
  wallCalendarText(visual);
  WCAL.el = visual;
  const fit = visual.querySelector(".wcal-fit"), hang = visual.querySelector(".wcal-hang");
  const txt = visual.querySelector(".wcal-txt"), ring = visual.querySelector(".wcal-ring path");

  // fill the panel: scale to its height, stretch the width (the red strip always spans the panel)
  if (WCAL.ro) WCAL.ro.disconnect();
  WCAL.ro = new ResizeObserver(() => {
    const W = visual.clientWidth, H = visual.clientHeight;
    if (!W || !H) return;
    let k = H / (WCAL_BIND + WCAL_PAGE_H), w = W / k;
    if (w < WCAL_MIN_W) { w = WCAL_MIN_W; k = W / w; }
    else if (w > WCAL_MAX_W) w = WCAL_MAX_W;
    hang.style.width = w.toFixed(1) + "px";
    fit.style.setProperty("--k", k.toFixed(4));
    visual.style.setProperty("--bh", (WCAL_BIND * k).toFixed(2) + "px");
  });
  WCAL.ro.observe(visual);

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const len = ring.getTotalLength() + 1;
  ring.style.strokeDasharray = len;
  ring.style.strokeDashoffset = reduce ? 0 : len;
  if (reduce) return;
  txt.style.clipPath = "inset(0 100% 0 0)";

  // entrance, once, when it comes into view
  if (WCAL.io) WCAL.io.disconnect();
  WCAL.io = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    WCAL.io.disconnect();
    txt.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 1500, delay: 500, easing: "steps(22, end)", fill: "forwards" });
    ring.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 850, delay: 2050, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
  }, { threshold: 0.45 });
  WCAL.io.observe(visual);
}

function removeWallCalendar(visual) {
  if (!visual.classList.contains("is-cal")) return;
  visual.classList.remove("is-cal");
  visual.style.removeProperty("--bh");
  if (WCAL.ro) WCAL.ro.disconnect();
  if (WCAL.io) WCAL.io.disconnect();
  WCAL.el = null;
}


/* ---------- REGISTER BUTTONS ---------- */
// In the Events sheet's "link" column:
//   a Google Form (or any) link → "Register" opens that link, as before;
//   the word  site              → "Register" opens the website's own registration (js/register.js),
//                                  which records it in Supabase and gives a ticket with a QR code;
//   blank                       → no button.
const REG_EVENTS = {};
// While website registration is still being set up, it works but is labelled a demo: the window and
// the ticket say it doesn't count and point people to the Google Form in @mcc_uoft's Instagram bio.
// Switch this to false when website registration is ready for real.
window.MCC_REG_DEMO = true;
function isSiteRegistration(ev) { return /^\s*(site|website)\s*$/i.test(ev && ev.link || ""); }
// The database wants a simple id (lowercase letters, numbers, dashes). If the sheet's id isn't
// like that (spaces, capitals, blank), one is made from the id — or the name and date — instead.
function registrationId(ev) {
  const slug = v => String(v || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return slug(ev.id) || slug(`${ev.name || "event"}-${ev.date || ""}`);
}
function registerButton(ev, cls, label) {
  if (!ev || !ev.link) return "";
  if (isSiteRegistration(ev)) {
    const id = registrationId(ev);
    if (!id) return "";
    REG_EVENTS[id] = { ...ev, id };
    return `<button type="button" class="${cls} js-register" data-reg="${escapeHtml(id)}">${label}</button>`;
  }
  return `<a class="${cls}" href="${safeUrl(ev.link)}" target="_blank" rel="noopener">${label}</a>`;
}

// The registration window and what it needs are only downloaded the first time someone taps Register.
function loadScriptOnce(src, ready) {
  if (ready()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) { existing.addEventListener("load", resolve); existing.addEventListener("error", reject); return; }
    const el = document.createElement("script");
    el.src = src; el.async = true; el.dataset.src = src;
    el.onload = resolve; el.onerror = reject;
    document.head.appendChild(el);
  });
}
function loadRegistration() {
  return loadScriptOnce("js/exec-config.js", () => !!window.MCC_EXEC_CONFIG)
    .then(() => loadScriptOnce("js/supabase.js", () => !!(window.supabase && window.supabase.createClient)))
    .then(() => loadScriptOnce("js/vendor/qrcode.min.js", () => typeof window.qrcode === "function"))
    .then(() => loadScriptOnce("js/register.js?v=wallet4", () => !!window.MCCRegister));
}
function initRegisterButtons() {
  document.addEventListener("click", e => {
    const btn = e.target.closest && e.target.closest(".js-register");
    if (!btn) return;
    const ev = REG_EVENTS[btn.dataset.reg];
    if (!ev) return;
    btn.disabled = true;
    loadRegistration()
      .then(() => window.MCCRegister.open(ev))
      .catch(err => { console.error("Couldn't load registration:", err); alertRegistrationDown(btn); })
      .finally(() => { btn.disabled = false; });
  });
  // Arrived from a "reset your password" email?
  if (/[#&]type=recovery(&|$)/.test(location.hash) && !document.body.matches('[data-page="exec"], [data-page="login"]')) {
    loadRegistration().then(() => window.MCCRegister.recover()).catch(() => {});
  }
}
function alertRegistrationDown(btn) {
  btn.textContent = "Try again";
}

/* ---------- ASK MCC HOOKS ----------
   The Ask MCC chat (js/ask-mcc.js) offers next steps under its answers: an event card with
   Register / Add to calendar, a newsletter box, "Ask the exec team". It never does these itself:
   it calls these hooks, so the chat reuses this site's own registration window, calendar links,
   newsletter form and Supabase connection. Each returns quickly and never throws at the chat. */
const KIT_SUBSCRIBE_URL = "https://app.kit.com/forms/10200664/subscriptions";   // same form as newsletter.html
window.MCCSite = {
  register(ev) {
    const full = { ...ev, id: registrationId(ev) };
    if (!full.id) return Promise.resolve();
    REG_EVENTS[full.id] = full;
    return loadRegistration()
      .then(() => window.MCCRegister.open(full))
      .catch(err => { console.error("Couldn't load registration:", err); location.href = "events.html"; });
  },
  calendar(ev) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(ev.date || ""))) return null;
    return calendarLinks({ ...ev, date: String(ev.date) });
  },
  newsletter(email) {
    return fetch(KIT_SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
      body: "email_address=" + encodeURIComponent(email),
    }).then(r => r.json().catch(() => ({})).then(j => {
      if (r.ok && j.status === "success") return { ok: true };
      const m = j && j.errors && j.errors.messages && j.errors.messages[0];
      return { ok: false, message: m ? m + "." : "" };
    })).catch(() => ({ ok: false, message: "Couldn't reach the sign-up service. Please try again in a moment." }));
  },
  // Sends the question to the exec portal's Questions inbox (supabase/ask-mcc-questions.sql).
  askTeam({ question, email, context, session }) {
    return loadScriptOnce("js/exec-config.js", () => !!window.MCC_EXEC_CONFIG).then(() => {
      const cfg = window.MCC_EXEC_CONFIG || {};
      if (!cfg.url || !cfg.key) return { ok: false };
      return fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/rpc/ask_exec", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": cfg.key },
        body: JSON.stringify({ p_question: question, p_email: email || null,
                               p_context: (context || "").slice(0, 2000), p_session: session || null }),
      }).then(r => r.ok ? { ok: true } : r.json().catch(() => ({})).then(j => {
        const m = String((j && j.message) || "");
        // the database's own messages are written for visitors ("Please enter a valid email")
        return { ok: false, message: /^(Please|Too many|You have)/.test(m) ? m + "." : "" };
      }));
    }).catch(() => ({ ok: false }));
  },
};

/* ---------- ADD TO CALENDAR + MAP LINK (next event) ---------- */
// Online events have nothing to map.
function mapUrl(location) {
  const loc = (location || "").trim();
  if (!loc || /\b(online|zoom|virtual|teams|discord)\b/i.test(loc)) return null;
  const q = /toronto|north york|scarborough|mississauga|\bON\b/i.test(loc) ? loc : loc + ", Toronto";
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
}

// End time: the end_time column if filled in, else the end of a range like "7-9 PM".
function parseEventEndHHMMSS(ev) {
  if (ev.end_time && ev.end_time.trim()) {
    const v = parseTimeToHHMMSS(ev.end_time.trim());
    if (v) return v;
  }
  const raw = (ev.time || "").trim();
  const parts = raw.split(/[-–—]| to /i);
  if (parts.length < 2) return null;
  const last = parts[parts.length - 1].trim();
  let m = last.match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])$/);
  if (m) return parseTimeToHHMMSS(`${m[1]}:${m[2] || "00"} ${m[3]}`);
  m = last.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return null;
  const meridiem = raw.match(/([AaPp][Mm])/);
  return parseTimeToHHMMSS(`${m[1]}:${m[2] || "00"}${meridiem ? " " + meridiem[1] : ""}`);
}

function calendarLinks(ev) {
  const stamp = d => d.toISOString().replace(/\.\d{3}/, "").replace(/[-:]/g, "");   // 20261111T000000Z
  const ymd = iso => iso.replace(/-/g, "");
  const dayAfter = iso => { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10).replace(/-/g, ""); };

  const valid = d => d instanceof Date && !isNaN(d.getTime());
  const startT = parseEventStartHHMMSS(ev);
  let start = null, end = null;
  if (startT) {
    start = torontoWallToUTC(`${ev.date}T${startT}`);
    const endT = parseEventEndHHMMSS(ev);
    if (endT) {
      end = torontoWallToUTC(`${ev.date}T${endT}`);
      if (valid(end) && valid(start) && end <= start) end = new Date(end.getTime() + 86400000);   // runs past midnight
    }
    if (valid(start) && !valid(end)) end = new Date(start.getTime() + 2 * 3600000);   // no end time given: assume 2 hours
    if (!valid(start)) { start = null; end = null; }                                    // unreadable time: all-day entry
  }
  const details = [ev.description, ev.link ? "Details: " + ev.link : "", "Myanmar Culture Club \u00b7 uoftmcc.ca"].filter(Boolean).join("\n\n");

  const google = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(ev.name) +
    "&dates=" + (start ? `${stamp(start)}/${stamp(end)}` : `${ymd(ev.date)}/${dayAfter(ev.date)}`) +
    "&details=" + encodeURIComponent(details) +
    (ev.location ? "&location=" + encodeURIComponent(ev.location) : "") +
    "&ctz=" + encodeURIComponent(CLUB_TIMEZONE);

  // .ics file for Apple Calendar, Outlook and most other calendar apps.
  const esc = v => String(v).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const fold = line => line.length <= 73 ? line : line.match(/.{1,73}/g).join("\r\n ");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Myanmar Culture Club//uoftmcc.ca//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + (ev.id || ymd(ev.date)) + "@uoftmcc.ca",
    "DTSTAMP:" + stamp(new Date()),
    ...(start ? ["DTSTART:" + stamp(start), "DTEND:" + stamp(end)]
              : ["DTSTART;VALUE=DATE:" + ymd(ev.date), "DTEND;VALUE=DATE:" + dayAfter(ev.date)]),
    "SUMMARY:" + esc(ev.name),
    "DESCRIPTION:" + esc(details),
    ...(ev.location ? ["LOCATION:" + esc(ev.location)] : []),
    "URL:" + (ev.link || "https://uoftmcc.ca/events.html"),
    "END:VEVENT", "END:VCALENDAR",
  ].map(fold);
  return {
    google,
    ics: "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n") + "\r\n"),
    file: (ev.id || "mcc-event").replace(/[^a-z0-9-]+/gi, "-") + ".ics",
  };
}

function calendarRow(ev, mmClass) {
  if (!ev || !/^\d{4}-\d{2}-\d{2}$/.test(String(ev.date || "").trim())) return "";
  let cal;
  try { cal = calendarLinks({ ...ev, date: String(ev.date).trim() }); }
  catch (err) { console.warn("Calendar links skipped:", err); return ""; }
  return `
    <div class="cal-row">
      <span class="cal-label ${mmClass}">${calendarIcon()}${t("add_to_calendar")}</span>
      <a class="cal-btn" href="${cal.google}" target="_blank" rel="noopener">Google</a>
      <a class="cal-btn" href="${cal.ics}" download="${cal.file}">Apple / Outlook</a>
    </div>`;
}

function renderComingUp(rest) {
  const grid = document.getElementById("js-events-grid");
  if (!grid) return;
  const section = grid.closest("section");
  if (!rest.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  const mmClass = getLang() === "mm" ? "myanmar" : "";
  grid.innerHTML = rest.map(ev => `
    <div class="event-mini reveal">
      <h3>${escapeHtml(ev.name)}</h3>
      ${eventMetaRow(ev)}
      ${ev.description ? `<p class="desc">${escapeHtml(ev.description)}</p>` : ""}
      ${registerButton(ev, `btn small ${mmClass}`, t("rsvp"))}
    </div>
  `).join("");
}

// `past` is already sorted most-recent-first (see splitEvents). Every
// past event renders here -- nothing is capped or hidden.
function renderPastGallery(past) {
  const gallery = document.getElementById("js-past-gallery");
  if (!gallery) return;
  gallery.innerHTML = past.map(ev => `
    <div class="past-card reveal">
      <div class="photo"><img src="${safeUrl(ev.photo)}" alt="${escapeHtml(ev.name)} — ${formatDate(ev.date)}${ev.location ? ", " + escapeHtml(ev.location) : ""}" loading="lazy"></div>
      <div class="info">
        <div class="title">${escapeHtml(ev.name)}</div>
        <div class="date">${formatDate(ev.date)}${ev.location ? " &middot; " + escapeHtml(ev.location) : ""}</div>
      </div>
    </div>
  `).join("");
  // Phones get the sideways timeline; wider screens keep the grid with the connecting line.
  try { buildPastTimeline(past); } catch (err) { console.error("Timeline failed, showing the grid instead:", err); }
  try { buildSnake(); } catch (err) { console.error("Connecting line failed, showing the plain grid:", err); }
  if (!PAST_MQ_WIRED && window.matchMedia) {
    PAST_MQ_WIRED = true;
    window.matchMedia(PAST_PHONE_MQ).addEventListener("change", () => { if (_dataLoaded) renderPastGallery(_cachedPast); });
  }
}

const PAST_PHONE_MQ = "(max-width: 820px)";
let PAST_MQ_WIRED = false;

// ---------- Desktop "connecting line" through the past-events grid ----------
// The grid stays (lots of posters at once is the point). As you scroll, a glowing line snakes
// through it: left to right along the first row, down the side, right to left along the next,
// and so on. Posters start dimmed and sunken; when the line reaches one it lifts, colour sweeps
// across it from the side the line came in, and a glint follows. It stays lit for good.
// A counter in the corner ticks up with each poster, and when the line reaches the last
// (oldest) one, a glow ripples back through the grid and confetti goes off.
// Rows alternate direction so the line meets the events in order (newest first).
const SNAKE = { g: null, listening: false, finaleDone: false };
const SVG_NS = "http://www.w3.org/2000/svg";

function teardownSnake() {
  const g = SNAKE.g;
  if (!g) return;
  if (SNAKE.ro) SNAKE.ro.disconnect();
  const svg = g.querySelector(".snake-svg");
  if (svg) svg.remove();
  if (SNAKE.pin) { SNAKE.pin.replaceWith(g); SNAKE.pin = null; }
  g.style.transform = "";
  g.classList.remove("snake");
  g.querySelectorAll(".past-card").forEach(c => {
    c.style.gridColumn = ""; c.style.gridRow = ""; c.style.removeProperty("--fill");
    c.classList.remove("lit", "ripple", "done");
    c.removeAttribute("tabindex"); c.removeAttribute("role"); c.removeAttribute("aria-label");
    const color = c.querySelector(".snake-color"); if (color) color.remove();
  });
  if (SNAKE.dock) { SNAKE.dock.remove(); SNAKE.dock = null; SNAKE.counter = null; }
  g.classList.remove("snake-moving");
  g.querySelectorAll(".past-card").forEach(c => { c.style.scale = ""; c.style.opacity = ""; c.style.translate = ""; c.style.removeProperty("--dim"); c._tr = c._sc = c._op = undefined; });
  SNAKE.g = null;
}

function buildSnake() {
  teardownSnake();
  const g = document.getElementById("js-past-gallery");
  if (!g) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = window.matchMedia && window.matchMedia(PAST_PHONE_MQ).matches;
  const cards = Array.from(g.querySelectorAll(".past-card"));
  if (reduce || phone || cards.length < 4) return;

  g.classList.add("snake");
  // The line does the revealing here, so the usual fade-in-on-scroll is switched off for these cards.
  cards.forEach(c => {
    c.classList.add("is-visible"); c.style.transitionDelay = "";
    const img = c.querySelector(".photo img");
    if (img && !c.querySelector(".snake-color")) {
      const color = img.cloneNode();
      color.className = "snake-color";
      color.alt = "";
      color.setAttribute("aria-hidden", "true");
      img.after(color);
    }
  });

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "snake-svg");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path class="snake-guide"/>
    <path class="snake-line"/>
    <g class="snake-ink"><g class="snake-ink-dry"></g><path class="snake-ink-tail"/><g class="snake-ink-wet"></g></g>
    <g class="snake-drops"></g>
    <ellipse class="snake-head" rx="6" ry="3.8"/>`;
  g.prepend(svg);
  const q = sel => svg.querySelector(sel);

  const pin = document.createElement("div");
  pin.className = "snake-pin";
  const stage = document.createElement("div");
  stage.className = "snake-stage";
  const view = document.createElement("div");
  view.className = "snake-view";
  g.replaceWith(pin);
  pin.appendChild(stage);
  stage.appendChild(view);
  view.appendChild(g);

  const cardYears = cards.map((c, i) => ((_cachedPast || [])[i] || {}).date ? _cachedPast[i].date.slice(0, 4) : "");
  const years = cardYears.filter(y => /^\d{4}$/.test(y)).sort();

  // Chapter year (rolls over as the line moves into older events).
  const yearEl = document.createElement("div");
  yearEl.className = "snake-year";
  yearEl.setAttribute("aria-hidden", "true");
  yearEl.innerHTML = tlOdometer(cardYears[0] || years[years.length - 1] || "2026");
  stage.appendChild(yearEl);


  // A quiet hint as the section locks in, gone as soon as the line starts moving.
  const hint = document.createElement("div");
  hint.className = "snake-hint";
  hint.setAttribute("aria-hidden", "true");
  hint.innerHTML = `<span class="snake-hint-mouse"><i></i></span>${escapeHtml(t("snake_hint"))}`;
  stage.appendChild(hint);

  // Dock: Show all + Skip.
  const dock = document.createElement("div");
  dock.className = "snake-dock";
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "snake-skip";
  skip.textContent = t("snake_skip") + " \u2193";
  skip.addEventListener("click", snakeSkip);
  const all = document.createElement("button");
  all.type = "button";
  all.className = "snake-skip snake-all";
  all.textContent = t("snake_show_all");
  all.addEventListener("click", snakeShowAll);
  dock.append(all, skip);
  document.body.appendChild(dock);

  // Seen the whole thing already this visit? Then the line stays drawn and the grid just scrolls.
  try { if (sessionStorage.getItem(SNAKE_FREE_KEY) === "1") { SNAKE.free = true; SNAKE.finaleDone = true; } } catch (err) {}
  if (SNAKE.free) cards.forEach(c => { c.dataset.fill = "1"; c.style.setProperty("--fill", "1"); c.classList.add("lit"); });
  // Ragged "soak" masks for the colour coming into each poster (one per direction), made once.
  if (!SNAKE.soak) SNAKE.soak = { l: inkSoakMask(false), r: inkSoakMask(true) };
  g.style.setProperty("--soak-l", SNAKE.soak.l);
  g.style.setProperty("--soak-r", SNAKE.soak.r);

  Object.assign(SNAKE, {
    g, cards, svg, counter: null, dock, pin, stage, yearEl, hint, cardYears, year: null, z: 0, hintDone: !!SNAKE.free,
    since: years[0] || "", litCount: -1,
    guide: q(".snake-guide"), line: q(".snake-line"), head: q(".snake-head"),
    inkDry: q(".snake-ink-dry"), inkTail: q(".snake-ink-tail"), inkWet: q(".snake-ink-wet"), drops: q(".snake-drops"), inkL: -1,
    cur: null, max: 0, total: 0, thr: [], keys: [], raf: null, last: 0
  });
  snakeCounter(SNAKE.finaleDone ? cards.length : 0);
  snakeLayout();
  // ResizeObserver also fires once straight away; skip that (and any no-op) so the
  // layout isn't rebuilt twice while the page is still fading in.
  let roW = g.clientWidth, roH = g.offsetHeight;
  SNAKE.ro = new ResizeObserver(() => {
    if (!SNAKE.g) return;
    const w = g.clientWidth, h = g.offsetHeight;
    if (w === roW && h === roH) return;
    roW = w; roH = h;
    snakeLayout(); snakeKick();
  });
  SNAKE.ro.observe(g);
  if (!SNAKE.listening) {
    SNAKE.listening = true;
    window.addEventListener("scroll", snakeKick, { passive: true });
    window.addEventListener("resize", () => { if (SNAKE.g) { snakeLayout(); snakeKick(); } });
  }
  snakeKick();
}

function snakeLayout() {
  const { g, cards } = SNAKE;
  cards.forEach(c => { c.style.gridColumn = ""; c.style.gridRow = ""; });
  const top0 = cards[0].offsetTop;
  let cols = cards.filter(c => c.offsetTop === top0).length;
  if (cols < 2) cols = 2;
  // Snake the placement: even rows left→right, odd rows right→left.
  cards.forEach((c, i) => {
    const r = Math.floor(i / cols), k = i % cols;
    c.style.gridRow = String(r + 1);
    c.style.gridColumn = String((r % 2 ? cols - 1 - k : k) + 1);
    c.dataset.from = r % 2 ? "r" : "l";            // which side the line (and the colour) comes in from
  });

  const rows = [];
  cards.forEach((c, i) => { const r = Math.floor(i / cols); (rows[r] = rows[r] || []).push(c); });
  const ys = rows.map(row => { const c = row[0], ph = c.querySelector(".photo"); return c.offsetTop + (ph ? ph.offsetHeight : c.offsetHeight) / 2; });
  const W = g.clientWidth, G = 26, R = 22;
  const xL = -G, xR = W + G;
  const cx = c => c.offsetLeft + c.offsetWidth / 2;
  const pitch = ys.length > 1 ? ys[1] - ys[0] : 400;

  let d = `M ${xL} ${ys[0]}`, L = 0;
  const thr = new Map(), keys = [];
  // The same path as plain geometry, so the ink can be sampled with arithmetic instead of
  // thousands of getPointAtLength() calls (each one re-walks the path: that froze the page ~1s).
  const segs = [];
  const seg = (o) => { segs.push(o); };
  rows.forEach((row, r) => {
    const y = ys[r], ltr = r % 2 === 0, last = r === rows.length - 1;
    const hs = r === 0 ? xL : (ltr ? xL + R : xR - R);
    const lc = row[row.length - 1];             // last row: run to the far edge of the final poster
    const he = last ? cx(lc) + (ltr ? 1 : -1) * lc.offsetWidth / 2 : (ltr ? xR - R : xL + R);
    row.forEach(c => thr.set(c, L + Math.abs(cx(c) - hs)));
    // Camera keyframes: hold this row while the line crosses it, then glide to the next row
    // through the turn (starting a little before the corner, settling just after it).
    const len = Math.abs(he - hs);
    keys.push({ y, L: L + (r === 0 ? 0 : Math.min(70, len * 0.1)) });
    d += ` H ${he}`;
    seg({ k: "l", x0: hs, y0: y, x1: he, y1: y, len });
    L += len;
    keys.push({ y, L: L - (last ? 0 : Math.min(140, len * 0.15)) });
    if (!last) {
      const yn = ys[r + 1], sweep = ltr ? 1 : 0, xs = ltr ? xR : xL;
      d += ` A ${R} ${R} 0 0 ${sweep} ${xs} ${y + R} V ${yn - R} A ${R} ${R} 0 0 ${sweep} ${ltr ? xR - R : xL + R} ${yn}`;
      const cxA = ltr ? xR - R : xL + R, vlen = Math.max(0, yn - y - 2 * R);
      seg({ k: "a", cx: cxA, cy: y + R, a0: -Math.PI / 2, a1: ltr ? 0 : -Math.PI, r: R, len: Math.PI * R / 2 });
      seg({ k: "l", x0: xs, y0: y + R, x1: xs, y1: yn - R, len: vlen });
      seg({ k: "a", cx: cxA, cy: yn - R, a0: ltr ? 0 : Math.PI, a1: Math.PI / 2, r: R, len: Math.PI * R / 2 });
      L += Math.PI * R + Math.max(0, yn - y - 2 * R);
    }
  });
  [SNAKE.guide, SNAKE.line].forEach(el => el.setAttribute("d", d));
  SNAKE.total = SNAKE.line.getTotalLength();
  const k = L ? SNAKE.total / L : 1;               // keep our bookkeeping in step with the browser's
  SNAKE.thr = cards.map(c => thr.get(c) * k);
  SNAKE.half = cards.map(c => (c.offsetWidth / 2) * k);
  SNAKE.keys = keys.map(p => ({ y: p.y, L: p.L * k }));
  SNAKE.segs = segs;
  SNAKE.segK = k;
  inkLayout();

  // Pin: tall enough that scrolling through it draws the whole line.
  const nav = document.querySelector("header.nav");
  SNAKE.top = nav ? nav.offsetHeight : 0;
  SNAKE.pin.style.setProperty("--snake-top", SNAKE.top + "px");
  SNAKE.stageH = window.innerHeight - SNAKE.top;
  SNAKE.padTop = 28;
  SNAKE.maxShift = Math.max(0, g.offsetHeight + SNAKE.padTop * 2 + 20 - SNAKE.stageH);
  SNAKE.rowY = ys;
  SNAKE.pitch = pitch;
  SNAKE.rowOf = cards.map((c, i) => Math.floor(i / cols));
  // Scroll budget: drawing the line, then the zoom-out finale.
  SNAKE.drawS = SNAKE.total / SNAKE_RATIO;
  SNAKE.zoomS = SNAKE.stageH * 1.6;
  // Finale: every poster flies into one wide wall that fits the screen under the title.
  // Pick the column count that makes the posters as big as possible.
  const n = cards.length, cw0 = cards[0].offsetWidth, ch0 = cards[0].offsetHeight;
  const stageW = SNAKE.stage.clientWidth, topRoom = 44, bottomRoom = 44, mg = 14;
  const availW = stageW - 2 * Math.max(24, (stageW - g.offsetWidth) / 2), availH = SNAKE.stageH - topRoom - bottomRoom;
  let best = { cw: 0, cols: n };
  for (let c = 3; c <= n; c++) {
    const rws = Math.ceil(n / c);
    const cw = Math.min((availW - (c - 1) * mg) / c, ((availH - (rws - 1) * mg) / rws) * (cw0 / ch0));
    if (cw > best.cw) best = { cw, cols: c };
  }
  const mc = best.cols, cwF = best.cw, chF = cwF * (ch0 / cw0), mr = Math.ceil(n / mc);
  const wallW = mc * cwF + (mc - 1) * mg, wallH = mr * chF + (mr - 1) * mg;
  const x0 = (stageW - wallW) / 2, y0 = topRoom + (availH - wallH) / 2;
  const viewPadX = (stageW - g.offsetWidth) / 2;
  SNAKE.wall = cards.map((c, i) => ({
    ox: viewPadX + c.offsetLeft, oy: SNAKE.padTop + c.offsetTop, w: c.offsetWidth, h: c.offsetHeight,
    tx: x0 + (i % mc) * (cwF + mg) + (Math.floor(i / mc) === mr - 1 ? ((mc * mr - n) * (cwF + mg)) / 2 : 0),
    ty: y0 + Math.floor(i / mc) * (chF + mg), s: cwF / c.offsetWidth
  }));
  SNAKE.pin.style.height = (SNAKE.stageH + snakeLead() + SNAKE.zoomS) + "px";
  SNAKE.cur = null;
  SNAKE.cam = null;
  SNAKE.fade = null;
  SNAKE.moving = false;
}

// 1px of scrolling draws SNAKE_RATIO px of line. Lower = slower.
const SNAKE_RATIO = 1.5;
// Easing: one soft lag between your scroll and everything on screen (smooths out mouse-wheel
// steps). The camera is worked out from the line, not eased separately, so the two move together.
const SNAKE_EASE = 6;

// Camera position for a given length of line: holds each row while the line crosses it, and
// glides (eased in and out) to the next row through the turn (keyframes from snakeLayout).
function snakeCamFor(L) {
  const k = SNAKE.keys;
  let y;
  if (!k.length) y = 0;
  else if (L <= k[0].L) y = k[0].y;
  else if (L >= k[k.length - 1].L) y = k[k.length - 1].y;
  else {
    let i = 1;
    while (i < k.length - 1 && k[i].L < L) i++;
    const a = k[i - 1], b = k[i];
    const f = b.L > a.L ? (L - a.L) / (b.L - a.L) : 1;
    const ef = f * f * f * (f * (f * 6 - 15) + 10);      // smootherstep: eases in and out of each glide
    y = a.y + (b.y - a.y) * ef;
  }
  return Math.max(0, Math.min(SNAKE.maxShift, y + SNAKE.padTop - SNAKE.stageH * 0.5));
}


function snakeCounter(n) {
  const c = SNAKE.counter;
  if (!c || n === SNAKE.litCount) return;
  const done = n >= SNAKE.cards.length && SNAKE.finaleDone;
  const tpl = t(done ? "snake_count_done" : "snake_count");
  const num = `<b>${n}</b>`;
  c.innerHTML = escapeHtml(tpl).replace("{n}", num).replace("{y}", escapeHtml(SNAKE.since));
  SNAKE.litCount = n;
}

function snakeFinale() {
  if (SNAKE.finaleDone) return;
  SNAKE.finaleDone = true;
  const n = SNAKE.cards.length;
  // ripple back from the last poster to the first
  SNAKE.cards.slice().reverse().forEach((c, i) => {
    c.style.animationDelay = (i * 70) + "ms";
    c.classList.add("ripple");
    setTimeout(() => { c.classList.remove("ripple"); c.style.animationDelay = ""; }, 1900 + i * 70);
  });
  SNAKE.litCount = -1;
  snakeCounter(n);
}

// ---------- Wet ink: the line is a brush stroke ----------
// Thick on the straights, thin round the bends (like a broad brush held at an angle), with a little
// unevenness along its length. Behind the tip it glistens amber while "wet" and dries to red.
// The stroke is cut into fixed chunks that are built once; only the last stretch near the tip is
// rebuilt each frame, so long lines stay cheap to draw.
const INK_STEP = 3, INK_CHUNK = 80, INK_WET = 180;

function inkWidth(p) {
  // broad-nib feel: horizontals thick, verticals thin, plus a slow, uneven wobble
  const w = 2.4 + 4.6 * Math.abs(Math.cos(p.a - 0.35));
  return w * (1 + 0.14 * Math.sin(p.s * 0.031) * Math.sin(p.s * 0.0077 + 1.3)) * (0.25 + 0.75 * Math.min(1, p.s / 46));
}
// Point at distance s along the snake path, from the geometry recorded in snakeLayout.
// Calls must come in increasing s (it walks forward through the segments).
function inkSampler() {
  const segs = SNAKE.segs || [], k = SNAKE.segK || 1;
  let i = 0, base = 0;
  return s => {
    s /= k;
    while (i < segs.length - 1 && s > base + segs[i].len) { base += segs[i].len; i++; }
    const g = segs[i];
    if (!g) return { x: 0, y: 0 };
    const f = g.len ? Math.max(0, Math.min(1, (s - base) / g.len)) : 1;
    if (g.k === "l") return { x: g.x0 + (g.x1 - g.x0) * f, y: g.y0 + (g.y1 - g.y0) * f };
    const a = g.a0 + (g.a1 - g.a0) * f;
    return { x: g.cx + g.r * Math.cos(a), y: g.cy + g.r * Math.sin(a) };
  };
}
function inkLayout() {
  const total = SNAKE.total, pts = [], at = inkSampler();
  for (let s = 0; s <= total; s += INK_STEP) { const q = at(s); pts.push({ s, x: q.x, y: q.y, a: 0 }); }
  const q = at(total); pts.push({ s: total, x: q.x, y: q.y, a: 0 });
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    pts[i].a = Math.atan2(b.y - a.y, b.x - a.x);
  }
  pts.forEach(p => { p.w = inkWidth(p) / 2; p.nx = -Math.sin(p.a); p.ny = Math.cos(p.a); });
  SNAKE.ink = pts;
  SNAKE.inkDry.innerHTML = "";
  SNAKE.inkChunks = [];
  for (let k = 0; k * INK_CHUNK < pts.length - 1; k++) {
    const a = k * INK_CHUNK, b = Math.min(pts.length - 1, (k + 1) * INK_CHUNK + 1);
    const el = document.createElementNS(SVG_NS, "path");
    el.setAttribute("d", inkRibbon(a, b, null));
    el.style.display = "none";
    SNAKE.inkDry.appendChild(el);
    SNAKE.inkChunks.push(el);
  }
  SNAKE.inkShown = 0;
  SNAKE.inkL = -1;
  SNAKE.drops.innerHTML = "";
}
// Polygon outline of the stroke between sample a and b; if L is given, the end tapers to a point.
function inkRibbon(a, b, L) {
  const pts = SNAKE.ink;
  if (b - a < 1) return "";
  let left = "", right = "";
  for (let i = a; i <= b; i++) {
    const p = pts[i];
    let w = p.w;
    if (L !== null) w *= 0.3 + 0.7 * Math.min(1, Math.max(0, (L - p.s) / 26));
    const lx = (p.x + p.nx * w).toFixed(1), ly = (p.y + p.ny * w).toFixed(1);
    const rx = (p.x - p.nx * w).toFixed(1), ry = (p.y - p.ny * w).toFixed(1);
    left += (i === a ? "M" : "L") + lx + "," + ly;
    right = "L" + rx + "," + ry + right;
  }
  return left + right + "Z";
}
function inkPoint(L) {
  const pts = SNAKE.ink, i = Math.max(0, Math.min(pts.length - 1, Math.round(L / INK_STEP)));
  return pts[i];
}
function inkDraw(L) {
  if (!SNAKE.ink || Math.abs(L - SNAKE.inkL) < 0.05) return;
  SNAKE.inkL = L;
  const pts = SNAKE.ink, n = Math.min(pts.length - 1, Math.floor(L / INK_STEP));
  // whole chunks safely behind the tip are shown as they are; the rest is rebuilt
  const dynFrom = Math.floor(Math.max(0, Math.floor((L - 60) / INK_STEP)) / INK_CHUNK) * INK_CHUNK;
  const shown = dynFrom / INK_CHUNK;
  if (shown !== SNAKE.inkShown) {
    SNAKE.inkChunks.forEach((c, k) => { c.style.display = k < shown ? "" : "none"; });
    SNAKE.inkShown = shown;
  }
  SNAKE.inkTail.setAttribute("d", L > 1 ? inkRibbon(dynFrom, n, L) : "");
  // wet sheen: stacked, shorter and shorter amber overlays, so it fades from the tip backwards
  const wet = SNAKE.inkWet;
  if (!wet.children.length) for (let j = 0; j < 5; j++) wet.appendChild(document.createElementNS(SVG_NS, "path"));
  const drawing = L > 1 && L < SNAKE.total - 0.5;
  Array.from(wet.children).forEach((p, j) => {
    const from = Math.max(0, Math.floor((L - INK_WET * (1 - j / 5)) / INK_STEP));
    p.setAttribute("d", drawing ? inkRibbon(from, n, L) : "");
  });
}
// A few drops of ink land where the brush first reaches a poster.
function inkDrops(c, i) {
  const ys = SNAKE.rowY[SNAKE.rowOf[i]], fromL = c.dataset.from !== "r";
  const x0 = c.offsetLeft + (fromL ? -10 : c.offsetWidth + 10);
  let html = "";
  for (let k = 0; k < 6; k++) {
    const r = 1.2 + Math.random() * 3, dx = (Math.random() - 0.5) * 30, dy = (Math.random() - 0.5) * 90;
    html += `<circle class="snake-drop" cx="${(x0 + dx).toFixed(1)}" cy="${(ys + dy).toFixed(1)}" r="${r.toFixed(1)}" style="animation-delay:${k * 45}ms"/>`;
  }
  SNAKE.drops.insertAdjacentHTML("beforeend", html);
}
// The colour soaks into a poster with a ragged, paper-like edge: a wide mask image whose edge is
// slid across the poster by --fill (see .snake-color in events.html).
function inkSoakMask(flip) {
  let d = "M0,0 L150,0", y = 0, seed = flip ? 7 : 3;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  while (y < 100) { y = Math.min(100, y + 3 + rnd() * 4); d += ` L${(150 + (rnd() - 0.5) * 16 + Math.sin(y * 0.11) * 5).toFixed(1)},${y.toFixed(1)}`; }
  d += " L0,100 Z";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 100' preserveAspectRatio='none'><filter id='b' x='-5%' y='-5%' width='110%' height='110%'><feGaussianBlur stdDeviation='1.6'/></filter><path filter='url(#b)' fill='#fff' d='${d}'${flip ? " transform='translate(300 0) scale(-1 1)'" : ""}/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Once the finale has played (this visit only), the line stays drawn and the pinned stretch before
// the zoom is just the grid scrolling past, 1:1, instead of the long line-drawing budget.
const SNAKE_FREE_KEY = "mcc_snake_seen";
function snakeLead() { return SNAKE.free ? SNAKE.maxShift : SNAKE.drawS; }

// Where the scroll is inside the pinned section, in px (0 … drawing/grid … zoom-out finale).
function snakeTarget() {
  const r = SNAKE.pin.getBoundingClientRect();
  SNAKE.pinTop = r.top;
  return Math.max(0, Math.min(snakeLead() + SNAKE.zoomS, SNAKE.top - r.top));
}

// As soon as the line has been drawn all the way once, switch to free mode: the long line-drawing
// stretch is swapped for the grid's own height (1:1 scrolling), and the scroll position is moved by
// the same amount so nothing on screen jumps. From then on, scrolling back up is just scrolling.
function snakeGoFree() {
  const target = snakeTarget(), cur = SNAKE.cur == null ? target : SNAKE.cur;
  // where the eased position lands in the new mapping: the same camera, or the same point in the zoom
  const cur2 = cur > SNAKE.drawS ? SNAKE.maxShift + (cur - SNAKE.drawS) : Math.min(SNAKE.cam || 0, SNAKE.maxShift);
  const delta = cur2 + (target - cur) - target;
  const y0 = window.scrollY;
  SNAKE.free = true;
  SNAKE.hintDone = true;
  try { sessionStorage.setItem(SNAKE_FREE_KEY, "1"); } catch (err) {}
  const de = document.documentElement, oa = de.style.overflowAnchor;
  de.style.overflowAnchor = "none";
  SNAKE.pin.style.height = (SNAKE.stageH + snakeLead() + SNAKE.zoomS) + "px";
  window.scrollTo({ top: y0 + delta, behavior: "instant" });
  de.style.overflowAnchor = oa;
  SNAKE.cur = cur2;
  // Skip / Show all were mid-way: carry on to the same place in the new layout
  const nav = SNAKE.nav; SNAKE.nav = null;
  if (nav === "skip") snakeSkip(); else if (nav === "all") snakeShowAll();
}

function snakeShowAll() {
  if (!SNAKE.pin) return;
  SNAKE.nav = SNAKE.free ? null : "all";
  const pinTop = SNAKE.pin.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: pinTop - SNAKE.top + snakeLead() + SNAKE.zoomS * 0.85, behavior: "smooth" });
}

function snakeSkip() {
  if (!SNAKE.pin) return;
  SNAKE.nav = SNAKE.free ? null : "skip";
  const pinTop = SNAKE.pin.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: pinTop - SNAKE.top + SNAKE.pin.offsetHeight - SNAKE.stageH + 2, behavior: "smooth" });
}

const easeInOut = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function snakeKick() {
  if (SNAKE.g && SNAKE.dock) {
    const r = SNAKE.pin.getBoundingClientRect();
    SNAKE.dock.classList.toggle("show", r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.5 && SNAKE.z < 0.35);
  }
  if (!SNAKE.g || SNAKE.raf) return;
  SNAKE.raf = requestAnimationFrame(snakeFrame);
}

function snakeFrame(now) {
  SNAKE.raf = null;
  if (!SNAKE.g) return;
  const dt = SNAKE.last ? Math.min(0.05, (now - SNAKE.last) / 1000) : 1 / 60;   // first frame after a rest eases too (was an instant jump)
  SNAKE.last = now;
  const target = snakeTarget();
  const free = !!SNAKE.free;
  if (SNAKE.cur === null) SNAKE.cur = target;
  // free mode: the grid follows the page 1:1 with only a whisper of easing
  SNAKE.cur += (target - SNAKE.cur) * (1 - Math.exp(-(free ? 16 : SNAKE_EASE) * dt));
  if (Math.abs(target - SNAKE.cur) < 0.1) SNAKE.cur = target;
  const moving = SNAKE.cur !== target;
  if (moving !== SNAKE.moving) { SNAKE.moving = moving; SNAKE.g.classList.toggle("snake-moving", moving); }
  const sc = SNAKE.cur;
  const L = free ? SNAKE.total : Math.min(SNAKE.total, sc * SNAKE_RATIO);
  const z = Math.max(0, Math.min(1, (sc - snakeLead()) / (SNAKE.zoomS * 0.75)));
  const e = easeInOut(z);
  if ((z >= 0.35) !== (SNAKE.z >= 0.35)) { SNAKE.z = z; snakeKick(); }
  SNAKE.z = z;

  inkDraw(L);
  const pt = inkPoint(L);
  SNAKE.head.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${(pt.a * 57.2958).toFixed(1)})`);
  SNAKE.head.style.opacity = L > 4 && L < SNAKE.total - 0.5 ? "" : "0";

  // Camera: follows the pen (the grid only moves while the line heads down a row), then in the
  // finale pulls back until the whole grid fits on screen.
  SNAKE.cam = free ? Math.min(sc, SNAKE.maxShift) : snakeCamFor(L);
  SNAKE.g.style.transform = `translate3d(0, ${(-SNAKE.cam).toFixed(2)}px, 0)`;
  SNAKE.yearEl.style.opacity = String(1 - e);
  SNAKE.svg.style.opacity = String(1 - Math.min(1, z * 2.5));
  // Top fade only appears once the grid has moved up under the nav, so the first row starts crisp.
  const fk = Math.min(1, SNAKE.cam / 120) * (1 - e);
  const fade = (70 * fk).toFixed(1);
  if (fade !== SNAKE.fade) {
    SNAKE.fade = fade;
    const v = SNAKE.stage.querySelector(".snake-view");
    v.style.setProperty("--snake-fade", fade + "px");
    v.style.setProperty("--snake-ramp", (80 * fk).toFixed(1) + "px");
  }
  const wall = e >= 0.999 && !moving;
  if (wall !== SNAKE.wallOn) {
    SNAKE.wallOn = wall;
    SNAKE.pin.classList.toggle("snake-wall", wall);
  }
  if (!SNAKE.hintDone && sc > 30) SNAKE.hintDone = true;
  const hintOn = !SNAKE.hintDone && SNAKE.pinTop < window.innerHeight * 0.35;
  if (hintOn !== SNAKE.hintOn) { SNAKE.hintOn = hintOn; SNAKE.hint.classList.toggle("show", hintOn); }

  const focusY = SNAKE.cam - SNAKE.padTop + SNAKE.stageH * 0.5;
  let lit = 0, current = 0;
  SNAKE.cards.forEach((c, i) => {
    // How far the line has got across this card: 0 at the edge it enters, 1 at the far edge.
    // Colour only ever grows, so posters stay lit if you scroll back up.
    const h = SNAKE.half[i];
    if (free ? SNAKE.rowY[SNAKE.rowOf[i]] <= focusY + SNAKE.pitch * 0.5 : L >= SNAKE.thr[i] - h) current = i;
    const f = Math.max(0, Math.min(1, (L - (SNAKE.thr[i] - h)) / (2 * h)));
    const prev = Number(c.dataset.fill || 0);
    if (f > prev) { c.dataset.fill = f.toFixed(4); c.style.setProperty("--fill", f.toFixed(4)); }
    if (f > 0.01 && !c.classList.contains("lit")) { c.classList.add("lit"); if (!free) inkDrops(c, i); }
    if (Math.max(f, prev) >= 0.999) lit++;
    // Focus: the row the pen is on stays crisp; rows above and below recede a little.
    const rd = free ? 0 : Math.min(1.5, Math.abs(SNAKE.rowY[SNAKE.rowOf[i]] - focusY) / SNAKE.pitch);
    // Finale: fly into the wall, slightly staggered so they cascade in.
    const w = SNAKE.wall[i];
    const ei = easeInOut(Math.max(0, Math.min(1, (z - (i / SNAKE.cards.length) * 0.3) / 0.7)));
    // The poster the line is passing grows a touch, easing up as the line arrives and back as it leaves.
    const near = free ? 0 : Math.max(0, 1 - Math.abs(L - SNAKE.thr[i]) / (h * 1.6));
    const on = near * near * (3 - 2 * near);
    const sF = 1 - rd * 0.035 + on * 0.05, sc2 = sF + (w.s - sF) * ei;
    const dx = (w.tx - w.ox - (w.w - w.w * w.s) / 2) * ei;
    const dy = (w.ty - (w.oy - SNAKE.cam) - (w.h - w.h * w.s) / 2) * ei;
    const tr = ei > 0 ? `${dx.toFixed(1)}px ${dy.toFixed(1)}px` : "", scl = sc2.toFixed(3), op = (1 - rd * 0.3 * (1 - ei)).toFixed(2);
    if (c._tr !== tr) { c._tr = tr; c.style.translate = tr; }
    if (c._sc !== scl) { c._sc = scl; c.style.scale = scl; }
    if (c._op !== op) { c._op = op; c.style.setProperty("--dim", op); }   // dims the contents only, so the card stays solid over the ink
  });
  const year = SNAKE.cardYears[current];
  if (year && year !== SNAKE.year) {
    SNAKE.year = year;
    const digits = year.split("");
    SNAKE.yearEl.querySelectorAll(".odo-s").forEach((strip, i) => { strip.style.transform = `translateY(-${Number(digits[i] || 0) * 10}%)`; });
  }
  snakeCounter(lit);
  if (lit === SNAKE.cards.length && !SNAKE.finaleDone) snakeFinale();
  if (!free && SNAKE.finaleDone && L >= SNAKE.total - 0.5) { snakeGoFree(); snakeKick(); return; }
  if (SNAKE.cur !== target) snakeKick(); else SNAKE.last = 0;
}

// ---------- "Since 2022" timeline (events page) ----------
// Past events as a pinned, sideways-scrolling story, oldest first. Scrolling down slides the
// posters sideways; the one in the middle comes into focus, the big year rolls over like an
// odometer, and the rail underneath has a marker per year you can click to jump.
// The plain grid stays as the fallback (reduced motion, very few events, or any error here).
const TL = { el: null, listening: false };
const TL_SETTLE_MS = 160;   // pause in scrolling before it settles on the nearest poster

function tlOdometer(year) {
  const strip = '<span class="odo-s">' + "0123456789".split("").map(d => `<span>${d}</span>`).join("") + "</span>";
  return '<span class="odo">' + String(year).split("").map(() => `<span class="odo-d">${strip}</span>`).join("") + "</span>";
}
function tlSetYear(year) {
  if (!TL.el) return;
  const digits = String(year).split("");
  TL.el.querySelectorAll(".odo-s").forEach((s, i) => { s.style.transform = `translateY(-${Number(digits[i] || 0) * 10}%)`; });
}

function buildPastTimeline(past) {
  const section = document.getElementById("past-events");
  if (!section) return;
  const head = section.querySelector(".section-head");
  const wrap = section.querySelector(":scope > .wrap");
  const old = document.getElementById("js-past-timeline");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const events = past.filter(ev => /^\d{4}-\d{2}-\d{2}$/.test(ev.date || ""))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  if (old) { if (head && wrap) wrap.prepend(head); old.remove(); TL.el = null; section.classList.remove("tl-on"); }
  const phone = window.matchMedia && window.matchMedia(PAST_PHONE_MQ).matches;
  if (reduce || !phone || events.length < 3 || !head || !wrap) return;

  const cards = events.map((ev, i) => `
      <article class="tl-card" data-year="${ev.date.slice(0, 4)}">
        <div class="tl-poster"><img class="tl-base" src="${safeUrl(ev.photo)}" alt="${escapeHtml(ev.name)} — ${formatDate(ev.date)}" loading="${i < 4 ? "eager" : "lazy"}" decoding="async"><img class="tl-color" src="${safeUrl(ev.photo)}" alt="" aria-hidden="true" loading="${i < 4 ? "eager" : "lazy"}" decoding="async"></div>
        <div class="tl-info">
          <div class="tl-title">${escapeHtml(ev.name)}</div>
          <div class="tl-date">${formatDate(ev.date)}${ev.location ? " &middot; " + escapeHtml(ev.location) : ""}</div>
        </div>
      </article>`).join("");
  const nowYear = new Date().getFullYear();
  const end = `
      <article class="tl-card tl-end" data-year="${nowYear}">
        <div class="tl-poster">
          <span class="eyebrow">${escapeHtml(t("tl_end_kicker"))}</span>
          <div class="tl-end-title">${escapeHtml(t("tl_end_title"))}</div>
          <a href="#next-event">${escapeHtml(t("tl_end_cta"))}</a>
        </div>
      </article>`;

  const total = events.length + 1;                     // posters + the closing card
  const firstOfYear = {};
  events.forEach((ev, i) => { const y = ev.date.slice(0, 4); if (!(y in firstOfYear)) firstOfYear[y] = i; });
  const ticks = Object.keys(firstOfYear).map(y =>
    `<button type="button" class="tl-tick" data-i="${firstOfYear[y]}" data-year="${y}" style="left:${(firstOfYear[y] / (total - 1)) * 100}%"><span>${y}</span></button>`).join("");

  const el = document.createElement("div");
  el.className = "tl";
  el.id = "js-past-timeline";
  el.innerHTML = `
    <div class="tl-stage">
      <div class="wrap tl-head"><div class="tl-year" aria-hidden="true">${tlOdometer(events[0].date.slice(0, 4))}</div></div>
      <div class="tl-viewport"><div class="tl-track">${cards}${end}</div></div>
      <div class="wrap tl-foot"><div class="tl-rail"><div class="tl-fill"></div>${ticks}</div><div class="tl-count"></div><button type="button" class="snake-skip tl-skip">${escapeHtml(t("snake_skip"))} \u2193</button></div>
    </div>`;
  el.querySelector(".tl-head").prepend(head);
  section.appendChild(el);
  section.classList.add("tl-on");

  TL.el = el;
  TL.section = section;
  TL.track = el.querySelector(".tl-track");
  TL.cards = Array.from(TL.track.children);
  TL.n = events.length;
  TL.cur = null;
  TL.active = -1;
  TL.year = null;
  TL.fill = el.querySelector(".tl-fill");
  TL.count = el.querySelector(".tl-count");
  TL.ticks = Array.from(el.querySelectorAll(".tl-tick"));
  TL.ticks.forEach(b => b.addEventListener("click", () => tlJump(Number(b.dataset.i))));
  // Skip: straight to whatever comes after the posters.
  el.querySelector(".tl-skip").addEventListener("click", () => {
    tlGlideStop();
    window.scrollTo({ top: section.getBoundingClientRect().bottom + window.scrollY - TL.top, behavior: "smooth" });
  });
  tlInkBuild();
  TL.cards[TL.cards.length - 1].querySelector("a").addEventListener("click", e => {
    const target = document.getElementById("next-event");
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  tlMeasure();
  tlSetYear(events[0].date.slice(0, 4));
  if (!TL.listening) {
    TL.listening = true;
    window.addEventListener("scroll", tlOnScroll, { passive: true });
    window.addEventListener("resize", () => { if (TL.el) { tlMeasure(); tlKick(); } });
    window.addEventListener("touchstart", () => { TL.touching = true; tlGlideStop(); }, { passive: true });
    window.addEventListener("wheel", tlGlideStop, { passive: true });
    window.addEventListener("touchend", () => { TL.touching = false; tlOnScroll(); }, { passive: true });
    window.addEventListener("touchcancel", () => { TL.touching = false; tlOnScroll(); }, { passive: true });
  }
  tlSwipeInit();
  tlKick();
}

// ---------- Sideways swipe on the phone timeline ----------
// The posters sit in a row, so people swipe them. A sideways drag moves the row with the finger
// (it scrolls the page by the same amount, so the year, rail and ink all follow). Letting go
// glides to the nearest poster, or on to the next one after a quick flick. Up and down still
// scroll the page as before.
const TL_FLICK = 0.2;        // px per ms: faster than this counts as a flick to the next poster
const TL_COMMIT_PX = 48;     // a slower drag this far also moves on, rather than springing back
const TL_FLING = 1.4;        // px per ms: a hard flick carries one poster further (two at twice this)

// Glide the page to a poster after a swipe. Starts fast and slows to a stop, so it carries on from
// the finger instead of pausing first (which the browser's own smooth scroll does).
function tlGlide(i) {
  tlGlideStop();
  const root = document.documentElement;
  const from = window.scrollY;
  const to = Math.round(TL.el.getBoundingClientRect().top + from - TL.top + i * TL.step);
  const dist = to - from;
  if (Math.abs(dist) < 1) return;
  const dur = Math.min(560, Math.max(240, Math.abs(dist) * 1.2));
  let t0 = null;
  root.style.scrollBehavior = "auto";
  const step = ts => {
    if (t0 === null) t0 = ts;
    const k = Math.min(1, (ts - t0) / dur);
    window.scrollTo(0, from + dist * (1 - Math.pow(1 - k, 3)));
    if (k < 1) TL.glide = requestAnimationFrame(step);
    else { TL.glide = 0; root.style.scrollBehavior = ""; }
  };
  TL.glide = requestAnimationFrame(step);
}
function tlGlideStop() {
  if (!TL.glide) return;
  cancelAnimationFrame(TL.glide);
  TL.glide = 0;
  document.documentElement.style.scrollBehavior = "";
}

// One-time "Swipe" pill: shown the first time the posters come to rest on screen, gone after a
// few seconds or the first swipe, and never again on this device once someone has swiped.
function tlHintCheck() {
  const h = TL.hint;
  if (!h || TL.hintDone) return;
  const r = TL.el.getBoundingClientRect();
  const pinned = r.top <= TL.top + 1 && tlTarget() < TL.dist - 1;
  if (!pinned) { h.classList.remove("show"); return; }
  if (h.classList.contains("show")) return;
  const poster = (TL.cards[Math.max(0, TL.active)] || TL.cards[0]).querySelector(".tl-poster").getBoundingClientRect();
  const stage = h.parentNode.getBoundingClientRect();
  h.style.top = Math.round(poster.bottom - stage.top - 58) + "px";
  h.classList.add("show");
  clearTimeout(TL.hintTimer);
  TL.hintTimer = setTimeout(() => tlHintDone(false), 6000);
}
function tlHintDone(swiped) {
  TL.hintDone = true;
  clearTimeout(TL.hintTimer);
  if (TL.hint) TL.hint.classList.remove("show");
  if (swiped) { try { localStorage.setItem("mcc_swiped", "1"); } catch (e) { /* storage blocked */ } }
}

function tlSwipeInit() {
  const stage = TL.el.querySelector(".tl-stage");
  let knows = false;
  try { knows = localStorage.getItem("mcc_swiped") === "1"; } catch (e) { /* storage blocked */ }
  TL.hintDone = knows;
  TL.hint = document.createElement("div");
  TL.hint.className = "tl-hint";
  TL.hint.setAttribute("aria-hidden", "true");
  TL.hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/></svg>Swipe to see more';
  stage.appendChild(TL.hint);
  const root = document.documentElement;
  let g = null, swallowClick = 0;
  const offset = () => TL.top - TL.el.getBoundingClientRect().top;      // how far the row has travelled
  const clampI = i => Math.max(0, Math.min(TL.cards.length - 1, i));
  const end = () => { TL.dragging = false; root.style.scrollBehavior = ""; g = null; };

  stage.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) { if (g) end(); return; }
    const t = e.touches[0];
    g = { x: t.clientX, y: t.clientY, axis: null, lastX: t.clientX, lastT: e.timeStamp, v: 0 };
  }, { passive: true });

  stage.addEventListener("touchmove", e => {
    if (!g || e.touches.length !== 1) return;
    const t = e.touches[0], dx = t.clientX - g.x, dy = t.clientY - g.y;
    if (!g.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      g.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (g.axis === "x") {
        const o = offset();
        g.pinned = o >= -1 && o <= TL.dist + 1;       // posters are in place and can follow the finger
        g.o0 = Math.max(0, Math.min(TL.dist, o));
        g.y0 = window.scrollY;
        g.x = t.clientX;                              // start from here, so the row doesn't jump by the 8px
        if (g.pinned) { TL.dragging = true; root.style.scrollBehavior = "auto"; }
        tlHintDone(true);
      }
    }
    if (g.axis !== "x") return;
    if (e.cancelable) e.preventDefault();
    const now = e.timeStamp, dt = now - g.lastT;
    if (dt > 0) { g.v = g.v * 0.4 + ((t.clientX - g.lastX) / dt) * 0.6; g.lastX = t.clientX; g.lastT = now; }
    if (!g.pinned) return;
    let o = g.o0 - (t.clientX - g.x);
    if (o < 0) o *= 0.3; else if (o > TL.dist) o = TL.dist + (o - TL.dist) * 0.3;   // soft resistance at either end
    g.over = o < 0 ? o : (o > TL.dist ? o - TL.dist : 0);
    const inside = Math.max(0, Math.min(TL.dist, o));
    TL.pull = -g.over;                                // past the ends the row gives a little, then springs back
    window.scrollTo(0, g.y0 + (inside - g.o0));
    tlKick();
  }, { passive: false });

  const release = e => {
    if (!g) return;
    const was = g;
    end();
    if (was.axis !== "x") return;
    TL.pull = 0;
    swallowClick = e.timeStamp;
    const moved = was.lastX - was.x;
    const flick = Math.abs(was.v) > TL_FLICK && e.timeStamp - was.lastT < 120;
    let i;
    if (was.pinned) {
      const pos = Math.max(0, Math.min(TL.dist, offset())) / TL.step;
      const i0 = Math.round(was.o0 / TL.step), d = pos - i0;
      if (flick) {
        const more = Math.min(2, Math.floor(Math.abs(was.v) / TL_FLING));
        i = was.v < 0 ? Math.floor(pos + 0.02) + 1 + more : Math.ceil(pos - 0.02) - 1 - more;
      }
      else { i = Math.round(pos); if (i === i0 && Math.abs(d) * TL.step > TL_COMMIT_PX) i = i0 + (d > 0 ? 1 : -1); }
    } else {
      if (Math.abs(moved) < 30) return;
      i = (TL.active < 0 ? 0 : TL.active) + (moved < 0 ? 1 : -1);
    }
    tlGlide(clampI(i));
  };
  stage.addEventListener("touchend", release, { passive: true });
  stage.addEventListener("touchcancel", release, { passive: true });
  // A swipe that ends on a poster or link isn't a tap.
  stage.addEventListener("click", e => {
    if (swallowClick && e.timeStamp - swallowClick < 400) { e.preventDefault(); e.stopPropagation(); return; }
    // Tapping a poster at the side brings it to the middle.
    const card = e.target.closest(".tl-card"), i = card ? TL.cards.indexOf(card) : -1;
    if (i >= 0 && i !== TL.active) { e.preventDefault(); e.stopPropagation(); tlGlide(i); }
  }, true);
}

function tlMeasure() {
  const nav = document.querySelector("header.nav");
  const top = nav ? nav.offsetHeight : 0;
  TL.section.style.setProperty("--tl-top", top + "px");
  TL.top = top;
  const vw = TL.el.clientWidth;
  const w = TL.cards[0].offsetWidth;
  const gap = Math.round(Math.max(TL.ink ? 40 : 18, Math.min(44, vw * 0.035)));   // wider when the ink runs between posters
  TL.track.style.setProperty("--tl-gap", gap + "px");
  const pad = Math.max(0, (vw - w) / 2);
  TL.track.style.paddingLeft = pad + "px";
  TL.track.style.paddingRight = pad + "px";
  TL.step = w + gap;
  TL.dist = TL.step * (TL.cards.length - 1);          // sideways travel = downward scroll, 1:1
  const stageH = window.innerHeight - top;
  TL.el.style.height = (stageH + TL.dist) + "px";
  TL.w = w; TL.pad = pad; TL.gap = gap;
  tlInkLayout();

  // On narrow screens, years that sit too close together keep their dot but drop the label
  // (always keeping the most recent year's label).
  const railW = TL.el.querySelector(".tl-rail").clientWidth;
  let lastX = Infinity;
  for (let i = TL.ticks.length - 1; i >= 0; i--) {
    const x = (Number(TL.ticks[i].dataset.i) / (TL.cards.length - 1)) * railW;
    const tight = lastX - x < 40;
    TL.ticks[i].querySelector("span").style.visibility = tight ? "hidden" : "";
    if (!tight) lastX = x;
  }
}

// ---------- Wet ink on the phone timeline ----------
// The same brush stroke as the desktop grid, running just under the posters. Its tip sits at the
// right edge of the poster in the middle of the screen, so as you scroll, the ink reaches the next
// poster and its colour soaks in from the left (same ragged mask as desktop). Colour stays once in.
function tlInkBuild() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "tl-ink");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <defs>
      <clipPath id="tl-ink-clip"><rect x="0" y="-20" width="0" height="80"/></clipPath>
      <linearGradient id="tl-ink-wet" gradientUnits="userSpaceOnUse" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#D9742A" stop-opacity="0"/><stop offset="1" stop-color="#D9742A" stop-opacity=".95"/>
      </linearGradient>
    </defs>
    <g clip-path="url(#tl-ink-clip)"><path class="tl-ink-dry"/><path class="tl-ink-wet" fill="url(#tl-ink-wet)"/></g>
    <g class="tl-ink-drops"></g>
    <ellipse class="tl-ink-head" rx="6.5" ry="4"/>`;
  TL.track.prepend(svg);
  TL.ink = { svg, clip: svg.querySelector("rect"), dry: svg.querySelector(".tl-ink-dry"), wet: svg.querySelector(".tl-ink-wet"),
             grad: svg.querySelector("linearGradient"), drops: svg.querySelector(".tl-ink-drops"), head: svg.querySelector(".tl-ink-head"), fills: [], started: false };
  if (!SNAKE.soak) SNAKE.soak = { l: inkSoakMask(false), r: inkSoakMask(true) };
  TL.track.style.setProperty("--soak-l", SNAKE.soak.l);
  TL.el.classList.add("tl-inked");
}
function tlInkLayout() {
  const ink = TL.ink;
  if (!ink) return;
  const poster = TL.cards[0].querySelector(".tl-poster");
  const H = 26, y0 = H / 2, top = poster.offsetTop + poster.offsetHeight / 2 - y0;   // through the middle, behind the posters
  const x0 = TL.pad - 14, x1 = TL.pad + (TL.n - 1) * TL.step + TL.w + 8;
  ink.svg.style.top = top + "px";
  ink.svg.setAttribute("width", Math.ceil(TL.track.scrollWidth));
  ink.svg.setAttribute("height", H);
  ink.x0 = x0; ink.x1 = x1; ink.y0 = y0;
  // one long, slightly wavering brush stroke; drawn once, revealed up to the tip with a clip
  let top1 = "", bot = "";
  for (let s = 0; x0 + s <= x1 + 4; s += 4) {
    const x = x0 + s, y = y0 + 2.2 * Math.sin(s * 0.019) + 1.1 * Math.sin(s * 0.053 + 1);
    const w = 2.8 * (1 + 0.2 * Math.sin(s * 0.031) * Math.sin(s * 0.0077 + 1.3)) * (0.3 + 0.7 * Math.min(1, s / 40));
    top1 += (s ? "L" : "M") + x.toFixed(1) + "," + (y - w).toFixed(1);
    bot = "L" + x.toFixed(1) + "," + (y + w).toFixed(1) + bot;
  }
  ink.path = top1 + bot + "Z";
  ink.dry.setAttribute("d", ink.path);
  ink.wet.setAttribute("d", ink.path);
  ink.yAt = x => { const s = x - x0; return y0 + 2.2 * Math.sin(s * 0.019) + 1.1 * Math.sin(s * 0.053 + 1); };
  ink.lastX = null;
}
function tlInkDraw(x) {
  const ink = TL.ink;
  if (!ink || ink.x0 == null) return;
  const head = Math.min(ink.x1, TL.pad + x + TL.w + TL.gap * 0.5);   // tip waits in the gap after the centred poster
  if (ink.lastX !== null && Math.abs(head - ink.lastX) < 0.1) return;
  const moving = ink.lastX !== null;
  ink.lastX = head;
  ink.clip.setAttribute("width", Math.max(0, head + 1).toFixed(1));
  ink.grad.setAttribute("x1", (head - 170).toFixed(1));
  ink.grad.setAttribute("x2", head.toFixed(1));
  const hy = ink.yAt(head);
  ink.head.setAttribute("transform", `translate(${head.toFixed(1)} ${hy.toFixed(1)})`);
  ink.head.style.opacity = head < ink.x1 - 1 ? "" : "0";
  // colour soaks into each event poster as the tip passes it (only ever grows)
  for (let i = 0; i < TL.n; i++) {
    const left = TL.pad + i * TL.step, f = Math.max(0, Math.min(1, (head - 6 - left) / TL.w));
    const prev = ink.fills[i] || 0;
    if (f > prev) {
      ink.fills[i] = f;
      TL.cards[i].style.setProperty("--fill", f.toFixed(4));
      if (prev === 0 && moving && ink.started) tlInkDrops(left, ink.yAt(left));
    }
  }
  ink.started = true;
}
function tlInkDrops(x, y) {
  let html = "";
  for (let k = 0; k < 5; k++) {
    const r = 1 + Math.random() * 2.4, dx = (Math.random() - 0.5) * 26, dy = (Math.random() - 0.5) * 18;
    html += `<circle class="snake-drop" cx="${(x + dx - 6).toFixed(1)}" cy="${(y + dy).toFixed(1)}" r="${r.toFixed(1)}" style="animation-delay:${k * 45}ms"/>`;
  }
  TL.ink.drops.insertAdjacentHTML("beforeend", html);
}

function tlTarget() {
  const r = TL.el.getBoundingClientRect();
  return Math.max(0, Math.min(TL.dist, TL.top - r.top));
}

function tlKick() {
  if (TL.raf || !TL.el) return;
  TL.raf = requestAnimationFrame(tlFrame);
}

function tlFrame() {
  TL.raf = null;
  if (!TL.el) return;
  const target = tlTarget();
  if (TL.cur === null) TL.cur = target;
  if (TL.dragging || TL.glide) TL.cur = target;        // under a finger, or gliding after one, the row tracks exactly
  else TL.cur += (target - TL.cur) * 0.16;            // eased, so it glides rather than jerks
  if (Math.abs(target - TL.cur) < 0.4) TL.cur = target;
  const x = TL.cur;
  TL.pullNow = TL.dragging ? (TL.pull || 0) : (TL.pullNow || 0) * 0.8;   // give at the ends, springing back on release
  if (Math.abs(TL.pullNow) < 0.4) TL.pullNow = 0;
  TL.track.style.transform = `translate3d(${TL.pullNow - x}px,0,0)`;

  const pos = x / TL.step;
  tlInkDraw(x);
  TL.cards.forEach((c, i) => {
    const d = i - pos, ad = Math.abs(d);
    const scale = 1 - Math.min(ad, 2) * 0.09;
    const rot = Math.max(-16, Math.min(16, -d * 11));
    c.style.transform = `perspective(1400px) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    const op = (1 - Math.min(ad, 1.6) * 0.34).toFixed(3);
    // with the ink behind, fade the artwork rather than the card, so the ink doesn't show through
    if (TL.ink) c.style.setProperty("--tlo", op); else c.style.opacity = op;
  });

  const active = Math.max(0, Math.min(TL.cards.length - 1, Math.round(pos)));
  if (active !== TL.active) {
    if (TL.cards[TL.active]) TL.cards[TL.active].classList.remove("is-active");
    TL.cards[active].classList.add("is-active");
    TL.active = active;
    const year = TL.cards[active].dataset.year;
    if (year !== TL.year) {
      TL.year = year;
      tlSetYear(year);
      TL.ticks.forEach(b => b.classList.toggle("now", b.dataset.year === year));
    }
    // fetch the next few posters now, so they are there by the time a swipe reaches them
    for (let j = active + 1; j <= active + 3 && j < TL.cards.length; j++)
      TL.cards[j].querySelectorAll('img[loading="lazy"]').forEach(im => { im.loading = "eager"; });
    TL.count.textContent = active < TL.n ? `${String(active + 1).padStart(2, "0")} / ${String(TL.n).padStart(2, "0")}` : "";
  }
  const frac = TL.dist ? x / TL.dist : 0;
  TL.fill.style.width = (frac * 100) + "%";
  TL.ticks.forEach(b => b.classList.toggle("on", Number(b.dataset.i) <= pos + 0.01));

  if (TL.cur !== target || TL.pullNow) tlKick();
}

function tlOnScroll() {
  if (!TL.el) return;
  tlKick();
  clearTimeout(TL.settle);
  TL.settle = setTimeout(() => {
    if (!TL.el || TL.touching) return;
    const target = tlTarget();
    tlHintCheck();
    if (target <= 1 || target >= TL.dist - 1) return;  // not pinned: leave the page alone
    const delta = Math.round(target / TL.step) * TL.step - target;
    if (Math.abs(delta) > 2) window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" });
  }, TL_SETTLE_MS);
}

function tlJump(i) {
  if (!TL.el) return;
  const elTop = TL.el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: elTop - TL.top + i * TL.step, behavior: "smooth" });
}

// Tiny blurred copies of the usual hero photos (24px JPEGs, ~600 bytes each, also inline in index.html).
// A panel shows its copy straight away and the real photo dissolves in over it once loaded, so the opening
// keeps its rhythm on a slow connection. A photo with no copy here just has the panel's own colour behind it.
const HERO_LQIP = {
 "images/welcome_vertical.jpg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAUABgDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAMEBQYB/8QAJxAAAgICAQIEBwAAAAAAAAAAAQIDBAARBRJBISJRgRMUYXFysdH/xAAXAQADAQAAAAAAAAAAAAAAAAABAgME/8QAHBEBAQAABwAAAAAAAAAAAAAAAAECERITIjFh/9oADAMBAAIRAxEAPwChY4rj0rJN8lKFYb8srD9g5NYq8fa5efrjtrI7aPQ6kdvUZ1IvLBQSoVJdFCgsP7kdaNzIHaCvMpIG2j03bx2PfM2v1bbY8/A1mYiK1ajJbsinQA+4xnVrSryxbEXwmO9hT9cYeQZYV5oo5CC6K2/UZ4acOvKnT+PhjGPZCy1mWiYX0pPvjGMy3tZ//9k=",
 "images/welcome_top.jpg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAQABgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQAC/8QAKBAAAgEDAQYHAQAAAAAAAAAAAQIRAAMEEgYTITFBYRQWIjJRccHR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAED/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARAv/aAAwDAQACEQMRAD8AYG2pdiEwX9/AGRK/2h7O0uZhPkNjoLgvNrlwWjsDWABeyFLZK2iylfVBIAmT+UfFy1hOwvowZSNCKZnjMjpzrMXo2Er53zmvWwMcBEjejTz+YPSqj8K/YF654hW3FvSwgQCSO/1VV1iX/9k=",
 "images/welcome_bottom.jpg": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAOABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIDBP/EACUQAAIBAwMDBQEAAAAAAAAAAAECAwAEERIhUQUTMQYWIjJBcf/EABYBAQEBAAAAAAAAAAAAAAAAAAECBP/EABkRAAIDAQAAAAAAAAAAAAAAAAABAgQSFP/aAAwDAQACEQMRAD8AzdW6xexNFaxXDaEGcr/ef2re6byKCFROGk1fImPyK1tBDKUbtIGUhgdIztVGhiOWEahyPsBuOMcYrD0FuIvUPVMF9aGIQEaVDsMjyDnaikuNCRk9tSedI3opVlhlH//Z"
};

function renderHeroPhotos(heroRows) {
  const container = document.getElementById("js-hero-photos");
  if (!container) return;
  const bySlot = {};
  heroRows.forEach(r => { bySlot[r.slot] = r; });
  const letters = ["a", "b", "c"];
  const panels = container.querySelectorAll(".panel");
  const html = [1, 2, 3].map((slot, i) => {
    const row = bySlot[slot];
    const lq = row && HERO_LQIP[row.photo];
    const inner = row
      ? (lq ? `<i class="lq" aria-hidden="true" style="background-image:url(${lq})"></i>` : "") +
        `<img src="${safeUrl(row.photo)}" alt="${escapeHtml(row.alt || "")}"${i === 0 ? ' fetchpriority="high"' : ""} decoding="async" onerror="this.style.visibility='hidden'" style="width:100%;height:100%;object-fit:cover;">`
      : "";
    return `<div class="panel panel-${letters[i]}">${inner}</div>`;
  });
  // Same photos as already on the page (the usual case): leave them alone, so nothing reloads or flickers
  // in the middle of the opening.
  const same = panels.length === 3 && [1, 2, 3].every((slot, i) => {
    const img = panels[i].querySelector("img"), row = bySlot[slot];
    return row ? !!img && img.getAttribute("src") === safeUrl(row.photo) : !img;
  });
  if (!same) container.innerHTML = html.join("");
}

// Fades/slides ".reveal" elements in as they scroll into view (once each —
// they don't re-hide if you scroll back up). Elements inside a grid
// (the Coming Up cards, the Past Events gallery) get a small staggered
// delay so they arrive one after another rather than all at once.
// Respects prefers-reduced-motion: reduce (see the CSS rule of the same
// name) by just showing everything immediately, no observer.
function initScrollReveal() {
  try {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    const reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      document.documentElement.classList.add("reveal-on");
      return;
    }

    [".events-grid", ".past-gallery"].forEach(sel => {
      const group = document.querySelector(sel);
      if (!group) return;
      group.querySelectorAll(".reveal").forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i, 7) * 70}ms`;
      });
    });

    // Already on screen as the page opens (within its first moments): show it as-is, no slide.
    if (performance.now() < 2000) {
      targets.forEach(el => {
        if (el.classList.contains("is-visible") || el.closest("[data-pending]")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-visible");
      });
    }
    // From here on, cards below the fold are hidden until they're scrolled into view.
    document.documentElement.classList.add("reveal-on");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });

    targets.forEach(el => observer.observe(el));

    // Safety net: some mobile browsers/in-app webviews (Instagram, Facebook,
    // etc. — exactly where a club site link tends to get shared) run
    // IntersectionObserver unreliably, or delay it long enough that a
    // visitor scrolls right past a card before it ever triggers. Real
    // content should never stay permanently invisible over an animation,
    // so force everything to show after a couple seconds no matter what.
    setTimeout(() => {
      targets.forEach(el => el.classList.add("is-visible"));
      observer.disconnect();
    }, 2000);
  } catch (err) {
    // If anything above goes wrong, fall back to just showing the content.
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
  }
}

// Shared by the "celebrate" buttons below and the logo easter egg further
// down — a burst of confetti pieces radiating out from (x, y). Both callers
// already check prefers-reduced-motion/animate support before calling this.
const CONFETTI_COLORS = ["#C08A2E", "#AE3628", "#4B7A3C", "#F6F1E4", "#1C2440"];

function confettiBurst(x, y) {
  const pieceCount = 32;
  for (let i = 0; i < pieceCount; i++) {
    const el = document.createElement("span");
    const size = 5 + Math.random() * 6;
    const round = Math.random() < 0.4;
    Object.assign(el.style, {
      position: "fixed",
      left: x + "px",
      top: y + "px",
      width: size + "px",
      height: size + "px",
      background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      borderRadius: round ? "50%" : "2px",
      pointerEvents: "none",
      zIndex: 9999,
      willChange: "transform, opacity",
    });
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = 110 + Math.random() * 170; // bigger spread than before
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 70; // upward bias, like a firework burst
    const rotate = (Math.random() - 0.5) * 900;

    const anim = el.animate([
      { transform: "translate(-50%, -50%) translate(0px, 0px) rotate(0deg)", opacity: 1 },
      { transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(-50%, -50%) translate(${dx * 1.2}px, ${dy + 220}px) rotate(${rotate * 1.4}deg)`, opacity: 0 },
    ], { duration: 1400 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }); // longer hang time than before

    anim.onfinish = () => el.remove();
  }
}

// Little confetti-burst "congrats!" moment for anything with class="celebrate"
// — the Join the Club / Join Newsletter buttons. These links open the actual
// form in a new tab (target="_blank"), so this never blocks or delays that;
// it's just a bit of positive feedback in the moment you click. Respects
// prefers-reduced-motion by doing nothing at all (the link still works fine).
function initCelebrations() {
  const targets = document.querySelectorAll(".celebrate");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof Element === "undefined" || !Element.prototype.animate) return;

  targets.forEach(el => {
    el.addEventListener("click", e => {
      // Let modified clicks (open in new tab/window, download, etc.) behave
      // however the browser/user normally handles those — only hijack a
      // plain left-click.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = el.getAttribute("href");
      if (!href) return; // nothing to navigate to — just let it burst, no-op otherwise

      // Hold the actual navigation for a beat so the confetti is genuinely
      // visible before we leave the page — a new tab would switch focus
      // away almost instantly, so this deliberately navigates in the same
      // tab instead (use the browser's back button to return to the site).
      e.preventDefault();
      confettiBurst(e.clientX, e.clientY);
      window.setTimeout(() => { window.location.href = href; }, 1300);
    });
  });
}

// Hidden little "you found it" moment — triple-click the logo mark (not the
// club name text next to it, which should always just go home normally) and
// it spins itself up like an Android hidden-menu easter egg, with the same
// confetti burst used elsewhere on the site.
function initLogoEasterEgg() {
  const logo = document.querySelector(".brand img");
  const brandLink = document.querySelector(".brand");
  if (!logo || !brandLink) return;

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof Element === "undefined" || !Element.prototype.animate) return;

  // The homepage's own logo just scrolls to the top of the same page
  // (href="#top") — completely harmless to click repeatedly, so clicks 1
  // and 2 there are left 100% untouched and instant. On the events page the
  // logo instead navigates to a different page (href="index.html"), which
  // would fire on the very first click and cut the pattern off before a
  // 2nd/3rd click could register — so on THAT page only, clicks are held
  // for a brief 220ms in case more are coming. That's short enough to be
  // barely noticeable next to the page load that follows anyway.
  const href = brandLink.getAttribute("href") || "";
  const samePage = href.charAt(0) === "#";
  const WINDOW_MS = 600;
  const NAV_GRACE_MS = 220;
  let clickTimes = [];
  let navTimer = null;

  function spin() {
    logo.animate([
      { transform: "scale(1) rotate(0deg)", offset: 0 },
      { transform: "scale(1.5) rotate(200deg)", offset: 0.45 },
      { transform: "scale(1.5) rotate(380deg)", offset: 0.75 },
      { transform: "scale(1) rotate(360deg)", offset: 1 },
    ], { duration: 900, easing: "cubic-bezier(.34,1.56,.64,1)" });

    const rect = logo.getBoundingClientRect();
    confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  logo.addEventListener("click", e => {
    const now = Date.now();
    clickTimes = clickTimes.filter(t => now - t < WINDOW_MS);
    clickTimes.push(now);

    if (samePage) {
      // Nothing to protect against — let every click behave normally, and
      // just layer the spin on top as a bonus when the 3rd one lands.
      if (clickTimes.length >= 3) {
        clickTimes = [];
        spin();
      }
      return;
    }

    e.preventDefault();
    clearTimeout(navTimer);

    if (clickTimes.length >= 3) {
      clickTimes = [];
      spin();
      return;
    }

    navTimer = setTimeout(() => {
      clickTimes = [];
      window.location.href = href;
    }, NAV_GRACE_MS);
  });
}

// Powers fun-fact.html: shows a random Myanmar fun fact on load, and a new
// one (never the same fact twice in a row) each time "Another fact" is
// clicked, with the same confetti burst used elsewhere on the site.
function initFunFact() {
  const textEl = document.getElementById("js-fact-text");
  const emojiEl = document.getElementById("js-fact-emoji");
  const reroll = document.getElementById("js-fact-reroll");
  if (!textEl) return;

  let lastIndex = -1;
  function showRandomFact() {
    let i = Math.floor(Math.random() * MYANMAR_FUN_FACTS.length);
    if (MYANMAR_FUN_FACTS.length > 1 && i === lastIndex) {
      i = (i + 1) % MYANMAR_FUN_FACTS.length;
    }
    lastIndex = i;
    const fact = MYANMAR_FUN_FACTS[i];
    textEl.textContent = fact.text;
    putFactIcon(emojiEl, fact);
  }

  showRandomFact();

  if (reroll) {
    reroll.addEventListener("click", e => {
      showRandomFact();
      const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && typeof Element !== "undefined" && Element.prototype.animate) {
        confettiBurst(e.clientX, e.clientY);
      }
    });
  }
}

function initFooterNewsletter() {
  applyPlaceholders();
  // Footer sign-up beside "Join the Club". Posts through MCCSite.newsletter (same Kit form as newsletter.html).
  document.querySelectorAll("form.footer-nl").forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button[type="submit"]');
    const msg = form.closest(".contact-intro")?.querySelector(".footer-nl-msg");
    const say = text => { if (msg) msg.textContent = text || ""; };
    const done = () => {
      form.classList.add("is-done");
      form.innerHTML = "";
      form.textContent = "You're on the list! Check your inbox to confirm.";
      form.setAttribute("role", "status");
      say("");
    };
    form.addEventListener("submit", e => {
      e.preventDefault();
      if (form.website && form.website.value) { done(); return; }   // honeypot: bots fill this in
      const email = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say("Please enter a valid email address."); input.focus(); return; }
      say(""); btn.disabled = true;
      window.MCCSite.newsletter(email).then(res => {
        if (res.ok) { done(); return; }
        say(res.message || "That didn't go through. Please try a different email address.");
        btn.disabled = false; input.focus();
      });
    });
  });
}

function initEmailCopy() {
  const buttons = document.querySelectorAll(".js-email-copy");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    const email = btn.dataset.email;
    if (!email) return;
    const label = btn.querySelector(".js-email-label");
    const arrow = btn.querySelector(".arrow");
    // Not captured once up front — the label's language can change (via the
    // EN/MM toggle) between page load and whenever this actually reverts.
    const arrowSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 L17 7"/><path d="M8 7 H17 V16"/></svg>';
    let resetTimer = null;

    btn.addEventListener("click", async () => {
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          copied = true;
        }
      } catch (err) {
        copied = false;
      }

      if (!copied) {
        try {
          const temp = document.createElement("textarea");
          temp.value = email;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          temp.setSelectionRange(0, temp.value.length);
          copied = document.execCommand("copy");
          document.body.removeChild(temp);
        } catch (err) {
          copied = false;
        }
      }

      if (!copied) return;

      btn.classList.add("is-copied");
      if (label) label.textContent = t("contact_email_copied");
      if (arrow) {
        arrow.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13 L10 18 L19 6"/></svg>';
      }

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label) label.textContent = t("contact_email_label");
        if (arrow) arrow.innerHTML = arrowSvg;
      }, 1800);
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Used for any URL coming from the Sheet (event links, photos) before it's
// dropped into an href/src attribute. Blocks the javascript:/data: schemes
// (which a browser would otherwise treat as executable when clicked/loaded)
// and escapes quotes so the value can't break out of the attribute and
// inject extra HTML. A relative path like "images/events/x.jpg" or a normal
// http(s)/mailto link passes through unchanged.
function safeUrl(str) {
  if (!str) return "";
  const s = String(str).trim();
  if (/^(javascript|data|vbscript):/i.test(s)) return "";
  return escapeHtml(s);
}

// Cached inputs to the three CSV-driven render functions above, so the
// language toggle can re-render them in the new language instantly
// without re-fetching the CSVs.
let _cachedNext = null, _cachedRest = [], _cachedPast = [];
let _dataLoaded = false;

// ---------- Homepage: "မင်္ဂလာပါ" greeting, written in ----------
// The word lives in index.html as ready-made outlines, one per syllable (မ · င်္ဂ · လာ · ပါ),
// shaped from the Yinmar font ahead of time so it's identical in every browser. Here it becomes:
//   • a pen layer — each syllable's outline traced in one flowing, overlapping motion, left to right;
//   • a cover — the word in the page colour, hiding the inner half of every outline, so where
//     letters overlap (the ာ in လာ) only the clean outer edge of the word is drawn;
//   • an ink layer — the solid word, revealed through a soft edge that follows behind the pen and
//     spreads unevenly, like ink soaking into paper, before settling crisp.
// Starts half a second after the page appears, plays on every visit, again whenever you scroll
// back up to it, and when you hover over (or tap) it. Reduced motion: just the finished word.
const GREET = { svg: null, raf: null };

// ---------- Homepage: "Learn to write this" margin note beside the greeting ----------
// A handwritten note (Gochi Hand) just above the word, on the "Welcome" line, with an arrow down to the
// top of လာ, linking to the learn page. It's placed from the greeting's own outlines, so the arrow lands
// on လာ at every screen size.
// Animation ("Pencil, then ink", picked Nov 21): sketched in faint pencil — words, then arrow, then
// underline — and then inked over in red. It plays once, straight after the greeting is written in,
// and never again on that visit (tapping the greeting to rewrite it leaves the note alone). Wherever
// the greeting shows up already written, so does the note.
function initGreetNote() {
  const none = { play() {}, show() {} };
  const note = document.getElementById("js-greet-note");
  const arrow = document.getElementById("js-greet-arrow");
  const svg = document.getElementById("js-greet");
  const box = note && note.parentElement;
  if (!note || !arrow || !svg || !box) return none;
  const ink = note.querySelector(".gn-ink");
  const shaft = arrow.querySelector(".ga-shaft");
  const head = arrow.querySelector(".ga-head");
  const ul = note.querySelector(".gn-ul path");
  const strokes = [shaft, head, ul];
  // Points in the greeting's own units (its viewBox): just above the top of လာ, and the top of the word.
  const TARGET = { x: 207, y: -59 }, WORD_TOP = { x: 0, y: -93 };
  const PENCIL = getComputedStyle(document.documentElement).getPropertyValue("--pencil").trim() || "#A39C8A";
  let state = "hidden";            // hidden → playing → done

  const pt = p => {
    const m = svg.getScreenCTM(), r = box.getBoundingClientRect();
    const q = new DOMPoint(p.x, p.y).matrixTransform(m);
    return { x: q.x - r.left, y: q.y - r.top };
  };
  const f = n => n.toFixed(1);

  function place() {
    if (!svg.getScreenCTM() || !svg.getBoundingClientRect().width) return false;
    const W = box.clientWidth, nw = note.offsetWidth, nh = note.offsetHeight;
    const tgt = pt(TARGET);
    const u = pt({ x: 100, y: 0 }).x - pt({ x: 0, y: 0 }).x;   // px per 100 units
    // Just above the word, at the right, on the "Welcome" line; a short hooked arrow drops onto လာ.
    let nx, ny, s, c1, c2;
    const eb = box.querySelector(".eyebrow");
    const ebR = eb ? eb.getBoundingClientRect().right - box.getBoundingClientRect().left : 0;
    nx = Math.max(ebR + 14, Math.min(W - nw - 4, tgt.x + u * 0.5));
    // Two-column hero (desktop): the gap between "Welcome" and the word is tight, so the note's text sits
    // on the "Welcome" line (its bottom on the eyebrow's baseline) — one row, the word clearly below.
    // One column (phones, ≤820px, same breakpoint as the hero grid): it hangs just above the word.
    const oneCol = window.matchMedia && matchMedia("(max-width:820px)").matches;
    if (eb && !oneCol) {
      const ebB = eb.getBoundingClientRect().bottom - box.getBoundingClientRect().top;
      const inkB = ink.getBoundingClientRect().bottom - note.getBoundingClientRect().top;
      ny = ebB - inkB + nh * 0.12;
    } else ny = pt(WORD_TOP).y - nh * 0.85;
    s = { x: nx - 7, y: ny + nh * 0.5 };          // from beside "Learn", clear of the underline
    c1 = { x: s.x - (s.x - tgt.x) * 0.75, y: s.y - u * 0.01 };
    c2 = { x: tgt.x + u * 0.01, y: tgt.y - u * 0.1 };
    // The underline is drawn to the text's real width (a stretched viewBox would squash the pen line).
    const tw = note.querySelector(".gn-text").offsetWidth, uls = ul.ownerSVGElement;
    uls.setAttribute("viewBox", `0 0 ${f(tw + 2)} 8`);
    uls.style.width = f(tw + 2) + "px";
    ul.setAttribute("d", `M1 5.2C${f(tw * .18)} 2.6 ${f(tw * .41)} 6.6 ${f(tw * .63)} 4.1S${f(tw * .89)} 4.9 ${f(tw + 1)} 2.8`);
    note.style.left = f(nx) + "px";
    note.style.top = f(ny) + "px";
    shaft.setAttribute("d", `M${f(s.x)} ${f(s.y)}C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(tgt.x)} ${f(tgt.y)}`);
    // Arrowhead: two flicks back along the curve's last direction, one a little shorter, as by hand.
    let dx = tgt.x - c2.x, dy = tgt.y - c2.y; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const L = Math.max(6, Math.min(10, u * 0.075)), side = (a, len) => {
      const c = Math.cos(a), sn = Math.sin(a), bx = -dx, by = -dy;
      return { x: tgt.x + len * (bx * c - by * sn), y: tgt.y + len * (bx * sn + by * c) };
    };
    const a = side(0.5, L), b = side(-0.5, L * 0.82);
    head.setAttribute("d", `M${f(a.x)} ${f(a.y)}L${f(tgt.x)} ${f(tgt.y)}L${f(b.x)} ${f(b.y)}`);
    arrow.style.setProperty("--gn-nx", f(dx * 3) + "px");   // hover: the arrow nudges toward လာ
    arrow.style.setProperty("--gn-ny", f(dy * 3) + "px");
    strokes.forEach(p => { const len = p.getTotalLength() + 1; p.dataset.len = len; p.style.strokeDasharray = `${len} ${len}`; });
    return true;
  }

  const cancel = () => [note, ink, ...strokes].forEach(el => el.getAnimations().forEach(x => x.cancel()));
  const finalLook = () => {
    ink.style.clipPath = ""; ink.style.opacity = ""; ink.style.color = "";
    strokes.forEach(p => { p.style.strokeDashoffset = "0"; p.style.stroke = ""; p.style.strokeWidth = ""; });
  };
  const reveal = () => { note.classList.add("is-placed"); arrow.classList.add("is-placed"); };

  function show() {
    if (state === "playing") return;
    cancel();
    if (!place()) return;
    finalLook();
    reveal();
    state = "done";
  }

  function play() {
    if (state !== "hidden") return;
    if (!place()) { show(); return; }
    state = "playing";
    const RED = getComputedStyle(note).color;
    const draw = (p, ms, delay, easing) => p.animate(
      [{ strokeDashoffset: p.dataset.len }, { strokeDashoffset: 0 }],
      { duration: ms, delay, easing: easing || "cubic-bezier(.45,.05,.35,1)", fill: "both" });
    const anims = [];
    // Pencil: the words, left to right, then the arrow, then the underline — faint and thin.
    ink.style.color = PENCIL;
    strokes.forEach(p => { p.style.stroke = PENCIL; p.style.strokeWidth = "1.2"; p.style.strokeDashoffset = p.dataset.len; });
    anims.push(ink.animate([{ opacity: 0 }, { opacity: 0.85 }], { duration: 500, fill: "both" }));
    anims.push(ink.animate([{ clipPath: "inset(-40% 100% -40% -6%)" }, { clipPath: "inset(-40% -6% -40% -6%)" }],
      { duration: 520, easing: "cubic-bezier(.3,.1,.5,1)", fill: "both" }));
    anims.push(draw(shaft, 340, 420));
    anims.push(draw(head, 130, 760, "ease-out"));
    anims.push(draw(ul, 240, 860));
    // Ink: red floods over the pencil and the lines thicken.
    anims.push(ink.animate([{ color: PENCIL, opacity: 0.85 }, { color: RED, opacity: 1 }], { duration: 600, delay: 1250, easing: "ease-out", fill: "forwards" }));
    strokes.forEach(p => anims.push(p.animate([{ stroke: PENCIL, strokeWidth: 1.2 }, { stroke: RED, strokeWidth: 1.8 }],
      { duration: 600, delay: 1250, easing: "ease-out", fill: "forwards" })));
    reveal();
    Promise.all(anims.map(x => x.finished)).then(() => { state = "done"; cancel(); finalLook(); }, () => {});
  }

  // Keep it on the word when the layout changes (resize, web fonts arriving). Mid-animation the
  // strokes keep their lengths, so only re-place once it's settled.
  let rq = 0;
  const relayout = () => { if (state !== "done") return; cancelAnimationFrame(rq); rq = requestAnimationFrame(() => { place(); finalLook(); }); };
  window.addEventListener("resize", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  // It's hidden in Burmese, so coming back to English it needs measuring again.
  document.querySelectorAll(".lang-toggle button").forEach(b => b.addEventListener("click", () => setTimeout(relayout)));
  // Hover: the underline is drawn again (the arrow's nudge is CSS).
  note.addEventListener("pointerenter", e => {
    if (state !== "done" || e.pointerType !== "mouse") return;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ul.animate([{ strokeDashoffset: ul.dataset.len }, { strokeDashoffset: 0 }], { duration: 300, easing: "cubic-bezier(.45,.05,.35,1)" });
  });

  return { play, show };
}

function initGreeting() {
  const svg = document.getElementById("js-greet");
  if (!svg) return;
  const html = document.documentElement;
  const note = initGreetNote();
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveal = () => html.classList.remove("greet-pending");
  // Opening order: words first. The page opens with "Welcome", the greeting starts writing almost at
  // once, and the hero photos fade in one by one as the pen crosses the word (left photo, then the two
  // on the right); the paragraph and buttons come last (CSS delays in index.html).
  // Which photos are still waiting lives on <html> (hold-a/b/c), because the photo panels are
  // re-rendered when the hero data loads.
  let photosLetIn = !html.classList.contains("hero-wait");
  if (!photosLetIn) {
    html.classList.add("hold-a", "hold-b", "hold-c");
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("hero-wait")));
  }
  const letPhotosIn = () => {
    if (photosLetIn) return;
    photosLetIn = true;
    // Big photo first, then the two small ones a quarter-second apart (CSS sets the fades).
    // Each photo that has already downloaded is decoded now, so its fade never starts on a dropped frame;
    // its turn waits for that, but never more than 200ms. A photo still downloading goes in on time and
    // shows its soft preview until it arrives.
    const decoded = x => {
      const img = document.querySelector(`#js-hero-photos .panel-${x} img`);
      if (!img || !img.complete || !img.naturalWidth || !img.decode) return Promise.resolve();
      return img.decode().catch(() => {});
    };
    [["a", 700], ["b", 1450], ["c", 1700]].forEach(([x, ms]) => {
      const ready = decoded(x);
      setTimeout(() => {
        let go = false;
        const letIn = () => { if (go) return; go = true; html.classList.remove("hold-" + x); };
        ready.then(letIn); setTimeout(letIn, 200);
      }, ms);
    });
    // The paragraph comes in one line at a time. It's split into lines just before it appears (so the
    // web font has loaded and the line breaks are the real ones), then the plain text goes back.
    const lede = html.classList.contains("hero-intro") && document.querySelector(".hero-copy .lede");
    // The lines are measured in the real font, so wait for it, but never past 3s from the start of the page.
    const fontsThen = fn => {
      const f = document.fonts;
      if (!f || f.status === "loaded") return fn();
      lede.classList.add("lede-wait");
      let done = false;
      const go = () => { if (done) return; done = true; fn(); lede.classList.remove("lede-wait"); };
      f.ready.then(go, go);
      setTimeout(go, Math.max(0, 3000 - performance.now()));
    };
    if (lede && !lede.classList.contains("myanmar")) setTimeout(() => fontsThen(() => {
      try {
        const text = lede.textContent;
        lede.innerHTML = text.split(" ").map(w => `<span class="w">${escapeHtml(w)}</span>`).join(" ");
        const lines = [];
        lede.querySelectorAll(".w").forEach(w => {
          const top = w.offsetTop;
          if (!lines.length || Math.abs(lines[lines.length - 1].top - top) > 4) lines.push({ top, words: [] });
          lines[lines.length - 1].words.push(w.textContent);
        });
        lede.innerHTML = lines.map(l => `<span class="ln">${escapeHtml(l.words.join(" "))}</span>`).join("");
        lede.classList.add("split");
        const spans = lede.querySelectorAll(".ln");
        spans.forEach((ln, i) => setTimeout(() => ln.classList.add("in"), 50 + i * 110));
        setTimeout(() => {
          if (lede.querySelector(".ln")) lede.textContent = text;   // unless a language switch already rewrote it
          lede.classList.remove("split");
        }, 50 + spans.length * 110 + 900);
      } catch (e) { lede.textContent = lede.textContent; lede.classList.remove("split"); }
    }), 1700);
    // Then the section below (the Next Event heading and card, held by hold-below): only once the hero
    // buttons have landed. Scrolling, tapping or a key press before that finishes the opening at once.
    if (html.classList.contains("hold-below")) {
      const evs = ["wheel", "touchmove", "keydown", "pointerdown"];
      const done = () => { evs.forEach(e => window.removeEventListener(e, skip)); window.removeEventListener("scroll", onScroll); };
      const skip = () => {
        done();
        if (!html.classList.contains("hold-below")) return;
        html.classList.add("intro-skip");
        html.classList.remove("greet-pending", "hold-a", "hold-b", "hold-c", "hold-below");
        // The paragraph and buttons may already be waiting out their delays; a transition keeps the delay it
        // started with, so shorten the ones in flight.
        document.querySelectorAll(".hero-copy .lede, .hero-copy .cta-row .btn").forEach(el => {
          if (!el.getAnimations) { el.style.transition = "none"; return; }
          el.getAnimations().forEach(an => {
            try { an.effect.updateTiming({ delay: 0, duration: Math.min(300, Number(an.effect.getTiming().duration) || 300) }); }
            catch (e) { an.finish(); }
          });
        });
      };
      const onScroll = () => { if (window.scrollY > 8) skip(); };
      evs.forEach(e => window.addEventListener(e, skip, { passive: true }));
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();   // a reload that restored the scroll position
      setTimeout(() => { html.classList.remove("hold-below"); done(); }, 3000);
    }
    setTimeout(() => html.classList.remove("hero-intro"), 5200);   // then hover goes back to its quick zoom
  };
  const NS = "http://www.w3.org/2000/svg";
  const src = svg.querySelector(".greet-src");

  const build = () => {
    if (reduce || !src) return false;
    const bb = src.getBBox();
    const layer = cls => { const g = src.cloneNode(true); g.setAttribute("class", cls); return g; };
    const F = 70;                                   // softness of the ink's leading edge (units)
    const M = { x: bb.x - F - 40, y: bb.y - 40, w: bb.width + 2 * F + 80, h: bb.height + 80 };
    const defs = document.createElementNS(NS, "defs");
    defs.innerHTML =
      `<linearGradient id="greet-feather" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${F}" y2="0">` +
      `<stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>` +
      `<filter id="greet-soak" filterUnits="userSpaceOnUse" x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="2" seed="7" result="n"/>` +
      `<feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>` +
      `<mask id="greet-mask" maskUnits="userSpaceOnUse" x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}">` +
      `<rect x="${M.x}" y="${M.y}" width="${M.w}" height="${M.h}" fill="url(#greet-feather)" filter="url(#greet-soak)"/></mask>`;
    const pen = layer("greet-pen");
    const cover = layer("greet-cover");
    const ink = layer("greet-ink");
    ink.setAttribute("mask", "url(#greet-mask)");
    src.replaceWith(defs, pen, cover, ink);
    const sylls = Array.from(pen.children).map(el => {
      const len = Math.ceil(el.getTotalLength()) + 2;
      el.style.strokeDasharray = `${len} ${len}`;
      const b = el.getBBox();
      return { el, len, x0: b.x, w: b.width };
    });
    Object.assign(GREET, { svg, grad: defs.querySelector("#greet-feather"), soak: defs.querySelector("feDisplacementMap"),
      noise: defs.querySelector("feTurbulence"), sylls, F, x0: bb.x, w: bb.width });
    paint(-1);
    return true;
  };

  const ease = x => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // t in seconds since the write started (negative = not started)
  function paint(t) {
    const G = GREET;
    const q = ease((t - 0.85) / 1.8);               // ink sweeps in just behind the pen
    const inkX = G.x0 - 2 + q * (G.w + G.F + 4);
    G.grad.setAttribute("x1", (inkX - G.F).toFixed(1));
    G.grad.setAttribute("x2", inkX.toFixed(1));
    G.soak.setAttribute("scale", (t < 0 ? 0 : 46 * Math.sin(Math.PI * q)).toFixed(1)); // wobbles while moving, calm at rest
    G.sylls.forEach((s, i) => {
      const p = ease((t - i * 0.34) / 1.4);         // syllables overlap, so it reads as one motion
      s.el.style.strokeDashoffset = (s.len * (1 - p)).toFixed(1);
      const covered = Math.max(0, Math.min(1, (inkX - G.F - (s.x0 + s.w * 0.4)) / (s.w * 0.6 + 1)));
      s.el.style.opacity = p > 0 ? String(1 - covered) : "0";  // each outline fades once inked over
    });
  }

  const write = () => {
    reveal();
    letPhotosIn();
    if (!GREET.sylls) { note.show(); return; }
    cancelAnimationFrame(GREET.raf);
    const first = !GREET.wrote;   // the margin note follows the first write only
    GREET.wrote = true;
    let noted = !first;
    GREET.noise.setAttribute("seed", String(1 + Math.floor(Math.random() * 90)));  // a different spread each time
    const t0 = performance.now();
    const frame = now => {
      const t = (now - t0) / 1000;
      paint(t);
      if (!noted && t >= 2.9) { noted = true; note.play(); }   // once the ink has settled
      GREET.raf = t < 3.4 ? requestAnimationFrame(frame) : null;
    };
    GREET.raf = requestAnimationFrame(frame);
  };

  let ok = false;
  try { ok = build(); } catch (e) { ok = false; }
  if (!ok) { reveal(); letPhotosIn(); note.show(); return; }
  // Written once per visit to the site. Arriving from another MCC page (or Back/Forward) shows it
  // already written — the inline script in index.html decides and sets "greet-still" on <html>.
  if (html.classList.contains("greet-still")) { paint(99); reveal(); letPhotosIn(); note.show(); }
  else setTimeout(write, 250);
  // Tap (or click) to have it written again — once the current write has finished.
  // Not on hover, and not when it scrolls back into view.
  const again = () => { if (!GREET.raf) write(); };
  svg.addEventListener("click", again);
  svg.style.cursor = "pointer";
}

// ---------- Next Event card (homepage + events page) tilts gently toward the cursor ----------
// Mouse only (not touch), off for reduced motion. The card turns a few degrees and the poster
// inside drifts the other way, which gives a sense of depth without any shine effects.
function initEventTilt() {
  if (!window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll("#event .event-card, #next-event .event-card").forEach(tiltCard);
}
function tiltCard(card) {
  const st = { tx: 0, ty: 0, x: 0, y: 0, raf: null, last: 0, on: false };
  function frame(now) {
    st.raf = null;
    const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0.016;
    st.last = now;
    const k = 1 - Math.exp(-7 * dt);
    st.x += (st.tx - st.x) * k;
    st.y += (st.ty - st.y) * k;
    const settled = Math.abs(st.tx - st.x) < 0.001 && Math.abs(st.ty - st.y) < 0.001;
    if (settled) { st.x = st.tx; st.y = st.ty; }
    card.style.transform = (st.x || st.y) ? `perspective(1400px) rotateX(${(-st.y * 4).toFixed(3)}deg) rotateY(${(st.x * 5).toFixed(3)}deg)` : "";
    const img = card.querySelector(".event-visual > img");
    if (img) img.style.transform = (st.x || st.y) ? `translate3d(${(-st.x * 14).toFixed(2)}px, ${(-st.y * 14).toFixed(2)}px, 0) scale(1.06)` : "";
    if (!settled) st.raf = requestAnimationFrame(frame); else st.last = 0;
  }
  const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(frame); };
  card.addEventListener("pointerenter", e => {
    if (e.pointerType !== "mouse") return;
    // Let the fade-in finish first, then take over the transform.
    card.style.transition = "box-shadow .5s ease";
    card.classList.add("tilt", "hovering");
  });
  card.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    st.tx = (e.clientX - r.left) / r.width - 0.5;
    st.ty = (e.clientY - r.top) / r.height - 0.5;
    kick();
  });
  card.addEventListener("pointerleave", () => { st.tx = 0; st.ty = 0; card.classList.remove("hovering"); kick(); });
}

// ---------- Homepage: "Explore MCC" bento grid ----------
// Each tile is a small live preview of another page. Filled from the same data the rest of the
// site uses: past events (Sheet), the team (Team tab, or data/team.csv), gallery thumbnails and the
// fun facts list above. The Newsletter tile is just its label and a Read link.
const BENTO = { posters: null, factIndex: -1, team: null, news: null, since: "", count: 0 };

// Events tile posters — edit these two lists to curate it (matched against the event's name or
// poster filename, ignoring capitals). The count ("22 events since 2022") still includes every event.
const BENTO_POSTERS_HIDE = ["multicultural-bazaar", "mcc-mixer"];            // never shown in the tile
const BENTO_POSTERS_FIRST = ["sea of love", "thingyan", "general meeting", "home away from home"]; // shown first
const BENTO_COLORS = ["#AE3628", "#86601E", "#4B7A3C", "#1C2440", "#8C2A1F"];

function renderBento(past) {
  const root = document.getElementById("js-bento");
  if (!root) return;
  const key = ev => ((ev.name || "") + " " + (ev.photo || "")).toLowerCase();
  const rank = ev => { const k = key(ev); const i = BENTO_POSTERS_FIRST.findIndex(w => k.includes(w)); return i < 0 ? 999 : i; };
  const withPhoto = past
    .filter(ev => ev.photo && !BENTO_POSTERS_HIDE.some(w => key(ev).includes(w)))
    .map((ev, i) => ({ ev, i }))
    .sort((a, b) => (rank(a.ev) - rank(b.ev)) || (a.i - b.i))
    .map(x => x.ev);
  const years = past.map(ev => (ev.date || "").slice(0, 4)).filter(y => /^\d{4}$/.test(y)).sort();
  BENTO.count = past.length;
  BENTO.since = years[0] || "";
  renderBentoText();

  // Events tile: columns of posters drifting past (alternating directions).
  const box = document.getElementById("js-bento-posters");
  if (box && withPhoto.length && !box.childElementCount) {
    const cols = 3;
    for (let c = 0; c < cols; c++) {
      const list = withPhoto.filter((_, i) => i % cols === c);
      const imgs = list.concat(list).map(ev => `<img src="${safeUrl(ev.photo)}" alt="" loading="lazy" decoding="async">`).join("");
      box.insertAdjacentHTML("beforeend", `<div class="t-col">${imgs}</div>`);
    }
    initBentoPosters(box);
  }
  if (!BENTO.loaded) { BENTO.loaded = true; loadBentoTeam(); initBentoFact(); renderBentoGallery(); initBentoIg(); initBentoLearn(); }
}

function renderBentoText() {
  const ev = document.getElementById("js-bento-events");
  if (ev && BENTO.count) {
    ev.innerHTML = escapeHtml(t("bento_events_big")).replace("{n}", `<b>${BENTO.count}</b>`).replace("{y}", escapeHtml(BENTO.since));
  }
}

// Poster columns drift slowly on their own; scrolling the page speeds them up for a moment,
// so the tile reacts to you (and eases back to a crawl when you stop).
function initBentoPosters(box) {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const cols = Array.from(box.querySelectorAll(".t-col"));
  const st = { off: cols.map(() => 0), boost: 0, lastY: window.scrollY, last: 0, raf: null, visible: false };
  const base = [16, 22, 18];                       // px per second, per column
  function frame(now) {
    st.raf = null;
    if (!st.visible) { st.last = 0; return; }
    const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0;
    st.last = now;
    st.boost *= Math.exp(-2.2 * dt);
    cols.forEach((col, i) => {
      const half = col.scrollHeight / 2;
      if (!half) return;
      st.off[i] = (st.off[i] + base[i % base.length] * (1 + st.boost) * dt) % half;
      const y = i % 2 ? -half + st.off[i] : -st.off[i];
      col.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    });
    st.raf = requestAnimationFrame(frame);
  }
  window.addEventListener("scroll", () => {
    const y = window.scrollY, d = Math.abs(y - st.lastY);
    st.lastY = y;
    st.boost = Math.min(12, st.boost + d * 0.04);
  }, { passive: true });
  new IntersectionObserver(entries => {
    st.visible = entries[0].isIntersecting;
    if (st.visible && !st.raf) st.raf = requestAnimationFrame(frame);
  }).observe(box);
}

// Team photos, shared by the homepage "Meet the team" tile and about.html.
// Key = full name in lower case; value = image path. A `photo` column in the Team tab also works.
var MCC_TEAM_PHOTOS = {
  "naing lin khant": "images/team/moarz.jpg",
  "eaint chan myae": "images/team/grace.jpg",
  "kaung min phyo": "images/team/martin.jpg"        // alt: images/team/martin-ocean.jpg
};
// Optional uncropped originals: shown when someone opens a profile and clicks the photo.
// Same keys as above. Without an entry here, the click shows the round photo's own file.
var MCC_TEAM_PHOTOS_FULL = {
  "eaint chan myae": "images/team/grace-full.jpg",
  "kaung min phyo": "images/team/martin-full.jpg"   // alt: images/team/martin-ocean-full.jpg
};
function teamPhoto(r) {
  const col = (r.photo || r.photo_url || r.image || "").trim();
  return col || MCC_TEAM_PHOTOS[(r.name || "").trim().toLowerCase()] || "";
}

async function loadBentoTeam() {
  const faces = document.getElementById("js-bento-faces");
  if (!faces) return;
  let text = typeof TEAM_CSV_URL === "string" ? readCachedCSV(TEAM_CSV_URL) : null;
  if (!text && typeof TEAM_CSV_URL === "string") text = await fetchCSVText(TEAM_CSV_URL);
  if (!text) { try { const r = await fetch("data/team.csv"); if (r.ok) text = await r.text(); } catch (e) { /* ignore */ } }
  const rows = text ? safeParse(text).filter(r => (r.name || "").trim()) : [];
  if (!rows.length) return;
  const depts = new Set(rows.map(r => (r.department || "").trim().toLowerCase()).filter(Boolean));
  BENTO.team = { people: rows.length, depts: depts.size || 1 };
  const initials = r => {
    const nm = ((r.preferred_name || "").trim() || r.name.trim()).split(/\s+/);
    return (nm[0][0] + (nm.length > 1 ? nm[nm.length - 1][0] : "")).toUpperCase();
  };
  // Sheet order, but anyone with a photo always makes it onto the tile: they take the places of the
  // last people without one, then everyone is put back in Sheet order.
  const MAX = 9, withPhoto = rows.filter(teamPhoto).slice(0, MAX);
  const pick = new Set(withPhoto.concat(rows.filter(r => !teamPhoto(r)).slice(0, MAX - withPhoto.length)));
  const show = rows.filter(r => pick.has(r));
  faces.innerHTML = show.map((r, i) => {
    const ph = teamPhoto(r);
    return ph
      ? `<span class="t-face" style="background:${BENTO_COLORS[i % BENTO_COLORS.length]} url('${escapeHtml(ph)}') center/cover no-repeat" role="img" aria-label="${escapeHtml(((r.preferred_name || "").trim() || r.name.trim()))}"></span>`
      : `<span class="t-face" style="background:${BENTO_COLORS[i % BENTO_COLORS.length]}">${escapeHtml(initials(r))}</span>`;
  }).join("")
    + (rows.length > show.length ? `<span class="t-face" style="background:var(--bg-sunk);color:var(--ink)">+${rows.length - show.length}</span>` : "");
  renderBentoText();
}

function initBentoFact() {
  const text = document.getElementById("js-bento-fact");
  const emoji = document.getElementById("js-bento-fact-emoji");
  const btn = document.getElementById("js-bento-fact-btn");
  if (!text || typeof MYANMAR_FUN_FACTS === "undefined" || !MYANMAR_FUN_FACTS.length) return;
  const show = (animate) => {
    let i = Math.floor(Math.random() * MYANMAR_FUN_FACTS.length);
    if (MYANMAR_FUN_FACTS.length > 1 && i === BENTO.factIndex) i = (i + 1) % MYANMAR_FUN_FACTS.length;
    BENTO.factIndex = i;
    const f = MYANMAR_FUN_FACTS[i];
    const put = () => { text.textContent = f.text; putFactIcon(emoji, f); text.classList.remove("out"); };
    if (!animate) return put();
    text.classList.add("out");
    setTimeout(put, 280);
  };
  show(false);
  if (btn) btn.addEventListener("click", () => show(true));
}

// Gallery tile photos — edit this list to change which gallery thumbnails the tile uses.
const BENTO_GALLERY_PHOTOS = ["p6-01","p6-03","p6-04","p6-05","p6-07","p6-09","p6-10","p6-14","p16-00","p16-02","p16-05","p16-07",
  "p16-10","p16-12","p16-15","p16-18","p18-06","p20-01","p20-03","p20-07","p20-09","p20-14","p23-03","p24-00","p25-04","p25-07",
  "p25-09","p30-00","p30-04","p30-06","p30-09","p32-03","p34-00","p37-05","p41-00","p44-06","p48-00","p50-00","p51-00"]
  .map(n => `images/gallery/thumbs/mcc-${n}.webp`);
const BENTO_PHONE_MQ = "(max-width: 560px)";

// Gallery tile. Wider screens: a faded sepia contact sheet with a magnifying loupe wandering over it
// (it follows the cursor while you hover). Phones: three strings of pegged polaroids running across the
// tile. Like the Events posters, both move on their own and speed up while the page scrolls.
function renderBentoGallery() {
  const box = document.getElementById("js-bento-gallery");
  if (!box) return;
  const tile = box.closest(".t-gallery");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mq = window.matchMedia(BENTO_PHONE_MQ);
  const st = { boost: 0, lastY: window.scrollY, raf: null, last: 0, visible: false, part: null, w: 0, h: 0 };
  const img = src => `<img src="${src}" alt="" loading="lazy" decoding="async">`;
  const shuffled = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  function magnifier(W, H) {
    const cols = W < 200 ? 3 : 4;
    const rows = Math.ceil(H / ((W + 12) / cols)) + 1;
    const html = shuffled(BENTO_GALLERY_PHOTOS).slice(0, cols * rows).map(img).join("");
    box.innerHTML = `<div class="lz-grid lz-base" style="--cols:${cols}">${html}</div>
      <div class="lz-clip"><div class="lz-zoom"><div class="lz-grid" style="--cols:${cols}">${html}</div></div></div>
      <div class="lz-ring"></div>`;
    const clip = box.querySelector(".lz-clip"), zoom = box.querySelector(".lz-zoom"), ring = box.querySelector(".lz-ring");
    const R = Math.round(Math.min(W, H) * 0.3), Z = 1.9;
    ring.style.width = ring.style.height = R * 2 + "px";
    let t = Math.random() * 10, x = W / 2, y = H * 0.35, ptr = null;
    const draw = () => {
      clip.style.clipPath = `circle(${R}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
      zoom.style.transform = `translate(${x}px,${y}px) scale(${Z}) translate(${-x}px,${-y}px)`;
      ring.style.transform = `translate(${(x - R).toFixed(1)}px,${(y - R).toFixed(1)}px)`;
    };
    const move = e => { const b = tile.getBoundingClientRect(); ptr = [e.clientX - b.left, Math.min(e.clientY - b.top, H * 0.62)]; };
    const leave = () => { ptr = null; };
    if (window.matchMedia("(hover: hover)").matches) { tile.addEventListener("pointermove", move); tile.addEventListener("pointerleave", leave); }
    draw();
    return {
      // Calm pace, matched to the Events posters: the loupe glides at roughly 15-25px a second,
      // and scrolling nudges it along like it nudges the posters (just more gently).
      tick(dt, k) {
        t += dt * 0.22 * (1 + (k - 1) * 0.35);
        const tx = ptr ? ptr[0] : W / 2 + (W / 2 - R * 0.55) * Math.sin(t * 0.9),
              ty = ptr ? ptr[1] : H * 0.34 + (H * 0.22) * Math.sin(t * 1.1 + 1);
        const ease = 1 - Math.exp(-(ptr ? 10 : 4) * dt);
        x += (tx - x) * ease; y += (ty - y) * ease;
        draw();
      },
      destroy() { tile.removeEventListener("pointermove", move); tile.removeEventListener("pointerleave", leave); }
    };
  }

  function clothesline(W, H) {
    const pw = Math.round(Math.max(58, Math.min(96, W * 0.36)));
    const rows = H > 300 ? 3 : 2;
    const ys = Array.from({ length: rows }, (_, i) => 10 + i * (H * 0.62 / rows));
    const sag = pw * 0.28, step = pw * 1.18, per = Math.ceil((W + pw * 2) / step) + 1;
    box.style.setProperty("--pw", pw + "px");
    box.innerHTML = `<svg class="cl-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${ys.map(y => `<path d="M-10 ${y} Q ${W / 2} ${y + sag * 2} ${W + 10} ${y}"/>`).join("")}</svg>`;
    const pool = shuffled(BENTO_GALLERY_PHOTOS); let next = 0;
    const cards = [];
    ys.forEach((y0, r) => {
      for (let i = 0; i < per; i++) {
        const el = document.createElement("div"); el.className = "pc";
        el.innerHTML = img(pool[next++ % pool.length]) + `<span class="peg"></span>`;
        box.appendChild(el);
        cards.push({ el, r, y0, x: i * step - pw, ph: Math.random() * 6, tilt: Math.random() * 6 - 3 });
      }
    });
    // Calm pace, matched to the Events posters: the strings creep along at about 8-11px a second
    // (the tile is narrow, so this reads like the posters' drift), and scrolling nudges them gently.
    const span = per * step, speed = [8, 11, 9.5];
    let t = 0, swing = 0;
    const yAt = (y0, x) => { const u = (x / W) * 2 - 1; return y0 + sag * (1 - u * u); };
    const slope = x => { const u = (x / W) * 2 - 1; return Math.atan2(-4 * sag * u / W, 1) * 180 / Math.PI; };
    const part = {
      tick(dt, k) {
        const kk = 1 + (k - 1) * 0.35;
        t += dt; swing += ((kk - 1) * 1.2 - swing) * Math.min(1, dt * 2);
        cards.forEach(c => {
          const dir = c.r % 2 ? -1 : 1;
          c.x += dir * speed[c.r % 3] * kk * dt;
          if (c.x > W + pw) { c.x -= span; c.el.firstChild.src = pool[next++ % pool.length]; }
          if (c.x < -pw * 2) { c.x += span; c.el.firstChild.src = pool[next++ % pool.length]; }
          const cx = c.x + pw / 2;
          const ang = slope(cx) + c.tilt + Math.sin(t * 1.1 + c.ph) * (1.2 + swing * 2.5);
          c.el.style.transform = `translate(${c.x.toFixed(1)}px,${(yAt(c.y0, cx) + 2).toFixed(1)}px) rotate(${ang.toFixed(2)}deg)`;
        });
      }
    };
    part.tick(0, 1);   // place the cards for the first (or reduced-motion) frame
    return part;
  }

  function build() {
    if (st.part && st.part.destroy) st.part.destroy();
    st.w = tile.clientWidth; st.h = tile.clientHeight;
    if (!st.w || !st.h) return;
    st.part = (mq.matches ? clothesline : magnifier)(st.w, st.h);
  }
  build();
  if (mq.addEventListener) mq.addEventListener("change", build);
  let rs = null;
  new ResizeObserver(() => {
    if (Math.abs(tile.clientWidth - st.w) < 2 && Math.abs(tile.clientHeight - st.h) < 2) return;
    clearTimeout(rs); rs = setTimeout(build, 150);
  }).observe(tile);
  if (reduce) return;

  function frame(now) {
    st.raf = null;
    if (!st.visible) { st.last = 0; return; }
    const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 0;
    st.last = now;
    st.boost *= Math.exp(-2.2 * dt);
    if (st.part) st.part.tick(dt, 1 + st.boost);
    st.raf = requestAnimationFrame(frame);
  }
  window.addEventListener("scroll", () => {
    const y = window.scrollY, d = Math.abs(y - st.lastY);
    st.lastY = y;
    st.boost = Math.min(12, st.boost + d * 0.04);
  }, { passive: true });
  new IntersectionObserver(entries => {
    st.visible = entries[0].isIntersecting;
    if (st.visible && !st.raf) st.raf = requestAnimationFrame(frame);
  }).observe(tile);
}

// Instagram tile: plain red at rest.
// Mouse/trackpad: warm embers trail the cursor and float up as they fade, over a faint glow that follows it.
// Touch (phones): the original effect — a tap sends out a warm glow, a ripple and a burst of sparks from
// the finger, then the tile settles back to plain red (so it isn't left lit after visiting Instagram).
// Learn tile: a pen writes one Burmese letter stroke by stroke, holds, fades out, then writes the next.
// Runs only while the tile is on screen; with reduced motion it just shows the first letter.
// Strokes are centre-lines ("x,y x,y …", baseline at y=0); the full set lives in js/learn-data.js.
/* Each stroke of a letter shows only its own circle where it meets another stroke. Fills `mask` (an SVG <mask>
   covering `area`) for stroke i: white everywhere, black over the later strokes that come near it (so their ink
   stays hidden), then a smooth white band exactly along stroke i's own centre-line (so its own circle shows,
   cleanly, right through the join). All vector: no pixel edges. W = the font's ink width in letter units.
   Also used by js/learn.js. Returns false when no other stroke comes near (no mask needed). */
function inkOwnMask(mask, strokes, i, area, W) {
  const NS = "http://www.w3.org/2000/svg", box = s => {
    const b = [1e9, 1e9, -1e9, -1e9];
    s.forEach(p => { b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]); });
    return b;
  };
  const me = box(strokes[i]), M = W * 1.5;
  // only strokes that come LATER can leak (earlier ones are already written)
  const near = strokes.filter((s, k) => {
    if (k <= i) return false;
    const b = box(s); if (b[2] < me[0] - M || b[0] > me[2] + M || b[3] < me[1] - M || b[1] > me[3] + M) return false;
    // really near: some point within reach of this stroke's line
    return s.some(p => strokes[i].some(q => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 < M * M * 1.6));
  });
  if (!near.length) return false;
  const add = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); mask.appendChild(e); return e; };
  const pts = s => (s.length > 1 ? s : [s[0], s[0]]).map(p => p[0] + "," + p[1]).join(" ");
  const line = { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" };
  add("rect", { x: area.x, y: area.y, width: area.width, height: area.height, fill: "#fff" });
  near.forEach(s => add("polyline", Object.assign({ points: pts(s), stroke: "#000", "stroke-width": W + 0.9 }, line)));
  // its own band runs a little past both ends (along the line's direction) so it fills its own corners at a join
  const own = strokes[i].slice(), ext = (a, b) => { const l = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; return [a[0] + (a[0] - b[0]) / l * W * 0.6, a[1] + (a[1] - b[1]) / l * W * 0.6]; };
  if (own.length > 1) { own.unshift(ext(own[0], own[1])); own.push(ext(own[own.length - 1], own[own.length - 2])); }
  add("polyline", Object.assign({ points: pts(own), stroke: "#fff", "stroke-width": W + 1.1 }, line));
  return true;
}
window.MCCInkOwnMask = inkOwnMask;

const BENTO_LEARN = [["က","M14.9 1.7Q10.6 -2.1 8.1 -7.8Q5.5 -13.5 5.5 -20.2Q5.5 -27.2 8.6 -32.8Q11.7 -38.3 17 -41.5Q22.3 -44.6 28.9 -44.6Q35.4 -44.6 40.8 -41.5Q46.1 -38.3 49.2 -32.8Q52.3 -27.2 52.3 -20.2Q52.3 -13.5 49.8 -7.8Q47.2 -2.1 42.9 1.7L39.2 -3.7Q42.2 -6.4 44 -10.7Q45.8 -15 45.8 -20.2Q45.8 -25.4 43.6 -29.4Q41.3 -33.5 37.5 -35.8Q33.7 -38.2 28.9 -38.2Q24.1 -38.2 20.3 -35.8Q16.5 -33.5 14.3 -29.4Q12 -25.4 12 -20.2Q12 -15 13.8 -10.7Q15.5 -6.4 18.7 -3.7ZM69.1 1.7Q65.7 1.7 62.2 0.6L64.8 -5.6Q67.2 -4.9 69.3 -4.9Q73.8 -4.9 77.6 -7.1Q81.3 -9.4 83.6 -13.2Q85.9 -17 85.9 -21.7Q85.9 -27 83.3 -30.7Q80.7 -34.5 76.8 -36.5Q72.9 -38.5 69.1 -38.5Q64.8 -38.5 61 -36.3Q57.1 -34.2 54.7 -30.2Q52.2 -26.3 52.2 -21L47.9 -30.5Q49.8 -35.3 53.2 -38.5Q56.5 -41.8 60.7 -43.4Q64.8 -45 69.1 -45Q73.2 -45 77.3 -43.5Q81.4 -41.9 84.9 -38.9Q88.3 -35.9 90.3 -31.6Q92.4 -27.2 92.4 -21.7Q92.4 -15.2 89.2 -9.9Q86 -4.6 80.8 -1.5Q75.5 1.7 69.1 1.7Z","16.6,0.1 14.5,-3.3 13.3,-5 12.2,-6.7 11.2,-8.5 10.4,-10.3 9.7,-12.2 9.2,-14.2 8.8,-16.2 8.5,-18.2 8.4,-20.3 8.5,-22.3 8.8,-24.3 9.2,-26.3 9.9,-28.2 10.7,-30.1 11.8,-31.8 13,-33.5 14.3,-35 15.8,-36.4 17.4,-37.6 19.1,-38.7 20.9,-39.7 22.8,-40.4 24.8,-41 26.8,-41.4 28.8,-41.5 30.9,-41.4 32.9,-41.1 34.8,-40.5 36.7,-39.8 38.5,-38.9 40.3,-37.8 41.9,-36.6 43.4,-35.2 44.8,-33.7 46,-32.1 47.1,-30.4 47.9,-28.5 48.6,-26.6 49,-24.6 49.2,-22.6 49.3,-20.5 49.1,-18.5 48.8,-16.5 48.4,-14.5 47.8,-12.6 47.1,-10.7 46.3,-8.8 45.3,-7 44.3,-5.2 43.1,-3.6 41,-0.2","46.2,-25.3 50,-30.5 51,-32.2 52.2,-33.9 53.6,-35.4 55.1,-36.8 56.7,-38 58.4,-39.1 60.3,-40 62.2,-40.7 64.1,-41.2 66.1,-41.6 68.2,-41.7 70.2,-41.7 72.2,-41.4 74.2,-40.9 76.1,-40.3 78,-39.5 79.7,-38.5 81.4,-37.3 83,-36 84.4,-34.5 85.6,-32.9 86.6,-31.1 87.5,-29.3 88.1,-27.3 88.5,-25.4 88.7,-23.3 88.7,-21.3 88.6,-19.3 88.2,-17.3 87.7,-15.3 87,-13.4 86.1,-11.6 85,-9.8 83.8,-8.2 82.4,-6.8 80.8,-5.4 79.1,-4.3 77.3,-3.4 75.4,-2.6 73.4,-2.1 71.4,-1.9 69.4,-1.9 67.4,-2.1 62.4,-2.1"],["မ","M28.7 1.7Q22.3 1.7 16.9 -1.6Q11.6 -4.8 8.5 -10.4Q5.4 -16 5.4 -23.3Q5.4 -31.2 7.9 -36.2Q10.4 -41.2 14.7 -44.8L18.6 -39.5Q15.3 -36.3 13.6 -32.5Q11.9 -28.6 11.9 -23.6Q11.9 -20 13.2 -16.8Q16.7 -20.1 20.8 -21.4Q24.9 -22.8 28.7 -22.8Q32.6 -22.8 36.7 -21.5Q40.7 -20.2 44.2 -16.8Q45.5 -19.7 45.5 -23.6Q45.5 -28.6 43.8 -32.4Q42 -36.2 39 -39.5L42.8 -44.8Q47.2 -41.2 49.6 -36.2Q52.1 -31.2 52.1 -23.3Q52.1 -16 48.9 -10.4Q45.8 -4.8 40.5 -1.6Q35.3 1.7 28.7 1.7ZM28.7 -4.9Q36.7 -4.9 41.7 -11.2Q38.3 -14.5 34.8 -15.6Q31.3 -16.8 28.7 -16.8Q26.3 -16.8 22.8 -15.6Q19.3 -14.5 15.9 -11.1Q18.1 -8.2 21.4 -6.5Q24.8 -4.9 28.7 -4.9Z","15.1,-45.2 14.5,-43.3 14.2,-41.4 13.5,-39.5 12.6,-37.7 11.6,-36 10.6,-34.2 9.8,-32.4 9.2,-30.5 8.8,-28.5 8.5,-26.5 8.5,-24.5 8.6,-22.5 8.9,-20.5 9.4,-18.6 10,-16.6 10.6,-14.7 11.4,-12.9 12.3,-11.1 13.3,-9.4 14.6,-7.8 16,-6.4 17.6,-5.2 19.4,-4.2 21.2,-3.4 23.1,-2.7 25.1,-2.3 27.1,-2 29.1,-1.9 31.1,-2 33,-2.3 35,-2.8 36.9,-3.5 38.6,-4.5 40.3,-5.6 41.7,-7 43,-8.5 44,-10.3 44.8,-12.1","42,-44.7 42.9,-42.4 43.6,-40.5 44.4,-38.7 45.2,-36.8 46,-35 46.8,-33.1 47.4,-31.2 48,-29.2 48.4,-27.2 48.6,-25.2 48.7,-23.2 48.5,-21.2 48.1,-19.2 47.5,-17.3 46.6,-15.5 45.5,-13.8","7.8,-10.6 12.4,-13.6 14,-14.8 15.7,-15.9 17.5,-16.9 19.4,-17.8 21.3,-18.5 23.3,-19 25.3,-19.4 27.3,-19.6 29.4,-19.7 31.4,-19.5 33.4,-19.2 35.4,-18.7 37.4,-18 39.3,-17.2 41.1,-16.3 42.8,-15.2 44.5,-14 49.6,-10.9"],["ဝ","M28.3 1.7Q22.2 1.7 16.9 -1.5Q11.7 -4.7 8.5 -10Q5.4 -15.2 5.4 -21.7Q5.4 -28 8.4 -33.3Q11.5 -38.7 16.7 -41.8Q22 -45 28.2 -45Q34.6 -45 39.7 -41.8Q44.9 -38.7 48 -33.3Q51.2 -28 51.2 -21.7Q51.2 -15.2 48 -10Q44.9 -4.7 39.7 -1.5Q34.6 1.7 28.3 1.7ZM28.2 -4.9Q32.7 -4.9 36.4 -7.2Q40.1 -9.5 42.4 -13.3Q44.6 -17.1 44.6 -21.7Q44.6 -26.3 42.4 -30.1Q40.1 -33.9 36.4 -36.2Q32.7 -38.5 28.3 -38.5Q23.6 -38.5 19.9 -36.2Q16.2 -33.9 14.1 -30.1Q11.9 -26.3 11.9 -21.7Q11.9 -17.1 14.1 -13.3Q16.2 -9.5 19.9 -7.2Q23.6 -4.9 28.2 -4.9Z","18.2,-4.4 16.5,-5.5 14.9,-6.8 13.6,-8.3 12.3,-9.9 11.3,-11.7 10.4,-13.5 9.7,-15.4 9.2,-17.4 8.8,-19.4 8.6,-21.4 8.7,-23.4 8.9,-25.5 9.3,-27.4 9.9,-29.4 10.7,-31.2 11.7,-33 13,-34.6 14.4,-36.1 16,-37.4 17.6,-38.5 19.4,-39.5 21.3,-40.3 23.2,-40.9 25.2,-41.3 27.2,-41.6 29.3,-41.6 31.3,-41.5 33.3,-41.1 35.2,-40.5 37.1,-39.7 38.8,-38.6 40.4,-37.3 41.9,-35.9 43.2,-34.4 44.3,-32.7 45.3,-30.9 46.1,-29.1 46.8,-27.2 47.2,-25.2 47.5,-23.2 47.6,-21.1 47.4,-19.1 47.1,-17.1 46.6,-15.1 45.8,-13.2 44.9,-11.4 43.7,-9.8 42.4,-8.2 40.9,-6.8 39.3,-5.6 37.6,-4.5 35.8,-3.6 33.9,-2.9 31.9,-2.4 29.9,-2 27.9,-1.9 25.9,-2 23.9,-2.3 21.9,-2.7 20,-3.4 18.2,-4.4"],["လ","M27.8 1.7Q21.4 1.7 16.3 -1.5Q11.2 -4.7 8.3 -10Q5.4 -15.2 5.4 -21.7Q5.4 -28 8.3 -33.3Q11.2 -38.7 16.3 -41.8Q21.4 -45 27.8 -45Q34.3 -45 38.9 -41.8Q43.6 -38.6 46.5 -33.3Q49.4 -27.9 50.5 -21.7Q51.9 -14.3 56.1 -9.6Q60.3 -4.9 66.8 -4.9Q71.3 -4.9 74.8 -7.2Q78.3 -9.5 80.4 -13.3Q82.4 -17.1 82.4 -21.7Q82.4 -26.3 80.4 -30.1Q78.3 -33.9 74.8 -36.2Q71.3 -38.5 66.8 -38.5Q64.3 -38.5 61.9 -37.4L59.1 -43.3Q60.8 -44.2 62.8 -44.6Q64.7 -45 66.8 -45Q72.9 -45 78 -41.9Q83 -38.8 86 -33.5Q89 -28.2 89 -21.7Q89 -15.2 86 -10Q83.1 -4.7 78.1 -1.5Q73.1 1.7 66.8 1.7Q59.9 1.7 55.2 -1.6Q50.5 -4.9 47.8 -10.2Q45 -15.5 43.8 -21.7Q42.3 -29.3 38.2 -33.9Q34.1 -38.5 27.8 -38.5Q23.3 -38.5 19.7 -36.2Q16.1 -33.9 14 -30.1Q11.9 -26.3 11.9 -21.7Q11.9 -17.1 14 -13.2Q16.1 -9.4 19.7 -7.1Q23.3 -4.9 27.8 -4.9Q29.1 -4.9 30.3 -5.1Q31.4 -5.4 32.4 -5.9L35.3 -0.1Q33.9 0.7 31.9 1.2Q30 1.7 27.8 1.7Z","34.5,-2.5 30,-2.4 28,-2.1 26,-2 24,-2.2 22,-2.7 20.2,-3.4 18.4,-4.3 16.7,-5.4 15.1,-6.6 13.7,-8.1 12.5,-9.6 11.4,-11.3 10.4,-13.1 9.7,-15 9.1,-16.9 8.8,-18.9 8.5,-20.9 8.5,-22.9 8.7,-24.9 9,-26.9 9.5,-28.8 10.2,-30.7 11.1,-32.5 12.3,-34.2 13.6,-35.7 15,-37 16.7,-38.2 18.4,-39.2 20.3,-40 22.2,-40.7 24.1,-41.2 26.1,-41.4 28.1,-41.5 30.1,-41.5 32.1,-41.1 34,-40.6 35.9,-39.8 37.6,-38.7 39.1,-37.4 40.4,-35.9 41.7,-34.3 42.7,-32.6 43.7,-30.8 44.5,-29 45.3,-27.1 46,-25.3 46.7,-23.4 47.3,-21.4 47.8,-19.5 48.4,-17.6 49,-15.7 49.7,-13.8 50.5,-11.9 51.5,-10.2 52.7,-8.6 54,-7.1 55.5,-5.7 57.2,-4.6 58.9,-3.6 60.8,-2.8 62.7,-2.3 64.7,-2.1 66.7,-2 68.7,-2.2 70.7,-2.5 72.6,-3.1 74.5,-3.9 76.3,-4.8 78,-5.9 79.5,-7.1 80.9,-8.6 82.2,-10.1 83.2,-11.9 84.1,-13.7 84.7,-15.6 85.2,-17.5 85.4,-19.5 85.5,-21.5 85.4,-23.6 85.2,-25.5 84.7,-27.5 84.1,-29.4 83.3,-31.2 82.3,-33 81.1,-34.6 79.8,-36.2 78.3,-37.5 76.7,-38.7 75,-39.8 73.2,-40.7 71.3,-41.3 69.3,-41.7 67.3,-42 65.3,-41.9 63.3,-41.7 59.3,-41.7"],["အ","M62.7 1.8Q59.3 1.8 56.4 1Q53.6 0.2 51.7 -1Q51.9 -7.2 55 -12.4Q58.2 -17.6 63.4 -20.7Q68.6 -23.7 74.8 -23.7Q77.7 -23.7 80.8 -22.9L80.1 -16.3Q77.4 -17.1 74.9 -17.1Q69.2 -17.1 64.7 -13.6Q60.3 -10.2 58.8 -5.1Q60.7 -4.6 62.7 -4.6Q67.3 -4.6 71.1 -6.9Q74.9 -9.2 77.1 -13Q79.4 -16.8 79.4 -21.4Q79.4 -26 77.1 -29.8Q74.9 -33.7 70.9 -36Q67 -38.3 62 -38.3Q56.5 -38.3 52.2 -35.3Q47.9 -32.3 45.9 -27.9L39.9 -30.1Q41.7 -34.3 45 -37.6Q48.2 -40.9 52.6 -42.9Q56.9 -44.8 61.9 -44.8Q68.8 -44.8 74.2 -41.7Q79.6 -38.5 82.8 -33.2Q85.9 -27.8 85.9 -21.4Q85.9 -14.9 82.8 -9.7Q79.7 -4.5 74.4 -1.4Q69.1 1.8 62.7 1.8ZM26 1.7Q15.8 1.7 10.6 -2Q5.4 -5.7 5.4 -11.4L11.5 -13.7Q11.5 -8.8 15.4 -6.8Q19.3 -4.9 26 -4.9Q29.6 -4.9 32.9 -5.6Q36.1 -6.2 38.2 -7.9Q40.2 -9.5 40.2 -12.3Q40.2 -14.6 38 -16Q35.8 -17.4 32.8 -18Q29.8 -18.6 27.1 -18.7V-24.6Q29.8 -24.8 32.8 -25.3Q35.8 -25.9 38 -27.2Q40.2 -28.6 40.2 -31.1Q40.2 -33.8 38.2 -35.4Q36.1 -37 32.9 -37.7Q29.6 -38.5 26 -38.5Q19 -38.5 15.3 -36.3Q11.5 -34.1 11.5 -29.6L5.4 -31.9Q5.4 -37.6 10.6 -41.3Q15.9 -45 26 -45Q35.1 -45 40 -41.9Q45 -38.9 46.5 -34.5Q47.2 -30.3 45.5 -26.8Q43.8 -23.3 39.6 -21.7Q43 -20.5 44.8 -17.9Q46.7 -15.3 46.7 -12.3Q46.7 -7.4 43.8 -4.3Q41 -1.3 36.3 0.2Q31.6 1.7 26 1.7Z","6.5,-30.9 9,-34 9.9,-35.9 11.1,-37.4 12.7,-38.7 14.4,-39.7 16.3,-40.4 18.2,-40.9 20.2,-41.3 22.2,-41.6 24.1,-41.9 26.1,-42 28.1,-42 30.1,-41.8 32.1,-41.5 34.1,-41 35.9,-40.3 37.8,-39.4 39.5,-38.4 41,-37.1 42.2,-35.5 43,-33.7 43.2,-31.7 42.8,-29.8 42,-27.9 40.8,-26.3 39.3,-25 37.9,-23.6 35.9,-22.2 33.9,-21.8 31.9,-21.7 29.9,-21.7 31.9,-21.7 33.9,-21.7 35.9,-21.7 37.1,-21.8 38,-20.1 39.5,-18.8 40.9,-17.4 42.1,-15.8 42.8,-13.9 43,-11.9 42.8,-10 41.9,-8.1 40.7,-6.6 39.2,-5.3 37.5,-4.2 35.7,-3.4 33.8,-2.7 31.8,-2.3 29.9,-1.9 27.9,-1.8 25.9,-1.8 23.9,-1.9 21.9,-2.1 19.9,-2.4 17.9,-2.9 16,-3.4 14.1,-4.1 12.3,-5 10.8,-6.2 9.5,-7.7 8.6,-9.5 6.1,-12.6","39.7,-31.7 44.8,-34.8 46.5,-35.8 48.2,-36.9 50,-37.9 51.8,-38.8 53.6,-39.7 55.5,-40.4 57.5,-41 59.5,-41.4 61.5,-41.6 63.5,-41.5 65.5,-41.3 67.5,-41 69.5,-40.4 71.4,-39.6 73.1,-38.7 74.8,-37.5 76.3,-36.1 77.6,-34.6 78.8,-32.9 79.8,-31.2 80.6,-29.3 81.2,-27.4 81.7,-25.4 82,-23.4 82.1,-21.4 82,-19.3 81.8,-17.3 81.3,-15.3 80.7,-13.4 79.8,-11.6 78.8,-9.8 77.5,-8.2 76.1,-6.8 74.5,-5.5 72.9,-4.4 71.1,-3.4 69.2,-2.6 67.2,-2 65.3,-1.6 63.2,-1.4 61.2,-1.5 59.3,-2.1 57.6,-3.3 56.6,-5 56.4,-7 56.8,-9 57.6,-10.9 58.7,-12.6 59.9,-14.2 61.4,-15.6 63,-16.9 64.7,-17.9 66.5,-18.8 68.4,-19.4 70.4,-19.8 72.5,-20.1 74.5,-20.3 76.5,-20.5 78.5,-20.9 80.4,-21.6 82.1,-22.6 86.3,-24.2"]];  // [letter, Padauk Book outline (SIL OFL), hidden strokes...]
// Learn Burmese tile = an Ask MCC chat. The question types itself, the lantern thinks, the reply streams in,
// then three things the Learn page does are listed, and a pane previews each in turn: a letter written in ink,
// a name spelled in Burmese, and a phrase "spoken" over a voice-note waveform. Hover a row to jump to it.
const LC_LETTERS = [0, 1, 3, 4];                 // BENTO_LEARN entries used (က မ လ အ; ဝ looked like a loading spinner)
const LC_ROMAN = ["ka", "ma", "la", "a"];
const LC_NAMES = [["ဆာရာ", "Sarah"], ["ကီဗင်", "Kevin"], ["အမ်မာ", "Emma"], ["အောင်", "Aung"]];
const LC_HELLO = [["မင်္", "min"], ["ဂ", "ga"], ["လာ", "la"], ["ပါ", "ba"]];
function initBentoLearn() {
  const tile = document.getElementById("js-bento-learn");
  if (!tile || tile.dataset.ready) return;
  tile.dataset.ready = "1";
  const NS = "http://www.w3.org/2000/svg";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LANTERN = '<svg viewBox="14 8 36 48" width="18" height="24" aria-hidden="true"><circle class="lt-halo" cx="32" cy="33" r="27"/><g class="lt-body"><line x1="32" y1="2" x2="32" y2="14" stroke="#C08A2E" stroke-width="3"/><rect x="24" y="13" width="16" height="4" rx="1" fill="#C08A2E"/><ellipse cx="32" cy="33" rx="15" ry="16" fill="#AE3628"/><ellipse class="lt-glow" cx="32" cy="33" rx="8.5" ry="10.5"/><path class="lt-flame" d="M32 30c-3 4-3 8 0 9.5 3-1.5 3-5.5 0-9.5z"/><path d="M32 17v32M24 19c-4 9-4 19 0 28M40 19c4 9 4 19 0 28" stroke="#7A2418" stroke-width="1.6" fill="none"/><rect x="24" y="48" width="16" height="4" rx="1" fill="#C08A2E"/><path d="M29 52l-2 8M32 52v9M35 52l2 8" stroke="#C08A2E" stroke-width="2"/></g></svg>';
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
  const Q = "How do I learn Burmese?", INTRO = "You're in the right place to start!";
  const ITEMS = [["learn.html#lb-chart", "Learn the 33 alphabets"], ["learn.html#name", "Write your name"], ["learn.html#say", "Say any phrase"]];
  const kicker = typeof t === "function" ? t("bento_learn_kicker") : "Learn Burmese";

  /* time: every wait/animation belongs to a "life" that can be stopped */
  function lifeFor() {
    const life = { alive: true, timers: [], rafs: [], ac: new AbortController() };
    life.wait = ms => new Promise((res, rej) => { life.timers.push(setTimeout(() => life.alive ? res() : rej("stop"), ms)); });
    life.anim = (ms, fn) => new Promise((res, rej) => {
      const t0 = performance.now();
      const step = now => { if (!life.alive) return rej("stop"); const k = Math.max(0, Math.min(1, (now - t0) / ms)); fn(k); if (k < 1) life.rafs.push(requestAnimationFrame(step)); else res(); };
      life.rafs.push(requestAnimationFrame(step));
    });
    life.stop = () => { life.alive = false; life.timers.forEach(clearTimeout); life.rafs.forEach(cancelAnimationFrame); life.ac.abort(); };
    return life;
  }
  const quiet = p => p.catch(e => { if (e !== "stop") console.error(e); });

  /* FINAL animations (js/learn-bands.js, made by hand in the MCC Stroke Trainer): the bands of a letter, or null.
     Each band = two matching borders a[k], b[k] plus m[k], the distance along its middle. Do not regenerate. */
  function finalBands(ch) {
    const B = window.MCC_BANDS; if (!B) return null;
    const r = Object.values(B).find(v => v.ch === ch); if (!r) return null;
    const pp = t => t.split(" ").map(q => q.split(",").map(Number));
    return r.bands.map(bd => {
      const a = pp(bd.a), b = pp(bd.b), m = [0];
      for (let k = 1; k < a.length; k++) m.push(m[k - 1] + Math.hypot((a[k][0] + b[k][0] - a[k - 1][0] - b[k - 1][0]) / 2, (a[k][1] + b[k][1] - a[k - 1][1] - b[k - 1][1]) / 2));
      return { a, b, m, len: m[m.length - 1] };
    });
  }
  const BAND_SPEED = 45, BAND_GAP = 420;      // units a second; ms between bands (as in the trainer)
  /* a letter that writes itself: the Padauk outline revealed by its hidden strokes, in writing order */
  function inkLetter(li) {
    const mk = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const uid = "lcl" + li + "-" + Math.random().toString(36).slice(2, 6);
    const [, d, ...raw] = BENTO_LEARN[li], S = raw.map(s => s.split(" ").map(p => p.split(",").map(Number)));
    let x0 = 1e9, x1 = -1e9; S.forEach(st => st.forEach(p => { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); }));
    const svg = mk("svg", { class: "ink-l", viewBox: `${x0 - 8} -54 ${x1 - x0 + 16} 62`, "aria-hidden": "true" });
    const defs = mk("defs", {}); svg.append(defs, mk("path", { class: "ghost", d }));
    const lines = S.map((st, i) => {
      const m = mk("mask", { id: uid + "-" + i, maskUnits: "userSpaceOnUse", x: -60, y: -90, width: 260, height: 140 });
      const pl = mk("polyline", { points: "", fill: "none", stroke: "#fff", "stroke-width": 9.7, "stroke-linecap": "round", "stroke-linejoin": "round" });
      m.appendChild(pl); defs.appendChild(m); svg.appendChild(mk("path", { class: "ink", d, mask: `url(#${uid}-${i})` })); return pl;
    });
    const tip = mk("circle", { class: "tip", r: 2.6, opacity: 0 }); svg.appendChild(tip);
    const BD = finalBands(BENTO_LEARN[li][0]);
    if (BD) {                                  // FINAL hand-made animation: fill the outline band by band, straight front edge
      svg.querySelectorAll("path.ink").forEach(p => p.remove());
      const els = BD.map(() => { const p = mk("path", { class: "ink", d: "" }); svg.insertBefore(p, tip); return p; });
      svg.write = async life => {
        for (let j = 0; j < BD.length; j++) {
          const { a, b, m, len } = BD[j], n = a.length - 1;
          await life.anim(len / BAND_SPEED * 1000, t => {
            const dist = t * len; let k = 0; while (k < n && m[k + 1] <= dist) k++;
            const f = k < n ? Math.max(0, Math.min(1, (dist - m[k]) / ((m[k + 1] - m[k]) || 1))) : 0;
            const lp = (p, q) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
            const fa = k < n ? lp(a[k], a[k + 1]) : a[n], fb = k < n ? lp(b[k], b[k + 1]) : b[n];
            const poly = a.slice(0, k + 1).concat([fa, fb], b.slice(0, k + 1).reverse());
            els[j].setAttribute("d", "M" + poly.map(p => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z");
            tip.setAttribute("cx", (fa[0] + fb[0]) / 2); tip.setAttribute("cy", (fa[1] + fb[1]) / 2); tip.setAttribute("opacity", 1);
          });
          await life.wait(j < BD.length - 1 ? BAND_GAP : 200);
        }
        tip.setAttribute("opacity", 0);
        els.forEach(p => p.remove()); svg.appendChild(mk("path", { class: "ink", d }));   // end on the plain outline
      };
      return svg;
    }
    svg.write = async life => {
      for (let si = 0; si < S.length; si++) {
        const st = S[si];
        await life.anim(st.length / 18 * 1000, k => {
          const pr = k * (st.length - 1), n = Math.floor(pr), f = pr - n, a = st.slice(0, n + 1);
          if (n < st.length - 1) a.push([st[n][0] + (st[n + 1][0] - st[n][0]) * f, st[n][1] + (st[n + 1][1] - st[n][1]) * f]);
          lines[si].setAttribute("points", (a.length > 1 ? a : [a[0], a[0]]).map(p => p.join(",")).join(" "));
          const e = a[a.length - 1]; tip.setAttribute("cx", e[0]); tip.setAttribute("cy", e[1]); tip.setAttribute("opacity", 1);
        });
        await life.wait(200);
      }
      tip.setAttribute("opacity", 0);
    };
    return svg;
  }

  /* the three previews; dur() = how long the pane should stay on it */
  function scenes() {
    const letter = (() => {
      let k = 0;
      const lens = LC_LETTERS.map(i => BENTO_LEARN[i].slice(2).reduce((s, st) => s + st.split(" ").length / 18 * 1000 + 200, 0));
      const lenOf = i => { const bd = finalBands(BENTO_LEARN[i][0]); return bd ? bd.reduce((s, b, j) => s + b.len / BAND_SPEED * 1000 + (j < bd.length - 1 ? BAND_GAP : 200), 0) : lens[LC_LETTERS.indexOf(i)]; };
      const el = document.createElement("div"); el.className = "scene off";
      return { el, dur: () => lenOf(LC_LETTERS[k]) + 300, async play(life) {
        if (el.busy) return; el.busy = true;
        try {
          el.innerHTML = ""; const svg = inkLetter(LC_LETTERS[k]); el.appendChild(svg);
          const g = document.createElement("span"); g.className = "gl"; g.textContent = LC_ROMAN[k]; g.style.cssText = "opacity:0;transition:opacity .4s"; el.appendChild(g);
          k = (k + 1) % LC_LETTERS.length;
          await svg.write(life); g.style.opacity = 1;
        } finally { el.busy = false; }
      } };
    })();
    const name = (() => {
      let k = 0;
      const el = document.createElement("div"); el.className = "scene across off";
      return { el, dur: () => 3200, async play(life) {
        const [m, e] = LC_NAMES[k]; k = (k + 1) % LC_NAMES.length;
        el.innerHTML = '<span class="gl">' + e + '</span><svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg><span class="mm big reveal-ink">' + m + "</span>";
        await life.wait(250); el.querySelector(".reveal-ink").classList.add("on");
      } };
    })();
    const say = (() => {
      const el = document.createElement("div"); el.className = "scene off";
      const N = 30, H = [];
      for (let k = 0; k < N; k++) { const u = k / (N - 1) * LC_HELLO.length, f = u - Math.floor(u); H.push(Math.round(5 + 15 * Math.pow(Math.sin(Math.PI * Math.min(.999, f)), 1.2) * (.75 + .25 * Math.sin(k * 2.3)))); }
      return { el, dur: () => 300 + LC_HELLO.length * 400 + 1500, async play(life) {
        el.innerHTML = '<span class="mm big">' + LC_HELLO.map(h => "<span>" + h[0] + "</span>").join("") + '</span><span class="wave">' +
          H.map(h => '<i style="height:' + h + 'px"></i>').join("") + '</span><span class="rom">' + LC_HELLO.map(h => "<span>" + h[1] + "</span>").join("") + "</span>";
        const bars = [...el.querySelectorAll(".wave i")], wave = el.querySelector(".wave"), rom = [...el.querySelectorAll(".rom span")], sy = [...el.querySelectorAll(".big span")];
        await life.wait(450); wave.classList.add("on");
        await life.anim(400 * LC_HELLO.length, k => {
          const pos = k * N, i = Math.min(LC_HELLO.length - 1, Math.floor(k * LC_HELLO.length));
          bars.forEach((b, j) => { b.classList.toggle("p", j < pos); b.classList.toggle("a", k < 1 && j >= pos - 3 && j < pos + 1); });
          sy.forEach((s, j) => s.className = k >= 1 ? "" : j === i ? "on" : j > i ? "dim" : "");
          rom.forEach((s, j) => s.className = k >= 1 || j < i ? "was" : j === i ? "on" : "");
        });
        wave.classList.remove("on");
      } };
    })();
    return [letter, name, say];
  }

  function build() {
    tile.innerHTML =
      '<div class="lc-top"><span class="t-kicker">' + kicker + '</span>' +
      '<button class="lc-again" type="button" aria-label="Ask again"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button>' +
      '<div class="m-u fx"><span class="q"></span><span class="car"></span></div></div>' +
      '<div class="m-b fx"><span class="lt">' + LANTERN + '</span><div class="bub"><div class="bub-hd"><span class="lt">' + LANTERN + '</span><p class="intro"></p></div>' +
      '<div class="body"><div class="split"><ol>' +
      ITEMS.map((it, i) => '<li><a class="row" href="' + it[0] + '"><span class="tx"><i>' + (i + 1) + '.</i> ' + it[1] + '</span>' + ARROW.replace("<svg ", '<svg class="go" ') + '<span class="prog"></span></a></li>').join("") +
      '</ol><div class="stage" aria-hidden="true"></div></div></div></div></div>';
  }

  /* the pane: one row at a time, waits for each preview to finish */
  function runPane(life) {
    const rows = [...tile.querySelectorAll(".row")], stage = tile.querySelector(".stage"), sc = scenes();
    stage.innerHTML = "";                     // drop the previews of an earlier run (else they stay stacked on top)
    sc.forEach(s => stage.appendChild(s.el));
    let act = -1, forced = -1;
    function show(r, ms) {
      rows.forEach((row, j) => {
        row.classList.toggle("act", j === r);
        const p = row.querySelector(".prog"); p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
        if (j === r && ms) p.style.animationDuration = ms + "ms";
      });
      sc.forEach((s, j) => s.el.classList.toggle("off", j !== r));
      act = r; quiet(sc[r].play(life));
    }
    rows.forEach((row, r) => {
      row.addEventListener("pointerenter", () => { forced = r; tile.classList.add("hold"); if (act !== r) show(r); }, { signal: life.ac.signal });
      row.addEventListener("pointerleave", () => { forced = -1; tile.classList.remove("hold"); }, { signal: life.ac.signal });
    });
    return async () => {
      let r = 0;
      while (life.alive) {
        if (forced < 0) { const ms = Math.max(3200, sc[r].dur() + 1400); show(r, ms); r = (r + 1) % rows.length; await life.wait(ms); }
        else { r = (forced + 1) % rows.length; await life.wait(300); }
      }
    };
  }

  let life = null, pane = null, visible = false, played = false;
  function startPane() { if (!visible || !played || pane) return; pane = lifeFor(); quiet(runPane(pane)()); }
  function stopPane() { if (pane) pane.stop(); pane = null; }
  async function play() {
    if (life) life.stop(); stopPane(); played = false; build(); tile.classList.remove("done");
    const $ = s => tile.querySelector(s);
    const user = $(".m-u"), q = $(".q"), bot = $(".m-b"), lts = [...tile.querySelectorAll(".lt")], intro = $(".intro"), body = $(".body"), lis = [...tile.querySelectorAll("li")];
    $(".lc-again").onclick = e => { e.preventDefault(); quiet(play()); };
    if (reduced) {
      q.textContent = Q; $(".car").remove(); intro.textContent = INTRO; [user, bot, body, ...lis].forEach(e => e.classList.add("in"));
      tile.classList.add("done"); played = true; startPane(); return;
    }
    life = lifeFor(); const L = life;
    await L.wait(250);
    user.classList.add("in");
    for (let i = 1; i <= Q.length; i++) { q.textContent = Q.slice(0, i); await L.wait(34 + (Q[i - 1] === " " ? 40 : 0)); }
    await L.wait(260); $(".car").remove();
    await L.wait(300);
    bot.classList.add("in"); lts.forEach(l => l.classList.add("think"));
    intro.innerHTML = '<span class="shim">Thinking…</span>';
    await L.wait(1200);
    lts.forEach(l => { l.classList.remove("think"); l.classList.add("lit"); }); intro.textContent = "";
    for (const w of INTRO.split(" ")) { const s = document.createElement("span"); s.className = "w"; s.textContent = w + " "; intro.appendChild(s); await L.wait(60); }
    await L.wait(150); body.classList.add("in");
    for (const li of lis) { li.classList.add("in"); await L.wait(170); }
    await L.wait(300);
    tile.classList.add("done"); played = true; startPane();
  }

  // cursor light over the tile
  tile.addEventListener("pointermove", e => { const r = tile.getBoundingClientRect(); tile.style.setProperty("--mx", (e.clientX - r.left) + "px"); tile.style.setProperty("--my", (e.clientY - r.top) + "px"); });
  if ("ResizeObserver" in window) new ResizeObserver(() => tile.classList.toggle("narrow", tile.clientWidth < 440)).observe(tile);
  else tile.classList.toggle("narrow", tile.clientWidth < 440);
  build();
  if (!("IntersectionObserver" in window)) { visible = true; quiet(play()); return; }
  new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible && !played && !life) quiet(play());
    if (visible) startPane(); else stopPane();
  }, { threshold: 0.5 }).observe(tile);
}

function initBentoIg() {
  const tile = document.querySelector(".t-ig");
  if (!tile || tile.querySelector(".ig-fx")) return;
  const fx = document.createElement("span");
  fx.className = "ig-fx"; fx.setAttribute("aria-hidden", "true");
  tile.insertBefore(fx, tile.firstChild);
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = 0, tapTimer = null;
  const at = e => { const b = tile.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const glowAt = (x, y) => { fx.style.setProperty("--mx", x + "px"); fx.style.setProperty("--my", y + "px"); };
  const spawn = (cls, x, y, vars) => {
    if (reduce) return;
    const el = document.createElement("span");
    el.className = cls; el.style.left = x + "px"; el.style.top = y + "px";
    for (const k in vars || {}) el.style.setProperty(k, vars[k]);
    fx.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  };
  const ember = (x, y) => spawn("ig-ember", x + Math.random() * 10 - 5, y + Math.random() * 10 - 5, {
    "--s": (5 + Math.random() * 7).toFixed(1) + "px", "--dx": (Math.random() * 30 - 15).toFixed(1) + "px",
    "--dy": (-40 - Math.random() * 60).toFixed(1) + "px", "--d": (0.9 + Math.random() * 0.8).toFixed(2) + "s" });
  const tap = (x, y) => {
    glowAt(x, y);
    tile.classList.add("is-tap");
    spawn("ig-ripple", x, y);
    for (let i = 0; i < 9; i++) {
      const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 50;
      spawn("ig-spark", x, y, { "--dx": (Math.cos(a) * r).toFixed(1) + "px", "--dy": (Math.sin(a) * r).toFixed(1) + "px" });
    }
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => tile.classList.remove("is-tap"), 900);
  };
  tile.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") { const [x, y] = at(e); tap(x, y); } });
  tile.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse") return; const [x, y] = at(e); glowAt(x, y); tile.classList.add("is-lit"); });
  tile.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const [x, y] = at(e); glowAt(x, y);
    const now = performance.now();
    if (now - last > 30) { last = now; ember(x, y); }
  });
  tile.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") tile.classList.remove("is-lit"); });
  // coming back from Instagram: make sure the tile is plain red again
  window.addEventListener("pageshow", () => tile.classList.remove("is-tap", "is-lit"));
}

function rerenderDynamicText() {
  try { renderBentoText(); } catch (err) { /* homepage only */ }
  // If the toggle is clicked before the CSVs finish loading, do nothing —
  // initSiteData's own render (moments later) will already pick up
  // whichever language is currently selected.
  if (!_dataLoaded) return;
  renderFeaturedEvent(_cachedNext);
  renderComingUp(_cachedRest);
  renderPastGallery(_cachedPast);
}

function pageUsesSiteData() {
  return ["js-event-visual", "js-event-body", "js-events-grid", "js-past-gallery", "js-hero-photos"]
    .some(id => document.getElementById(id));
}

function pendingEventAreas() {
  const card = document.getElementById("js-event-body");
  return [card && card.closest(".event-card"), document.getElementById("js-countdown"),
          document.getElementById("js-events-grid"), document.getElementById("js-past-gallery")]
    .filter(Boolean);
}

// Homepage, first visit: while the Sheet is on its way, the Next Event card shows a quiet skeleton in its
// own shape (styles in index.html). It fades away over the real card once the data is in.
function showEventSkeleton() {
  const body = document.getElementById("js-event-body");
  const card = body && body.closest("#event .event-card");
  if (!card || card.querySelector(".event-skel")) return;
  card.insertAdjacentHTML("beforeend",
    '<div class="event-skel" aria-hidden="true"><div class="sk-vis"></div><div class="sk-body">' +
    '<i style="width:28%"></i><i class="sk-h" style="width:72%"></i><i style="width:54%"></i>' +
    '<i style="width:94%"></i><i style="width:86%"></i><i style="width:60%"></i><i class="sk-btn"></i></div></div>');
}
function clearEventSkeleton() {
  document.querySelectorAll(".event-skel:not(.is-gone)").forEach(sk => {
    sk.classList.add("is-gone");
    setTimeout(() => sk.remove(), 500);
  });
}

function renderSiteData(eventRows, heroRows) {
  pendingEventAreas().forEach(el => el.removeAttribute("data-pending"));
  clearEventSkeleton();
  const { upcoming, past } = splitEvents(eventRows);
  let next = upcoming[0] || null;
  const rest = upcoming.slice(1);
  let pastForGallery = past;

  // See TESTING_SHOW_LATEST_EVENT_AS_NEXT above.
  if (!next && TESTING_SHOW_LATEST_EVENT_AS_NEXT && past.length) {
    next = past[0];
    pastForGallery = past.slice(1);
  }

  _cachedNext = next;
  _cachedRest = rest;
  _cachedPast = pastForGallery;
  _dataLoaded = true;

  // Each section draws on its own, so a problem in one never leaves the others blank.
  [() => renderFeaturedEvent(next), () => renderComingUp(rest),
   () => renderPastGallery(pastForGallery), () => renderHeroPhotos(heroRows), () => renderBento(past)]
    .forEach(draw => { try { draw(); } catch (err) { console.error("Section failed to draw:", err); } });

  ["js-event-visual", "js-events-grid", "js-past-gallery", "js-hero-photos"]
    .forEach(id => fadeInImages(document.getElementById(id)));

  // Runs after the dynamic sections above are in the DOM, so it picks up
  // their ".reveal" cards too, not just the ones already in the HTML.
  initScrollReveal();
}

// Photos that are already on hand show at once; ones still downloading fade in.
function fadeInImages(root) {
  if (!root) return;
  root.querySelectorAll("img").forEach(img => {
    if (img.complete && img.naturalWidth) return;
    img.classList.add("fade-img");
    const done = () => img.classList.add("is-loaded");
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

// The sticky nav gets a soft shadow once the page has scrolled under it.
function initNavShadow() {
  const nav = document.querySelector("header.nav");
  if (!nav) return;
  let ticking = false;
  const update = () => { nav.classList.toggle("scrolled", window.scrollY > 8); ticking = false; };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

async function initSiteData() {
  // Pages with no events or homepage photos don't need the Sheets at all.
  if (!pageUsesSiteData()) { initScrollReveal(); return; }

  // Safety net: never leave the event areas hidden if something below goes wrong.
  setTimeout(() => { pendingEventAreas().forEach(el => el.removeAttribute("data-pending")); clearEventSkeleton(); }, 6000);

  // Show this browser's last copy straight away (no waiting on Google)...
  const cachedEvents = readCachedCSV(EVENTS_CSV_URL);
  const cachedHero = readCachedCSV(HERO_CSV_URL);
  let shown = null;
  if (cachedEvents && cachedHero) {
    renderSiteData(safeParse(cachedEvents), safeParse(cachedHero));
    shown = cachedEvents + "\u0000" + cachedHero;
  } else {
    // First visit: hold the space for the events (rather than showing the placeholder ones
    // built into the page and swapping them) until the Sheet arrives.
    pendingEventAreas().forEach(el => el.setAttribute("data-pending", ""));
    showEventSkeleton();
    initScrollReveal();
  }

  // ...then refresh from the Sheets, and only re-draw if something changed.
  const [freshEvents, freshHero] = await Promise.all([
    fetchCSVText(EVENTS_CSV_URL),
    fetchCSVText(HERO_CSV_URL),
  ]);
  const eventsText = freshEvents || cachedEvents || FALLBACK_EVENTS_CSV;
  const heroText = freshHero || cachedHero || FALLBACK_HERO_CSV;
  if (eventsText + "\u0000" + heroText === shown) return;
  renderSiteData(safeParse(eventsText), safeParse(heroText));
}

/* ============================================================
   SNOWY NIGHT EASTER EGG
   ------------------------------------------------------------
   Type "snow" anywhere on the site (outside a text box), or add
   #snow to the end of any page's URL, and an animated ASCII
   scene fills the screen: snow falling on the CN Tower, Hart
   House + Soldiers' Tower and a Shwedagon-style pagoda, with
   the club's name brushed in Myanmar script. Esc / click closes
   it. The browser's dev console also gets a small hint.
   Reduced-motion visitors get the finished scene, no animation.
   ============================================================ */
function initSnowEasterEgg() {
  const W = 78, H = 26;                       // grid size; last row = ground
  const sprite = s => s.replace(/^\n|\n$/g, "").split("\n");

  const CN_TOWER = sprite(String.raw`
     |
     |
     |
     |
    _|_
   (___)
     |
     |
     |
   _/ \_
  /_____\
 (_______)
  \_____/
    | |
    | |
    | |
    | |
    | |
    | |
   /| |\
  / | | \
 /  | |  \
/___|_|___\
`);
  // Hart House (Collegiate Gothic) with Soldiers' Tower on its west end
  const HART_HOUSE = sprite(String.raw`
   ^   ^
  /|\_/|\
  |  #  |
  |_____|
  |  _  |  _   _   _   _   _   _   _   _
  | |#| |_| |_| |_| |_| |_| |_| |_| |_| |
  | |_| |   _     _    /\    _     _    |
  |  _  |  |#|   |#|  /  \  |#|   |#|   |
  | |#| |  |_|   |_| | /\ | |_|   |_|   |
  | |_| |   _     _  | || |  _     _    |
  |  _  |  |#|   |#| | || | |#|   |#|   |
  |_|_|_|__|_|___|_|_|_||_|_|_|___|_|___|
`);
  const PAGODA = sprite(String.raw`
     |
     ^
    /=\
    |*|
   /===\
  /_____\
  |=====|
 /=======\
/_________\
===========
`);
  const FONT = {
    M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
    C: [" ████", "█    ", "█    ", "█    ", " ████"],
  };
  const LOGO = [0, 1, 2, 3, 4].map(r =>
    ["M", "C", "C"].map(c => FONT[c][r]).join("  ").replace(/./g, ch => ch + ch));
  // "Myanmar Culture Club" in syllable clusters, so each is brushed in whole
  const BURMESE = ["မြန်", "မာ", " ", "ယဉ်", "ကျေး", "မှု", " ", "အ", "သင်း"];
  const SUB = "Myanmar Culture Club  ·  University of Toronto";
  const URL_TEXT = "uoftmcc.ca";

  const BUILDINGS = [{ art: CN_TOWER, x: 2, kind: "cn" },
                     { art: HART_HOUSE, x: 17, kind: "hart" },
                     { art: PAGODA, x: 66, kind: "pagoda" }];
  const LABELS = [["CN Tower", 7], ["Hart House", 39], ["Shwedagon", 71]];

  const NIGHT = "#12162A";
  const DAWN = ["#12162A", "#14193A", "#171C40", "#1B2046", "#20244D", "#262752", "#2D2A57",
    "#352C5B", "#3E2E5E", "#482F5F", "#53315F", "#5E325E", "#6A345C", "#76365A", "#823857",
    "#8E3B53", "#993E4F", "#A3424B", "#AD4747", "#B64D43", "#BE5440", "#C55B3D", "#CB633B",
    "#D06B3A", "#D4733A"];
  const GOLD = ["#B8862B", "#C99634", "#DAA63E", "#E8B84D", "#F2C960", "#F8DA7A", "#FCE79A",
    "#F8DA7A", "#F2C960", "#E8B84D", "#DAA63E", "#C99634"];
  const LEDS = ["#FF4A3D", "#FF8A3D", "#FFC23D", "#E8F04A", "#7CF06A", "#4AE3D6", "#4AA8FF",
    "#7A6BFF", "#C46BFF", "#FF6BD0"];
  const END = 200;                            // frame where the scene is "complete"

  const key = (x, y) => x + "," + y;
  const solid = new Set();                    // building cells snow can land on
  BUILDINGS.forEach(b => {
    const top = H - 1 - b.art.length;
    b.art.forEach((line, dy) => [...line].forEach((ch, dx) => {
      if (ch !== " ") solid.add(key(b.x + dx, top + dy));
    }));
  });

  function newState() {
    return {
      stars: Array.from({ length: 45 }, () =>
        [Math.floor(Math.random() * W), Math.floor(Math.random() * 13)]),
      flakes: [], settled: new Set(), ground: new Array(W).fill(0),
    };
  }

  // Builds one frame: a grid of [char, colour] plus where night meets dawn.
  function compose(t, st, snowing) {
    const g = Array.from({ length: H }, () => Array.from({ length: W }, () => [" ", null]));
    const put = (x, y, ch, c) => { if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = [ch, c]; };
    const cutoff = Math.max(0, H - Math.floor(t * H / 90));

    st.stars.forEach(([x, y]) => {
      if (y < cutoff) put(x, y, Math.random() < 0.3 ? ".·*+"[Math.floor(Math.random() * 4)] : "·", "#F6F1E4");
    });

    if (snowing) {
      const n = t < 30 ? 2 : 4;
      for (let i = 0; i < n; i++) {
        st.flakes.push({ x: Math.random() * (W - 1), y: 0, vy: 0.25 + Math.random() * 0.35,
                         ph: Math.random() * 6.3, ch: "*··.+"[Math.floor(Math.random() * 5)] });
      }
    }
    st.flakes = st.flakes.filter(f => {
      f.y += f.vy;
      f.x = Math.min(W - 1, Math.max(0, f.x + 0.35 * Math.sin(t * 0.12 + f.ph)));
      const x = Math.round(f.x), y = Math.floor(f.y);
      if (y + 1 >= H - 1) { st.ground[x]++; return false; }
      if (solid.has(key(x, y + 1)) || st.settled.has(key(x, y + 1))) {
        if (!solid.has(key(x, y)) && solid.has(key(x, y + 1))) st.settled.add(key(x, y));
        return false;
      }
      put(x, y, f.ch, f.ch === "*" ? "#FFFFFF" : "#C9D2EA");
      return true;
    });

    BUILDINGS.forEach(b => {
      const top = H - 1 - b.art.length;
      b.art.forEach((line, dy) => [...line].forEach((ch, dx) => {
        if (ch === " ") return;
        let c;
        if (b.kind === "cn") {
          if (dy === 0) c = Math.floor(t / 8) % 2 ? "#FF4A3D" : "#5A1A16";   // antenna beacon
          else if ([5, 10, 11, 12].includes(dy)) c = LEDS[(Math.floor(t / 3) + dx) % LEDS.length];
          else c = "#D6D9E0";
        } else if (b.kind === "hart") {
          if (ch === "#") c = (dx * 7 + dy * 3) % 90 < t ? "#FFE28A" : "#4A3A22"; // lights come on
          else c = ch === "^" ? "#F6E3C0" : "#E3C79A";
        } else {
          c = "*^".includes(ch) ? "#FFE27A" : "#F2B632";
        }
        put(b.x + dx, top + dy, ch, c);
      }));
    });
    st.settled.forEach(k => { const [x, y] = k.split(",").map(Number); put(x, y, "▄", "#FFFFFF"); });

    const lx = Math.floor((W - LOGO[0].length) / 2);
    const reveal = Math.max(0, (t - 10) * 2);
    LOGO.forEach((line, dy) => [...line.slice(0, reveal)].forEach((ch, dx) => {
      if (ch !== " ") put(lx + dx, 1 + dy, ch, GOLD[(((dx + dy - t) % GOLD.length) + GOLD.length) % GOLD.length]);
    }));

    const sx = Math.floor((W - SUB.length) / 2);
    [...SUB.slice(0, Math.max(0, t - 110))].forEach((ch, i) => put(sx + i, 9, ch, "#F6F1E4"));
    if (t > 160) {
      const ux = Math.floor((W - URL_TEXT.length) / 2);
      [...URL_TEXT].forEach((ch, i) => put(ux + i, 10, ch, Math.floor(t / 6) % 2 ? "#E8B84D" : "#FCE79A"));
    }
    return { g, cutoff };
  }

  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function toHTML({ g, cutoff }, st) {
    let html = "";
    const run = (text, style) => (style ? `<span style="${style}">${esc(text)}</span>` : esc(text));
    g.forEach((row, y) => {
      const bg = y < cutoff ? NIGHT : DAWN[Math.min(y, DAWN.length - 1)];
      html += `<span class="snowegg-row" style="background:${bg}">`;
      let cur = null, buf = "";
      row.forEach(([ch, c]) => {
        if (c !== cur) { if (buf) html += run(buf, cur && `color:${cur}`); buf = ""; cur = c; }
        buf += ch;
      });
      html += run(buf, cur && `color:${cur}`) + "</span>";
    });
    const ground = new Array(W).fill(" ");
    LABELS.forEach(([text, cx]) => [...text].forEach((ch, i) => { ground[cx - Math.floor(text.length / 2) + i] = ch; }));
    html += `<span class="snowegg-row">`;
    let cur = null, buf = "";
    ground.forEach((ch, x) => {
      const s = st.ground[x] >= 3 ? "background:#F4F6FB;color:#1C2440" : "background:#2F5226;color:#CFE6C2";
      if (s !== cur) { if (buf) html += run(buf, cur); buf = ""; cur = s; }
      buf += ch;
    });
    return html + run(buf, cur) + "</span>";
  }

  function plainText({ g }) {
    return g.map(row => row.map(c => c[0]).join("").replace(/\s+$/, "")).join("\n");
  }

  // Dev-console hello for anyone who peeks under the hood.
  try {
    console.log("%c" + plainText(compose(END, { stars: [], flakes: [], settled: new Set(), ground: [] }, false)),
      "font-family:monospace;color:#C08A2E;line-height:1.1");
    console.log("%cမင်္ဂလာပါ! Psst — type \"snow\" anywhere on the site. ❄", "font-weight:bold;color:#1C2440");
  } catch (_) { /* console unavailable — no big deal */ }

  let overlay = null;

  function open() {
    if (overlay) return;
    if (!document.getElementById("snowegg-style")) {
      const style = document.createElement("style");
      style.id = "snowegg-style";
      style.textContent = `
        .snowegg{position:fixed;inset:0;z-index:10000;background:#0B0E1C;display:flex;
          flex-direction:column;align-items:center;justify-content:center;gap:14px;
          padding:16px;cursor:pointer;opacity:0;transition:opacity .4s ease}
        .snowegg.is-open{opacity:1}
        .snowegg-stage{position:relative;font-size:min(15px, calc((100vw - 32px) / 47.5));
          border-radius:10px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .snowegg-pre{margin:0;font:inherit;font-family:ui-monospace,Menlo,Consolas,monospace;
          line-height:1.15;font-weight:600;color:#F6F1E4;white-space:pre}
        .snowegg-row{display:block}
        .snowegg-mm{position:absolute;left:0;right:0;top:calc(6.55 * 1.15em);text-align:center;
          color:#F2C960;font-size:1.45em;line-height:1.2;white-space:nowrap;pointer-events:none;
          text-shadow:0 0 12px rgba(242,201,96,.45)}
        .snowegg-brush{color:#FFFFFF;margin-left:.1em}
        .snowegg-hint{margin:0;color:rgba(246,241,228,.6);font:500 13px 'Work Sans',system-ui,sans-serif}
        @media (prefers-reduced-motion: reduce){.snowegg{transition:none}}`;
      document.head.appendChild(style);
    }

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const returnFocus = document.activeElement;
    const prevOverflow = document.documentElement.style.overflow;

    overlay = document.createElement("div");
    overlay.className = "snowegg";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label",
      "Easter egg: an ASCII-art snowy night over the CN Tower, Hart House and a pagoda, with the words Myanmar Culture Club");
    overlay.tabIndex = -1;
    overlay.innerHTML =
      `<div class="snowegg-stage" aria-hidden="true"><pre class="snowegg-pre"></pre>` +
      `<div class="snowegg-mm myanmar" lang="my"></div></div>` +
      `<p class="snowegg-hint">You found it ❄ — press Esc or click anywhere to close</p>`;
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";
    overlay.focus();
    requestAnimationFrame(() => overlay && overlay.classList.add("is-open"));

    const pre = overlay.querySelector(".snowegg-pre");
    const mm = overlay.querySelector(".snowegg-mm");
    const st = newState();
    let t = 0, timer = null;

    function draw() {
      pre.innerHTML = toHTML(compose(t, st, !reduce), st);
      const shown = Math.max(0, Math.floor((t - 55) / 6));
      mm.innerHTML = esc(BURMESE.slice(0, shown).join("")) +
        (shown > 0 && shown <= BURMESE.length ? `<span class="snowegg-brush">~</span>` : "");
    }

    if (reduce) { t = END; draw(); }
    else timer = setInterval(() => { draw(); t++; }, 50);   // keeps snowing until closed

    function close() {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey, true);
      document.documentElement.style.overflow = prevOverflow;
      overlay.remove();
      overlay = null;
      if (location.hash === "#snow") history.replaceState(null, "", location.pathname + location.search);
      if (returnFocus && returnFocus.focus) returnFocus.focus();
    }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") e.preventDefault();          // keep focus in the dialog
    }
    document.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", close);
  }

  // Secret word: "snow", typed anywhere that isn't a form field.
  let typed = "";
  document.addEventListener("keydown", e => {
    if (overlay || e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    const el = (e.composedPath && e.composedPath()[0]) || e.target;   // sees inside Ask MCC's shadow root
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed === "snow") { typed = ""; open(); }
  });

  // ...or a link ending in #snow (handy on phones, which have no keyboard).
  if (location.hash === "#snow") open();
  window.addEventListener("hashchange", () => { if (location.hash === "#snow") open(); });
}

/* ============================================================
   FALLING LEAVES (homepage, autumn only)
   ------------------------------------------------------------
   A one-time moment, not a constant effect: shortly after the
   homepage loads, five leaves (red maple, gold ginkgo, green
   birch) drift down, land at the bottom of the screen, rest
   for a beat and fade away. Nothing new falls after that, and
   it plays once per visit (sessionStorage), so going back to
   the homepage doesn't repeat it. Sept–Nov, Toronto time only.
   Skipped for reduced-motion visitors and on every other page.
   Add ?leaves to the homepage URL to replay it any time of year
   (?leaves=off hides it).
   ============================================================ */
function initFallingLeaves() {
  const param = new URLSearchParams(location.search).get("leaves");
  if (param === "off") return;
  if (!/(^|\/)(index\.html)?$/.test(location.pathname)) return;   // homepage only
  const month = Number(new Intl.DateTimeFormat("en-CA",
    { timeZone: "America/Toronto", month: "numeric" }).format(new Date())); // 1–12
  const forced = param !== null;
  if (!forced && (month < 9 || month > 11)) return;
  const SEEN = "mcc_leaves_seen";
  try { if (!forced && sessionStorage.getItem(SEEN)) return; sessionStorage.setItem(SEEN, "1"); } catch (_) {}
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof Path2D === "undefined") return;

  // Leaf shapes in a 100×100 box: outline, veins (clipped to the outline),
  // stem, and one colour per type: red maple, gold ginkgo, green birch.
  const SHAPES = [
    { // maple: five pointed lobes, veins fanning from the base
      body: new Path2D("M50 6 L57 23 L66 18 L63 39 L80 27 L77 37 L94 39 L84 51 L90 55 L68 66 L71 76 L53 72 L50 76 L47 72 L29 76 L32 66 L10 55 L16 51 L6 39 L23 37 L20 27 L37 39 L34 18 L43 23 Z"),
      veins: new Path2D("M50 74 L50 10 M50 68 L9 40 M50 68 L91 40 M50 68 L14 54 M50 68 L86 54 M50 40 L35 22 M50 40 L65 22"),
      stem: new Path2D("M50 77.5 L50 96"),
      colour: "#AE3628",
    },
    { // ginkgo: fan with a notch at the top, fine radiating veins
      body: new Path2D("M50 68 C44 58 22 44 8 30 C14 18 30 10 46 12 C48 16 49 22 50 26 C51 22 52 16 54 12 C70 10 86 18 92 30 C78 44 56 58 50 68 Z"),
      veins: new Path2D("M50 68 L12 30 M50 68 L20 22 M50 68 L30 15 M50 68 L40 12 M50 68 L47 14 M50 68 L53 14 M50 68 L60 12 M50 68 L70 15 M50 68 L80 22 M50 68 L88 30"),
      stem: new Path2D("M50 69.5 L50 96"),
      colour: "#DAA63E",
    },
    { // birch: ovate, finely toothed, straight parallel side veins
      body: new Path2D("M50 8 L48.8 9.8 L47.7 11.5 L45.7 13.2 L44.9 15.0 L42.5 16.8 L42.1 18.5 L39.4 20.2 L39.2 22.0 L36.6 23.8 L36.4 25.5 L33.8 27.2 L33.7 29.0 L31.2 30.8 L31.1 32.5 L28.7 34.2 L28.7 36.0 L26.3 37.8 L26.4 39.5 L24.1 41.2 L24.3 43.0 L22.2 44.8 L22.6 46.5 L20.6 48.2 L21.1 50.0 L19.2 51.8 L19.9 53.5 L18.3 55.2 L19.2 57.0 L17.8 58.8 L19.0 60.5 L17.9 62.2 L19.5 64.0 L18.8 65.8 L20.8 67.5 L20.8 69.2 L23.5 71.0 L24.4 72.8 L28.6 74.5 L32.1 76.2 L50.0 78.0 L50.0 78.0 L67.9 76.2 L71.4 74.5 L75.6 72.8 L76.5 71.0 L79.2 69.2 L79.2 67.5 L81.2 65.8 L80.5 64.0 L82.1 62.2 L81.0 60.5 L82.2 58.8 L80.8 57.0 L81.7 55.2 L80.1 53.5 L80.8 51.8 L78.9 50.0 L79.4 48.2 L77.4 46.5 L77.8 44.8 L75.7 43.0 L75.9 41.2 L73.6 39.5 L73.7 37.8 L71.3 36.0 L71.3 34.2 L68.9 32.5 L68.8 30.8 L66.3 29.0 L66.2 27.2 L63.6 25.5 L63.4 23.8 L60.8 22.0 L60.6 20.2 L57.9 18.5 L57.5 16.8 L55.1 15.0 L54.3 13.2 L52.3 11.5 L51.2 9.8 Z"),
      veins: new Path2D("M50 78 L50 12 M50 33.6 L35.5 23.6 M50 33.6 L64.5 23.6 M50 42.0 L29.7 32.0 M50 42.0 L70.3 32.0 M50 50.4 L24.9 40.4 M50 50.4 L75.1 40.4 M50 58.8 L21.6 48.8 M50 58.8 L78.4 48.8 M50 67.2 L20.6 57.2 M50 67.2 L79.4 57.2 M50 74.9 L23.1 64.9 M50 74.9 L76.9 64.9"),
      stem: new Path2D("M50 79.5 L50 96"),
      colour: "#4B7A3C",
    },
  ];

  const canvas = document.createElement("canvas");
  canvas.className = "falling-leaves";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0, dpr = 1;
  const rand = (a, b) => a + Math.random() * (b - a);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  }
  resize();

  // Five leaves: two maples, two ginkgos, one birch, each in its own lane across
  // the screen so they don't clump, released one after another over ~2.5s.
  const kinds = [0, 1, 2, 0, 1].sort(() => Math.random() - 0.5);
  const lanes = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
  const DELAY = 900;                                    // let the hero settle first
  const leaves = kinds.map((k, i) => ({
    shape: SHAPES[k],
    x: (lanes[i] + rand(0.25, 0.75)) * w / 5,
    y: rand(-70, -30), born: DELAY + i * rand(380, 620),
    size: rand(20, 30), vy: rand(1.1, 1.5),
    sway: rand(20, 42), swaySpeed: rand(0.018, 0.03), phase: rand(0, Math.PI * 2),
    rot: rand(0, Math.PI * 2), spin: rand(-0.02, 0.02), flip: rand(0.02, 0.04),
    alpha: rand(0.8, 0.92), landed: 0, done: false,
  }));

  function draw(L, x, y, angle, sx, alpha) {
    const s = L.size / 100;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(s * sx, s);
    ctx.translate(-50, -50);
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.strokeStyle = ctx.fillStyle = L.shape.colour;
    ctx.lineWidth = 3.2;
    ctx.stroke(L.shape.stem);
    ctx.fill(L.shape.body);
    ctx.save();
    ctx.clip(L.shape.body);
    ctx.strokeStyle = "rgba(40,20,10,0.28)";
    ctx.lineWidth = 1.3;
    ctx.stroke(L.shape.veins);
    ctx.restore();
    ctx.restore();
  }

  const HOLD = 1600, FADE = 1100;                       // ms resting on the ground, then fading
  let raf = 0, last = 0, clock = 0;
  function frame(now) {
    const dt = last ? Math.min(now - last, 50) : 16.7;   // frame-rate independent
    last = now; clock += dt;
    const step = dt / 16.7;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    leaves.forEach(L => {
      if (L.done || clock < L.born) return;
      const t = (clock - L.born) / 16.7;
      if (!L.landed) {
        L.y += L.vy * step;
        L.rot += L.spin * step;
        L.cx = L.x + Math.sin(t * L.swaySpeed + L.phase) * L.sway;
        L.angle = L.rot + Math.sin(t * L.swaySpeed + L.phase) * 0.6;
        L.sx = Math.cos(t * L.flip + L.phase);                 // tumbling in 3D
        const ground = h - L.size * 0.32;
        if (L.y >= ground) {                                    // touch down
          L.y = ground; L.landed = clock;
          L.restAngle = (Math.random() < 0.5 ? -1 : 1) * Math.PI / 2 + rand(-0.35, 0.35);
          L.fromAngle = L.angle; L.fromSx = L.sx;
          L.restSx = L.sx < 0 ? -1 : 1;
        }
        draw(L, L.cx, L.y, L.angle, L.sx, L.alpha);
        return;
      }
      const since = clock - L.landed;
      const k = Math.min(since / 450, 1), e = 1 - Math.pow(1 - k, 3);   // settle flat
      const angle = L.fromAngle + (L.restAngle - L.fromAngle) * e;
      const sx = L.fromSx + (L.restSx - L.fromSx) * e;
      const fade = Math.max(0, Math.min((since - HOLD) / FADE, 1));
      if (fade >= 1) { L.done = true; return; }
      draw(L, L.cx, L.y, angle, sx, L.alpha * (1 - fade));
    });
    if (leaves.every(L => L.done)) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  function onVis() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
  function finish() {                                   // all leaves have landed and faded: tidy up
    cancelAnimationFrame(raf); raf = 0;
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("resize", resize);
    canvas.remove();
  }
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(frame);
}

// site.js is loaded at the end of <body>, so the page's HTML is already in place here.
// Translations and event data are drawn right away, before the browser's first paint,
// so there's no flash of English or of the placeholder events before they switch.
function runNow(fn) {
  if (document.body) fn();
  else document.addEventListener("DOMContentLoaded", fn);
}
runNow(applyTranslations);
runNow(initSiteData);
document.addEventListener("DOMContentLoaded", initLangToggle);
document.addEventListener("DOMContentLoaded", initNavShadow);

// Independent of the CSV-driven render above — these buttons are already in
// the static HTML, so there's no reason to wait on data loading for this.
document.addEventListener("DOMContentLoaded", initCelebrations);
document.addEventListener("DOMContentLoaded", initLogoEasterEgg);
document.addEventListener("DOMContentLoaded", initEmailCopy);
document.addEventListener("DOMContentLoaded", initFooterNewsletter);
if (window.matchMedia) {
  const phPhone = window.matchMedia("(max-width: 560px)");
  const rePh = () => applyPlaceholders();
  if (phPhone.addEventListener) phPhone.addEventListener("change", rePh); else if (phPhone.addListener) phPhone.addListener(rePh);
}
document.addEventListener("DOMContentLoaded", initFunFact);
document.addEventListener("DOMContentLoaded", initEventTilt);
document.addEventListener("DOMContentLoaded", initRegisterButtons);
document.addEventListener("DOMContentLoaded", initGreeting);
document.addEventListener("DOMContentLoaded", initSnowEasterEgg);
document.addEventListener("DOMContentLoaded", initFallingLeaves);

// TEMP snow preview: open the homepage with ?snow to watch it (the script lives in _proto/, which isn't published).
if (/[?&]snow\b/.test(location.search)) setTimeout(() => {
  const s = document.createElement("script"); s.src = "_proto/snow-preview.js"; document.body.appendChild(s);
}, 3300);
