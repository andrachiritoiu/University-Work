import math
import random
import matplotlib.pyplot as plt

# codificare
# l = lungime cromozom
def lungime_cromozom(a, b, p):
    return max(1, math.ceil(math.log2((b - a) * (10 ** p) + 1)))

def cromozom_aleator(l):
    return [random.randint(0, 1) for _ in range(l)]

def decodifica(cromozom, a, b, l):
    val = 0
    # B2 -> B10
    for gena in cromozom:
        val = val * 2 + gena
    return (b - a) / (2 ** l - 1) * val + a

# evaluare
def fitness(x, A, B, C):
    return A * x * x + B * x + C


# selectie
def calculeaza_probabilitati(fvals):
    suma = sum(fvals)

    p = []
    for fv in fvals:
        p.append(fv / suma)

    q = [0]
    for prob in p:
        q.append(q[-1] + prob)

    return p, q


def cautare_binara(q, u):
    st = 0
    dr = len(q) - 2

    while st < dr:
        mij = (st + dr) // 2
        if q[mij + 1] <= u:
            st = mij + 1
        else:
            dr = mij

    return st

def selectie_elitista(populatie, fvals, g=None):
    p, q = calculeaza_probabilitati(fvals)

    # pastram cel mai bun individ
    idx_elita = fvals.index(max(fvals))
    elita = populatie[idx_elita].copy()

    populatie_noua = [elita]

    if g is not None:
        g.write("Probabilitati selectie \n")
        for i, prob in enumerate(p, start=1):
            g.write(f"cromozom {i:4d} probabilitate {prob}\n")

        g.write("\nIntervale probabilitati selectie \n")
        for x in q:
            g.write(f"{x} ")
        g.write("\n")

    # mai alegem restul prin ruleta
    for _ in range(len(populatie) - 1):
        u = random.random()
        idx = cautare_binara(q, u)
        if g is not None:
            g.write(f"u={u}  selectam cromozomul {idx + 1} \n")
        populatie_noua.append(populatie[idx].copy())

    return populatie_noua, p, q


# incrucisare
def crossover(populatie, pc, g=None):
    l = len(populatie[0])

    rezultat = [c.copy() for c in populatie]

    participanti = []

    if g is not None:
        g.write(f"\nProbabilitatea de incrucisare {pc}\n")

    # 1. alegem cine participa
    for i in range(len(rezultat)):
        u = random.random()
        if u < pc:
            participanti.append(i)
            if g is not None:
                g.write(f"{i + 1}: {''.join(map(str, rezultat[i]))} u={u}<{pc} participa \n")
        else:
            if g is not None:
                g.write(f"{i + 1}: {''.join(map(str, rezultat[i]))} u={u}\n")

    # 2. perechi
    for k in range(0, len(participanti) - 1, 2):
        i = participanti[k]
        j = participanti[k + 1]

        # 3. punctul de rupere
        punct = random.randint(1, l - 1)

        if g is not None:
            g.write(f"\nRecombinare dintre cromozomul {i + 1} cu cromozomul {j + 1}:\n")
            g.write(f"{''.join(map(str, rezultat[i]))} {''.join(map(str, rezultat[j]))} punct  {punct}\n")

        copil1 = rezultat[i][:punct] + rezultat[j][punct:]
        copil2 = rezultat[j][:punct] + rezultat[i][punct:]

        rezultat[i] = copil1
        rezultat[j] = copil2

        if g is not None:
            g.write(f"\nRezultat    {''.join(map(str, rezultat[i]))} {''.join(map(str, rezultat[j]))}\n")

    return rezultat

# mutatia
def mutatie(populatie, pm, g=None):
    rezultat = [c.copy() for c in populatie]
    modificati = set()

    for i in range(len(rezultat)):
        for j in range(len(rezultat[i])):
            u = random.random()
            if u < pm:
                rezultat[i][j] = 1 - rezultat[i][j]
                modificati.add(i + 1)

    if g is not None:
        g.write(f"\nProbabilitate de mutatie pentru fiecare gena {pm}\n")
        g.write("Au fost modificati cromozomii:\n")
        for idx in sorted(modificati):
            g.write(f"{idx}\n")

    return rezultat



def citeste_date_intrare(nume_fisier="input.txt"):
    with open(nume_fisier, "r") as f:
        n = int(f.readline().strip())
        a, b = map(float, f.readline().split())
        A, B, C = map(float, f.readline().split())
        precizie = int(f.readline().strip())
        pc = float(f.readline().strip())
        pm = float(f.readline().strip())
        nr_gen = int(f.readline().strip())

    return n, a, b, A, B, C, precizie, pc, pm, nr_gen

def afiseaza_populatie(g, titlu, populatie, a, b, l, A, B, C):
    g.write(f"{titlu}\n")
    for i, cromozom in enumerate(populatie, start=1):
        x = decodifica(cromozom, a, b, l)
        f = fitness(x, A, B, C)
        g.write(f"{i:4d}: {''.join(map(str, cromozom))} x= {x: .6f} f={f}\n")
    g.write("\n")



def main():
    # Pas 1.P(0)
    n, a, b, A, B, C, precizie, pc, pm, nr_gen = citeste_date_intrare("input.txt")

    l = lungime_cromozom(a, b, precizie)

    populatie = [cromozom_aleator(l) for _ in range(n)]


    max_hist = []
    mean_hist = []

    with open("Evolutie.txt", "w") as g:

        for generatie in range(nr_gen):
            #Pas 2.Fitness
            xs = [decodifica(cromozom, a, b, l) for cromozom in populatie]
            fvals = [fitness(x, A, B, C) for x in xs]

            max_fit = max(fvals)
            mean_fit = sum(fvals)/len(fvals)

            max_hist.append(max_fit)
            mean_hist.append(mean_fit)


            if generatie == 0:
                g.write("\nPopulatia initiala\n")
                for i in range(len(populatie)):
                    crom = populatie[i]
                    x = xs[i]
                    f = fvals[i]
                    g.write(f"{i + 1:4d}: {''.join(map(str, crom))} x= {x: .6f} f={f}\n")
                g.write("\n")

                #Pas 3.Selectia
                populatie_selectata, p, q = selectie_elitista(populatie, fvals, g)
                afiseaza_populatie(g, "\nDupa selectie:", populatie_selectata, a, b, l, A, B, C)

                #Pas 4.Incrucisarea
                populatie_dupa_crossover = crossover(populatie_selectata, pc, g)
                afiseaza_populatie(g, "\nDupa recombinare:", populatie_dupa_crossover, a, b, l, A, B, C)

                #Pas 5.Mutatia
                populatie_dupa_mutatie = mutatie(populatie_dupa_crossover, pm, g)
                afiseaza_populatie(g, "\nDupa mutatie:", populatie_dupa_mutatie, a, b, l, A, B, C)

                populatie = populatie_dupa_mutatie

            else:
                populatie_selectata, p, q = selectie_elitista(populatie, fvals)
                populatie_dupa_crossover = crossover(populatie_selectata, pc)
                populatie_dupa_mutatie = mutatie(populatie_dupa_crossover, pm)
                populatie = populatie_dupa_mutatie

        g.write("\nEvolutia maximului \n")
        for val in max_hist:
            g.write(f"{val}\n")

        generatii = list(range(1, nr_gen + 1))

    plt.figure(figsize=(10, 6))
    plt.plot(generatii, max_hist, label="Max Fitness")
    plt.plot(generatii, mean_hist, label="Mean Fitness")
    plt.xlabel("Generatia")
    plt.ylabel("Fitness")
    plt.title("Evolutia algoritmului genetic")
    plt.legend()
    plt.grid(True)
    plt.show()

if __name__ == "__main__":
    main()