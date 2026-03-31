# X = max
# 0 = min

import copy

# info = tabla de joc
# jucator = cine trebuie sa mute acum

class Nod:
    def __init__(self, info, jucator, parent=None, succ=None):
        self.info = info
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

        for i in range(3):
            toate.append(tabla[i])

        for j in range(3):
            toate.append([tabla[0][j], tabla[1][j], tabla[2][j]])

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


# alpha = cel mai bun scor gasit pentru max
# beta = cel mai bun scor gasit pentru min
def alpha_beta(nodCurent, adancime, alpha, beta, jucator):
    if graf.scop(nodCurent) or adancime == 0:
        nodCurent.euristica = graf.estimeaza(nodCurent)
        return nodCurent

    nodCurent.succ = graf.succesori(nodCurent)

    if jucator == 'MAX':
        valoare = -float('inf')
        stare_aleasa = None

        for succesor in nodCurent.succ:
            nod_evaluat = alpha_beta(
                succesor,
                adancime - 1,
                alpha,
                beta,
                graf.jucator_opus(jucator)
            )

            if nod_evaluat.euristica > valoare:
                valoare = nod_evaluat.euristica
                stare_aleasa = nod_evaluat

            alpha = max(alpha, valoare)

            # pruningul
            if alpha >= beta:
                break

        nodCurent.euristica = valoare
        nodCurent.stare_aleasa = stare_aleasa
        return stare_aleasa

    else:
        valoare = float('inf')
        stare_aleasa = None

        for succesor in nodCurent.succ:
            nod_evaluat = alpha_beta(
                succesor,
                adancime - 1,
                alpha,
                beta,
                graf.jucator_opus(jucator)
            )

            if nod_evaluat.euristica < valoare:
                valoare = nod_evaluat.euristica
                stare_aleasa = nod_evaluat

            beta = min(beta, valoare)

            if alpha >= beta:
                break

        nodCurent.euristica = valoare
        nodCurent.stare_aleasa = stare_aleasa
        return stare_aleasa


graf = Graf()

nod = alpha_beta(graf.nodStart, 3, -float('inf'), float('inf'), 'MAX')
print("Cea mai buna stare gasita:")
print(nod)
print("Euristica:", nod.euristica)