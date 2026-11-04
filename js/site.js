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
   the live event descriptions — add more any time, just keep
   the { emoji, text } shape.
   ============================================================ */
const MYANMAR_FUN_FACTS = [
  { emoji: "🏯", text: "Myanmar is home to over 100 distinct ethnic groups, each with its own language, dress, and traditions." },
  { emoji: "🍜", text: "Mohinga — a fish-based rice noodle soup often eaten for breakfast — is widely considered Myanmar's unofficial national dish." },
  { emoji: "🌿", text: "Thanaka, a pale yellow-white paste ground from bark, has been worn on the face as sunscreen and skincare for over 2,000 years." },
  { emoji: "✨", text: "Shwedagon Pagoda in Yangon is, by legend, said to enshrine strands of the Buddha's hair — and it's genuinely covered in gold leaf, not paint." },
  { emoji: "📿", text: "Myanmar follows a traditional lunar calendar, which is why Thingyan, the Burmese New Year water festival, falls on a different date every April." },
  { emoji: "🪷", text: "The plains of Bagan hold thousands of Buddhist temples and pagodas built between the 9th and 13th centuries — one of the densest concentrations of ancient temples anywhere in the world." },
  { emoji: "👘", text: "The longyi, a long sheet of fabric wrapped and knotted at the waist, is still everyday wear for both men and women across Myanmar." },
  { emoji: "🎣", text: "Fishermen on Inle Lake are famous for rowing their boats by wrapping one leg around the oar, keeping both hands free for their nets." },
  { emoji: "🎻", text: "The saung, a Burmese harp shaped like a boat, is one of the oldest surviving string instruments in Asia, with roots going back over a thousand years." },
  { emoji: "🔤", text: "The Burmese alphabet's round letters are widely believed to come from writing on palm leaves, which would tear along straight lines — a script quirk shared with other Southeast and South Asian writing systems." },
  { emoji: "🚂", text: "Yangon's Circular Railway loops the city in about three hours, passing through markets and rice paddies — commuters and curious visitors ride it side by side." },
  { emoji: "🎭", text: "Traditional Burmese marionette theatre (yoke thé) dates back centuries, and puppeteers were once given more creative license to comment on rulers than human actors were." },
  { emoji: "🗓️", text: "Myanmar was officially known as Burma in English until the country's name was changed in 1989." },
  { emoji: "🍵", text: "Laphet, fermented tea leaves tossed with nuts, sesame, and crispy beans, is eaten as a salad in Myanmar — one of the few places in the world where tea is eaten as much as it's drunk." },
  { emoji: "🌊", text: "Mahayana and Theravada Buddhism have coexisted in Myanmar for centuries, but Theravada Buddhism is practiced by the vast majority of the population today." },
  { emoji: "🧧", text: "In Myanmar, people are traditionally given a name letter based on the day of the week they were born — one of eight days, since Wednesday is split into morning and afternoon." },
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
    label_newsletter: "Newsletter",
    label_connect: "Connect",
    label_join_newsletter_nav: "Join Newsletter",
    label_join_club: "Join the Club",
    label_join_newsletter_footer: "Join the Newsletter",

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
    no_event_h3: "New event not available right now",
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

    events_eyebrow: "MCC Calendar",
    events_h1: "Every gathering, in one place.",
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
    bento_eyebrow: "Explore MCC",
    bento_h2: "Everything MCC, at a glance",
    bento_events_kicker: "Events",
    bento_events_big: "{n} events since {y}",
    bento_events_link: "See them all",
    bento_about_kicker: "The people",
    bento_about_title: "Meet the team behind MCC",
    bento_about_sub: "{n} people across {d} teams",
    bento_gallery_kicker: "Gallery",
    bento_gallery_title: "Moments from our events",
    bento_news_kicker: "Newsletter",
    bento_news_fallback: "Every issue, in one place",
    bento_news_link: "Read",
    bento_fact_kicker: "Did you know?",
    bento_fact_btn: "Another one",
    bento_ig_sub: "Follow along between events",

    about_eyebrow: "The People",
    about_h1: "The team behind MCC",
    about_close_h: "There's always a seat for you at our table.",
    gallery_eyebrow: "Gallery",
    gallery_h1: "Moments from our events",
    gallery_hint: "Drag to explore · tap a photo to open it",
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
    label_newsletter: "သတင်းလွှာ",
    label_connect: "ဆက်သွယ်ရန်",
    label_join_newsletter_nav: "သတင်းလွှာစာရင်းသွင်းရန်",
    label_join_club: "အသင်းဝင်ရန်",
    label_join_newsletter_footer: "သတင်းလွှာတွင် စာရင်းသွင်းရန်",

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
    no_event_h3: "လက်ရှိတွင် အခမ်းအနားအသစ်မရှိသေးပါ",
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
    bento_eyebrow: "MCC ကို လေ့လာပါ",
    bento_h2: "MCC အကြောင်း အားလုံး တစ်ချက်တည်းဖြင့်",
    bento_events_kicker: "အခမ်းအနားများ",
    bento_events_big: "{y} ခုနှစ်ကတည်းက အခမ်းအနား {n} ခု",
    bento_events_link: "အားလုံးကြည့်ရန်",
    bento_about_kicker: "အဖွဲ့ဝင်များ",
    bento_about_title: "MCC နောက်ကွယ်ရှိ အဖွဲ့နှင့် တွေ့ဆုံပါ",
    bento_about_sub: "အဖွဲ့ {d} ဖွဲ့တွင် လူ {n} ဦး",
    bento_gallery_kicker: "ဓာတ်ပုံပြခန်း",
    bento_gallery_title: "ကျွန်ုပ်တို့ ပွဲများမှ အမှတ်တရများ",
    bento_news_kicker: "သတင်းလွှာ",
    bento_news_fallback: "စာစောင်အားလုံး တစ်နေရာတည်းတွင်",
    bento_news_link: "ဖတ်ရန်",
    bento_fact_kicker: "သင်သိပါသလား?",
    bento_fact_btn: "နောက်တစ်ခု",
    bento_ig_sub: "ပွဲများကြားတွင်လည်း လိုက်ကြည့်ပါ",

    about_eyebrow: "အဖွဲ့ဝင်များ",
    about_h1: "MCC နောက်ကွယ်ရှိ အဖွဲ့",
    about_close_h: "ကျွန်ုပ်တို့စားပွဲတွင် သင့်အတွက် နေရာတစ်နေရာ ရှိပါသည်။",
    gallery_eyebrow: "ဓာတ်ပုံပြခန်း",
    gallery_h1: "ကျွန်ုပ်တို့၏ အခမ်းအနားများမှ အမှတ်တရများ",
    gallery_hint: "ရွှေ့၍ ကြည့်ရှုပါ · ဓာတ်ပုံကို နှိပ်၍ ဖွင့်ပါ",
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
      ? `<img src="${safeUrl(ev.photo)}" alt="${escapeHtml(ev.name)} event photo" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : "";
  }
  body.innerHTML = `
    <span class="event-tag ${mmClass}">${t("label_next_event")}</span>
    <h3>${escapeHtml(ev.name)}</h3>
    ${eventMetaRow(ev)}
    ${ev.description ? `<p class="desc">${escapeHtml(ev.description)}</p>` : ""}
    ${calendarRow(ev, mmClass)}
    ${ev.link ? `<a class="btn ${mmClass}" href="${safeUrl(ev.link)}" target="_blank" rel="noopener">${t("register_now")}</a>` : ""}
  `;
}

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
      ${ev.link ? `<a class="btn small ${mmClass}" href="${safeUrl(ev.link)}" target="_blank" rel="noopener">${t("rsvp")}</a>` : ""}
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
    const color = c.querySelector(".snake-color"); if (color) color.remove();
  });
  if (SNAKE.dock) { SNAKE.dock.remove(); SNAKE.dock = null; SNAKE.counter = null; }
  g.querySelectorAll(".past-card").forEach(c => { c.style.scale = ""; c.style.opacity = ""; c.style.translate = ""; });
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
    <circle class="snake-head" r="4.5"/>`;
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

  // Zoom-out finale title: "22 events and counting".
  const fin = document.createElement("div");
  fin.className = "snake-finale";
  fin.setAttribute("aria-hidden", "true");
  fin.innerHTML = escapeHtml(t("snake_count_done")).replace("{n}", `<b>${cards.length}</b>`);
  stage.appendChild(fin);

  // Dock: live counter ("11 events since 2022") + Skip.
  const dock = document.createElement("div");
  dock.className = "snake-dock";
  const counter = document.createElement("div");
  counter.className = "snake-count";
  counter.setAttribute("aria-hidden", "true");
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "snake-skip";
  skip.textContent = t("snake_skip") + " \u2193";
  skip.addEventListener("click", snakeSkip);
  dock.append(counter, skip);
  document.body.appendChild(dock);

  Object.assign(SNAKE, {
    g, cards, svg, counter, dock, pin, stage, yearEl, fin, cardYears, year: null, z: 0,
    since: years[0] || "", litCount: -1,
    guide: q(".snake-guide"), line: q(".snake-line"), head: q(".snake-head"),
    cur: null, max: 0, total: 0, thr: [], keys: [], raf: null, last: 0
  });
  snakeCounter(SNAKE.finaleDone ? cards.length : 0);
  snakeLayout();
  SNAKE.ro = new ResizeObserver(() => { if (SNAKE.g) { snakeLayout(); snakeKick(); } });
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
  const span = pitch * 0.42;

  let d = `M ${xL} ${ys[0]}`, L = 0;
  const thr = new Map(), keys = [];
  rows.forEach((row, r) => {
    const y = ys[r], ltr = r % 2 === 0, last = r === rows.length - 1;
    const hs = r === 0 ? xL : (ltr ? xL + R : xR - R);
    const lc = row[row.length - 1];             // last row: run to the far edge of the final poster
    const he = last ? cx(lc) + (ltr ? 1 : -1) * lc.offsetWidth / 2 : (ltr ? xR - R : xL + R);
    row.forEach(c => thr.set(c, L + Math.abs(cx(c) - hs)));
    keys.push({ y: y - span, L });
    d += ` H ${he}`;
    L += Math.abs(he - hs);
    keys.push({ y: y + span, L });
    if (!last) {
      const yn = ys[r + 1], sweep = ltr ? 1 : 0, xs = ltr ? xR : xL;
      d += ` A ${R} ${R} 0 0 ${sweep} ${xs} ${y + R} V ${yn - R} A ${R} ${R} 0 0 ${sweep} ${ltr ? xR - R : xL + R} ${yn}`;
      L += Math.PI * R + Math.max(0, yn - y - 2 * R);
    }
  });
  [SNAKE.guide, SNAKE.line].forEach(el => el.setAttribute("d", d));
  SNAKE.total = SNAKE.line.getTotalLength();
  const k = L ? SNAKE.total / L : 1;               // keep our bookkeeping in step with the browser's
  SNAKE.thr = cards.map(c => thr.get(c) * k);
  SNAKE.half = cards.map(c => (c.offsetWidth / 2) * k);
  SNAKE.keys = keys.map(p => ({ y: p.y, L: p.L * k }));
  SNAKE.line.style.strokeDasharray = `${SNAKE.total} ${SNAKE.total}`;

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
  const stageW = SNAKE.stage.clientWidth, topRoom = 104, bottomRoom = 60, mg = 14;
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
  SNAKE.pin.style.height = (SNAKE.stageH + SNAKE.drawS + SNAKE.zoomS) + "px";
  SNAKE.cur = null;
  SNAKE.cam = null;
}

// 1px of scrolling draws SNAKE_RATIO px of line. Lower = slower.
const SNAKE_RATIO = 1.5;
// Easing: the line follows your scroll with a short, soft lag (smooths out mouse-wheel steps),
// and the camera follows the line with a slightly longer one, so the grid never starts or stops
// moving abruptly when the line turns a corner.
const SNAKE_EASE = 8;
const SNAKE_CAM_EASE = 4.5;


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

// Where the scroll is inside the pinned section, in px (0 … drawing … zoom-out finale).
function snakeTarget() {
  const r = SNAKE.pin.getBoundingClientRect();
  return Math.max(0, Math.min(SNAKE.drawS + SNAKE.zoomS, SNAKE.top - r.top));
}

function snakeSkip() {
  if (!SNAKE.pin) return;
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
  const dt = SNAKE.last ? Math.min(0.05, (now - SNAKE.last) / 1000) : 1;
  SNAKE.last = now;
  const target = snakeTarget();
  if (SNAKE.cur === null) SNAKE.cur = target;
  SNAKE.cur += (target - SNAKE.cur) * (1 - Math.exp(-SNAKE_EASE * dt));
  if (Math.abs(target - SNAKE.cur) < 0.2) SNAKE.cur = target;
  const sc = SNAKE.cur;
  const L = Math.min(SNAKE.total, sc * SNAKE_RATIO);
  const z = Math.max(0, Math.min(1, (sc - SNAKE.drawS) / (SNAKE.zoomS * 0.75)));
  const e = easeInOut(z);
  if ((z >= 0.35) !== (SNAKE.z >= 0.35)) { SNAKE.z = z; snakeKick(); }
  SNAKE.z = z;

  SNAKE.line.style.strokeDashoffset = String(SNAKE.total - L);
  const pt = SNAKE.line.getPointAtLength(Math.max(0, Math.min(SNAKE.total, L)));
  SNAKE.head.setAttribute("cx", pt.x.toFixed(1));
  SNAKE.head.setAttribute("cy", pt.y.toFixed(1));
  SNAKE.head.style.opacity = L > 0.5 && L < SNAKE.total - 0.5 ? "" : "0";

  // Camera: follows the pen (the grid only moves while the line heads down a row), then in the
  // finale pulls back until the whole grid fits on screen.
  const camTarget = Math.max(0, Math.min(SNAKE.maxShift, pt.y + SNAKE.padTop - SNAKE.stageH * 0.5));
  if (SNAKE.cam == null) SNAKE.cam = camTarget;
  SNAKE.cam += (camTarget - SNAKE.cam) * (1 - Math.exp(-SNAKE_CAM_EASE * dt));
  if (Math.abs(camTarget - SNAKE.cam) < 0.2) SNAKE.cam = camTarget;
  SNAKE.g.style.transform = `translate3d(0, ${(-SNAKE.cam).toFixed(2)}px, 0)`;
  SNAKE.yearEl.style.opacity = String(1 - e);
  SNAKE.svg.style.opacity = String(1 - Math.min(1, z * 2.5));
  SNAKE.stage.querySelector(".snake-view").style.setProperty("--snake-fade", (70 * (1 - e)).toFixed(1) + "px");
  SNAKE.fin.style.opacity = String(Math.max(0, Math.min(1, (z - 0.55) / 0.35)));

  let lit = 0, current = 0;
  SNAKE.cards.forEach((c, i) => {
    // How far the line has got across this card: 0 at the edge it enters, 1 at the far edge.
    // Colour only ever grows, so posters stay lit if you scroll back up.
    const h = SNAKE.half[i];
    if (L >= SNAKE.thr[i] - h) current = i;
    const f = Math.max(0, Math.min(1, (L - (SNAKE.thr[i] - h)) / (2 * h)));
    const prev = Number(c.dataset.fill || 0);
    if (f > prev) { c.dataset.fill = f.toFixed(4); c.style.setProperty("--fill", f.toFixed(4)); }
    if (f > 0.01 && !c.classList.contains("lit")) c.classList.add("lit");
    if (Math.max(f, prev) >= 0.999) lit++;
    // Focus: the row the pen is on stays crisp; rows above and below recede a little.
    const rd = Math.min(1.5, Math.abs(SNAKE.rowY[SNAKE.rowOf[i]] - pt.y) / SNAKE.pitch);
    // Finale: fly into the wall, slightly staggered so they cascade in.
    const w = SNAKE.wall[i];
    const ei = easeInOut(Math.max(0, Math.min(1, (z - (i / SNAKE.cards.length) * 0.3) / 0.7)));
    const sF = 1 - rd * 0.035, sc2 = sF + (w.s - sF) * ei;
    const dx = (w.tx - w.ox - (w.w - w.w * w.s) / 2) * ei;
    const dy = (w.ty - (w.oy - SNAKE.cam) - (w.h - w.h * w.s) / 2) * ei;
    c.style.translate = ei > 0 ? `${dx.toFixed(2)}px ${dy.toFixed(2)}px` : "";
    c.style.scale = sc2.toFixed(4);
    c.style.opacity = (1 - rd * 0.3 * (1 - ei)).toFixed(3);
  });
  const year = SNAKE.cardYears[current];
  if (year && year !== SNAKE.year) {
    SNAKE.year = year;
    const digits = year.split("");
    SNAKE.yearEl.querySelectorAll(".odo-s").forEach((strip, i) => { strip.style.transform = `translateY(-${Number(digits[i] || 0) * 10}%)`; });
  }
  snakeCounter(lit);
  if (lit === SNAKE.cards.length && !SNAKE.finaleDone) snakeFinale();
  if (SNAKE.cur !== target || SNAKE.cam !== camTarget) snakeKick(); else SNAKE.last = 0;
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
        <div class="tl-poster"><img src="${safeUrl(ev.photo)}" alt="${escapeHtml(ev.name)} — ${formatDate(ev.date)}" loading="${i < 4 ? "eager" : "lazy"}" decoding="async"></div>
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
      <div class="wrap tl-foot"><div class="tl-rail"><div class="tl-fill"></div>${ticks}</div><div class="tl-count"></div></div>
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
    window.addEventListener("touchstart", () => { TL.touching = true; }, { passive: true });
    window.addEventListener("touchend", () => { TL.touching = false; tlOnScroll(); }, { passive: true });
  }
  tlKick();
}

function tlMeasure() {
  const nav = document.querySelector("header.nav");
  const top = nav ? nav.offsetHeight : 0;
  TL.section.style.setProperty("--tl-top", top + "px");
  TL.top = top;
  const vw = TL.el.clientWidth;
  const w = TL.cards[0].offsetWidth;
  const gap = Math.round(Math.max(18, Math.min(44, vw * 0.035)));
  TL.track.style.setProperty("--tl-gap", gap + "px");
  const pad = Math.max(0, (vw - w) / 2);
  TL.track.style.paddingLeft = pad + "px";
  TL.track.style.paddingRight = pad + "px";
  TL.step = w + gap;
  TL.dist = TL.step * (TL.cards.length - 1);          // sideways travel = downward scroll, 1:1
  const stageH = window.innerHeight - top;
  TL.el.style.height = (stageH + TL.dist) + "px";

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
  TL.cur += (target - TL.cur) * 0.16;                 // eased, so it glides rather than jerks
  if (Math.abs(target - TL.cur) < 0.4) TL.cur = target;
  const x = TL.cur;
  TL.track.style.transform = `translate3d(${-x}px,0,0)`;

  const pos = x / TL.step;
  TL.cards.forEach((c, i) => {
    const d = i - pos, ad = Math.abs(d);
    const scale = 1 - Math.min(ad, 2) * 0.09;
    const rot = Math.max(-16, Math.min(16, -d * 11));
    c.style.transform = `perspective(1400px) rotateY(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    c.style.opacity = (1 - Math.min(ad, 1.6) * 0.34).toFixed(3);
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
    TL.count.textContent = active < TL.n ? `${String(active + 1).padStart(2, "0")} / ${String(TL.n).padStart(2, "0")}` : "";
  }
  const frac = TL.dist ? x / TL.dist : 0;
  TL.fill.style.width = (frac * 100) + "%";
  TL.ticks.forEach(b => b.classList.toggle("on", Number(b.dataset.i) <= pos + 0.01));

  if (TL.cur !== target) tlKick();
}

function tlOnScroll() {
  if (!TL.el) return;
  tlKick();
  clearTimeout(TL.settle);
  TL.settle = setTimeout(() => {
    if (!TL.el || TL.touching) return;
    const target = tlTarget();
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

function renderHeroPhotos(heroRows) {
  const container = document.getElementById("js-hero-photos");
  if (!container) return;
  const bySlot = {};
  heroRows.forEach(r => { bySlot[r.slot] = r; });
  const letters = ["a", "b", "c"];
  container.innerHTML = [1, 2, 3].map((slot, i) => {
    const row = bySlot[slot];
    const inner = row
      ? `<img src="${safeUrl(row.photo)}" alt="${escapeHtml(row.alt || "")}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : "";
    return `<div class="panel panel-${letters[i]}">${inner}</div>`;
  }).join("");
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
    if (emojiEl) emojiEl.textContent = fact.emoji;
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

// ---------- Homepage: the Next Event card tilts gently toward the cursor ----------
// Mouse only (not touch), off for reduced motion. The card turns a few degrees and the poster
// inside drifts the other way, which gives a sense of depth without any shine effects.
function initEventTilt() {
  const card = document.querySelector("#event .event-card");
  if (!card || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
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
    const img = card.querySelector(".event-visual img");
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
// site uses: past events (Sheet), the team (Team tab, or data/team.csv), the latest published
// newsletter (Supabase, public read), and the fun facts list above.
const BENTO = { posters: null, factIndex: -1, team: null, news: null, since: "", count: 0 };

// Events tile posters — edit these two lists to curate it (matched against the event's name or
// poster filename, ignoring capitals). The count ("22 events since 2022") still includes every event.
const BENTO_POSTERS_HIDE = ["multicultural-bazaar", "mcc-mixer"];            // never shown in the tile
const BENTO_POSTERS_FIRST = ["sea of love", "thingyan", "general meeting", "home away from home"]; // shown first
const BENTO_COLORS = ["#AE3628", "#C08A2E", "#4B7A3C", "#1C2440", "#8C2A1F"];

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
  if (!BENTO.loaded) { BENTO.loaded = true; loadBentoTeam(); loadBentoNews(); initBentoFact(); renderBentoHexes(); }
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
  const show = rows.slice(0, 9);
  faces.innerHTML = show.map((r, i) => `<span class="t-face" style="background:${BENTO_COLORS[i % BENTO_COLORS.length]}">${escapeHtml(initials(r))}</span>`).join("")
    + (rows.length > show.length ? `<span class="t-face" style="background:var(--bg-sunk);color:var(--ink)">+${rows.length - show.length}</span>` : "");
  renderBentoText();
}

async function loadBentoNews() {
  const el = document.getElementById("js-bento-news");
  const cfg = window.MCC_EXEC_CONFIG;
  if (!el || !cfg || !cfg.url || !cfg.key) return;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/newsletters?select=name,updated_at&status=eq.published&order=updated_at.desc&limit=1`,
      { headers: { apikey: cfg.key } });
    if (!res.ok) return;
    const rows = await res.json();
    if (!rows || !rows[0] || !rows[0].name) return;
    el.removeAttribute("data-i18n");
    el.textContent = rows[0].name;
  } catch (e) { /* keep the fallback text */ }
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
    const put = () => { text.textContent = f.text; if (emoji) emoji.textContent = f.emoji || ""; text.classList.remove("out"); };
    if (!animate) return put();
    text.classList.add("out");
    setTimeout(put, 280);
  };
  show(false);
  if (btn) btn.addEventListener("click", () => show(true));
}

function renderBentoHexes() {
  const box = document.getElementById("js-bento-hexes");
  if (!box) return;
  const photos = ["images/welcome_vertical.jpg", "images/welcome_top.jpg", "images/welcome_bottom.jpg"];
  // a small honeycomb: 7 cells, photos in three of them
  const cells = [[52, 0], [100, 0], [28, 40], [76, 40], [124, 40], [52, 80], [100, 80]];
  const fill = { 1: 0, 3: 1, 5: 2 };
  const tints = ["rgba(174,54,40,0.22)", "rgba(192,138,46,0.3)", "rgba(75,122,60,0.25)", "rgba(28,36,64,0.16)"];
  box.innerHTML = cells.map(([x, y], i) => {
    const inner = i in fill ? `<img src="${photos[fill[i]]}" alt="" loading="lazy">` : "";
    const bg = i in fill ? "" : `background:${tints[i % tints.length]};`;
    return `<span class="t-hex" style="left:${x - 24}px;top:${y}px;${bg}">${inner}</span>`;
  }).join("");
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

function renderSiteData(eventRows, heroRows) {
  pendingEventAreas().forEach(el => el.removeAttribute("data-pending"));
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
  setTimeout(() => pendingEventAreas().forEach(el => el.removeAttribute("data-pending")), 6000);

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
    const el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed === "snow") { typed = ""; open(); }
  });

  // ...or a link ending in #snow (handy on phones, which have no keyboard).
  if (location.hash === "#snow") open();
  window.addEventListener("hashchange", () => { if (location.hash === "#snow") open(); });
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
document.addEventListener("DOMContentLoaded", initFunFact);
document.addEventListener("DOMContentLoaded", initEventTilt);
document.addEventListener("DOMContentLoaded", initSnowEasterEgg);
