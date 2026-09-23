# MCC Website — how this is put together

This folder is the whole website. It's plain HTML/CSS/JS — no build step,
no framework, nothing to install. You can open `index.html` directly in a
browser to preview it, or host the folder as-is.

**Credits:** Designed & built by Naing Lin Khant (Moarz).

```
index.html              ← homepage
events.html              ← all-events page
js/site.js               ← the ONLY file you'll ever need to edit for setup
data/events.csv          ← sample event data (used until you connect your Sheet)
data/hero.csv            ← sample homepage photo data (used until you connect your Sheet)
data/settings.csv        ← sample site settings, e.g. how many Past Events cards to show
images/brand/logo.png    ← club logo
images/events/*.jpg      ← event photos
```

## How the "self-service" system works

Instead of asking someone to edit code every time an event changes, the
site reads its event data from a table at runtime — a table you keep in a
Google Sheet. Here's the flow:

1. You keep a Google Sheet with your events (one row per event), a second
   small sheet with your 3 homepage photos, and a third tiny sheet for
   site settings (right now, just how many Past Events cards to show).
2. You publish all three sheets to the web as CSV (a free, built-in Google
   Sheets feature — no add-ons).
3. The website fetches those CSV links every time someone loads the page,
   and builds the "Next Event," "Coming Up," "Past Events," and homepage
   photos sections from whatever's in the sheet **at that moment**.
4. The "next event" is never picked by hand — the site looks at the
   current time in Toronto, finds the soonest event that hasn't ended yet,
   and shows that one. The moment an event's end time passes, it
   automatically drops out of "Next Event," any other still-upcoming
   events show as cards below it, and it becomes a "Past Event" card once
   it's no longer next. Nothing to toggle.

Until you set step 1–2 up, the site quietly falls back to the sample data
bundled in `data/events.csv`, `data/hero.csv`, and `data/settings.csv`, so
nothing is ever broken or blank.

## Step-by-step: connecting your Google Sheet

### 1. Create the sheet

Open [Google Sheets](https://sheets.google.com), create a new spreadsheet,
and make three tabs (right-click the tab bar → rename, or use the + button):

- **Events**
- **Hero**
- **Settings**

The easiest way to get the right columns: in each tab, go to
**File → Import → Upload**, and upload `data/events.csv` into the "Events"
tab, `data/hero.csv` into the "Hero" tab, and `data/settings.csv` into the
"Settings" tab (choose "Replace current sheet" on import each time). That
gives you the exact column headers already filled in with the current
content — just edit from there.

**Events tab columns:**

| Column | What goes here | Example |
|---|---|---|
| `id` | a short unique label, no spaces | `badminton-social` |
| `name` | event title | `Badminton Social` |
| `date` | **YYYY-MM-DD**, this is what drives the auto-sorting | `2026-03-08` |
| `end_time` | when the event actually ends — **this is what flips it from "Next Event" to "Past"** (24h `19:30` or `7:30 PM` both work). Leave blank and the event just stays "upcoming" through the end of its calendar day. | `19:30` |
| `time` | free text, shown next to the date on the page | `5:30–7:30 PM` |
| `location` | free text | `Vision Badminton Centre` |
| `description` | free text (can be blank) | |
| `photo` | a public image URL, or a path if you're also hosting images in this same folder | `images/events/badminton-social.jpg` |
| `link` | RSVP / registration URL (can be blank) | `https://forms.gle/...` |

Add a new row for every event, past or future — the site sorts it out by
date (and `end_time`) automatically. You never have to move a row between
"upcoming" and "past" yourself.

**The auto-switch is precise, not just day-based.** The site checks
`date` + `end_time` against the current time **in Toronto**, no matter
where the person viewing the site actually is. So a 5:30–7:30 PM event
stays as "Next Event" until 7:30 PM Toronto time, then automatically
becomes a past event — you don't need to do anything, and it won't flip
early or late just because a visitor is in a different timezone.

**If there's no upcoming event at all** (nothing left with a future
date/end_time), the "Next Event" spot doesn't break or show something
stale — it shows a friendly "New event not available right now — keep
checking back" message with a button linking to the Past Events section,
on both the homepage and the events page.

**If there's more than one upcoming event**, the soonest one is always
"Next Event" (featured, with the full description and photo) — any others
automatically show as smaller cards in the "Coming Up" section on the
events page, sorted soonest-first. Add as many future rows as you like;
you never have to decide which one is "next" yourself.

**Hero tab columns:**

| Column | What goes here |
|---|---|
| `slot` | `1`, `2`, or `3` — which of the three homepage photo spots (1 = the tall vertical photo on the left, 2 = the top-right photo, 3 = the bottom-right photo) |
| `photo` | a public image URL, or a path if hosting the image in this folder |
| `alt` | a short description of the photo, for accessibility |

By default the three slots point at `images/welcome_vertical.jpg`,
`images/welcome_top.jpg`, and `images/welcome_bottom.jpg` — drop your own
photos into the `images/` folder using those exact filenames and they'll
show up with no other changes needed, or point the `photo` column at
different filenames/URLs entirely.

**Settings tab columns:**

| Column | What goes here |
|---|---|
| `key` | the setting's name — right now just `past_events_count` |
| `value` | the setting's value |

This is a small, general-purpose key/value table rather than one column
per setting, so more settings can be added later without changing the
sheet's shape. Today it controls one thing: how many Past Events cards
show on the events page. Set `past_events_count` to `12`, `15`, `30`,
whatever you like — the page always shows your most recent events up to
that number (older ones just don't render; nothing is deleted from the
sheet). Leave it blank or delete the row and it defaults to 12.

### 2. Publish each tab to the web

With the sheet open:

1. **File → Share → Publish to web**
2. In the first dropdown, choose the specific tab (**Events**, not
   "Entire document")
3. In the second dropdown, choose **Comma-separated values (.csv)**
4. Click **Publish**, confirm, and copy the link it gives you
5. Repeat for the **Hero** tab

You'll end up with two links, both looking something like:
`https://docs.google.com/spreadsheets/d/e/2PACX.../pub?gid=0&single=true&output=csv`

### 3. Point the site at your sheet

Open `js/site.js` in any text editor. Right at the top you'll see:

```js
const EVENTS_CSV_URL = "data/events.csv"; // <-- replace with your published Google Sheet CSV link
const HERO_CSV_URL   = "data/hero.csv";   // <-- replace with your published Google Sheet CSV link
```

Paste your two links in (keep the quotes), save the file, and re-upload
it wherever the site is hosted. That's the only code change you'll ever
need to make — every event you add or edit after this point happens
entirely in the Sheet.

## Photos

You have two options for the `photo` column (events, hero, doesn't matter
which):

- **A public image URL** — for example, an image you've uploaded to
  Google Drive (with sharing set to "anyone with the link") or any other
  image host.
- **A path inside this folder** — if you're hosting on GitHub Pages,
  the simplest approach is to drop new photos into `images/events/` in
  your repo (GitHub's web interface lets you drag-and-drop files, no
  command line needed) and just type the filename into the `photo` column,
  e.g. `images/events/my-new-event.jpg`.

## Hosting on GitHub Pages (free)

1. Create a GitHub account if you don't have one, and a new repository
   (e.g. `mcc-website`) — Public.
2. Upload every file in this folder to the repo (GitHub's website lets
   you drag-and-drop; keep the folder structure exactly as it is here).
3. In the repo, go to **Settings → Pages**, set "Source" to the branch
   you uploaded to (usually `main`) and the root folder, then Save.
4. GitHub gives you a URL like `https://<your-username>.github.io/mcc-website/`
   within a minute or two — that's your live site.
5. Optional: attach a real domain name later under the same Pages settings
   once you own one.

No cost for any of this — GitHub Pages is free for a site like this one.

## What auto-syncs vs. what needs a code change

| Change | Where you make it |
|---|---|
| Add, edit, or remove an event | Google Sheet only |
| Change which photo shows on the homepage | Google Sheet ("Hero" tab) only |
| Which event is "Next Event" | Automatic — nothing to touch |
| Club contact info, social links, address | `index.html` / `events.html` (ask Claude, or edit the footer HTML directly) |
| Visual design, colors, fonts | `index.html` / `events.html` `<style>` block |
