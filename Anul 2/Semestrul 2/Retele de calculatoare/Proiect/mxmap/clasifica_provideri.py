from pathlib import Path
import pandas as pd

input_path = Path("mxmap/data/rezultate_mx_spf.csv")
output_path = Path("mxmap/data/rezultate_clasificate.csv")


def text_contine(text, cuvinte):
    # verificam daca textul contine unul dintre cuvintele cautate
    text = str(text).lower()

    for cuvant in cuvinte:
        if cuvant in text:
            return True

    return False


def get_provider_mail(domeniu, inregistrari_mx, inregistrare_spf):
    # unim informatiile dns intr un singur text
    domeniu = str(domeniu).lower().strip()
    inregistrari_mx = str(inregistrari_mx).lower()
    inregistrare_spf = str(inregistrare_spf).lower()

    text_dns = inregistrari_mx + " " + inregistrare_spf

    # verificam daca providerul este google
    cuvinte_google = [
        "google",
        "googlemail",
        "aspmx.l.google.com"
    ]

    if text_contine(text_dns, cuvinte_google):
        return "google"

    # verificam daca providerul este microsoft
    cuvinte_microsoft = [
        "outlook",
        "office365",
        "microsoft",
        "protection.outlook.com",
        "spf.protection.outlook.com"
    ]

    if text_contine(text_dns, cuvinte_microsoft):
        return "microsoft"

    # verificam daca providerul este zoho
    cuvinte_zoho = [
        "zoho",
        "zcsend"
    ]

    if text_contine(text_dns, cuvinte_zoho):
        return "zoho"

    # verificam daca providerul este sendinblue
    cuvinte_sendinblue = [
        "sendinblue",
        "brevo"
    ]

    if text_contine(text_dns, cuvinte_sendinblue):
        return "sendinblue"

    # verificam daca mailul pare gazduit local pe domeniul primariei
    if domeniu != "" and domeniu != "nan":
        if domeniu in text_dns:
            return "local"

        domeniu_fara_ro = domeniu.replace(".ro", "")

        if domeniu_fara_ro != "" and domeniu_fara_ro in text_dns:
            return "local"

    # verificam daca pare provider romanesc
    cuvinte_provideri_ro = [
        ".ro",
        "mxhost",
        "romarg",
        "hostico",
        "hosterion",
        "cyberfolks",
        "namebox",
        "chroot",
        "gts",
        "rdsnet",
        "rotld"
    ]

    if text_contine(text_dns, cuvinte_provideri_ro):
        return "provider romanesc"

    return "necunoscut"


def get_categorie_provider(provider):
    # grupam providerii in categorii mai simple 
    provider = str(provider).lower()

    if provider == "google":
        return "google"

    if provider == "microsoft":
        return "microsoft"

    if provider == "local":
        return "local"

    if provider in ["zoho", "sendinblue"]:
        return "provider extern"

    if provider == "provider romanesc":
        return "provider romanesc"

    return "necunoscut"


def main():
    if not input_path.exists():
        print(f"Fisierul de intrare nu exista {input_path}")
        return

    tabel_rezultate = pd.read_csv(input_path)

    coloane_necesare = ["domeniu", "inregistrari_mx", "inregistrare_spf"]

    for coloana in coloane_necesare:
        if coloana not in tabel_rezultate.columns:
            print(f"lipseste coloana obligatorie {coloana}")
            print("coloane gasite", list(tabel_rezultate.columns))
            return

    provideri = []
    categorii = []

    # clasificam fiecare domeniu
    for _, rand in tabel_rezultate.iterrows():
        domeniu = rand["domeniu"]
        inregistrari_mx = rand["inregistrari_mx"]
        inregistrare_spf = rand["inregistrare_spf"]

        provider = get_provider_mail(domeniu, inregistrari_mx, inregistrare_spf)
        categorie = get_categorie_provider(provider)

        provideri.append(provider)
        categorii.append(categorie)

    tabel_rezultate["provider"] = provideri
    tabel_rezultate["categorie"] = categorii

    tabel_rezultate.to_csv(output_path, index=False)

    print(f"Rezultatul a fost salvat in {output_path}")
    print()

    coloane_preview = []

    for coloana in ["localitate", "domeniu", "inregistrari_mx", "inregistrare_spf", "provider", "categorie"]:
        if coloana in tabel_rezultate.columns:
            coloane_preview.append(coloana)

    print(tabel_rezultate[coloane_preview])


if __name__ == "__main__":
    main()
