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

const EVENTS_CSV_URL   = "data/events.csv";   // <-- replace with your published Google Sheet CSV link
const HERO_CSV_URL     = "data/hero.csv";     // <-- replace with your published Google Sheet CSV link
const SETTINGS_CSV_URL = "data/settings.csv"; // <-- replace with your published Google Sheet CSV link

// Used when the "Settings" sheet doesn't have a past_events_count row
// (or it's blank/not a number yet).
const DEFAULT_PAST_EVENTS_COUNT = 12;

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
    label_all_events: "All Events",
    label_connect: "Connect",
    label_join_newsletter_nav: "Join Newsletter",
    label_join_club: "Join the Club",
    label_join_newsletter_footer: "Join the Newsletter",

    hero_h1: "Mingalabar",
    hero_lede: "The Myanmar Culture Club brings the food, festivals, languages, and stories of Myanmar to the University of Toronto. Whether you grew up with these traditions or are discovering them for the first time, there's a seat for you at our table.",
    hero_cta_next: "See Our Next Event",

    strip1_h: "Student-run, UofT-wide",
    strip1_p: "Open to every faculty and every year — no Burmese background required, just curiosity.",
    strip2_h: "Food, festivals & language",
    strip2_p: "From Thingyan water festival to mohinga nights and Burmese language chats.",
    strip3_h: "A community away from home",
    strip3_p: "For the Myanmar diaspora and anyone who wants to learn alongside us.",

    event_h2: "See what MCC is hosting",
    event_intro: "Our next gathering, straight from the calendar. Check back often — new events go up here first.",
    register_now: "Register Now",
    stay_tuned_tag: "Stay tuned",
    no_event_h3: "New event not available right now",
    no_event_p: "We're always planning something — keep checking back, and in the meantime take a look at everything we've hosted so far.",
    visit_all_previous: "Visit All Previous Events",
    rsvp: "RSVP",

    footer_h2: "Let's stay in touch.",
    footer_p: "Follow along for event drops, cultural spotlights, and the occasional mohinga craving. New members welcome any time of year.",
    contact_email_label: "Email",
    contact_email_copied: "Copied to clipboard!",
    contact_linktree_label: "Everything else",

    events_eyebrow: "MCC Calendar",
    events_h1: "Every gathering, in one place.",
    events_lede: "From food nights to festival celebrations, here's what the Myanmar Culture Club has coming up — and what we've hosted before. Can't make it in person? Follow along on Instagram so you never miss the next one.",
    coming_up_eyebrow: "Coming Up",
    coming_up_h2: "More on the calendar",
    past_events_eyebrow: "Past Events",
    past_events_h2: "What we've hosted",
    past_note_showing_recent: "Showing our {n} most recent events.",
    past_note_everything: "Everything we've hosted — {n} events so far.",
  },
  mm: {
    label_welcome: "ကြိုဆိုပါသည်",
    label_next_event: "လာမည့်အခမ်းအနား",
    label_all_events: "အခမ်းအနားအားလုံး",
    label_connect: "ဆက်သွယ်ရန်",
    label_join_newsletter_nav: "သတင်းလွှာစာရင်းသွင်းရန်",
    label_join_club: "အသင်းဝင်ရန်",
    label_join_newsletter_footer: "သတင်းလွှာတွင် စာရင်းသွင်းရန်",

    hero_h1: "မင်္ဂလာပါ",
    hero_lede: "Myanmar Culture Club သည် တိုရွန်တိုတက္ကသိုလ်သို့ မြန်မာ့အစားအစာ၊ ပွဲတော်များ၊ ဘာသာစကားနှင့် ဇာတ်လမ်းများကို ယူဆောင်လာပါသည်။ ဤအစဉ်အလာများကြားတွင် ကြီးပြင်းခဲ့သူဖြစ်စေ၊ ယခုမှစတင်၍ ရှာဖွေလေ့လာနေသူဖြစ်စေ၊ ကျွန်ုပ်တို့စားပွဲတွင် သင့်အတွက် နေရာတစ်နေရာ ရှိပါသည်။",
    hero_cta_next: "လာမည့်အခမ်းအနားကြည့်ရန်",

    strip1_h: "ကျောင်းသားများကိုယ်တိုင်စီမံ၊ တက္ကသိုလ်တစ်ခုလုံးအတွက်",
    strip1_p: "အဌာနတိုင်း၊ နှစ်အလိုက်ကျောင်းသားများအားလုံးအတွက် ဖွင့်ထားပါသည် — မြန်မာ့နောက်ခံလိုအပ်ချက်မရှိပါ၊ စူးစမ်းလိုစိတ်တစ်ခုတည်း လိုအပ်ပါသည်။",
    strip2_h: "အစားအစာ၊ ပွဲတော်များနှင့် ဘာသာစကား",
    strip2_p: "သင်္ကြန်ပွဲတော်မှသည် မုန့်ဟင်းခါးညများ၊ မြန်မာစကားပြောဆိုမှုများအထိ။",
    strip3_h: "အိမ်ကွာသော်လည်း အသိုင်းအဝိုင်း",
    strip3_p: "မြန်မာမျိုးနွယ်စုများနှင့် ကျွန်ုပ်တို့နှင့်အတူ လေ့လာလိုသူတိုင်းအတွက်။",

    event_h2: "MCC ၏ လာမည့်အစီအစဉ်များကြည့်ရန်",
    event_intro: "ကျွန်ုပ်တို့၏ ပြက္ခဒိန်မှ လာမည့်စုစည်းပွဲ။ မကြာခဏ ပြန်ကြည့်ပါ — အခမ်းအနားအသစ်များကို ဒီနေရာတွင် အရင်ဆုံးတင်ပါသည်။",
    register_now: "အခုပင်စာရင်းသွင်းပါ",
    stay_tuned_tag: "စောင့်ကြည့်ပါ",
    no_event_h3: "လက်ရှိတွင် အခမ်းအနားအသစ်မရှိသေးပါ",
    no_event_p: "ကျွန်ုပ်တို့ အမြဲတမ်းစီစဉ်နေပါသည် — ဆက်လက်ကြည့်ရှုပေးပါ၊ ယခုအချိန်တွင် ကျွန်ုပ်တို့ယခင်ကျင်းပခဲ့သော အခမ်းအနားများကို ကြည့်ရှုနိုင်ပါသည်။",
    visit_all_previous: "ယခင်အခမ်းအနားများအားလုံးကြည့်ရန်",
    rsvp: "စာရင်းသွင်းရန်",

    footer_h2: "ဆက်သွယ်နေကြပါစို့။",
    footer_p: "အခမ်းအနားသတင်းများ၊ ယဉ်ကျေးမှုဆိုင်ရာ အထူးဖော်ပြချက်များနှင့် တစ်ခါတစ်ရံ မုန့်ဟင်းခါးစားချင်စိတ်များအတွက် လိုက်နာကြည့်ရှုပါ။ အသင်းဝင်သစ်များကို နှစ်တစ်လျှောက်လုံး ကြိုဆိုပါသည်။",
    contact_email_label: "အီးမေးလ်",
    contact_email_copied: "ကူးယူပြီးပါပြီ!",
    contact_linktree_label: "အခြားအရာများ",

    events_eyebrow: "MCC ပြက္ခဒိန်",
    events_h1: "စုစည်းပွဲအားလုံး တစ်နေရာတည်းတွင်။",
    events_lede: "အစားအသောက်ညများမှ ပွဲတော်ကျင်းပမှုများအထိ၊ Myanmar Culture Club ၏ လာမည့်အခမ်းအနားများနှင့် ယခင်ကကျင်းပခဲ့သည့်အခမ်းအနားများကို ဤနေရာတွင် တွေ့နိုင်ပါသည်။ တကယ်လာရောက်၍မရပါက Instagram တွင် လိုက်နာပါ၊ နောက်တစ်ကြိမ် လွတ်မသွားပါစေနှင့်။",
    coming_up_eyebrow: "လာမည့်အစီအစဉ်များ",
    coming_up_h2: "ပြက္ခဒိန်ပေါ်ရှိ နောက်ထပ်များ",
    past_events_eyebrow: "ယခင်အခမ်းအနားများ",
    past_events_h2: "ကျွန်ုပ်တို့ ကျင်းပခဲ့သည်များ",
    past_note_showing_recent: "လတ်တလော အခမ်းအနား {n} ခုကို ပြသထားပါသည်။",
    past_note_everything: "ကျွန်ုပ်တို့ ကျင်းပခဲ့သမျှ — အခမ်းအနား {n} ခု ရှိပါပြီ။",
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
function applyTranslations() {
  const lang = getLang();
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.lang = lang === "mm" ? "my" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
    el.classList.toggle("myanmar", lang === "mm");
  });
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
// Event" spot shows a "New event not available right now" message. Flip
// this to true to instead show your most recent past event in that spot
// (so you can preview/test how the "Next Event" card looks with real
// content, without needing an actual upcoming event in the sheet). It
// only kicks in when there is no genuine upcoming event — a real
// upcoming event always takes priority. Set back to false when you're
// done testing.
const TESTING_SHOW_LATEST_EVENT_AS_NEXT = true;

// All "is this event over yet" checks are done in Toronto time, regardless
// of the visitor's own timezone or device clock — see nowInToronto() below.
const CLUB_TIMEZONE = "America/Toronto";

const FALLBACK_EVENTS_CSV = `id,name,date,end_time,time,location,description,photo,link
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

// Generic key/value settings table — right now just controls how many
// Past Events cards show, but the shape leaves room to add more site
// settings later without changing the CSV format again.
const FALLBACK_SETTINGS_CSV = `key,value
past_events_count,20`;

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

async function loadCSV(url, fallbackText) {
  if (!url || url.includes("PASTE_") || url.includes("YOUR_")) {
    return safeParse(fallbackText);
  }
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const rows = safeParse(text);
    if (!rows.length) throw new Error("empty sheet");
    return rows;
  } catch (err) {
    console.warn(`Falling back to bundled data for ${url}:`, err);
    return safeParse(fallbackText);
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
      ${ev.location ? `<span class="meta-item">${pinIcon()}${ev.location}</span>` : ""}
    </div>`;
}

function renderFeaturedEvent(ev) {
  const visual = document.getElementById("js-event-visual");
  const body = document.getElementById("js-event-body");
  if (!body) return;
  const mmClass = getLang() === "mm" ? "myanmar" : "";

  if (!ev) {
    if (visual) visual.innerHTML = "";
    // On the events page itself the past gallery is further down this same
    // page; on the homepage it lives on events.html — point the link at
    // wherever it actually is.
    const pastHref = document.getElementById("js-past-gallery") ? "#past-events" : "events.html#past-events";
    body.innerHTML = `
      <span class="event-tag ${mmClass}">${t("stay_tuned_tag")}</span>
      <h3 class="${mmClass}">${t("no_event_h3")}</h3>
      <p class="desc ${mmClass}">${t("no_event_p")}</p>
      <a class="btn ghost ${mmClass}" href="${pastHref}">${t("visit_all_previous")}</a>`;
    return;
  }

  if (visual) {
    visual.innerHTML = ev.photo
      ? `<img src="${ev.photo}" alt="${escapeHtml(ev.name)} event photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : "";
  }
  body.innerHTML = `
    <span class="event-tag ${mmClass}">${t("label_next_event")}</span>
    <h3>${escapeHtml(ev.name)}</h3>
    ${eventMetaRow(ev)}
    ${ev.description ? `<p class="desc">${escapeHtml(ev.description)}</p>` : ""}
    ${ev.link ? `<a class="btn ${mmClass}" href="${ev.link}" target="_blank" rel="noopener">${t("register_now")}</a>` : ""}
  `;
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
      ${ev.link ? `<a class="btn small ${mmClass}" href="${ev.link}" target="_blank" rel="noopener">${t("rsvp")}</a>` : ""}
    </div>
  `).join("");
}

// `past` is already sorted most-recent-first (see splitEvents), so
// slicing to `limit` keeps the newest N and drops the older ones — no
// need to pick which events to show, just how many.
function renderPastGallery(past, limit) {
  const gallery = document.getElementById("js-past-gallery");
  if (!gallery) return;
  const shown = past.slice(0, limit);
  gallery.innerHTML = shown.map(ev => `
    <div class="past-card reveal">
      <div class="photo"><img src="${ev.photo}" alt="${escapeHtml(ev.name)} — ${formatDate(ev.date)}${ev.location ? ", " + escapeHtml(ev.location) : ""}" loading="lazy"></div>
      <div class="info">
        <div class="title">${escapeHtml(ev.name)}</div>
        <div class="date">${formatDate(ev.date)}${ev.location ? " &middot; " + escapeHtml(ev.location) : ""}</div>
      </div>
    </div>
  `).join("");

  const note = document.getElementById("js-past-note");
  if (note) {
    note.classList.toggle("myanmar", getLang() === "mm");
    note.textContent = past.length > shown.length
      ? t("past_note_showing_recent").replace("{n}", shown.length)
      : t("past_note_everything").replace("{n}", shown.length);
  }
}

// Turns the Settings sheet's key/value rows into a plain {key: value} map.
function settingsMap(rows) {
  const map = {};
  rows.forEach(r => { if (r.key) map[r.key.trim()] = (r.value || "").trim(); });
  return map;
}

function renderHeroPhotos(heroRows) {
  const container = document.getElementById("js-hero-photos");
  if (!container) return;
  const bySlot = {};
  heroRows.forEach(r => { bySlot[r.slot] = r; });
  const letters = ["a", "b", "c"];
  container.innerHTML = [1, 2, 3].map((slot, i) => {
    const row = bySlot[slot];
    const inner = row
      ? `<img src="${row.photo}" alt="${escapeHtml(row.alt || "")}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : "";
    return `<div class="panel panel-${letters[i]}">${inner}</div>`;
  }).join("");
}

// Fades/slides ".reveal" elements in as they scroll into view (once each —
// they don't re-hide if you scroll back up). Elements inside a grid
// (the about strip, the Coming Up cards, the Past Events gallery) get a
// small staggered delay so they arrive one after another rather than all
// at once. Respects prefers-reduced-motion: reduce (see the CSS rule of
// the same name) by just showing everything immediately, no observer.
function initScrollReveal() {
  try {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    const reduceMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }

    [".strip .wrap", ".events-grid", ".past-gallery"].forEach(sel => {
      const group = document.querySelector(sel);
      if (!group) return;
      group.querySelectorAll(".reveal").forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i, 7) * 70}ms`;
      });
    });

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

// Cached inputs to the three CSV-driven render functions above, so the
// language toggle can re-render them in the new language instantly
// without re-fetching the CSVs.
let _cachedNext = null, _cachedRest = [], _cachedPast = [], _cachedPastLimit = DEFAULT_PAST_EVENTS_COUNT;
let _dataLoaded = false;

function rerenderDynamicText() {
  // If the toggle is clicked before the CSVs finish loading, do nothing —
  // initSiteData's own render (moments later) will already pick up
  // whichever language is currently selected.
  if (!_dataLoaded) return;
  renderFeaturedEvent(_cachedNext);
  renderComingUp(_cachedRest);
  renderPastGallery(_cachedPast, _cachedPastLimit);
}

async function initSiteData() {
  const [eventRows, heroRows, settingsRows] = await Promise.all([
    loadCSV(EVENTS_CSV_URL, FALLBACK_EVENTS_CSV),
    loadCSV(HERO_CSV_URL, FALLBACK_HERO_CSV),
    loadCSV(SETTINGS_CSV_URL, FALLBACK_SETTINGS_CSV),
  ]);

  const settings = settingsMap(settingsRows);
  const pastLimit = parseInt(settings.past_events_count, 10) || DEFAULT_PAST_EVENTS_COUNT;

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
  _cachedPastLimit = pastLimit;
  _dataLoaded = true;

  renderFeaturedEvent(next);
  renderComingUp(rest);
  renderPastGallery(pastForGallery, pastLimit);
  renderHeroPhotos(heroRows);

  // Runs after the dynamic sections above are in the DOM, so it picks up
  // their ".reveal" cards too, not just the ones already in the HTML.
  initScrollReveal();
}

// Applies saved-language text to the static HTML before anything else runs,
// so there's no flash of English before it switches.
document.addEventListener("DOMContentLoaded", applyTranslations);
document.addEventListener("DOMContentLoaded", initLangToggle);
document.addEventListener("DOMContentLoaded", initSiteData);

// Independent of the CSV-driven render above — these buttons are already in
// the static HTML, so there's no reason to wait on data loading for this.
document.addEventListener("DOMContentLoaded", initCelebrations);
document.addEventListener("DOMContentLoaded", initLogoEasterEgg);
document.addEventListener("DOMContentLoaded", initEmailCopy);
