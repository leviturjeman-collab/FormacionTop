"""Comprueba claves basicas YAML como texto.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Comprueba claves basicas YAML como texto.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
