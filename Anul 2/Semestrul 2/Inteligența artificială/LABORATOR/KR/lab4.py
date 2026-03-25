import copy
import heapq


class Nod:
    # blocuri
    n = 4
    # stive
    m = 3

    def __init__(self, info, succ=None, parent=None, g=0, h=0):
        self.info = copy.deepcopy(info)
        self.succ = succ
        self.parent = parent
        self.g = g
        self.h = h
        self.f = self.g + self.h

    def __eq__(self, elem):
        return self.info == elem.info

    def drumRadacina(self):
        drum = []
        nod = self
        while nod is not None:
            drum.append(nod)
            nod = nod.parent

        drum.reverse()
        return drum

    def vizitat(self, nod):
        drum_nod = self.drumRadacina()
        info_noduri = [n.info for n in drum_nod]

        if nod.info not in info_noduri:
            return False
        else:
            return True

    def __str__(self):
        return str(self.info)

    def __repr__(self):
        return f"Nod({self.info})"

    def printDrumRadacina(self):
        drum = self.drumRadacina()
        out = []
        for nod in drum:
            out.append(str(nod.info) + f" g={nod.g} h={nod.h} f={nod.f}")
        return "\n".join(out)

    def __lt__(self, other):
        return self.f < other.f



class Graf:
    def __init__(self, nodStart, noduriScop, n, m, greutati, euristica=None):
        self.nodStart=nodStart
        self.noduriScop=noduriScop
        self.n=n
        self.m=m
        self.greutati = greutati
        self.euristica = euristica

    def scop(self,nod):
        if nod in self.noduriScop:
            return True
        else:
            return False

    def calculeaza_h(self, info):
        if self.euristica is None:
            return 0
        return self.euristica(info, self.noduriScop[0], self.greutati)

    def succesori(self,nod):
        succ=[]
        m=self.m

        for i in range(0,m):
            if nod.info[i] == []:
                continue

            bloc_mutat = nod.info[i][-1]

            for peste_stiva in range(0,m):
                if i == peste_stiva:
                    continue

                stare_curenta = copy.deepcopy(nod.info)
                stare_curenta[i].pop()
                stare_curenta[peste_stiva].append(bloc_mutat)

                g_nou = nod.g + self.greutati[bloc_mutat]
                h_nou = self.calculeaza_h(stare_curenta)
                nod_nou = Nod(stare_curenta, parent=nod, g=g_nou, h=h_nou)

                if not nod.vizitat(nod_nou):
                    succ.append(nod_nou)

        return succ


# functie ajutatoare - nr de blocuri gresit
def numara_blocuri_gresite(info, scop):
    cnt = 0

    for i in range(len(info)):
        # ia fiecare stiva
        max_len = max(len(info[i]), len(scop[i]))

        for j in range(max_len):
            #sa verifice cate blocuri sunt gresite fata de scop

            if j<len(info[i]):
                bloc_info = info[i][j]
            else:
                bloc_info = None

            if j<len(scop[i]):
                bloc_scop = scop[i][j]
            else:
                bloc_scop = None

            if bloc_info is not None and bloc_info != bloc_scop:
                cnt+=1

    return cnt



# h(n)=numar blocuri greșite×greutatea minima
def h_admisibila_consistenta(info, scop, greutati):
    g_min = min(greutati.values())
    nr_gresite = numara_blocuri_gresite(info, scop)
    return nr_gresite * g_min



def A_star(graf):
    # open
    heap = []
    start = Nod(
        graf.nodStart,
        g=0,
        h=graf.calculeaza_h(graf.nodStart)
    )
    heapq.heappush(heap, (start.f, start))

    # closed
    costuri_minime = {}
    costuri_minime[str(start.info)] = start.g

    while heap:
        f_curent, u = heapq.heappop(heap)

        if graf.scop(u.info):
            print("Drumul gasit cu A* este:")
            print(u.printDrumRadacina())
            print()
            print("Cost total:", u.g)
            print("Numar de mutari:", len(u.drumRadacina()) - 1)
            return u

        for v in graf.succesori(u):
            cheie = str(v.info)

            if cheie not in costuri_minime or v.g < costuri_minime[cheie]:
                costuri_minime[cheie] = v.g
                heapq.heappush(heap, (v.f, v))

    print("Nu exista solutie.")
    return None


if __name__ == "__main__":
    stare_start = [
        ['a', 'b'],
        ['c'],
        ['d']
    ]

    stare_scop = [
        [],
        [],
        ['a', 'b', 'c', 'd']
    ]

    greutati = {
        'a': 1,
        'b': 2,
        'c': 3,
        'd': 4
    }

    print("\nTest A* cu euristica admisibila consistenta")
    graf_h1 = Graf(
        stare_start,
        [stare_scop],
        n=4,
        m=3,
        greutati=greutati,
        euristica=h_admisibila_consistenta
    )
    A_star(graf_h1)

