# Proiect Rețele 2025–2026

---

## Cuprins

1. [Structura echipei](#structura-echipei)
2. [Cerințe](#cerințe)
3. [Cum se rulează](#cum-se-rulează)
   - [VPS + Domeniu + Certificat](#1-vps--domeniu--certificat)
   - [Ad Blocker DNS (over HTTPS)](#2-ad-blocker-dns-over-https)
   - [MXMap România](#3-mxmap-românia)
   - [ARP Spoofing](#4-arp-spoofing)
   - [TCP Hijacking](#5-tcp-hijacking)
   - [DNS Tunnel](#6-dns-tunnel)
4. [Structura repository-ului](#structura-repository-ului)
5. [Setup inițial](#setup-inițial)

---

## Structura echipei

| Persoană | Responsabilitate principală | Responsabilitate secundară |
|---|---|---|
| **Hancu Alexandru** | VPS · DNS Blocker · DoH | Ajutor DNS Tunnel |
| **Chiritoiu Andra** | MXMap · Hartă HTML | Statistici / Logging |
| **Pupaza Alexandra** | ARP Spoofing · TCP Hijacking | DNS Tunnel |

---

## Cerințe

| # | Cerință | Punctaj |
|---|---|---|
| 1 | VPS + domeniu + certificat TLS | 1p |
| 2 | Ad Blocker DNS (over HTTPS) | 1p |
| 3 | MXMap pentru localități din România | 1p |
| 4 | ARP Spoofing | 0.5p |
| 5 | TCP Hijacking | 1.5p |
| 6 | DNS Tunnel | 1p |
| ★ | Exercițiu opțional (individual) | 1p bonus |

**Total maxim:** 6p + 1p bonus

---

## Cum se rulează

### 1. VPS + Domeniu + Certificat

#### Obținere VPS (gratuit)

- **DigitalOcean** – $200 credite prin [GitHub Student Pack](https://education.github.com/pack)
- **Oracle Free Tier** – 1 OCPU / 1 GB RAM (AMD) sau 4 OCPU / 24 GB RAM (ARM)  
  → [cloud.oracle.com](https://cloud.oracle.com/compute/instances?region=eu-frankfurt-1)
- **Self-hosted** cu port forwarding + DNS dinamic (ex. Digi `.go.ro`)

#### Obținere domeniu (gratuit)

Prin GitHub Student Pack: [name.com](https://name.com), [Namecheap](https://namecheap.com) sau `.tech domains`.

#### Certificat TLS cu Let's Encrypt

```bash
sudo apt install certbot
sudo certbot certonly --standalone -d domeniu.tău.com
```

Reînnoire automată prin crontab:

```bash
0 0 1 * * certbot renew --quiet
```

---

### 2. Ad Blocker DNS (over HTTPS)

#### Pornire servicii

```bash
cd vps_dns_blocker/
docker compose up -d
```

#### Testare DNS pe UDP 53

```bash
# Oprire resolver sistem
sudo systemctl stop systemd-resolved

# Test domeniu normal
dig @IP_VPS google.com

# Test domeniu blocat (trebuie să returneze 0.0.0.0)
dig @IP_VPS doubleclick.net
```

#### Testare DNS over HTTPS

```bash
curl -H "accept: application/dns-json" \
  "https://domeniu.tău.com/dns-query?name=google.com&type=A"
```

Sau direct din Firefox: `Settings → Network → DNS over HTTPS → Custom → https://domeniu.tău.com/dns-query`

#### Statistici domenii blocate

```bash
python stats_blocked_domains.py
```

Generează un raport cu cele mai frecvente companii blocate (Google, Facebook, etc.).

---

### 3. MXMap România

#### Instalare dependențe

```bash
cd mxmap/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Sau manual:

```bash
pip install requests pandas scapy folium
```

#### Rulare pipeline complet

```bash
source mxmap/venv/bin/activate

# 1. Extrage localități și emailuri din Wikidata
python preia_date_wikidata.py

# 2. Extrage domeniul din fiecare adresă de email
python extrage_domenii.py

# 3. Interogare DNS (MX + TXT/SPF) cu Scapy — necesită sudo
sudo venv/bin/python interogheaza_dns_scapy.py

# 4. Clasifică providerul de mail
python clasifica_provideri.py

# 5. Generează harta HTML interactivă
python genereaza_harta.py
```

#### Vizualizare hartă

```bash
# Deschide local (WSL)
explorer.exe "$(wslpath -w public/harta.html)"

# Sau pornește server local
python3 -m http.server 8000
# → http://localhost:8000/public/harta.html
```

Harta este și hostată pe VPS la:

```
https://domeniu.tău.com/map.html
```

#### Categorii de provideri detectate

| Culoare | Categorie |
|---|---|
| 🟢 Verde | Provider local (serverul primariei) |
| 🔵 Albastru | Microsoft (Outlook / Office 365) |
| 🔴 Roșu | Google (Gmail / Workspace) |
| 🟠 Portocaliu | Provider românesc |
| 🟣 Mov | Provider extern (non-US) |
| ⚫ Gri | Necunoscut |

---

### 4. ARP Spoofing
> Necesită **Linux** cu Docker. Nu funcționează pe Windows sau macOS.

#### Pornire containere

```bash
cd lab_attacks/
docker compose up -d
```

Topologie:

```
CLIENT ←→ ROUTER ←→ SERVER
              ↕
           MIDDLE
       (ARP poisoning)
```

#### Rulare atac

```bash
# Intră în containerul middle
docker exec -it middle bash

# Curăță cache ARP (opțional, accelerează atacul)
ip -s -s neigh flush all

# Pornește ARP spoofing
python arp_spoof.py
```

#### Verificare atac reușit

Pe containerul middle, în paralel:

```bash
tcpdump -SntvXX -i any
```

Pe containerul server:

```bash
wget http://old.fmi.unibuc.ro
```

Dacă middle vede conținutul HTML → **atacul a reușit**.

---

### 5. TCP Hijacking

> Necesită ARP Spoofing activ.

#### Faza 1 — Modificare mesaje TCP (0.5p)

Pornire server și client TCP care schimbă mesaje random:

```bash
# Pe containerul server
python tcp_server.py

# Pe containerul client
python tcp_client.py
```

Pornire proxy TCP pe middle (interceptează și modifică mesajele):

```bash
docker exec -it middle bash
python tcp_proxy_lab.py
```

Dacă atacul funcționează, atât clientul cât și serverul afișează mesajul injectat de middle.

#### Faza 2 — Modificare pagină HTTP (1p)

```bash
# Pe containerul middle
python tcp_proxy_lab.py --http-mode

# Pe containerul client — descarcă pagina
wget http://80.96.21.96/
```

Imaginea din header a paginii va fi înlocuită cu imaginea injectată de middle.

---

### 6. DNS Tunnel

**Responsabili: Hancu Alexandra + Pupaza Alexandra**

#### Setup DNS (pe VPS)

Adaugă în zona DNS a domeniului tău:

```
tunel.domeniu.tău.com.   IN  NS  ns.domeniu.tău.com.
ns.domeniu.tău.com.      IN  A   <IP_VPS>
```

Verificare:

```bash
dig NS tunel.domeniu.tău.com
```

#### Pornire server DNS tunnel

```bash
# Pe VPS
python dns_tunnel/dns_tunnel_server.py
```

#### Transfer fișier prin tunel

```bash
# Pe client
python dns_tunnel/dns_tunnel_client.py fisier.txt tunel.domeniu.tău.com

# Verificare integritate
md5sum fisier.txt
md5sum fisier_primit.txt
```

Transferul folosește **stop-and-wait** pentru fiabilitate peste UDP.

---

## Structura repository-ului

```
r26-acap/
│
├── vps_dns_blocker/
│   ├── dns_blocker/
│   ├── doh_server/
│   ├── nginx/
│   ├── docker-compose.yml
│   ├── blocked_queries.log
│   └── stats_blocked_domains.py
│
├── mxmap/
│   ├── data/
│   │   ├── localitati.csv
│   │   ├── localitati_cu_domenii.csv
│   │   ├── rezultate_mx_spf.csv
│   │   └── rezultate_clasificate.csv
│   ├── public/
│   │   ├── harta.html
│   │   └── map.html
│   ├── preia_date_wikidata.py
│   ├── extrage_domenii.py
│   ├── interogheaza_dns_scapy.py
│   ├── clasifica_provideri.py
│   ├── genereaza_harta.py
│   └── requirements.txt
│
├── lab_attacks/
│   ├── docker-compose.yml
│   ├── docker/Dockerfile
│   ├── scripts/
│   │   ├── client.sh
│   │   ├── server.sh
│   │   ├── router.sh
│   │   └── middle.sh
│   ├── arp_spoof.py
│   ├── tcp_client.py
│   ├── tcp_server.py
│   └── tcp_proxy_lab.py
│
├── dns_tunnel/
│   ├── dns_tunnel_client.py
│   └── dns_tunnel_server.py
│
└── README.md
```

---

## Setup inițial

```bash
# Clonare repo
git clone <url-repo>
cd r26-acap

# Verificare dependențe
docker --version
docker compose version
python3 --version
pip --version
```

Lucrul pe branch-uri separate:

```bash
git checkout -b vps-dns-blocker   # Persoana 1
git checkout -b mxmap              # Persoana 2
git checkout -b lab-attacks        # Persoana 3
```

---

