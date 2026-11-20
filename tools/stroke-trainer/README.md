# MCC Stroke Trainer — versions and batches

The writing animations on the Learn page (`js/learn-bands.js`) are made by hand in the
[MCC Stroke Trainer](https://claude.ai/artifact/Y9K5RXHJi7bxJyQGfxsSNL). The trainer changes over time, so this
folder keeps **every version that produced letters on the site** and **which letters each one made**, so any
batch can be checked or redone later.

| File | What it is |
|---|---|
| `trainer-v4.0.html`, `trainer-v4.1.html`, `trainer-v4.2.html` | The trainer exactly as it was for each version (open in a browser; needs internet for one library). Saving only works in the live artifact. |
| `batches.json` | Each batch: date, trainer version, letters (with glyph ids), and every choice made for each letter (cuts, moved or switched-off ends, writing order, where the pen starts, direction). |
| `replay.py` | Runs a trainer version on the saved choices and prints the bands, or checks them against `js/learn-bands.js`. |

## Batches

| Batch (id) | Date | Trainer | Letters |
|---|---|---|---|
| 1 (`1`) | Nov 20, 2026 | v4.0 | ဂ င ဎ ပ လ ဝ |
| 2, part 1 (`2.1`) | Nov 20, 2026 | v4.1 | က ခ ဃ ဆ ဇ တ ထ န ဖ ဘ ယ သ |
| 2, part 2 (`2.2`) | Nov 20, 2026 | v4.2 | စ ဈ ဓ |

v4.2 reproduces every letter above exactly (checked with `replay.py --check`). v4.1 reproduces batches 1 and 2.1;
v4.0 only batch 1 (it can't cut overlaps).

**Later:** a general trainer that loads each letter with the version it was made in (from `batches.json`), so its
order and direction can be changed without redoing the rest.

## Versions

- **v4.0** — each stroke is a band between the font's two borders; each font shape is a piece. Overlapping shapes are each swept whole.
- **v4.1** — overlaps cut by click order: the piece clicked first keeps the overlap; a later piece is cut along the earlier one's border, and the cut becomes one of its ends.
- **v4.2** — where a cut bulges *away* from the band (စ: the inner band meets the ring's inner border), the band first sweeps along the cut edge, so its straight front doesn't leave a sliver. Saves include the version (`tool`). Where the cut bulges into the band (က), nothing changes, because the front only crosses ink that's already painted.

## Redoing letters

- **One letter, by hand:** take it out of `meta/done` in the trainer's database (ask Claude), redo and save it in the trainer, then replace its entry in `js/learn-bands.js`.
- **A whole batch with a newer trainer, or a different direction:** edit the choices in `batches.json` if needed (`order[].start` = the end where the pen starts; `dir` turns a ring round), then

  ```
  python3 replay.py trainer-v4.2.html --batch 2.1          # prints the new bands as JSON
  python3 replay.py trainer-v4.2.html --batch 1 2 --check ../../js/learn-bands.js   # compare with the site
  ```

  `replay.py` needs `pip install playwright && playwright install chromium`.

When a new trainer version is used for a batch, add its file here, add it to `versions` in `batches.json`, and add the batch.
