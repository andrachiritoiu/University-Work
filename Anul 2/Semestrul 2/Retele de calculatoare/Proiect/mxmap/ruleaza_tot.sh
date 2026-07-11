#!/bin/bash

source mxmap/venv/bin/activate

python mxmap/preia_date_wikidata.py
python mxmap/extrage_domenii.py
sudo mxmap/venv/bin/python mxmap/interogheaza_dns_scapy.py
python mxmap/clasifica_provideri.py
python mxmap/genereaza_harta.py

echo "Harta a fost generata in mxmap/public/harta.html"
