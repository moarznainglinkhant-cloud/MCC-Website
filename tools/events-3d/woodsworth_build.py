# Woodsworth College: the new academic building on St George (stacked, shifted fin-wrapped glass boxes over a stone and brick base), with one of the old brick houses beside it.
# Writes woodsworth-college.glb. Axes as the other models: x = east, y = up, z = south (north is -z). Origin = the Woodsworth origin used by the page.
import numpy as np, json, struct, io, sys
from PIL import Image, ImageDraw
rng = np.random.default_rng(7)

# ---------------------------------------------------------------- textures
def tex(fn, size=256, q=86):
    im = Image.new("RGB", (size, size)); fn(im, ImageDraw.Draw(im), size); b = io.BytesIO(); im.save(b, "JPEG", quality=q); return b.getvalue()
def noise(im, amt):
    a = np.asarray(im).astype(np.int16); a += rng.integers(-amt, amt + 1, a.shape[:2] + (1,), dtype=np.int16); return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
def t_fin(im, d, s):                       # pale vertical fins in front of glass; one tile = 3.2 m wide, 4 m (one floor) tall
    for y in range(s): d.line([(0, y), (s, y)], fill=(86 + y // 7, 100 + y // 7, 112 + y // 8))
    d.rectangle([0, 0, s, 12], fill=(206, 198, 180)); d.rectangle([0, 13, s, 18], fill=(70, 74, 78))            # floor edge
    for i in range(16):
        x = i * 16 + 4; c = int(rng.integers(-9, 10)); d.rectangle([x, 0, x + 7, s], fill=(233 + c // 2, 224 + c // 2, 203 + c)); d.line([(x + 7, 0), (x + 7, s)], fill=(176, 166, 146))
def t_bronze(im, d, s):                    # dark bronze fins in front of a warm lobby
    for y in range(s): d.line([(0, y), (s, y)], fill=(236 - y // 7, 200 - y // 7, 140 - y // 8))
    d.rectangle([0, 0, s, 7], fill=(58, 42, 30))
    for i in range(16):
        x = i * 16 + 5; d.rectangle([x, 0, x + 4, s], fill=(84, 60, 42)); d.line([(x, 0), (x, s)], fill=(112, 84, 58))
def t_glass(im, d, s):                     # clear glazing with thin mullions and a warm room behind; one tile = 3 m by one floor
    for y in range(s): k = y / s; d.line([(0, y), (s, y)], fill=(int(150 + 60 * k), int(170 + 22 * k), int(186 - 40 * k)))
    d.rectangle([0, 0, s, 6], fill=(70, 72, 74)); d.rectangle([0, 0, 4, s], fill=(70, 72, 74)); d.rectangle([s // 2, 0, s // 2 + 2, s], fill=(96, 98, 100))
def t_brick(im, d, s):
    d.rectangle([0, 0, s, s], fill=(150, 132, 118)); bw, bh = s // 8, s // 20
    for r in range(21):
        for c in range(-1, 9):
            x = c * bw + (bw // 2 if r % 2 else 0); k = int(rng.integers(-16, 17)); d.rectangle([x + 1, r * bh + 1, x + bw - 2, r * bh + bh - 2], fill=(158 + k, 74 + k // 2, 56 + k // 2))
def t_stone(im, d, s):                     # coursed rubble
    d.rectangle([0, 0, s, s], fill=(96, 92, 86)); y = 0
    while y < s:
        h = int(rng.integers(16, 30)); x = -int(rng.integers(0, 30))
        while x < s:
            w = int(rng.integers(24, 60)); k = int(rng.integers(-18, 19)); d.rectangle([x + 1, y + 1, x + w - 2, y + h - 2], fill=(146 + k, 142 + k, 132 + k)); x += w
        y += h
def t_concrete(im, d, s):
    d.rectangle([0, 0, s, s], fill=(176, 178, 176))
    for y in range(0, s, 32): d.line([(0, y), (s, y)], fill=(150, 152, 150))
def t_paving(im, d, s):
    d.rectangle([0, 0, s, s], fill=(150, 148, 142))
    for i in range(0, s, 64): d.line([(i, 0), (i, s)], fill=(124, 122, 116)); d.line([(0, i), (s, i)], fill=(124, 122, 116))
def t_roof(im, d, s):
    d.rectangle([0, 0, s, s], fill=(74, 76, 80))
    for y in range(0, s, 16): d.line([(0, y), (s, y)], fill=(58, 60, 64))
def t_soffit(im, d, s):
    d.rectangle([0, 0, s, s], fill=(120, 74, 44))
    for x in range(0, s, 32): d.line([(x, 0), (x, s)], fill=(96, 58, 34))
MATS = {  # name: (texture fn, noise, roughness, metallic, metres per tile u, v)
    "UofT_FinGlass":     (t_fin, 3, .45, .1, 3.2, 4.0),
    "UofT_BronzeGlass":  (t_bronze, 3, .4, .3, 3.2, 4.5),
    "UofT_CurtainGlass": (t_glass, 2, .12, .2, 3.0, 5.5),
    "UofT_WallSecondary":(t_brick, 6, .9, 0, 1.6, 1.6),
    "UofT_StoneWall":    (t_stone, 8, .93, 0, 3.0, 3.0),
    "UofT_StoneTrim":    (t_concrete, 5, .8, 0, 4.0, 4.0),
    "UofT_Paving":       (t_paving, 5, .88, 0, 4.0, 4.0),
    "UofT_RoofSlate":    (t_roof, 4, .7, 0, 3.0, 3.0),
    "UofT_Soffit":       (t_soffit, 4, .5, .4, 3.0, 3.0),
    "UofT_LeadedGlass":  (None, 0, .12, 0, 1, 1),
    "UofT_Interior":     (None, 0, 1, 0, 1, 1),
    "UofT_Door":         (None, 0, .5, .2, 1, 1),
}
FLAT = { "UofT_LeadedGlass": [.16, .2, .25, 1], "UofT_Interior": [.85, .68, .45, 1], "UofT_Door": [.3, .2, .13, 1] }

# ---------------------------------------------------------------- geometry
geo = {}   # node name → material → lists
def quad(node, mat, p0, p1, p2, p3):       # corners counter-clockwise seen from outside; uv from world metres
    g = geo.setdefault(node, {}).setdefault(mat, {"p": [], "n": [], "uv": [], "i": []}); P = [np.array(p, float) for p in (p0, p1, p2, p3)]
    n = np.cross(P[1] - P[0], P[3] - P[0]); n /= np.linalg.norm(n); su, sv = MATS[mat][4], MATS[mat][5]; b = len(g["p"])
    for p in P:
        if abs(n[1]) > .7: u, v = p[0], p[2]
        elif abs(n[0]) > abs(n[2]): u, v = p[2], p[1]
        else: u, v = p[0], p[1]
        g["p"].append(p); g["n"].append(n); g["uv"].append((u / su, -v / sv))
    g["i"] += [b, b + 1, b + 2, b, b + 2, b + 3]
def box(node, mat, x0, x1, y0, y1, z0, z1, top=None, skip=""):
    if "s" not in skip: quad(node, mat, (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1))     # south (+z)
    if "n" not in skip: quad(node, mat, (x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0))     # north
    if "e" not in skip: quad(node, mat, (x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1))     # east (+x)
    if "w" not in skip: quad(node, mat, (x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0))     # west
    if "t" not in skip: quad(node, top or mat, (x0, y1, z1), (x1, y1, z1), (x1, y1, z0), (x0, y1, z0))
    if "b" not in skip: quad(node, top or mat, (x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1))
def window(node, face, a, y, w, h, at, depth=.06, mat="UofT_LeadedGlass"):   # a pane just proud of a wall; face = which way it looks
    if face == "s": quad(node, mat, (a, y, at + depth), (a + w, y, at + depth), (a + w, y + h, at + depth), (a, y + h, at + depth))
    if face == "n": quad(node, mat, (a + w, y, at - depth), (a, y, at - depth), (a, y + h, at - depth), (a + w, y + h, at - depth))
    if face == "e": quad(node, mat, (at + depth, y, a + w), (at + depth, y, a), (at + depth, y + h, a), (at + depth, y + h, a + w))
    if face == "w": quad(node, mat, (at - depth, y, a), (at - depth, y, a + w), (at - depth, y + h, a + w), (at - depth, y + h, a))

B = "Woodsworth"
# ground
box(B + "_Paving", "UofT_Paving", -40, 26, 0, .05, -13, 17, skip="b")
# base: rubble stone at the west end, a bronze-finned double-height lobby toward the street
box(B + "_Stone", "UofT_StoneWall", -11, -2, 0, 9, -9, 9, top="UofT_RoofSlate", skip="be")
for fy in (1.4, 5.4):
    for fx in (-9.3, -5.6): window(B + "_Glass", "s", fx, fy, 1.5, 2.5, 9)
box(B + "_Lobby", "UofT_BronzeGlass", -2, 12, 0, 9, -9, 9, top="UofT_RoofSlate", skip="bw")
box(B + "_Trim", "UofT_StoneTrim", -11.2, 12.2, 8.6, 9.0, -9.2, 9.2)                                   # the slab the upper boxes sit on
# brick wing and the tall concrete stack beside the old houses
box(B + "_Brick", "UofT_WallSecondary", -19, -11, 0, 11, -7, 9, top="UofT_RoofSlate", skip="b")
for fy in (1.6, 6.2):
    for fx in (-17.6, -14.2): window(B + "_Glass", "s", fx, fy, 1.4, 2.6, 9)
    window(B + "_Glass", "w", -4, fy, 1.4, 2.6, -19); window(B + "_Glass", "w", 3, fy, 1.4, 2.6, -19)
box(B + "_Brick", "UofT_WallSecondary", -15.5, -11, 0, 11, 9, 10.2, skip="bn")
box(B + "_Trim", "UofT_StoneTrim", -15.5, -11, 11, 22, 5.6, 10.2, skip="b")
# first glass box: shifted east, hanging out over the street, its underside sloping up to the outer edge
N1 = B + "_Fins"; x0, x1, xe, y0, y1, ys, z0, z1 = -9, 12, 20, 9, 17, 12.6, -9, 9
quad(N1, "UofT_FinGlass", (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)); quad(N1, "UofT_FinGlass", (x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0))
quad(N1, "UofT_FinGlass", (x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0))
quad(N1, "UofT_FinGlass", (x1, y0, z1), (xe, ys, z1), (xe, y1, z1), (x1, y1, z1)); quad(N1, "UofT_FinGlass", (xe, ys, z0), (x1, y0, z0), (x1, y1, z0), (xe, y1, z0))
quad(N1, "UofT_FinGlass", (xe, ys, z1), (xe, ys, z0), (xe, y1, z0), (xe, y1, z1))
quad(B + "_Soffit", "UofT_Soffit", (x1, y0, z0), (xe, ys, z0), (xe, ys, z1), (x1, y0, z1))
quad(B + "_Roof", "UofT_RoofSlate", (x0, y1, z1), (xe, y1, z1), (xe, y1, z0), (x0, y1, z0))
# set-back clear storey with a terrace
box(B + "_CurtainGlass", "UofT_CurtainGlass", -7, 16, 17, 22.5, -7.5, 7.5, skip="bt")
box(B + "_Trim", "UofT_StoneTrim", -9.2, 20.2, 17, 17.35, -9.2, 9.2)
# top glass box, with a clear slash where the stair climbs behind the fins
box(B + "_Fins", "UofT_FinGlass", -9, 17, 22.5, 35, -9, 9, top="UofT_RoofSlate", skip="")
quad(B + "_CurtainGlass", "UofT_CurtainGlass", (-5, 23.2, 9.08), (6, 28.2, 9.08), (6, 31.6, 9.08), (-5, 26.6, 9.08))
quad(B + "_CurtainGlass", "UofT_CurtainGlass", (17.08, 24, 7), (17.08, 24, -3), (17.08, 28.5, -3), (17.08, 28.5, 7))
box(B + "_Trim", "UofT_StoneTrim", -9.15, 17.15, 34.7, 35.15, -9.15, 9.15)
# warm rooms behind the clear glass
box(B + "_Interior", "UofT_Interior", -6.6, 15.6, 17.4, 22.4, -7.1, 7.1, skip="bt")
# doors in the lobby's south wall, and the step in front
quad("Door_Main_L", "UofT_Door", (3.0, .1, 9.1), (4.0, .1, 9.1), (4.0, 2.7, 9.1), (3.0, 2.7, 9.1)); quad("Door_Main_L", "UofT_Door", (4.0, .1, 9.04), (3.0, .1, 9.04), (3.0, 2.7, 9.04), (4.0, 2.7, 9.04))
quad("Door_Main_R", "UofT_Door", (4.0, .1, 9.1), (5.0, .1, 9.1), (5.0, 2.7, 9.1), (4.0, 2.7, 9.1)); quad("Door_Main_R", "UofT_Door", (5.0, .1, 9.04), (4.0, .1, 9.04), (4.0, 2.7, 9.04), (5.0, 2.7, 9.04))
box(B + "_Trim", "UofT_StoneTrim", 2.6, 5.4, 2.7, 3.0, 9.0, 9.5); box(B + "_Paving", "UofT_Paving", 1.5, 6.5, .05, .1, 9, 12, skip="b")
# one of the old brick houses on St George, to the west of the brick wing
H = B + "_House"; hx0, hx1, hz0, hz1, he, hr = -36, -22, 1, 13, 8, 13
box(H, "UofT_WallSecondary", hx0, hx1, 0, he, hz0, hz1, skip="bt"); zm = (hz0 + hz1) / 2
quad(B + "_Roof", "UofT_RoofSlate", (hx0 - .4, he, hz1 + .4), (hx1 + .4, he, hz1 + .4), (hx1 + .4, hr, zm), (hx0 - .4, hr, zm)); quad(B + "_Roof", "UofT_RoofSlate", (hx1 + .4, he, hz0 - .4), (hx0 - .4, he, hz0 - .4), (hx0 - .4, hr, zm), (hx1 + .4, hr, zm))
for xx, s in ((hx0, -1), (hx1, 1)):         # gable ends
    g = geo.setdefault(H, {}).setdefault("UofT_WallSecondary", {"p": [], "n": [], "uv": [], "i": []}); b = len(g["p"]); pts = [(xx, he, hz0), (xx, he, hz1), (xx, hr, zm)]
    for p in pts: g["p"].append(np.array(p, float)); g["n"].append(np.array([s, 0, 0.])); g["uv"].append((p[2] / 1.6, -p[1] / 1.6))
    g["i"] += [b, b + 1, b + 2] if s > 0 else [b + 1, b, b + 2]
for fy in (1.2, 4.7):
    for fx in (-34.4, -30.6, -26.8, -24.2): window(B + "_Glass", "s", fx, fy, 1.1, 2.2, hz1)
    for fz in (3, 9): window(B + "_Glass", "w", fz, fy, 1.1, 2.2, hx0)
box(H, "UofT_WallSecondary", -31, -26, 0, 10.5, hz1, hz1 + 1.6, top="UofT_RoofSlate", skip="bn")           # a projecting bay
box(B + "_Trim", "UofT_StoneTrim", hx0 + 2, hx0 + 3.2, hr - 1.5, hr + 1.8, zm - .6, zm + .6)                # chimney

# ---------------------------------------------------------------- write the glb
blob = bytearray(); views = []; accs = []
def view(data, target=None):
    while len(blob) % 4: blob.append(0)
    v = {"buffer": 0, "byteOffset": len(blob), "byteLength": len(data)};
    if target: v["target"] = target
    blob.extend(data); views.append(v); return len(views) - 1
def acc(arr, typ, comp, target, mm=False):
    a = {"bufferView": view(arr.tobytes(), target), "componentType": comp, "count": len(arr), "type": typ}
    if mm: a["min"] = arr.min(0).tolist(); a["max"] = arr.max(0).tolist()
    accs.append(a); return len(accs) - 1
names = list(MATS); images, textures, materials = [], [], []
for n in names:
    fn, nz, rough, metal, _, _ = MATS[n]; m = {"name": n, "pbrMetallicRoughness": {"roughnessFactor": rough, "metallicFactor": metal}, "doubleSided": True}
    if fn:
        data = tex(lambda im, d, s: fn(im, d, s));
        if nz: im = noise(Image.open(io.BytesIO(data)), nz); b = io.BytesIO(); im.save(b, "JPEG", quality=86); data = b.getvalue()
        images.append({"bufferView": view(data), "mimeType": "image/jpeg"}); textures.append({"source": len(images) - 1, "sampler": 0}); m["pbrMetallicRoughness"]["baseColorTexture"] = {"index": len(textures) - 1}
    else: m["pbrMetallicRoughness"]["baseColorFactor"] = FLAT[n]
    if n == "UofT_Interior": m["emissiveFactor"] = [.25, .17, .08]
    materials.append(m)
nodes, meshes = [], []
for node, by in geo.items():
    prims = []
    for mat, g in by.items():
        prims.append({"attributes": {"POSITION": acc(np.array(g["p"], np.float32), "VEC3", 5126, 34962, True), "NORMAL": acc(np.array(g["n"], np.float32), "VEC3", 5126, 34962), "TEXCOORD_0": acc(np.array(g["uv"], np.float32), "VEC2", 5126, 34962)},
                      "indices": acc(np.array(g["i"], np.uint32), "SCALAR", 5125, 34963), "material": names.index(mat)})
    meshes.append({"name": node, "primitives": prims}); nodes.append({"name": node, "mesh": len(meshes) - 1})
nodes.append({"name": "Entrance_Main", "translation": [4.0, .1, 10.4]}); nodes.append({"name": "View_Front", "translation": [40, 1.7, 46]})
nodes.append({"name": "WoodsworthCollege", "children": list(range(len(nodes)))})
while len(blob) % 4: blob.append(0)
j = {"asset": {"version": "2.0", "generator": "woodsworth build.py", "copyright": "© 2026 Naing Lin Khant (Moarz). All rights reserved."}, "scene": 0, "scenes": [{"nodes": [len(nodes) - 1]}], "nodes": nodes, "meshes": meshes, "materials": materials,
     "textures": textures, "images": images, "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}], "accessors": accs, "bufferViews": views, "buffers": [{"byteLength": len(blob)}]}
js = json.dumps(j, separators=(",", ":")).encode(); js += b" " * (-len(js) % 4)
out = sys.argv[1] if len(sys.argv) > 1 else "woodsworth-college.glb"
with open(out, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, 12 + 8 + len(js) + 8 + len(blob))); f.write(struct.pack("<I4s", len(js), b"JSON")); f.write(js); f.write(struct.pack("<I4s", len(blob), b"BIN\0")); f.write(blob)
print(out, 12 + 16 + len(js) + len(blob), "bytes", sum(len(g["i"]) // 3 for by in geo.values() for g in by.values()), "triangles")
