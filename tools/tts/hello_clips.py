"""Build the two Hello clips from the native recordings.

mingalaba.mp3      = the full word, from "3rd Street 32" (same recording as "Mingalabar Thansin Cho").
mingalaba-slow.mp3 = min · ga · la · ba cut from recording "6", with 0.55 s of silence between them.
Prints the syllable spans (seconds into each finished clip) for HELLO_CLIPS in ask-mcc widget/src/actions.tsx.
"1" (unused-1.m4a) was the third option; its ga runs into la with no dip, so it was not used.
"""
import json, subprocess, numpy as np
from pathlib import Path
# Run from the website folder:  python3 tools/tts/hello_clips.py   (needs ffmpeg + numpy)

SR = 48000
HERE = Path(__file__).parent
UP = str(HERE / "hello_src") + "/"
OUT = HERE.parent.parent / "audio"

def load(name):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", UP + name, "-ac", "1", "-ar", str(SR),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    # remove DC and rumble below ~70 Hz (one-pole high-pass)
    y = np.empty_like(x); a = np.exp(-2 * np.pi * 70 / SR); prev_x = prev_y = 0.0
    for i, v in enumerate(x):
        prev_y = a * (prev_y + v - prev_x); prev_x = v; y[i] = prev_y
    return y

def cut(x, a, b, fin=0.008, fout=0.015):
    s = x[int(a * SR):int(b * SR)].copy()
    ni, no = int(fin * SR), int(fout * SR)
    s[:ni] *= np.linspace(0, 1, ni) ** 2
    s[-no:] *= np.linspace(1, 0, no) ** 2
    return s

def speech_rms(s):
    f = s[: len(s) // 480 * 480].reshape(-1, 480)
    r = np.sqrt((f ** 2).mean(1)); return np.sqrt((r[r > r.max() * 0.2] ** 2).mean())

def level(s, target):  # same speech loudness for both clips, peak kept under -1.5 dBFS
    g = target / speech_rms(s)
    g = min(g, 10 ** (-1.5 / 20) / np.abs(s).max())
    return s * g

def write(s, path):
    pcm = (np.clip(s, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-ar", "44100", "-ac", "1", "-b:a", "128k", path], input=pcm, check=True)

TARGET = 0.12  # speech RMS (~ -18 dBFS)

# --- full word: 3rd Street 32 -------------------------------------------------------------
full = load("full-3rd-street-32.m4a")
A = 0.53                                       # clip starts here in the original
normal = level(cut(full, A, 1.60, 0.03, 0.07), TARGET)
# syllable starts in the original: min 0.60, ga 0.855, la 0.97 (F1 drops into the /l/), ba 1.325 (after closure)
nb = [(0.595, 0.845), (0.850, 0.970), (0.970, 1.225), (1.320, 1.490)]
normal_spans = [{"start": round(a - A, 3), "end": round(b - A, 3)} for a, b in nb]

# --- syllables: recording 6 ---------------------------------------------------------------
six = load("syllables-6.m4a")
cuts = [("min", 0.300, 0.648), ("ga", 0.652, 0.892), ("la", 0.885, 1.205), ("ba", 1.285, 1.560)]
GAP, LEAD, TAIL = 0.55, 0.05, 0.15
parts, slow_spans, t = [np.zeros(int(LEAD * SR))], [], LEAD
for name, a, b in cuts:
    s = cut(six, a, b)
    parts.append(s); slow_spans.append({"start": round(t, 3), "end": round(t + len(s) / SR, 3)})
    t += len(s) / SR
    parts.append(np.zeros(int((GAP if name != "ba" else TAIL) * SR))); t += GAP if name != "ba" else TAIL
slow = level(np.concatenate(parts), TARGET)

write(normal, str(OUT / "mingalaba.mp3"))
write(slow, str(OUT / "mingalaba-slow.mp3"))
print(json.dumps({"normal": normal_spans, "slow": slow_spans,
                  "durations": {"normal": len(normal) / SR, "slow": len(slow) / SR}}, indent=1))
