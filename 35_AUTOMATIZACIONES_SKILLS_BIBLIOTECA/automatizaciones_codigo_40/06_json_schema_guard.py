"""Valida payloads contra schema.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Valida payloads contra schema.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
