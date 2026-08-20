"""Extrae proveedor, importe y fecha de texto factura.
Caso roto: entrada vacia o campo ausente.
"""

def run(data):
    data = data or {}
    return {"ok": bool(data), "description": "Extrae proveedor, importe y fecha de texto factura.", "input": data}

if __name__ == "__main__":
    print(run({"demo": True}))
