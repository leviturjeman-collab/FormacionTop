"""Enruta tickets por urgencia.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Enruta tickets por urgencia.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
