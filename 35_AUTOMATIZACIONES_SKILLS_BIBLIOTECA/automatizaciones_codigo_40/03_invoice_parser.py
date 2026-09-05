#!/usr/bin/env python3
"""Extrae campos de texto etiquetado Proveedor/Fecha/Total; no hace OCR ni interpreta facturas arbitrarias.

Uso: python 03_invoice_parser.py --demo
     python 03_invoice_parser.py --input entrada.json
     echo JSON | python 03_invoice_parser.py
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
    text = required(data,'text')
    patterns={'supplier':r'(?im)^proveedor:\s*(.+)$','date':r'(?im)^fecha:\s*(\d{4}-\d{2}-\d{2})','total':r'(?im)^total:\s*([0-9.,]+)'}
    result={k:(m.group(1).strip() if (m:=re.search(p,text)) else None) for k,p in patterns.items()}
    if result['date']:
        try: date.fromisoformat(result['date'])
        except ValueError: result['date']=None
    if result['total'] is not None: result['total']=money(result['total'])
    return {**result,'missing':[k for k,v in result.items() if v is None],'review_required':True,'method':'labelled-text-regex'}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'text': 'Proveedor: Taller Uno\nFecha: 2026-09-05\nTotal: 1.234,56 EUR'}

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
