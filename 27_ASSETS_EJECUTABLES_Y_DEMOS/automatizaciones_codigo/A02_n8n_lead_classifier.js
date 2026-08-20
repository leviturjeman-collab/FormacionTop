const lead = $json;
const score = (lead.budget ? 30 : 0) + (lead.email ? 20 : 0) + (lead.need ? 30 : 0) + (lead.timeline ? 20 : 0);
return [{ json: { ...lead, score, priority: score >= 70 ? "alta" : score >= 40 ? "media" : "baja" } }];
