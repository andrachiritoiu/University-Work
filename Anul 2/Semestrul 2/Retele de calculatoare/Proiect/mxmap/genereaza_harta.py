from pathlib import Path
import html
import pandas as pd
import folium

input_path = Path("mxmap/data/rezultate_clasificate.csv")
output_path_ro = Path("mxmap/public/harta.html")
output_path_demo = Path("mxmap/public/map.html")


def get_culoare_dupa_categorie(categorie):
    # alegem culoarea markerului in functie de categoria providerului
    categorie = str(categorie).lower().strip()

    if categorie == "local":
        return "green"

    if categorie == "microsoft":
        return "blue"

    if categorie == "google":
        return "red"

    if categorie == "provider romanesc":
        return "orange"

    if categorie == "provider extern":
        return "purple"

    return "gray"


def get_text_popup(rand):
    # construim textul care apare cand apasam pe un marker
    localitate = html.escape(str(rand.get("localitate", "")))
    email = html.escape(str(rand.get("email", "")))
    domeniu = html.escape(str(rand.get("domeniu", "")))
    mx = html.escape(str(rand.get("inregistrari_mx", "")))
    spf = html.escape(str(rand.get("inregistrare_spf", "")))
    provider = html.escape(str(rand.get("provider", "")))
    categorie = html.escape(str(rand.get("categorie", "")))

    text_popup = f"""
    <b>localitate</b> {localitate}<br>
    <b>email</b> {email}<br>
    <b>domeniu</b> {domeniu}<br>
    <b>mx</b> {mx}<br>
    <b>spf</b> {spf}<br>
    <b>provider</b> {provider}<br>
    <b>categorie</b> {categorie}
    """

    return text_popup


def adauga_legenda(harta):
    # adaugam legenda pentru culorile folosite pe harta
    legenda_html = """
    <div style="
        position: fixed;
        bottom: 40px;
        left: 40px;
        width: 220px;
        background-color: white;
        border: 2px solid gray;
        z-index: 9999;
        font-size: 14px;
        padding: 10px;
        border-radius: 6px;
    ">
        <b>Legenda MXMap</b><br><br>
        <span style="color: green;">●</span> local<br>
        <span style="color: blue;">●</span> microsoft<br>
        <span style="color: red;">●</span> google<br>
        <span style="color: orange;">●</span> provider romanesc<br>
        <span style="color: purple;">●</span> provider extern<br>
        <span style="color: gray;">●</span> necunoscut<br>
    </div>
    """

    harta.get_root().html.add_child(folium.Element(legenda_html))


def main():
    if not input_path.exists():
        print(f"Fisierul de intrare nu exista {input_path}")
        return

    tabel_rezultate = pd.read_csv(input_path)

    # verificam coloanele necesare pentru harta
    coloane_necesare = ["localitate", "latitudine", "longitudine", "provider", "categorie"]

    for coloana in coloane_necesare:
        if coloana not in tabel_rezultate.columns:
            print(f"Lipseste coloana obligatorie {coloana}")
            print("Coloane gasite", list(tabel_rezultate.columns))
            return

    # eliminam randurile fara coordonate
    tabel_rezultate = tabel_rezultate.dropna(subset=["latitudine", "longitudine"])

    if tabel_rezultate.empty:
        print("Nu exista randuri cu latitudine si longitudine")
        return

    # cream harta centrata pe romania
    harta = folium.Map(
        location=[45.9432, 24.9668],
        zoom_start=7,
        tiles="OpenStreetMap"
    )

    # adaugam cate un marker pentru fiecare localitate
    for _, rand in tabel_rezultate.iterrows():
        latitudine = float(rand["latitudine"])
        longitudine = float(rand["longitudine"])
        categorie = rand["categorie"]

        culoare = get_culoare_dupa_categorie(categorie)
        text_popup = get_text_popup(rand)

        folium.CircleMarker(
            location=[latitudine, longitudine],
            radius=8,
            popup=folium.Popup(text_popup, max_width=450),
            tooltip=str(rand["localitate"]),
            color=culoare,
            fill=True,
            fill_color=culoare,
            fill_opacity=0.8
        ).add_to(harta)

    # adaugam legenda
    adauga_legenda(harta)

    # ne asiguram ca exista folderul public
    output_path_ro.parent.mkdir(parents=True, exist_ok=True)

    # salvam harta in doua fisiere
    harta.save(output_path_ro)
    harta.save(output_path_demo)

    print(f"Harta a fost salvata in {output_path_ro}")
    print(f"Harta a fost salvata si in {output_path_demo}")


if __name__ == "__main__":
    main()
