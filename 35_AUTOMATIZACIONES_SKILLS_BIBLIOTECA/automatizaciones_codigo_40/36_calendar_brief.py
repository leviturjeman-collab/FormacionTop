#!/usr/bin/env python3
"""Prepara agenda del día con fechas ISO; no crea eventos ni presupone acceso al calendario.

Uso: python 36_calendar_brief.py --demo
     python 36_calendar_brief.py --input entrada.json
     echo JSON | python 36_calendar_brief.py
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
    day=date.fromisoformat(required(data,'date')); events=records(data,'events'); selected=[]
    for event in events:
        start=datetime.fromisoformat(required(event,'start')); end=datetime.fromisoformat(required(event,'end'))
        if end<=start: raise ValueError('Evento con fin anterior al inicio')
        if start.date()==day: selected.append({**event,'minutes':round((end-start).total_seconds()/60)})
    selected.sort(key=lambda e:e['start'])
    return {'date':day.isoformat(),'events':selected,'total_minutes':sum(e['minutes'] for e in selected)}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'date': '2026-09-05', 'events': [{'title': 'Revisión', 'start': '2026-09-05T10:00:00+00:00', 'end': '2026-09-05T11:00:00+00:00'}]}

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
