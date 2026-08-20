import csv
with open('leads.csv', newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        print({k.strip().lower(): v.strip() for k,v in row.items()})
