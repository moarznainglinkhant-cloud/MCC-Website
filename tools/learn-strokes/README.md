# Learn Burmese stroke data: how js/learn-data.js was made

Not part of the live site. Keep for regenerating the strokes.

1. Font: Noto Sans Myanmar variable TTF from google/fonts (`ofl/notosansmyanmar/NotoSansMyanmar[wdth,wght].ttf`), saved here as `f_NotoSansMyanmarBwdthCwghtD.ttf`.
2. `translit.js` is the name engine (same code as the top of `js/learn.js`, plus a `module.exports` line). A node one-liner lists every letter+mark cluster it can output into `clusters.json`.
3. `gen2.py` (needs fonttools, freetype-py, uharfbuzz, scikit-image, opencv, Pillow): rasterises each glyph, thins it to a centre-line, and orders the strokes. The 33 consonants use the hand-written `SPEC` table (node/edge ids from `strokes.py`'s debug sheet `graph.png`); every other glyph (vowel signs, medials, variants) is ordered automatically. Writes `raw.json` and the debug sheets `dbg_cons.png` / `dbg_auto.png`.
4. A short script turns `raw.json` into `js/learn-data.js` (G = glyph strokes, C = cluster layouts from HarfBuzz, K = consonant glyph ids).

To change one letter's stroke order, edit its `SPEC` entry in `gen2.py` and regenerate.
