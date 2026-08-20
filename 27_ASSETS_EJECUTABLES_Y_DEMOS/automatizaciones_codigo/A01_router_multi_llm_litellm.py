from litellm import completion

MODELS = ["openai/gpt-4.1-mini", "anthropic/claude-sonnet-4-5", "gemini/gemini-2.5-flash"]

def ask_all(prompt):
    results = []
    for model in MODELS:
        try:
            r = completion(model=model, messages=[{"role": "user", "content": prompt}])
            results.append({"model": model, "ok": True, "text": r.choices[0].message.content})
        except Exception as e:
            results.append({"model": model, "ok": False, "error": str(e)})
    return results

print(ask_all("Resume este lead y marca riesgo comercial."))
