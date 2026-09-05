#!/usr/bin/env python3
"""Analiza YAML con PyYAML y política local; no sustituye docker compose config.

Uso: python 23_docker_compose_checker.py --demo
     python 23_docker_compose_checker.py --input entrada.json
     echo JSON | python 23_docker_compose_checker.py
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
    text=required(data,'yaml')
    try: import yaml
    except ImportError: raise ValueError('Instala dependencia: python -m pip install PyYAML==6.0.3')
    config=yaml.safe_load(text)
    if not isinstance(config,dict) or not isinstance(config.get('services'),dict) or not config['services']: raise ValueError('Falta services no vacío')
    issues=[]
    for name,s in config['services'].items():
        if not isinstance(s,dict): issues.append(name+': definición inválida'); continue
        if not s.get('image') and not s.get('build'): issues.append(name+': falta image/build')
        if s.get('image','').endswith(':latest') or (s.get('image') and ':' not in s['image']): issues.append(name+': imagen sin versión fija')
        if s.get('privileged'): issues.append(name+': privileged activado')
        for port in s.get('ports',[]):
            if isinstance(port,str) and not port.startswith(('127.0.0.1:','[::1]:')): issues.append(name+': puerto expuesto '+port)
    return {'issues':issues,'passes_local_policy':not issues,'scope':'static policy, not docker compose runtime validation'}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'yaml': 'services:\n  app:\n    image: example/app:1.0\n    ports: ["127.0.0.1:8000:8000"]'}

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
