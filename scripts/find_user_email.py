import json

with open(r'C:\Users\ghabr\.gemini\antigravity\brain\db659566-e772-44f8-93f0-e36abdb74f1a\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            data = json.loads(line)
        except Exception:
            continue
        if data.get('source') == 'USER_EXPLICIT':
            content = data.get('content', '')
            if '@' in content or 'mail' in content.lower():
                print(f"Step {data.get('step_index')}: {content}")
