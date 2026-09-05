// n8n Code node; normalize titles and disambiguate within this batch.
const seen=new Map();
return $input.all().map(item=>{
  if(typeof item.json.title!=='string'||!item.json.title.trim())return {json:{ok:false,error:'title_required'}};
  const base=item.json.title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if(!base)return {json:{ok:false,error:'title_has_no_slug_characters'}};
  const count=(seen.get(base)||0)+1;seen.set(base,count);
  return {json:{ok:true,title:item.json.title,slug:count===1?base:base+'-'+count}};
});
