from pathlib import Path
import re
import requests
import pandas as pd

output_path = Path("mxmap/data/localitati.csv")

limita_rezultate = 160


def get_coordonate_din_wikidata(coordonate_text):
    # wikidata intoarce coordonatele in format point longitudine latitudine
    if coordonate_text is None:
        return None, None

    potrivire = re.search(r"Point\(([-0-9.]+) ([-0-9.]+)\)", coordonate_text)

    if potrivire is None:
        return None, None

    longitudine = potrivire.group(1)
    latitudine = potrivire.group(2)

    return latitudine, longitudine


def get_date_wikidata():
    # interogam wikidata prin sparql fara web scraping
    query = f"""
    SELECT ?item ?itemLabel ?email ?coord WHERE {{
      ?item wdt:P17 wd:Q218 .
      ?item wdt:P968 ?email .
      ?item wdt:P625 ?coord .

      SERVICE wikibase:label {{
        bd:serviceParam wikibase:language "ro,en" .
      }}
    }}
    LIMIT {limita_rezultate}
    """

    url = "https://query.wikidata.org/sparql"

    headers = {
        "Accept": "application/sparql-results+json",
        "User-Agent": "mxmap-retele-project/1.0"
    }

    params = {
        "query": query,
        "format": "json"
    }

    raspuns = requests.get(url, headers=headers, params=params, timeout=30)

    if raspuns.status_code != 200:
        print("wikidata request failed")
        print("status code", raspuns.status_code)
        print(raspuns.text[:500])
        return []

    date_json = raspuns.json()
    rezultate = date_json["results"]["bindings"]

    return rezultate


def transforma_rezultate(rezultate):
    # transformam raspunsul wikidata in randuri pentru csv
    randuri = []

    for rezultat in rezultate:
        localitate = rezultat.get("itemLabel", {}).get("value", "")
        email = rezultat.get("email", {}).get("value", "")
        coordonate_text = rezultat.get("coord", {}).get("value", "")

        latitudine, longitudine = get_coordonate_din_wikidata(coordonate_text)

        if localitate == "":
            continue

        if email == "":
            continue

        if "@" not in email:
            continue

        if latitudine is None or longitudine is None:
            continue

        randuri.append({
            "localitate": localitate,
            "email": email,
            "latitudine": latitudine,
            "longitudine": longitudine
        })

    return randuri


def main():
    # luam datele din wikidata
    rezultate = get_date_wikidata()

    if len(rezultate) == 0:
        print("Nu am gasit rezultate in wikidata")
        return

    randuri = transforma_rezultate(rezultate)

    if len(randuri) == 0:
        print("Nu am putut transforma rezultatele in randuri valide")
        return

    tabel_localitati = pd.DataFrame(randuri)

    # eliminam duplicatele dupa email
    tabel_localitati = tabel_localitati.drop_duplicates(subset=["email"])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    tabel_localitati.to_csv(output_path, index=False)

    print(f"Datele au fost salvate in {output_path}")
    print()
    print(tabel_localitati.head(20))
    print()
    print("Numar randuri", len(tabel_localitati))


if __name__ == "__main__":
    main()
