"""Replay saved trainer choices with any trainer version and print the bands (same format as js/learn-bands.js).

  pip install playwright && playwright install chromium
  python3 replay.py trainer-v4.2.html --batch 2.1               # bands for batch 2, part 1 as JSON {glyph id: {ch, lat, bands}}
  python3 replay.py trainer-v4.2.html --batch 1 2 --check ../../js/learn-bands.js   # compare with the site

To change a letter's direction, edit its "order" in batches.json (start = the end where the pen starts,
dir flips a ring) — or better, redo it in the trainer — then replay and paste the result into learn-bands.js.
The trainer loads polygon-clipping from cdn.jsdelivr.net; pass --lib path/to/polygon-clipping.umd.min.js to use a local copy.
"""
import argparse, asyncio, json, os, re, subprocess, sys
from playwright.async_api import async_playwright

ap = argparse.ArgumentParser()
ap.add_argument("trainer"); ap.add_argument("--batch", nargs="+", required=True, help="batch ids: 1, 2 (= 2.1 and 2.2), 2.2 …")
ap.add_argument("--batches", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "batches.json"))
ap.add_argument("--lib"); ap.add_argument("--check")
A = ap.parse_args()
html = open(A.trainer, encoding="utf-8").read()
lib = open(A.lib, encoding="utf-8").read() if A.lib else None
data = json.load(open(A.batches, encoding="utf-8"))
letters = [l for b in data["batches"] if b["id"] in A.batch or str(b["batch"]) in A.batch for l in b["letters"]]

JS = """(letters) => {
  const out = {}, parse1 = s => s.trim().split(/\\s+/).map(p => p.split(",").map(Number));
  for (const L of letters) {
    const i = DATA.L.findIndex(l => l.g === L.g); open(i); const c = L.choices;
    divs = (c.divs || []).map(x => ({ t: "line", h: typeof x.h === "string" ? parse1(x.h) : x.h }));
    caps = Object.fromEntries(Object.entries(c.caps || {}).map(([k, v]) => [k, typeof v === "string" ? parse1(v) : v]));
    ign = Object.fromEntries(Object.entries(c.ign || {}).map(([k, v]) => [k, typeof v === "string" ? parse1(v) : v]));
    rebuild();
    order = c.order.map(o => ({ piece: o.piece, start: o.start, dir: o.dir || 1 }));
    const S = typeof allBands === "function" ? allBands() : order.map(bandOf).filter(Boolean);   // 4.0 had no allBands
    out[L.g] = { ch: L.ch, lat: L.lat, bands: S.map(s => ({ a: fmt(s.a), b: fmt(s.b) })) };
  }
  return out;
}"""

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(); p = await b.new_page()
        async def route(r):
            u = r.request.url
            if u.startswith("http://trainer.local/"): await r.fulfill(body=html, content_type="text/html")
            elif lib and "polygon-clipping" in u: await r.fulfill(body=lib, content_type="application/javascript")
            elif "polygon-clipping" in u: await r.continue_()
            else: await r.abort()
        await p.route("**/*", route)
        await p.goto("http://trainer.local/#l0"); await p.wait_for_timeout(500)
        res = await p.evaluate(JS, letters); await b.close(); return res

res = asyncio.run(main())
if A.check:
    site = open(A.check, encoding="utf-8").read()
    js = subprocess.run(["node", "-e", "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.MCC_BANDS))", os.path.abspath(A.check)], capture_output=True, text=True, check=True).stdout
    S = json.loads(js); bad = 0
    for g, v in res.items():
        s = S.get(str(g))
        same = s is not None and [(x["a"], x["b"]) for x in s["bands"]] == [(x["a"], x["b"]) for x in v["bands"]]
        bad += not same; print(v["ch"], g, "same as the site" if same else ("NOT on the site" if s is None else "DIFFERENT from the site"))
    sys.exit(1 if bad else 0)
print(json.dumps(res, ensure_ascii=False))
