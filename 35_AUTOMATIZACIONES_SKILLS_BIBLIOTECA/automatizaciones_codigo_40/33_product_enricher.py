#!/usr/bin/env python3
"""Normaliza ficha de producto sin inventar prestaciones ni material.

Uso: python 33_product_enricher.py --demo
     python 33_product_enricher.py --input entrada.json
     echo JSON | python 33_product_enricher.py
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
    name=required(data,'name'); description=required(data,'description'); price=money(required(data,'price'))
    return {'sku':str(data.get('sku','')),'name':name,'slug':slug(name),'price':price,'currency':str(data.get('currency','EUR')),'description':description,'search_text':(name+' '+description).lower(),'generated_claims':False}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'name': 'Camiseta Azul', 'description': 'Algodón, talla M', 'price': '19,90', 'sku': 'CAM-M'}

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
