// n8n Code node: connect retry=true to a Wait node using delay_seconds, not directly back to HTTP.
return $input.all().map(item=>{
  const status=Number(item.json.statusCode),attempt=Number(item.json.attempt??0);
  if(!Number.isInteger(attempt)||attempt<0)return {json:{retry:false,error:'invalid_attempt'}};
  const retry=[408,429,500,502,503,504].includes(status)&&attempt<5;
  return {json:{...item.json,retry,attempt:attempt+1,delay_seconds:retry?Math.min(60,2**attempt):0,terminal:!retry}};
});
