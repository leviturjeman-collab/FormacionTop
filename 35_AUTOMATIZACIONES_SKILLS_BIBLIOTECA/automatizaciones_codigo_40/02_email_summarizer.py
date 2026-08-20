"""Resume emails y extrae acciones.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Resume emails y extrae acciones.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
