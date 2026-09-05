MODELS=["openai","anthropic","gemini"]
def route(prompt):
    return [{"model":m,"ok":True,"text":"demo"} for m in MODELS]
print(route("clasifica este lead"))
