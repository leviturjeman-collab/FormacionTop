import requests
url = "https://r.jina.ai/http://example.com"
text = requests.get(url, timeout=20).text
print(text[:2000])
