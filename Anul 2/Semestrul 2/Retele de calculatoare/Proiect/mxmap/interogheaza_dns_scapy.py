from pathlib import Path
import pandas as pd
from scapy.all import IP, UDP, DNS, DNSQR, sr1

input_path = Path("mxmap/data/localitati_cu_domenii.csv")
output_path = Path("mxmap/data/rezultate_mx_spf.csv")

servere_dns = ["8.8.8.8", "1.1.1.1"]


def curata_text_dns(value):
    # transformam valorile dns in text simplu
    if value is None:
        return ""

    if isinstance(value, bytes):
        return value.decode(errors="ignore").strip(".")

    if isinstance(value, list):
        bucati_text = []

        for bucata in value:
            bucati_text.append(curata_text_dns(bucata))

        return "".join(bucati_text).strip(".")

    return str(value).strip(".")


def trimite_cerere_dns(domeniu, tip_cerere, server_dns):
    # construim manual pachetul dns cu scapy
    pachet = (
        IP(dst=server_dns)
        / UDP(dport=53)
        / DNS(
            rd=1,
            qd=DNSQR(qname=domeniu, qtype=tip_cerere)
        )
    )

    # trimitem pachetul si asteptam raspuns
    raspuns = sr1(pachet, verbose=0, timeout=4)

    return raspuns


def get_raspuns_dns(domeniu, tip_cerere):
    # incercam mai multe servere dns
    for server_dns in servere_dns:
        raspuns = trimite_cerere_dns(domeniu, tip_cerere, server_dns)

        if raspuns is not None and DNS in raspuns:
            return raspuns

    return None


def get_lista_raspunsuri(raspuns):
    # extragem raspunsurile din pachetul dns primit
    if raspuns is None:
        return []

    if DNS not in raspuns:
        return []

    if raspuns[DNS].ancount == 0:
        return []

    lista_raspunsuri = []

    for index in range(raspuns[DNS].ancount):
        lista_raspunsuri.append(raspuns[DNS].an[index])

    return lista_raspunsuri


def get_inregistrari_mx(domeniu):
    # cerem inregistrarile mx pentru domeniu
    raspuns = get_raspuns_dns(domeniu, "MX")
    lista_raspunsuri = get_lista_raspunsuri(raspuns)

    inregistrari_mx = []

    for raspuns_dns in lista_raspunsuri:
        if raspuns_dns.type != 15:
            continue

        prioritate = getattr(raspuns_dns, "preference", "")
        server_mail = getattr(raspuns_dns, "exchange", None)

        if server_mail is None:
            server_mail = getattr(raspuns_dns, "rdata", "")

        server_mail = curata_text_dns(server_mail)

        if server_mail == "":
            continue

        if prioritate != "":
            inregistrari_mx.append(f"{prioritate} {server_mail}")
        else:
            inregistrari_mx.append(server_mail)

    return "; ".join(inregistrari_mx)


def get_inregistrari_txt(domeniu):
    # cerem inregistrarile txt pentru domeniu
    raspuns = get_raspuns_dns(domeniu, "TXT")
    lista_raspunsuri = get_lista_raspunsuri(raspuns)

    inregistrari_txt = []

    for raspuns_dns in lista_raspunsuri:
        if raspuns_dns.type != 16:
            continue

        text_dns = getattr(raspuns_dns, "rdata", "")
        text_dns = curata_text_dns(text_dns)

        if text_dns != "":
            inregistrari_txt.append(text_dns)

    return inregistrari_txt


def get_inregistrare_spf(domeniu):
    # cautam in txt regula spf
    inregistrari_txt = get_inregistrari_txt(domeniu)

    for text_dns in inregistrari_txt:
        if text_dns.lower().startswith("v=spf1"):
            return text_dns

    return ""


def main():
    if not input_path.exists():
        print(f"fisierul de intrare nu exista {input_path}")
        return

    tabel_localitati = pd.read_csv(input_path)

    if "domeniu" not in tabel_localitati.columns:
        print("lipseste coloana obligatorie domeniu")
        print("coloane gasite", list(tabel_localitati.columns))
        return

    rezultate_mx = []
    rezultate_spf = []

    for _, rand in tabel_localitati.iterrows():
        domeniu = str(rand["domeniu"]).strip()

        if domeniu == "" or domeniu == "nan":
            rezultate_mx.append("")
            rezultate_spf.append("")
            continue

        print(f"interoghez domeniul {domeniu}")

        inregistrari_mx = get_inregistrari_mx(domeniu)
        inregistrare_spf = get_inregistrare_spf(domeniu)

        rezultate_mx.append(inregistrari_mx)
        rezultate_spf.append(inregistrare_spf)

    tabel_localitati["inregistrari_mx"] = rezultate_mx
    tabel_localitati["inregistrare_spf"] = rezultate_spf

    tabel_localitati.to_csv(output_path, index=False)

    print()
    print(f"rezultatul a fost salvat in {output_path}")
    print()

    coloane_preview = []

    for nume_coloana in ["localitate", "domeniu", "inregistrari_mx", "inregistrare_spf"]:
        if nume_coloana in tabel_localitati.columns:
            coloane_preview.append(nume_coloana)

    print(tabel_localitati[coloane_preview])


if __name__ == "__main__":
    main()
