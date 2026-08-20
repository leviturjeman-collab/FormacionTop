"""Convierte URL en texto con reader.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Convierte URL en texto con reader.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
