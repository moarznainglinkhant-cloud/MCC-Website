#!/usr/bin/env python3
"""Make test clips in both Azure Burmese voices so we can pick one.

Run on your Mac (needs internet; standard library only):
    export AZURE_SPEECH_KEY="..."        # Azure portal -> your Speech resource -> Keys and Endpoint
    export AZURE_SPEECH_REGION="eastus"  # the Location/Region shown on that same page
    python3 tools/tts/samples.py
Clips land in tools/tts/samples/ (not for the site; delete after choosing).
"""
import os, sys, urllib.request, urllib.error
from xml.sax.saxutils import escape

KEY = os.environ.get("AZURE_SPEECH_KEY")
REGION = os.environ.get("AZURE_SPEECH_REGION")
if not KEY or not REGION:
    sys.exit("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION first (see the top of this file).")

VOICES = ["my-MM-NilarNeural", "my-MM-ThihaNeural"]
# (file name, parts spoken with a short pause between)
CLIPS = [
    ("01-ka",       ["က", "ကကြီး"]),            # sound, then traditional name
    ("02-kha",      ["ခ", "ခခွေး"]),
    ("03-nya",      ["ည", "ည"]),
    ("04-tha",      ["သ", "သ"]),
    ("05-hello",    ["မင်္ဂလာပါ"]),
    ("06-name",     ["နိုင်လင်းခန့်"]),            # a name (Naing Lin Khant)
]
URL = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "samples")
os.makedirs(OUT, exist_ok=True)

def ssml(voice, parts):
    body = '<break time="450ms"/>'.join(escape(p) for p in parts)
    return (f'<speak version="1.0" xml:lang="my-MM"><voice name="{voice}">'
            f'<prosody rate="-10%">{body}</prosody></voice></speak>').encode("utf-8")

for v in VOICES:
    short = v.split("-")[2].replace("Neural", "").lower()
    for name, parts in CLIPS:
        req = urllib.request.Request(URL, data=ssml(v, parts), method="POST", headers={
            "Ocp-Apim-Subscription-Key": KEY,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
            "User-Agent": "MCC-Website-tts-samples/1.0",
        })
        try:
            data = urllib.request.urlopen(req, timeout=30).read()
        except urllib.error.HTTPError as e:
            sys.exit(f"Azure said {e.code} for {v} {name}: {e.read()[:300]!r}  (check key/region)")
        path = os.path.join(OUT, f"{short}-{name}.mp3")
        open(path, "wb").write(data)
        print("wrote", os.path.relpath(path), len(data), "bytes")
print("Done. Open tools/tts/samples/ and listen.")
