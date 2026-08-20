def choose(goal):
    if 'video' in goal: return ['Remotion','FFmpeg','Whisper']
    if 'multi llm' in goal: return ['LiteLLM','Open WebUI','Ollama']
    if 'workflow' in goal: return ['n8n','Activepieces']
    return ['ChatGPT','manual checklist']
