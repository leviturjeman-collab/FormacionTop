#!/usr/bin/env python3
"""Provider fallback CLI. --demo never makes a network request."""
import argparse,json,os,sys,time,urllib.request,urllib.error

def call_provider(provider,prompt):
    if provider=='anthropic':
        key=os.environ.get('ANTHROPIC_API_KEY')
        if not key: raise ValueError('missing ANTHROPIC_API_KEY')
        url='https://api.anthropic.com/v1/messages'; headers={'x-api-key':key,'anthropic-version':'2023-06-01'}
        body={'model':os.environ.get('ANTHROPIC_MODEL','claude-haiku-4-5'),'max_tokens':600,'messages':[{'role':'user','content':prompt}]}
    elif provider=='openai':
        key=os.environ.get('OPENAI_API_KEY')
        if not key: raise ValueError('missing OPENAI_API_KEY')
        url='https://api.openai.com/v1/chat/completions'; headers={'Authorization':'Bearer '+key}
        body={'model':os.environ.get('OPENAI_MODEL','gpt-4.1-mini'),'max_tokens':600,'messages':[{'role':'user','content':prompt}]}
    else: raise ValueError('unsupported provider')
    headers['content-type']='application/json'
    request=urllib.request.Request(url,data=json.dumps(body).encode(),headers=headers,method='POST')
    with urllib.request.urlopen(request,timeout=30) as response: data=json.load(response)
    text=''.join(b['text'] for b in data.get('content',[]) if b.get('type')=='text') if provider=='anthropic' else data['choices'][0]['message']['content']
    if not isinstance(text,str) or not text.strip(): raise ValueError('provider returned no text')
    return {'text':text,'model':data.get('model'),'usage':data.get('usage')}

def route(prompt,transport=call_provider):
    if not isinstance(prompt,str) or not prompt.strip(): return {'ok':False,'error':'prompt_required','attempts':[]}
    attempts=[]
    for provider in ['anthropic','openai']:
        start=time.perf_counter()
        try:
            result=transport(provider,prompt); attempts.append({'provider':provider,'ok':True,'elapsed_ms':round((time.perf_counter()-start)*1000)})
            return {'ok':True,'provider':provider,**result,'attempts':attempts,'fallback':len(attempts)>1}
        except Exception as error:
            attempts.append({'provider':provider,'ok':False,'error_type':type(error).__name__,'elapsed_ms':round((time.perf_counter()-start)*1000)})
    return {'ok':False,'error':'all_providers_failed','attempts':attempts}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('prompt',nargs='?',default='Explica una automatización');p.add_argument('--demo',action='store_true');a=p.parse_args()
    def fixture(provider,prompt):
        if provider=='anthropic': raise TimeoutError('simulated')
        return {'text':'Respuesta fixture para '+prompt,'model':'mock','usage':{},'simulated':True}
    result=route(a.prompt,fixture if a.demo else call_provider);print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(0 if result['ok'] else 1)
