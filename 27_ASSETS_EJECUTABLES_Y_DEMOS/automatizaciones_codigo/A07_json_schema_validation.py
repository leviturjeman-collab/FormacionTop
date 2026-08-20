from jsonschema import validate
schema = {"type":"object","required":["objetivo","entrada"],"properties":{"objetivo":{"type":"string"},"entrada":{"type":"object"}}}
payload = {"objetivo":"clasificar lead", "entrada":{"email":"demo@example.com"}}
validate(payload, schema)
