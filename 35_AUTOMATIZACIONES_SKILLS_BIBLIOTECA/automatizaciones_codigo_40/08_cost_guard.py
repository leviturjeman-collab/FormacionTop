"""Corta batches por presupuesto.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Corta batches por presupuesto.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
