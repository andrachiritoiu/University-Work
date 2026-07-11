from pathlib import Path
import pandas as pd

input_path = Path("mxmap/data/localitati.csv")
output_path = Path("mxmap/data/localitati_cu_domenii.csv")

def get_domeniu_din_email(email):
    # verificam daca emailul lipseste
    if pd.isna(email):
        return ""

    text_email = str(email).strip().lower()

    # eliminam prefixul mailto daca apare in date
    text_email = text_email.replace("mailto:", "")

    # daca sunt mai multe emailuri in aceeasi celula pastram primul
    separatori = [";", ",", "|"]

    for separator in separatori:
        if separator in text_email:
            text_email = text_email.split(separator)[0].strip()

    # verificam daca textul contine caracterul @
    if "@" not in text_email:
        return ""

    # luam partea de dupa ultimul @
    domeniu = text_email.rsplit("@", 1)[-1]

    domeniu = domeniu.strip()
    domeniu = domeniu.replace(" ", "")
    domeniu = domeniu.strip("<>")

    if domeniu == "":
        return ""

    # verificam daca domeniul pare valid
    if "." not in domeniu:
        return ""

    return domeniu


def main():
    if not input_path.exists():
        print(f"Fisierul de intrare nu exista {input_path}")
        return

    tabel_localitati = pd.read_csv(input_path)

    if "email" not in tabel_localitati.columns:
        print("Lipseste coloana obligatorie email")
        print("Coloane gasite", list(tabel_localitati.columns))
        return

    # adaugam coloana domeniu
    tabel_localitati["domeniu"] = tabel_localitati["email"].apply(get_domeniu_din_email)

    # salvam rezultatul
    tabel_localitati.to_csv(output_path, index=False)

    coloane_preview = []

    for nume_coloana in ["localitate", "email", "domeniu"]:
        if nume_coloana in tabel_localitati.columns:
            coloane_preview.append(nume_coloana)

    print(f"Rezultatul a fost salvat in {output_path}")
    print()
    print(tabel_localitati[coloane_preview])


if __name__ == "__main__":
    main()
