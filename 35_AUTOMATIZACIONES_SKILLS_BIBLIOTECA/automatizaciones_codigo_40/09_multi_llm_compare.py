"""Compara salidas de modelos.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Compara salidas de modelos.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
