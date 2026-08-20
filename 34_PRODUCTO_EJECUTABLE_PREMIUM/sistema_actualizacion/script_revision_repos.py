import requests
repos=["n8n-io/n8n","ollama/ollama","langgenius/dify","BerriAI/litellm"]
for repo in repos:
    r=requests.get(f"https://api.github.com/repos/{repo}", timeout=20)
    data=r.json()
    print(repo, data.get("stargazers_count"), data.get("updated_at"))
