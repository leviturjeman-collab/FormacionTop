#!/usr/bin/env python3
"""Detecta patrones de secretos en texto y solo devuelve referencias enmascaradas.

Uso: python 07_secret_scanner.py --demo
     python 07_secret_scanner.py --input entrada.json
     echo JSON | python 07_secret_scanner.py
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
    text=required(data,'text')
    patterns={'anthropic':r'sk-ant-[A-Za-z0-9_-]{20,}','openai':r'sk-(?:proj-)?[A-Za-z0-9_-]{20,}','github':r'(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})','private_key':r'-----BEGIN [A-Z ]*PRIVATE KEY-----','aws':r'AKIA[0-9A-Z]{16}'}
    findings=[{'kind':kind,'line':text[:m.start()].count('\n')+1,'redacted':m.group()[:6]+'…'} for kind,p in patterns.items() for m in re.finditer(p,text)]
    return {'findings':findings,'clean':not findings,'scope':'patterns-only; false negatives possible'}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'text': 'token=ghp_abcdefghijklmnopqrstuvwx'}

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
