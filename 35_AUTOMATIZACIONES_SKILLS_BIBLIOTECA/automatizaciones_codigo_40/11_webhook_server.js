// Servidor webhook minimo.
const input = $json || {};
return [{ json: { ...input, ok: true, note: "Servidor webhook minimo." } }];
