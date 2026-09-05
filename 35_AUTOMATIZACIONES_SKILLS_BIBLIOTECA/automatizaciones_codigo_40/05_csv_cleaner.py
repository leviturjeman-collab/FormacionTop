"""Limpia CSV y normaliza headers.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Limpia CSV y normaliza headers.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
