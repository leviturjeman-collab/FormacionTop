#!/usr/bin/env python3
"""Limpia SRT y valida tiempos sin desplazar la sincronización.

Uso: python 17_srt_cleaner.py --demo
     python 17_srt_cleaner.py --input entrada.json
     echo JSON | python 17_srt_cleaner.py
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
    raw=required(data,'srt').replace('\r\n','\n'); blocks=re.split(r'\n\s*\n',raw.strip()); clean=[]; last=-1
    for block in blocks:
        lines=block.splitlines(); idx=1 if lines and lines[0].strip().isdigit() else 0
        if len(lines)<=idx+1: raise ValueError('Bloque SRT incompleto')
        timing=lines[idx].strip(); match=re.fullmatch(r'(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})',timing)
        if not match: raise ValueError('Tiempo SRT inválido')
        nums=list(map(int,match.groups())); start=nums[0]*3600000+nums[1]*60000+nums[2]*1000+nums[3]; end=nums[4]*3600000+nums[5]*60000+nums[6]*1000+nums[7]
        if start<last or end<=start or max(nums[1],nums[2],nums[5],nums[6])>=60: raise ValueError('Tiempos desordenados o inválidos')
        last=start; text='\n'.join(' '.join(l.split()) for l in lines[idx+1:] if l.strip()); clean.append(str(len(clean)+1)+'\n'+timing+'\n'+text)
    return {'srt':'\n\n'.join(clean)+'\n','captions':len(clean)}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'srt': '1\n00:00:01,000 --> 00:00:02,000\n Hola   mundo \n'}

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
