#!/usr/bin/env python3
"""Extrae HTML estático o consulta HTTPS público sin redirecciones; no ejecuta JavaScript. En servidor compartido debe añadirse control de egress para evitar DNS rebinding.

Uso: python 18_url_reader.py --demo
     python 18_url_reader.py --input entrada.json
     echo JSON | python 18_url_reader.py
Salida: JSON; exit 0 correcto, exit 1 entrada/operación inválida.
"""
import argparse, csv, io, json, math, os, re, sys, unicodedata
import urllib.request, urllib.parse
from datetime import date, datetime
from html import unescape

def required(data,key):
    value=data.get(key)
    if not isinstance(value,str) or not value.strip(): raise ValueError(key+': se requiere texto no vacío')
    return value.strip()

def number(value,key):
    if isinstance(value,bool): raise ValueError(key+': booleano no válido')
    try: result=float(value)
    except (TypeError,ValueError): raise ValueError(key+': número requerido')
    if not math.isfinite(result) or result<0: raise ValueError(key+': debe ser finito y >=0')
    return result

def records(data,key):
    value=data.get(key)
    if not isinstance(value,list) or any(not isinstance(v,dict) for v in value): raise ValueError(key+': lista de objetos requerida')
    return value

def slug(value):
    value=unicodedata.normalize('NFKD',str(value)).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',value).strip('-')

def money(value):
    if isinstance(value,(int,float)): return number(value,'importe')
    text=str(value).strip().replace(' ','')
    if ',' in text: text=text.replace('.','').replace(',','.')
    return number(text,'importe')

def _process(data):
    html=data.get('html')
    if html is None:
        url=required(data,'url'); host=urllib.parse.urlparse(url).hostname
        if not host or urllib.parse.urlparse(url).scheme!='https': raise ValueError('Solo HTTPS')
        import socket, ipaddress
        addresses=socket.getaddrinfo(host,443,type=socket.SOCK_STREAM)
        if any(not ipaddress.ip_address(a[4][0]).is_global for a in addresses): raise ValueError('Destino no público')
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self,*args,**kwargs): raise ValueError('Redirección no permitida')
        with urllib.request.build_opener(NoRedirect).open(url,timeout=15) as response:
            raw=response.read(1000001)
            if len(raw)>1000000: raise ValueError('Respuesta demasiado grande')
            html=raw.decode('utf-8',errors='replace')
    if not isinstance(html,str): raise ValueError('html debe ser texto')
    html=re.sub(r'<(script|style)\b[^>]*>.*?</\1>',' ',html,flags=re.S|re.I)
    return {'text':' '.join(unescape(re.sub(r'<[^>]+>',' ',html)).split()),'method':'static-html','javascript_rendered':False}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'html': '<h1>Ejemplo</h1><p>Texto útil</p>'}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo',action='store_true')
    parser.add_argument('--input')
    args=parser.parse_args()
    try:
        if args.demo: data=DEMO
        elif args.input:
            with open(args.input,encoding='utf-8') as source: data=json.load(source)
        else: data=json.load(sys.stdin)
        result=run(data)
    except Exception as error: result={'ok':False,'error':type(error).__name__,'message':str(error)}
    print(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False))
    return 0 if result['ok'] else 1

if __name__=='__main__': raise SystemExit(main())
