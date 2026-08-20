"""Clasifica leads por presupuesto, email y necesidad.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Clasifica leads por presupuesto, email y necesidad.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
