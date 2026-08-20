def compare(outputs):
    return {"consenso": [o for o in outputs if o.get("ok")], "fallos": [o for o in outputs if not o.get("ok")]}
