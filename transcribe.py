from faster_whisper import WhisperModel
import sys
import os

# Get audio path from terminal argument
audio_path = sys.argv[1]

# Supported languages
SUPPORTED_LANGUAGES = {"en", "bn", "hi"}

# Load Whisper model
model = WhisperModel("medium", compute_type="int8")

# ── Step 1: Detect language ────────────────────────────────────────────────
_, info = model.transcribe(audio_path, language=None)

detected_lang = info.language
confidence    = round(info.language_probability * 100, 1)

if detected_lang not in SUPPORTED_LANGUAGES:
    print(f"[warn] Detected '{detected_lang}' ({confidence}%) – falling back to English", file=sys.stderr)
    detected_lang = "en"
else:
    print(f"[info] Detected language: '{detected_lang}' ({confidence}% confidence)", file=sys.stderr)

# ── Step 2: Transcribe in detected language ────────────────────────────────
segments, _ = model.transcribe(
    audio_path,
    language=detected_lang,
    task="transcribe",  # keeps output in original language, NOT translated to English
    vad_filter=True,
)

# ── Step 3: Write SRT ──────────────────────────────────────────────────────
os.makedirs("subtitles", exist_ok=True)

file_name = os.path.splitext(os.path.basename(audio_path))[0]
srt_path  = f"subtitles/{file_name}.srt"

def format_time(seconds):
    hours   = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs    = int(seconds % 60)
    millis  = int((seconds - int(seconds)) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"

print(f"[info] Writing subtitles in: '{detected_lang}'", file=sys.stderr)

with open(srt_path, "w", encoding="utf-8") as srt_file:
    for index, segment in enumerate(segments, start=1):
        srt_file.write(f"{index}\n")
        srt_file.write(f"{format_time(segment.start)} --> {format_time(segment.end)}\n")
        srt_file.write(f"{segment.text.strip()}\n\n")

# Return subtitle path to Node.js
print(srt_path)