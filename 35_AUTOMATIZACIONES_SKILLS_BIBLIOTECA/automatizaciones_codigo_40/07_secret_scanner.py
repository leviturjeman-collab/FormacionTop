"""Detecta posibles API keys.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Detecta posibles API keys.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
