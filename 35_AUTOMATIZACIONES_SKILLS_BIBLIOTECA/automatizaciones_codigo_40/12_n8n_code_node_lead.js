// n8n Code node, Run Once for All Items. Produces a rule score; no CRM writes.
return $input.all().map(item=>{
  const b=item.json.body ?? item.json;
  const email=String(b.email??'').trim().toLowerCase();
  const budget=Number(b.budget??0); const need=String(b.need??'').trim();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||!Number.isFinite(budget)||budget<0)return {json:{ok:false,error:'invalid_email_or_budget'}};
  const score=20+(budget>=1000?40:budget>0?20:0)+(need.length>=10?40:0);
  return {json:{ok:true,email,score,segment:score>=80?'hot':score>=50?'warm':'cold',review_required:true}};
});
