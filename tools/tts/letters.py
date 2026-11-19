#!/usr/bin/env python3
"""Make the Learn page's letter clips: each letter's sound, a pause, then its traditional name
(က … ကကြီး), read by Azure's Burmese voice Nilar. Writes audio/learn/<code point>.mp3
(e.g. audio/learn/1000.mp3 for က). Run once on your Mac; commit the audio/learn folder.

    export AZURE_SPEECH_KEY="..."
    export AZURE_SPEECH_REGION="northcentralus"
    python3 tools/tts/letters.py            # only makes missing clips
    python3 tools/tts/letters.py --all      # remakes all 33

The letter list is read from js/learn.js (LETTERS), so it never drifts from the page.
Azure's free tier allows about 20 clips a minute, so this waits 3.2 s between clips (~2 minutes).
"""
import os
import re
import sys
import time
import urllib.error
import urllib.request
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VOICE = "my-MM-NilarNeural"
KEY, REGION = os.environ.get("AZURE_SPEECH_KEY"), os.environ.get("AZURE_SPEECH_REGION")
if not KEY or not REGION:
    sys.exit("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION first (see the top of this file).")

src = open(os.path.join(ROOT, "js", "learn.js"), encoding="utf-8").read()
block = re.search(r"var LETTERS = \[(.*?)\];", src, re.S).group(1)
letters = re.findall(r'\["([^"]+)","([^"]+)","([^"]+)","([^"]+)"\]', block)
assert len(letters) == 33, f"expected 33 letters in js/learn.js, found {len(letters)}"

out_dir = os.path.join(ROOT, "audio", "learn")
os.makedirs(out_dir, exist_ok=True)
url = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
remake = "--all" in sys.argv
made = 0
for glyph, sound, roman, name in letters:
    path = os.path.join(out_dir, f"{ord(glyph):04x}.mp3")
    if os.path.exists(path) and not remake:
        continue
    parts = [glyph] if name == glyph else [glyph, name]
    body = '<break time="500ms"/>'.join(escape(p) for p in parts)
    ssml = (f'<speak version="1.0" xml:lang="my-MM"><voice name="{VOICE}">'
            f'<prosody rate="-15%">{body}</prosody></voice></speak>').encode("utf-8")
    req = urllib.request.Request(url, data=ssml, method="POST", headers={
        "Ocp-Apim-Subscription-Key": KEY, "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3", "User-Agent": "MCC-Website-letters/1.0"})
    for attempt in range(3):
        try:
            data = urllib.request.urlopen(req, timeout=30).read()
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(20)
                continue
            sys.exit(f"Azure said {e.code} for {glyph} ({sound}): {e.read()[:200]!r}")
    with open(path, "wb") as f:
        f.write(data)
    made += 1
    print(f"{glyph}  {sound:<4} {roman:<16} -> audio/learn/{os.path.basename(path)} ({len(data)} bytes)")
    time.sleep(3.2)
print(f"Done: {made} new clip(s). Commit the audio/learn folder.")
