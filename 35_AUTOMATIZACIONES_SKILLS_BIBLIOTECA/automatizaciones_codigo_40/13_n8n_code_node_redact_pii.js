// n8n Code node. Deterministic common patterns only; review names and addresses separately.
return $input.all().map(item=>{
  const text=item.json.text;
  if(typeof text!=='string'||!text.trim())return {json:{ok:false,error:'text_required'}};
  const patterns=[['EMAIL',/[\w.+-]+@[\w-]+\.[\w.-]+/g],['IBAN',/\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){10,30}\b/g],['DNI',/\b(?:\d{8}[A-Z]|[XYZ]\d{7}[A-Z])\b/gi],['PHONE',/(?<!\d)(?:\+\d{1,3}[ .-]?)?(?:\d[ .-]?){8,12}\d(?!\d)/g]];
  let clean=text;const counts={};
  for(const [kind,re] of patterns){counts[kind]=0;clean=clean.replace(re,()=>{counts[kind]++;return '['+kind+'_REDACTED]';});}
  return {json:{ok:true,text:clean,counts,review_required:true,fully_anonymized:false}};
});
