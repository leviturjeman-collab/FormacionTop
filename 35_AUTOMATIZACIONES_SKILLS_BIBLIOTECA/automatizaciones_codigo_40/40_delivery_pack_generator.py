#!/usr/bin/env python3
"""Genera contenidos de un paquete de entrega y declara pendientes; no finge haber probado el proyecto.

Uso: python 40_delivery_pack_generator.py --demo
     python 40_delivery_pack_generator.py --input entrada.json
     echo JSON | python 40_delivery_pack_generator.py
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
    project=required(data,'project'); owner=required(data,'owner'); command=required(data,'run_command'); acceptance=data.get('acceptance')
    if not isinstance(acceptance,list) or not acceptance: raise ValueError('acceptance debe contener criterios')
    return {'files':{'README.md':'# '+project+'\nResponsable: '+owner+'\n\n## Ejecutar\n```\n'+command+'\n```\n','ACEPTACION.md':'# Criterios\n'+'\n'.join('- [ ] '+str(a) for a in acceptance)+'\n','OPERACION.md':'# Operación\nRegistrar credenciales por nombre, backup, recuperación, costes y responsable de guardia.\n'},'ready_for_handoff':False,'missing':['evidence of passed acceptance','operational configuration']}

def run(data):
    try:
        if not isinstance(data,dict): raise ValueError('La entrada debe ser objeto JSON')
        return {'ok':True,**_process(data)}
    except Exception as error:
        return {'ok':False,'error':type(error).__name__,'message':str(error)}

DEMO={'project': 'Pedidos', 'owner': 'Ana', 'run_command': 'python app.py', 'acceptance': ['Pedido persiste tras reinicio']}

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
