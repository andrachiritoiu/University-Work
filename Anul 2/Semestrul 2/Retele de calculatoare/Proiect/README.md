[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/RinQpMQq)
# Proiect Rețele 2025-2026



## Cuprins
- [Cum se ia nota?](#notafinalix)
- [Regulament](#cedereguli)
- [Cerințe](#cerinteee)
    - [Preambul: VPS + domeniu + certificat (1p)](#vps)
    - [Ad Blocker DNS (over HTTPS) (1p)](#dns1)
    - [MXMap pentru localități din România (1p)](#mxmap)
    - [ARP Spoofing (0.5p)](#arpspoof)
    - [TCP Hijacking (1.5p)](#tcphij)
    - [DNS Tunnel (1p)](#dns2)
    - [Exercițiu opțional (individual) pentru un punct bonus (1p)](#optionalix)



<a name="notafinalix"></a>
## Nota finală la această materie este:
- 55% curs
- 35% laborator
- 10% gratis

Echivalent cu 60% curs 40% laborator fără punct din oficiu.
Presupunând că la laborator ați făcut scorul perfect, cu un punct din oficiu aveți 4.5, deci ați trecut examenul! Singura cerință este să veniți la oral să anunțați intenția de a fi trecuți, altfel veți fi absenți. Se poate trece ușor dacă ați acumulat puncte de la laborator. 

Temele de laborator din timpul semestrului nu se pot recupera în restanță, decât în situații excepționale (plecări erasmus, situații de sănătate etc.) Pentru mărire de notă și pentru restanță vor fi niște cerințe suplimentare (pe lângă exercițiile curente) care vor ține cont de timpul suplimentar de lucru.

La curs avem în sesiune un examen scris, un proiect și o evaluare orală.
Asta presupune că pe 15 iunie pe la 09:00 toată lumea va da un examen grilă scris care constă din întrebări elementare de cultură generală. Testul se notează de la 1 la 10, are 10 întrebări și durează vreo 15-20 de minute.

Întrebările sunt de cultură generală despre: HTTP/S, DNS, SSH, UDP, TCP (Handshake, Finalizare, Opțiuni, Flow Control, Congestion Control), IPv4, Ethernet, ARP, Socket API. Modele de întrebări sunt [aici](https://gaia.cs.umass.edu/kurose_ross/knowledgechecks/).

După testul grilă, în ordinea grupelor, în ordinea numelor din grupe, câte o persoană din fiecare grupă va veni cu colegii săi de echipă să-și prezinte proiectul și să își ia nota. Cine nu participă la examinarea orală, ia 0. Voi încerca să fac un fel de program, dar estimez că toată evaluarea orală va dura cel puțin 8 ore (deci grupa 231 va fi prima de pe la 10 dimineața și 252 undeva pe la 4-6 seara).

Proiectul se notează de la 1 la 6 (+1 punct bonus) și toți membrii echipei trebuie să știe să răspundă la întrebări din orice parte a proiectului. 


Nota finală este:
```
1 + grilă/10 * punctaj proiect + scor laborator
```
Testul grilă ponderează punctajul la proiect astfel încât aproape orice 2 întrebări greșite la grilă, scad un punct de la proiect, vezi aici [exemplu de calcul](https://docs.google.com/spreadsheets/d/1Ibw5MRlNquXdLxtjgVEVJI0LMUk8EsiDVZrtz4LV-XQ/edit?usp=sharing).
Dacă faceți totul perfect inclusiv exercițiul bonus puteți obține 11.5. Cei cu nota asta pot conta pe o scrisoare de recomandare din partea mea pentru job, master etc.



<a name="cedereguli"></a>
### Reguli:
- echipe de maxim 3 persoane - munca în echipă înseamnă că fiecare coleg poate explica munca celorlalți
- codul pe care nu îl puteți explica se punctează cu 0
- codul copiat de la alți colegi din alte echipe sau scris cu LLM se punctează cu 0 sau se face raport de incident în consiliul facultății; codul este verificat cu [moss](https://theory.stanford.edu/~aiken/moss/) și cu un [clasificator experimental de identificat cod scris cu LLM](https://arxiv.org/abs/2605.01596)
- de asemenea am o serie de soluții parțiale generate de mai multe LLMs (Claude, DeepSeek, ChatGPT, Gemini) pe care o să le folosesc pentru similaritate
- echipele pot fi formate din colegi de la orice serie 
- în cerință aveți exemple de cod, dacă le folosiți, trebuie să le citați printr-o mențiune la început de fișier; de asemenea codul preluat trebuie înțeles complet
- veți fi punctați pe baza întrebărilor pe care le primiți, se pot scădea puncte de la proiect dacă nu știți ce conține codul
- întrebările nu vor ține cont de partea la care ați lucrat cel mai mult
- proiectul trebuie să ruleze în timpul prezentării
- dacă sunt printre voi persoane care au motive întemeiate, putem face o evaluare și în timpul semestrului
- cod, rezultate, statistici, hărți și orice derivat de la această temă trebuie să rămână în repository privat
- **termen limită:** 15 iunie


<a name="cerinteee"></a>
## Cerințe

Pentru proiect trebuie să rezolvați următoarele probleme:
- [Preambul: VPS + domeniu + certificat (1p)](#vps)
- [Ad Blocker DNS (over HTTPS) (1p)](#dns1)
- [MXMap pentru localități din România (1p)](#mxmap)
- [ARP Spoofing (0.5p)](#arpspoof)
- [TCP Hijacking (1.5p)](#tcphij)
- [DNS Tunnel (1p)](#dns2)
- [Exercițiu opțional (individual) pentru un punct bonus (1p)](#optionalix)




<a name="vps"></a> 
## Preambul: VPS + domeniu + certificat

Atenție că exercițiile care necesită folosirea unor containere docker nu se pot rezolva pe Windows sau MacOS pentru că face figuri netfilterqueue și iptables.
De asemenea, vă încurajez să obțineți un VPS și un domeniu gratuit cu care să faceți teste. Este acceptabil să rezolvați unele exerciții și fără docker, cu un router și niște calculatoare / laptopuri / raspberry pi.

### VPS
Pentru a rezolva exercițiile proiectului, este obligatoriu să aveți acces la un server privat virtual (VPS) cu IP public sau cu DNS dinamic. Acest lucru vă va ajuta în general în viață dincolo de rezultatul de la acest curs.

Un VPS implică diverse costuri, așa că cel mai important lucru aici este **să nu plătiți nimic!** Pentru asta aveți următoarele opțiuni:

- DigitalOcean - 200$ credits prin github student pack, [link referal aici](https://m.do.co/c/421a5d7512d3), gratuit vreo 2 luni, e foarte simplu, nu necesită tutorial; dacă rămâneți cu restanță, va trebui să vă faceți alt cont
- dispozitiv self-hosted cu port forwarding și DNS dinamic (poate fi un laptop vechi sau un raspberry pi); trebuie să îl pot accesa și eu, deci nu merge cu MeshVPN; poate că merge cu Cloudflare Tunnel, nu am încercat
- Oracle Free Tier - 1OCPU/1GB RAM AMDx86_64 sau 4OCPU/24GB RAM ARM https://cloud.oracle.com/compute/instances?region=eu-frankfurt-1 - dacă mergeți pe varianta asta puteți urmări o variantă de [setup de la zero aici](https://youtu.be/IQDIBsGl5As). Oracle are o interfață greoaie și neprietenoasă, e greu să-ți faci și cont, de aceea nu e prima recomandare. Veți vedea în tutorial că pe OCI porturile trebuie deschise și din [iptables](https://judexzhu.github.io/Iptables-Basic-Knowledge/) și din [rețeaua virtuală VCN](https://stackoverflow.com/a/63648081): `sudo sudo iptables -I INPUT 6 -p udp -m udp --dport 53 -j ACCEPT && sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8080 -j ACCEPT && sudo netfilter-persistent save` mai multe despre [iptables si aici](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands)
- mai sunt si altele aici, dar nu la fel de avantajoase: https://github.com/cloudcommunity/Cloud-Free-Tier-Comparison

### Domeniu
Prin [github student dev pack](https://education.github.com/pack) și [name.com](https://www.name.com/partner/github-students) sau namecheap sau .tech domains puteți obține un domeniu gratuit. Recomand să vă luați un domeniu pe care să puteți face orice fel de experimente doriți, inclusiv să obțineți un certificat TLS.


### Certificat TLS
Obțineți un certificat TLS pentru domeniile voastre folosind [Lets Encrypt](https://letsencrypt.org/getting-started/). Puteți automatiza regenerarea certificatului folosind [certbot](https://certbot.eff.org/) și crontab.

### Self-hosting (opțional)
O alternativă la VPS este să aveți un calculator (poate fi si raspberry Pi) în rețeaua de acasă pe care să îl accesați de la distanță. Ca să accesați de la distanță servicii din rețeaua locală de acasă, aveți două opțiuni:

1. Port-forwarding și DNS dinamic - verificați la ISP ce fel de servicii oferă. De ex. [Digi oferă dynamic dns](https://s.digi.ro/gateway/g/ZmlsZVNvdXJjZT1odHRwJTNBJTJGJTJG/c3RvcmFnZWRpZ2lybzEucmNzLXJkcy5y/byUyRnN0b3JhZ2UlMkYyMDIxJTJGMDIl/MkYwNCUyRjEyODQwMzRfMTI4NDAzNF9U/UC1MaW5rLXBvcnQtZncucGRmJmhhc2g9/NGZmZDViNzUwYWY5NGUzMDkyZDg1MjhmOGFkMDAwZmU=.pdf), un serviciu prin care puteți să obțineți un domeniu `.go.ro` pentru IP-ul dinamic de acasă (acest domeniu poate deveni un CNAME pentru domeniul vostru obținut de pe [name.com](https://name.com)). Asignați unui calculator din rețeaua locală o adresă IP fixată (ex. `192.168.66.66`) în funcție de adresa sa fizică. Apoi, prin port forwarding, redirecționați mesajele care intră la router pe un port public (de ex. `80`) către serviciul care rulează pe o adresă locală (de ex. `192.168.66.66:8081`). Procedeul ar funcționa și fără DNS dinamic pentru că IP-ul public de la digi nu se schimbă foarte des.
2. Mesh VPN prin tailscale sau [zero-tier](https://www.zerotier.com/) - o alternativă prin care mai multe noduri să facă parte din aceeași rețea locală virtuală.

Accesul public la un calculator din rețeaua de acasă poate reprezinta o breșă majoră de securitate. Nu lăsați servicii pornite decât dacă v-ați asigurat că sunt bine securizate.













<a name="dns1"></a> 
## Ad Blocker DNS (over HTTPS) 
În cadrul acestei teme, veți avea de implementat un blocker de reclame și tracking după modelul [pi-hole](https://pi-hole.net/).

1. Citiți despre DNS în [secțiunea de curs](https://github.com/senisioi/computer-networks/tree/2023/capitolul2#dns).
1. Scrieți codul unei aplicații de tip DNS resolver. Puteți urmări un tutorial [în Rust aici](https://github.com/EmilHernvall/dnsguide/tree/master) și puteți folosi ca punct de plecare [codul în python disponibil în capitolul 6](https://github.com/senisioi/computer-networks/tree/2023/capitolul6#scapy_dns).
1. Serverul DNS nu trebuie să fie complet sau să implementeze tot protocolul, doar să fie funcțional pentru cerințele de mai jos și să implementeze un mecanism de caching și unul de apeluri recursive. 
1. Utilizați o listă deja curatoriată de domenii asociate cu [reclame și tracking](https://github.com/anudeepND/blacklist) cu scopul de a bloca acele domenii. De fiecare dată când vine o cerere către serverul vostru pentru domenii din lista respectivă, serverul trebuie să [returneaze IP-ul](https://superuser.com/questions/1030329/better-to-block-a-host-to-0-0-0-0-than-to-127-0-0-1) `0.0.0.0`.
1. Pe lângă un server DNS pe portul UDP 53, implementați endpoints pentru un [DNS over HTTPS](https://developers.google.com/speed/public-dns/docs/doh/json). Ce puteți face e să adăugați un serviciu de HTTPS care apelează DNS-ul vostru intern. Din moment ce aveți deja un certificat, puteți cu ușurință să hostați un endpoint DoH.
1. Creați o orchestrație docker compose (pe modelul [simple_fastapi.py](https://github.com/senisioi/computer-networks/blob/2026/capitolul2/src/simple_fastapi.py) făcut la curs) care să pornească codul vostru în python și să pornească serviciile de DNS pe UDP și DNS over HTTPS. 
1. Pentru partea de HTTPS ar putea fi mai ușor să folosiți [nginx](https://nginx.org/) sau un HTTP server reverse proxy. Și acesta se poate rula din container, dacă doriți.
1. Deschideți portul UDP 53 pentru conexiuni din exterior
1. Rulați serviciile pe VPS-ul creat la preambul.
1. Testați prima dată că merge DNS pe UDP 53, porniți serverul DNS de la punctul anterior și testați-l cu dig, dar opriți resolverul existent `systemctl start systemd-resolved`
1. Testați apoi că merge și DNS over HTTPS în Firefox.
1. Apoi puteți seta întregul server să fie DNS-ul principal pentru calculatorul vostru sau chiar pe rețeaua locală de acasă:
    - [Linux](https://www.linuxfordevices.com/tutorials/linux/change-dns-on-linux)
    - [Windows & MacOS](https://www.hellotech.com/guide/for/how-to-change-dns-server-windows-mac)
1. Dacă accesați un site cu multe reclame (ex. https://www.accuweather.com/) ar trebui să apară curat în browser.
1. Salvați într-un fișier toate cererile pe care le blocați pe parcursul unei zile de navigat pe internet. Încercați să adunați minim 100 de nume blocate.
1. Obțineți niște statistici pentru a verifica câte din numele blocate aparțin unor companii precum google, facebook etc. și care sunt cele mai frecvente companii pe care le blocați. Pentru obținerea statisticilor aveți mai multe variante a) verificați dacă un domeniu conține cuvinte precum `google`, `facebook`, etc. b) verificați dacă name serverul pentru acel domeniu conține numele unor companii c) verificați dacă IP-ul pentru acele domenii sau pentru name server sunt parte dintr-o rețea a vreunei companii. Pentru a afla mai multe informații despre un IP și cine îl deține, puteți folosi reverse DNS (e.g., `dig -x 80.96.21.88 +trace`) sau `whois 80.96.21.209` sau un API precum https://ipinfo.io/











<a name="mxmap"></a>
## MXMap pentru localități din România

Faceți o hartă html interactivă pe care o hostați pe serverul vostru. Harta trebuie să fie a României și arată [localitățile](https://en.wikipedia.org/wiki/List_of_cities_and_towns_in_Romania) colorate în funcție de ce fel de provider de mail are primăria respectivă (ce companie, dacă e un provider local sau dacă datele sunt stocate în US). Pentru a afla provider-ul de mail, trebuie extrasă adresa de mail (acolo unde este disponibilă) din WikiData, de exemplu: https://www.wikidata.org/wiki/Q576804. Wikidata are un Query Builder cu care puteți [extrage informațiile](https://w.wiki/Mp9p) necesare, nu faceți web scraping. Dacă doriți, puteți face același lucru la nivel mai granular, pentru [unităție administrative teritoriale](https://w.wiki/MpAR).

Pentru a afla providerul de mail, trebuie obligatoriu să faceți cereri de tip DNS folosind scapy. Interogați [intrări de tip MX](https://www.cloudflare.com/learning/dns/dns-records/dns-mx-record/) sau TXT corespunzătoare [SPF (Sender Policy Framework)](https://www.mimecast.com/content/sender-policy-framework/).

De exemplu, pentru primaria@primariamarasesti.ro, avem domeniul `primariamarasesti.ro` iar rezultatele indică că au un [provider de mail local](https://ipinfo.io/185.248.198.0).

```bash
dig MX primariamarasesti.ro
primariamarasesti.ro.   300 IN  MX  10 mail.primariamarasesti.ro.


dig TXT primariamarasesti.ro
primariamarasesti.ro.   300 IN  TXT "v=spf1 a mx ip4:185.248.198.0 ~all"
```

Proiecte similare sunt MXMap din Elveția https://mxmap.ch/ sau din Olanda https://mxmap.nl/. Scopul vostru nu este să le copiați pe acelea, ci să implementați logica de detecție a providerului de mail pentru UAT-urile sau localitățile din România. Vrem să vedem în ce măsură datele de email de la instituțiile administrațiilor publice sunt stocate în România, în US sau în țări terțe.












<a name="arpspoof"></a> 
## ARP Spoofing și TCP Hijacking 

Pentru rezolvarea acestor exerciții trebuie să folosiți docker pe linux pentru că nu funcționează iptables și netfilterqueue pe alte sisteme de operare. Dacă nu doriți să folosiți linux, puteți folosi un router real și laptopurile voastre pe post de middle, server și client. Dar va trebui să faceți de mână toate configurațiile.


## Structura containerelor
Partea asta se rezolvă folosind aceeași structură de containere ca în capitolul3. Pentru a construi containerele, rulăm `docker compose up -d`.
Imaginea este construită pe baza fișierul `docker/Dockerfile`, dacă facem modificări în fișier sau în scripturile shell, putem rula `docker-compose build --no-cache` pentru a reconstrui imaginile containerelor.


### Observații
1. E posibil ca tabelel ARP cache ale containerelor `router` și `server` să se updateze mai greu. Ca să nu dureze câteva ore până verificați că funcționează, puteți să le curățați în timp ce sau înainte de a declanșa atacul folosind [comenzi de aici](https://linux-audit.com/how-to-clear-the-arp-cache-on-linux/) `ip -s -s neigh flush all`
2. Orice bucată de cod pe care o luați de pe net trebuie înțeleasă, altfel nu va fi puncată.
3. Atacurile implementante aici au un scop didactic, nu încercați să folosiți aceste metode pentru a ataca alte persoane de pe o rețea locală, puteți fi prinși cu ușurință.



## ARP Spoofing 
[ARP spoofing](https://samsclass.info/124/proj11/P13xN-arpspoof.html) presupune trimiterea unui pachet ARP de tip reply către o țintă pentru a o informa greșit cu privire la adresa MAC pereche pentru un IP. [Aici](https://medium.com/@ismailakkila/black-hat-python-arp-cache-poisoning-with-scapy-7cb1d8b9d242) și [aici](https://www.youtube.com/watch?v=hI9J_tnNDCc) puteți urmări cum se execută un atac de otrăvire a tabelei cache ARP stocată pe diferite mașini.

Arhitectura containerelor este definită aici, împreună cu schema prin care `middle` îi informează pe `server` și pe `router` cu privire la locația fizică (adresa MAC) unde se găsesc IP-urile celorlalți. 


```
            MIDDLE------------\
        subnet2: 198.7.0.3     \
        MAC: 02:42:c6:0a:00:02  \
               forwarding        \ 
              /                   \
             /                     \
Poison ARP 198.7.0.1 is-at         Poison ARP 198.7.0.2 is-at 
           02:42:c6:0a:00:02         |         02:42:c6:0a:00:02
           /                         |
          /                          |
         /                           |
        /                            |
    SERVER <---------------------> ROUTER <---------------------> CLIENT
net2: 198.7.0.2                      |                           net1: 172.7.0.2
MAC: 02:42:c6:0a:00:03               |                            MAC eth0: 02:42:ac:0a:00:02
                           subnet1:  172.7.0.1
                           MAC eth0: 02:42:ac:0a:00:01
                           subnet2:  198.7.0.1
                           MAC eth1: 02:42:c6:0a:00:01
                           subnet1 <------> subnet2
                                 forwarding
```

Fiecare container execută la secțiunea command în `docker-compose.yml` un shell script prin care se configurează rutele. [Cient](https://github.com/retele-2023/proiect/blob/main/src/client.sh) și [server](https://github.com/retele-2023/proiect/blob/main/src/server.sh) setează ca default gateway pe router (anulând default gateway din docker). 

În plus, adaugă ca nameserver 8.8.8.8, dacă vreți să testați [DNS spoofing](https://networks.hypha.ro/capitolul6/#scapy_dns_spoofing). 

[Middle](https://github.com/retele-2023/proiect/blob/main/src/middle.sh) setează `ip_forwarding=1` și regula: `iptables -t nat -A POSTROUTING -j MASQUERADE` pentru a permite mesajelor care sunt [forwardate de el să iasă din rețeaua locală](https://askubuntu.com/questions/466445/what-is-masquerade-in-the-context-of-iptables). Puteți modifica să nu facă NAT, dacă aveți probleme cu asta.


Rulati procesul de otrăvire a tabelei ARP din diagrama de mai sus pentru containerele `server` și `router` în mod constant, cu un time.sleep de câteva secunde pentru a nu face flood de pachete. (Hint: puteți folosi două [thread-uri](https://realpython.com/intro-to-python-threading/#starting-a-thread) pentru otrăvirea routerului și a serverului).


Pe lângă print-urile și mesajele de logging din programele voastre, rulați în containerul middle: `tcpdump -SntvXX -i any` iar pe `server` faceți un `wget http://old.fmi.unibuc.ro`. Dacă middle este capabil să vadă conținutul HTML din request-ul server-ului, înseamnă că atacul a reușit. Altfel încercați să curățați cache-ul ARP al serverului.

















<a name="tcphij"></a> 
## TCP Hijacking 


### Faza 1 (0.5p)

Modificați `tcp_server.py` și `tcp_client.py` din repository `src` și rulați-le pe containerul `server`, respectiv `client` ca să-și trimită în continuu unul altuia mesaje random (generați text sau numere, ce vreți voi). Puteți folosi time.sleep de o secundă/două să nu facă flood. Folosiți soluția de la exercițiul anterior pentru a vă interpune în conversația dintre `client` și `server`.
După ce ați reușit atacul cu ARP spoofing și interceptați toate mesajele, modificați conținutul mesajelor trimise de către client și de către server și inserați voi un mesaj adițional în payload-ul de TCP. Trebuie să funcționeze și atunci când lungimea mesajului se schimbă după ce a fost interceptat.
Dacă atacul a funcționat atât clientul cât și serverul afișează mesajul pe care l-ați inserat. Atacul acesta se numeșete [TCP hijacking](https://www.geeksforgeeks.org/session-hijacking/) pentru că atacatorul devine un [proxy](https://en.wikipedia.org/wiki/Proxy_server) pentru conexiunea TCP dintre client și server.


### Faza 2 (1p)
Dacă atacul a funcționat între client și server, acum trebuie să folosiți acest atac pentru a modifica conținut arbitrar dintr-o pagină HTML cerută de client. Asta presupune următoarele:
1. atacul ARP spoofing este activ
1. clientul cere o pagină HTTP (portul 80), de exemplu http://80.96.21.96/
1. middle interceptează această pagină și înlocuiește imaginea din header (de exemplu [asta](http://80.96.21.96/unibuc_fisiere/header.jpg)) cu o altă imagine, de exemplu [asta](https://haveibeenpwned.com/Images/Hero.svg) sau cu [un hyrax](https://www.reddit.com/r/hyrax/comments/1g2a72n/what_are_your_favorite_hyrax_picturesaccountsmemes/)
1. pentru început, folosiți `wget` pentru a downloada pagina ca să vedeți că atacul funcționează corect
1. pentru un atac complet, trebuie să modificați imaginea folosită de către containerul client să fie acest [firefox](https://hub.docker.com/r/jlesage/firefox)
1. atunci când accesăm pagina de firefox care rulează în container, pe orice link din pagină aș apăsa trebuie să rămână imaginea nouă vizibilă
1. dacă nu vă place site-ul respectiv, căutați altul pe [shodan](https://www.shodan.io/search?query=port%3A80+country%3ARO+http.status%3A200+org%3A%22Universitatea+din+Bucuresti%22&page=4)



### Indicații de rezolvare

1. Puteți urmări exemplul din curs despre [Netfilter Queue](https://networks.hypha.ro/capitolul6/#scapy_nfqueue) pentru a pune mesajele care circulă pe rețeaua voastră într-o coadă ca să le procesați cu scapy. Atenție! netfilterqueu nu va funcționa cu windows sau mac.
1. Urmăriți exemplul [DNS Spoofing](https://networks.hypha.ro/capitolul6/#scapy_dns_spoofing) pentru a vedea cum puteți altera mesajele care urmează a fi redirecționate într-o coadă și pentru a le modifica payload-ul înainte de a le trimite (adică să modificați payload-ul înainte de a apela `packet.accept()`). 
1. Atenție că atunci când modificați lungimea unui pachet, acesta nu va mai fi trimis mai departe cu `accept`, ci va trebui să dați un `send()` nou.
1. Verificați dacă pachetele trimise/primite au flag-ul PUSH setat. Are sens să alterați `SYN` sau `FIN`?
1. Țineți cont de lungimea mesajului pe care îl introduceți pentru ajusta `Sequence Number` (sau `Acknowledgement Number`?), dacă e necesar.
1. Puteți face tot atacul de pe containerul router pentru a testa TCP hijacking apoi puteți combina exercițiul ARP spoofing.
1. La Faza 2 va fi nevoie să interpretați conținutul HTTP ca să vedeți când vine cererea pentru imaginea țintă.
1. Scrieți pe teams orice întrebări aveți, indiferent de cât de simple sau complicate vi se par.














<a name="dns2"></a> 
## Tunel DNS
În cadrul acestei teme veți avea de implementat un client și un server care vor utiliza pachete DNS malformate pentru a crea un tunel prin care se pot transmite informații arbitrare.
Este un atac destul de [periculos](https://www.catchpoint.com/network-admin-guide/dns-tunneling) iar această temă are scopul de a vă familiariza cu principiile acestui atac cu scopul de a putea crea metode de protecție pe rețelele cu care veți lucra. Nu încercați să reproduceți metoda pe rețele publice, există [o groază de mijloace](https://www.prosec-networks.com/en/blog/dns-tunneling-erkennen/) prin care se poate descoperi tipul acesta de trafic pe rețea.

Ca model, puteți să vă inspirați din aplicații care fac deja asta, cum ar fi [dnstt](https://www.bamsoftware.com/software/dnstt/), [iodine](https://github.com/yarrick/iodine) și multe altele.


În cele ce urmează vom presupune că lucrăm cu VPS.

1. Citiți despre tuneluri DNS pe pagina https://dnstunnel.de și pe pagina despre [mitigare](https://www.prosec-networks.com/en/blog/dns-tunneling-erkennen/)
1. Configurați intrări NS și A ca în exemplul de pe https://dnstunnel.de și testați cu dig că se face rezolvarea numelor în mod corect 
1. Modificați codul de DNS server de la punctul anterior pentru a putea cere și transfera un fișier de la server la client folosind pachete malformate DNS, modificând query si response packet, [exemplu aici](https://dnstunnel.de/#communication); clientul poate trimite cerere pentru un nume_fisier.domeniu.tunel.live iar serverul răspunde cu pachete TXT care contin fisierul pe bucăți codificat binar
1. Atenție că datele transmise prin protocolul UDP se pot pierde, **trebuie să aveți un stop and wait sau fereastră glisantă prin care să vă asigurați că tot fișierul ajunge la destinație**; la demo veți prezenați [md5 checksum](https://www.tecmint.com/generate-verify-check-files-md5-checksum-linux/) pentru fișier; programul trebuie să își continue starea și dacă pierdeți conexiunea de rețea în timp ce faceți transferul
1. În cazul în care nu puteți rezolva punctul anterior, primiți 0.2p pe exercițiul acesta dacă copiați fișierul cu secury copy (scp) folosind o unealtă de DNS tunnelling existentă (iodine, dnstt, ozymandns etc).









<a name="optionalix"></a> 
## Exercițiu opțional pentru un punct bonus
Acest exercițiu se punctează individual și este valabil doar în sesiunea curentă. Nu se poate recupera la restanță, mărire etc.

Exercițiul constă la alegere între a rezolva Opțiunea 1 sau Opțiunea 2.

### Opțiunea 1 - DNS proxy
Faceți tunelul DNS de la exercițiul anterior să accepte trafic arbitrar prin care serverul DNS să devină SOCKS5 proxy și să direcționați trafic din browser după modelul [iodine](https://github.com/yarrick/iodine) și [aici](https://medium.com/@darxtrix/tunnel-your-way-to-free-internet-1a2e9120ddc).


### Opțiunea 2 - HTTP Request Smuggling
Pe platforma [neonctf](https://neonctf.ro/sessions/homework-1778343726889-u6zkxn) aveți un task care implică atacarea unei pagini web. Când apăsați butonul Spin Up, o pagină web vulnerabilă va fi deschisă pentru voi.

Acolo rulează o aplicație în spatele unui gateway HTTP personalizat care aplică reguli de control al accesului pentru ruta `/admin`. Gateway-ul are un parser strict pentru antetul [Transfer-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding), recunoaște doar valoarea exactă `chunked`. 

Backend-ul din spatele lui folosește însă un parser mai permisiv, care acceptă variante ofuscate. Această diferență de interpretare permite un atac de tip [HTTP request smuggling](https://sc.scomurr.com/http-request-smuggling-obfuscated-te-header/).   

Soluția voastră trebuie să fie un raport scris în markdown despre cum ați făcut atacul împreună cu codul și un demo pentru atac.

