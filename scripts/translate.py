"""
Translate English to Assamese via deep-translator.
Usage:
  echo '{"text":"..."}' | python translate.py              # stdin/stdout
  python translate.py input.json output.json                # file-based
"""
import json, sys, io

# Force UTF-8 for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

try:
    from deep_translator import GoogleTranslator
except ImportError:
    msg = json.dumps({"error": "deep-translator not installed. Run: pip install deep-translator"})
    print(msg)
    sys.exit(1)

def translate(text: str) -> str:
    if not text or not text.strip():
        return ""
    translator = GoogleTranslator(source="en", target="as")
    result = translator.translate(text[:1500])
    return (result or "").strip()

# File-based mode: python translate.py input.json output.json
if len(sys.argv) >= 3:
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    try:
        with open(input_path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
        result = translate(data.get("text") or "")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump({"translation": result}, f, ensure_ascii=False)
        print("OK", flush=True)
    except Exception as e:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump({"error": str(e)}, f)
        sys.exit(1)
else:
    # Stdin/stdout mode
    try:
        data = json.load(sys.stdin)
        result = translate(data.get("text") or "")
        print(json.dumps({"translation": result}, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
