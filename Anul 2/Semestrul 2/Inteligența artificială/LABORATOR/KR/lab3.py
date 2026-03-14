# blocuri, fara greutate

# import copy
#
# class Nod:
#     # blocuri
#     n = 4
#     # stive
#     m = 3
#     nrSol = 1
#
#     def __init__(self, info, poz=-1, succ=None, parent=None):
#         self.info = copy.deepcopy(info)
#         self.succ = succ
#         self.parent = parent
#
#     def __eq__(self, elem):
#         return self.info == elem.info
#
#     def drumRadacina(self):
#         drum = []
#         nod = self
#         while nod is not None:
#             drum.append(nod)
#             nod = nod.parent
#
#         drum.reverse()
#         return drum
#
#     def vizitat(self, nod):
#         drum_nod = self.drumRadacina()
#         info_noduri = [n.info for n in drum_nod]
#
#         if nod.info not in info_noduri:
#             return False
#         else:
#             return True
#
#     def __str__(self):
#         return str(self.info)
#
#     def __repr__(self):
#         return str(self.info)
#
#     def printDrumRadacina(self):
#         drum = self.drumRadacina()
#         out = []
#         for nod in drum:
#             out.append(str(nod.info))
#         return "\n".join(out)
#
#
# class Graf:
#     def __init__(self,nodStart,nodScop,n,m):
#         self.nodStart=nodStart
#         self.noduriScop=nodScop
#         self.n=n
#         self.m=m
#
#     def scop(self,nod):
#         if nod in self.noduriScop:
#             return True
#         else:
#             return False
#
#     def succesori(self,nod):
#         succ=[]
#         m=self.m
#
#         for i in range(0,m):
#             if nod.info[i] == []:
#                 continue
#
#             bloc_mutat = nod.info[i][-1]
#
#             for peste_stiva in range(0,m):
#                 if i == peste_stiva:
#                     continue
#
#                 stare_curenta = copy.deepcopy(nod.info)
#                 stare_curenta[i].pop()
#                 stare_curenta[peste_stiva].append(bloc_mutat)
#
#                 nod_nou = Nod(stare_curenta, parent=nod)
#
#                 if not nod.vizitat(nod_nou):
#                     succ.append(nod_nou)
#
#         return succ
#
#
# from collections import deque
#
# def BFS(graf):
#     q = deque()
#     start = Nod(graf.nodStart)
#     q.append(start)
#
#     vizitate = []
#     vizitate.append(start.info)
#
#     while len(q) > 0:
#         u = q.popleft()
#
#         if graf.scop(u.info):
#             print("Drumul minim este:")
#             print(u.printDrumRadacina())
#             print()
#
#             nr_mutari = len(u.drumRadacina()) - 1
#             print("Numarul minim de mutari este:", nr_mutari)
#             return nr_mutari
#
#         succ = graf.succesori(u)
#         u.succ = succ
#
#         for v in succ:
#             if v.info not in vizitate:
#                 q.append(v)
#                 vizitate.append(v.info)
#
#     print("Nu exista solutie.")
#     return None
#
#
# def DFS(graf):
#     start = Nod(graf.nodStart)
#     sol = DFS_recursiv(graf, start)
#
#
# def DFS_recursiv(graf, u):
#     if graf.scop(u.info):
#         print(u.printDrumRadacina())
#         print()
#         return True
#
#     succ = graf.succesori(u)
#     u.succ = succ
#
#     for v in succ:
#         if DFS_recursiv(graf, v):
#             return True
#
#     return False
#
#
# if __name__ == "__main__":
#     stare_start = [
#         ['a', 'b'],
#         ['c'],
#         ['d']
#     ]
#
#     stare_scop = [
#         [],
#         [],
#         ['a', 'b', 'c', 'd']
#     ]
#
#     graf = Graf(stare_start, [stare_scop], n=4, m=3)
#
#     print("Test succesori pentru starea initiala:")
#     nod_test = Nod(stare_start)
#     succ = graf.succesori(nod_test)
#
#     for s in succ:
#         print(s)
#
#     print("BFS:")
#     BFS(graf)




# blocuri , cu greutate
import copy
import heapq

class Nod:
    # blocuri
    n = 4
    # stive
    m = 3
    nrSol = 1

    def __init__(self, info, poz=-1, succ=None, parent=None, g=0):
        self.info = copy.deepcopy(info)
        self.succ = succ
        self.parent = parent
        self.g = g

    def __eq__(self, elem):
        return self.info == elem.info

    def __lt__(self, other):
        return self.g < other.g

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
        return str(self.info)

    def printDrumRadacina(self):
        drum = self.drumRadacina()
        out = []
        for nod in drum:
            out.append(str(nod.info) + " cost=" + str(nod.g))
        return "\n".join(out)


class Graf:
    def __init__(self,nodStart,nodScop,n,m,greutati):
        self.nodStart=nodStart
        self.noduriScop=nodScop
        self.n=n
        self.m=m
        self.greutati=greutati

    def scop(self,nod):
        if nod in self.noduriScop:
            return True
        else:
            return False

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

                cost_nou = nod.g + self.greutati[bloc_mutat]
                nod_nou = Nod(stare_curenta, parent=nod, g=cost_nou)

                if not nod.vizitat(nod_nou):
                    succ.append(nod_nou)

        return succ


def UCS(graf):
    heap = []
    start = Nod(graf.nodStart, g=0)
    heapq.heappush(heap, (start.g, start))

    costuri_minime = {}
    costuri_minime[str(start.info)] = 0

    while len(heap) > 0:
        cost_curent, u = heapq.heappop(heap)

        if graf.scop(u.info):
            print("Drumul de cost minim este:")
            print(u.printDrumRadacina())
            print()
            print("Costul minim este:", u.g)
            print("Numarul de mutari este:", len(u.drumRadacina()) - 1)
            return u.g

        succ = graf.succesori(u)
        u.succ = succ

        for v in succ:
            cheie = str(v.info)

            if cheie not in costuri_minime or v.g < costuri_minime[cheie]:
                costuri_minime[cheie] = v.g
                heapq.heappush(heap, (v.g, v))

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

    graf = Graf(stare_start, [stare_scop], n=4, m=3, greutati=greutati)

    print("Test succesori pentru starea initiala:")
    nod_test = Nod(stare_start)
    succ = graf.succesori(nod_test)

    for s in succ:
        print(s, "cost =", s.g)

    print("\nUCS:")
    UCS(graf)
