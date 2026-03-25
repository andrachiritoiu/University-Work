# min max
# 1

class Nod:
  def __init__(self,info,parent=None,succ=None):
    self.info=info
    self.parent=parent
    if succ!=None:
      self.succ=succ
    else:
      self.succ=[]

  def drumRadacina(self):
    drum=[]
    nod=self
    while nod is not None:
      drum.append(nod)
      nod=nod.parent

    drum.reverse()
    return drum


  def vizitat(self,nod):
    drum_nod=self.drumRadacina()
    info_noduri=[n.info for n in drum_nod]

    if nod.info not in info_noduri:
      return False
    else:
      return True

  def __str__(self):
    drum=self.drumRadacina()
    info=[(str)(n.info) for n in drum]
    return f"{self.info} ({' -> '.join(info)})"

  @staticmethod
  def to_string(lista_noduri):
    info_noduri=[(str)(n.info) for n in lista_noduri]
    return f"[ {', '.join(info_noduri)} ]"



class Graf:
    # estimari=val noduri finale
    def __init__(self, nodStart, noduriScop, muchii, estimari):
        self.nodStart = nodStart
        self.noduriScop = noduriScop
        self.estimari = estimari

        self.lista_vecini = {}
        for (u, v) in muchii:
            if u not in self.lista_vecini:
                self.lista_vecini[u] = []
            self.lista_vecini[u].append(v)

    def scop(self, nod):
        return nod in self.noduriScop

    def succesori(self, nod):
        return self.lista_vecini.get(nod, [])


def min_max(nodCurent, jucator, adancime=10):
    # jucator curent - MAX sau MIN
    if graf.scop(nodCurent) or adancime == 0:
        return graf.estimari[nodCurent]  #val nod

    succesori = graf.succesori(nodCurent)

    if jucator == 'MAX':
        valoare = -float('inf')
        for succesor in succesori:
            valoare = max(valoare, min_max(succesor, 'MIN', adancime - 1))
        return valoare
    else:
        valoare = float('inf')
        for succesor in succesori:
            valoare = min(valoare, min_max(succesor, 'MAX', adancime - 1))
        return valoare


graf = Graf(0,
            [2, 5, 7, 8, 9, 10],
            [(0, 1), (0, 2), (0, 3), (1, 4), (1, 5),
             (3, 6), (3, 7), (4, 8), (4, 9), (6, 10)],
            {2: -float('inf'), 5: 0, 7: float('inf'), 8: 3, 9: 2, 10: 1})


print("Scorul cel mai mare este: ",min_max(graf.nodStart, 'MAX'))
print()




# 2
import copy

class Nod:
    def __init__(self, info, jucator, parent=None, succ=None):
        self.info = info              # tabla de joc
        self.jucator = jucator
        self.parent = parent
        if succ is not None:
            self.succ = succ
        else:
            self.succ = []

        self.euristica = None
        self.stare_aleasa = None

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
        linii = []
        for linie in self.info:
            linii.append("|".join(linie))
        return "\n-----\n".join(linii)

    @staticmethod
    def to_string(lista_noduri):
        return "\n\n".join([str(n) for n in lista_noduri])


class Graf:
    MAX = 'X'
    MIN = '0'
    GOL = '.'

    def __init__(self, tabla=None):
        if tabla is None:
            tabla = [
                [self.GOL, self.GOL, self.GOL],
                [self.GOL, self.GOL, self.GOL],
                [self.GOL, self.GOL, self.GOL]
            ]

        self.nodStart = Nod(tabla, self.MAX)

    def jucator_opus(self, jucator):
        if jucator == self.MAX:
            return self.MIN
        else:
            return self.MAX

    def linii_coloane_diagonale(self, tabla):
        toate = []

        #linii
        for i in range(3):
            toate.append(tabla[i])

        #coloane
        for j in range(3):
            toate.append([tabla[0][j], tabla[1][j], tabla[2][j]])

        #diagonale
        toate.append([tabla[0][0], tabla[1][1], tabla[2][2]])
        toate.append([tabla[0][2], tabla[1][1], tabla[2][0]])

        return toate

    def scop(self, nod):
        toate = self.linii_coloane_diagonale(nod.info)

        for linie in toate:
            if linie.count(self.MAX) == 3:
                return self.MAX
            if linie.count(self.MIN) == 3:
                return self.MIN

        for i in range(3):
            for j in range(3):
                if nod.info[i][j] == self.GOL:
                    return False

        return "remiza"

    def succesori(self, nod):
        # toate variantele de table generate la o mutare
        lista_succ = []

        for i in range(3):
            for j in range(3):
                if nod.info[i][j] == self.GOL:
                    tabla_noua = copy.deepcopy(nod.info)
                    tabla_noua[i][j] = nod.jucator

                    nod_nou = Nod(
                        tabla_noua,
                        self.jucator_opus(nod.jucator),
                        parent=nod
                    )

                    if not nod.vizitat(nod_nou):
                        lista_succ.append(nod_nou)

        return lista_succ

    def scor_simbol(self, tabla, simbol):
        adversar = self.jucator_opus(simbol)
        scor = 0

        for linie in self.linii_coloane_diagonale(tabla):
            if adversar not in linie:
                nr = linie.count(simbol)

                if simbol == 'X':
                    if nr == 1:
                        scor += 1
                    elif nr == 2:
                        scor += 10
                    elif nr == 3:
                        scor += 100

                if simbol == '0':
                    if nr == 1:
                        scor -= 1
                    elif nr == 2:
                        scor -= 10
                    elif nr == 3:
                        scor -= 100

        return scor

    def estimeaza(self, nod):
        rezultat = self.scop(nod)

        if rezultat == self.MAX:
            return 100
        elif rezultat == self.MIN:
            return -100
        elif rezultat == "remiza":
            return 0

        scor_x = self.scor_simbol(nod.info, 'X')
        scor_0 = self.scor_simbol(nod.info, '0')

        return scor_x + scor_0


def min_max(nodCurent, adancime, jucator):
    if graf.scop(nodCurent) or adancime == 0:
        nodCurent.euristica = graf.estimeaza(nodCurent)
        return nodCurent

    nodCurent.succ = graf.succesori(nodCurent)

    mutari_evaluate = []
    for succesor in nodCurent.succ:
        nod_evaluat = min_max(succesor, adancime - 1, graf.jucator_opus(jucator))
        mutari_evaluate.append(nod_evaluat)

    if jucator == 'MAX':
        nodCurent.stare_aleasa = max(mutari_evaluate, key=lambda x: x.euristica)
    else:
        nodCurent.stare_aleasa = min(mutari_evaluate, key=lambda x: x.euristica)

    nodCurent.euristica = nodCurent.stare_aleasa.euristica
    return nodCurent.stare_aleasa



graf = Graf()

nod = min_max(graf.nodStart, 3, 'MAX')
print("Cea mai buna stare gasita:")
print(nod)
print("Euristica:", nod.euristica)