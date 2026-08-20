import re, pathlib
pattern = re.compile(r"(sk-|OPENAI_API_KEY|ANTHROPIC_API_KEY|GEMINI_API_KEY)")
for p in pathlib.Path('.').rglob('*'):
    if p.is_file() and p.suffix in ['.py','.js','.md','.env']:
        if pattern.search(p.read_text(errors='ignore')):
            print('Revisar secreto:', p)
