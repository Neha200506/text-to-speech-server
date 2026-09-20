
import asyncio
import edge_tts
import sys
import json
import base64


VOICE_MAP = {
    "English": {
        "female": "en-US-AriaNeural",
        "male": "en-US-AndrewNeural"
    },
    "Hindi": {
        "female": "hi-IN-SwaraNeural",
        "male": "hi-IN-MadhurNeural"
    },
    "Marathi": {
        "female": "mr-IN-AarohiNeural",
        "male": "mr-IN-ManoharNeural"
    },
    "German": {
        "female": "de-DE-AmalaNeural",
        "male": "de-DE-ConradNeural"
    }
}


async def generate_audio(text, language, voice_type):
    language_voices = VOICE_MAP.get(language)

    if not language_voices:
        raise ValueError(f"Unsupported language: {language}")

    voice_type = str(voice_type).lower()

    if "female" in voice_type:
        selected_voice = language_voices["female"]
    else:
        selected_voice = language_voices["male"]

    print(
        f"[PYTHON-LOG] Actual selected voice: {selected_voice}",
        file=sys.stderr
    )

    communicate = edge_tts.Communicate(
        text,
        selected_voice
    )

    audio_data = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])

    if not audio_data:
        raise ValueError("No audio data was received from Edge TTS.")

    return base64.b64encode(audio_data).decode("utf-8")


def main():
    # Read incoming JSON as UTF-8 bytes.
    # This helps preserve Hindi, Marathi, and German characters.
    raw_input = sys.stdin.buffer.read().decode("utf-8-sig")

    input_data = json.loads(raw_input)

    text = input_data["text"]

    # Remove invalid Unicode surrogate characters.
    text = text.encode("utf-8", errors="replace").decode("utf-8")

    language = input_data["language"]
    voice = input_data["voice"]

    audio_base64 = asyncio.run(
        generate_audio(text, language, voice)
    )

    # Keep stdout reserved for JSON response.
    # Debug logs are written to stderr.
    print(json.dumps({
        "audio": audio_base64
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()