"""Turn the HCP1065 tractography atlas into a small file for the About page brain band.

Input: the unzipped hcp1065_avg_tracts_trk folder (77 .trk.gz bundles, RAS mm).
Output: brain.bin, little-endian:
  magic 'MCCB', uint32 version=1, uint32 nStreamlines, uint32 pointsPerStreamline,
  float32 scale (mm per int16 unit),
  int16  positions[n*k*3]   (RAS mm / scale, centred on the brain)
  uint8  colors[n*3]        (one colour per streamline)
  uint8  phases[n]          (random 0-255, for the travelling pulses)
  uint8  midline[n]         (0-255: how close the streamline gets to the midline, for the grow-in)
Version 2 appends two more sections (when --mesh and --swc are given):
  cortex: uint32 nPts, int16 pos[nPts*3] (same frame and scale as the fibres), int8 normal[nPts*3]
          (one hemisphere; the page mirrors it for the other)
  neurons: uint32 nNeurons, then per neuron: uint32 nVerts (line-list pairs), int16 xy[nVerts*2]
          (micrometres x 4, soma at 0,0, apical dendrite up), uint8 dist[nVerts] (path distance from the soma, 0-255)
Usage: python3 brain-fibres.py <atlas_dir> <out.bin> [target_streamlines] [points] [--mesh lh.mz3] [--swc dir]
"""
import colorsys, glob, os, struct, sys
import numpy as np
import nibabel as nib

args = sys.argv[1:]
def opt(name):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return None
MESH, SWC = opt("--mesh"), opt("--swc")
src, out = args[0], args[1]
TARGET = int(args[2]) if len(args) > 2 else 3000
K = int(args[3]) if len(args) > 3 else 21
rng = np.random.default_rng(7)


def resample(line, k):
    d = np.r_[0, np.cumsum(np.linalg.norm(np.diff(line, axis=0), axis=1))]
    if d[-1] < 1e-6:
        return None
    t = np.linspace(0, d[-1], k)
    return np.stack([np.interp(t, d, line[:, i]) for i in range(3)], 1)


files = sorted(glob.glob(os.path.join(src, "**", "*.trk.gz"), recursive=True))
bundles = []
for f in files:
    s = nib.streamlines.load(f).streamlines
    bundles.append((os.path.relpath(f, src), s))
    print(f"{len(s):7d}  {os.path.relpath(f, src)}", file=sys.stderr)

# Share streamlines out by sqrt(bundle size) so small bundles still show up.
w = np.array([np.sqrt(len(s)) for _, s in bundles])
quota = np.maximum(8, np.round(w / w.sum() * TARGET)).astype(int)

lines, bid = [], []
boff = rng.normal(0, 0.05, len(bundles))  # each bundle gets its own small hue shift
for b, ((name, s), q) in enumerate(zip(bundles, quota)):
    idx = rng.choice(len(s), size=min(q, len(s)), replace=False)
    for i in idx:
        r = resample(np.asarray(s[i], np.float32), K)
        if r is not None and np.linalg.norm(r[-1] - r[0]) > 12:  # skip stubs
            lines.append(r); bid.append(b)
P = np.stack(lines)  # n, K, 3
n = len(P)

centre = (P.reshape(-1, 3).min(0) + P.reshape(-1, 3).max(0)) / 2
P -= centre
scale = float(np.abs(P).max() / 32000)

# Colour: hue sweeps across the brain left to right, so the two hemispheres meet at the
# sagittal midline (green-yellow on the left, magenta-violet on the right), with jitter.
cx = P[:, :, 0].mean(1)
u = np.argsort(np.argsort(cx)) / (len(cx) - 1)  # by rank, so the full colour range is used
cols = []
for ui, b in zip(u, bid):
    h = (0.15 + 0.68 * ui + boff[b] + rng.normal(0, 0.025)) % 1.0  # yellow -> green -> cyan -> blue -> magenta
    s_ = np.clip(0.75 + rng.normal(0, 0.1), 0.55, 0.95)
    v = np.clip(0.95 + rng.normal(0, 0.05), 0.8, 1)
    cols.append([int(c * 255) for c in colorsys.hsv_to_rgb(h, s_, v)])
cols = np.array(cols, np.uint8)
phase = rng.integers(0, 256, n, dtype=np.uint8)
mid = np.abs(P[:, :, 0]).min(1)
midline = (255 * (1 - np.clip(mid / mid.max(), 0, 1))).astype(np.uint8)

VERSION = 2 if (MESH and SWC) else 1
with open(out, "wb") as fh:
    fh.write(b"MCCB" + struct.pack("<IIIf", VERSION, n, K, scale))
    fh.write(np.round(P / scale).astype("<i2").tobytes())
    fh.write(cols.tobytes()); fh.write(phase.tobytes()); fh.write(midline.tobytes())
    if VERSION == 2:
        import gzip
        b = open(MESH, "rb").read()
        if b[:2] == b"\x1f\x8b": b = gzip.decompress(b)
        _, _, nf, nv, nskip = struct.unpack("<HHIII", b[:16]); o = 16 + nskip
        F = np.frombuffer(b, np.int32, nf * 3, o).reshape(-1, 3); o += nf * 12
        V = np.frombuffer(b, np.float32, nv * 3, o).reshape(-1, 3).astype(np.float64)
        N = np.zeros_like(V)                       # vertex normals from the full mesh
        fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
        for c in range(3): np.add.at(N, F[:, c], fn)
        N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-9
        keep = 10242 if nv == 40962 else nv        # icosphere mesh: the first 10,242 vertices are an even subset
        Vc, Nc = V[:keep] - centre, N[:keep]
        fh.write(struct.pack("<I", keep))
        fh.write(np.round(Vc / scale).astype("<i2").tobytes())
        fh.write(np.round(Nc * 127).astype("i1").tobytes())
        files = sorted(glob.glob(os.path.join(SWC, "*.swc")))
        fh.write(struct.pack("<I", len(files)))
        for f in files:
            d = np.loadtxt(f, comments="#", ndmin=2)
            idx = {int(r[0]): i for i, r in enumerate(d)}
            root = next(i for i, r in enumerate(d) if int(r[6]) == -1)
            xy = d[:, 2:4] - d[root, 2:4]
            dist = np.zeros(len(d))
            for i, r in enumerate(d):              # SWC lists parents before children
                p = idx.get(int(r[6]))
                if p is not None: dist[i] = dist[p] + np.linalg.norm(d[i, 2:5] - d[p, 2:5])
            segs = [(idx[int(r[6])], i) for i, r in enumerate(d) if int(r[6]) in idx]
            ids = np.array(segs).reshape(-1)
            fh.write(struct.pack("<I", len(ids)))
            fh.write(np.round(xy[ids] * 4).astype("<i2").tobytes())
            fh.write((255 * dist[ids] / dist.max()).astype(np.uint8).tobytes())
            print(f"neuron {os.path.basename(f)}: {len(segs)} segments", file=sys.stderr)
print(f"{n} streamlines x {K} points, {os.path.getsize(out)/1024:.0f} KB, extent mm {np.ptp(P.reshape(-1,3),0).round(1)}", file=sys.stderr)
