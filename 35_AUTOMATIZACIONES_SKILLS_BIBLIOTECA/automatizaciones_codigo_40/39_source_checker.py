"""Checklist credibilidad fuente.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Checklist credibilidad fuente.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
