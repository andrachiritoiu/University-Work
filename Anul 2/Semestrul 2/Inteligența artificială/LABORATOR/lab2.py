class Nod:
    n = 3
    # nr de locuri in barca
    m = 2

    def __init__(self, info, poz=-1, succ=None, parent=None):
        if info is None:
            info = (self.n, self.n, -1)
        self.info = info
        self.succ = succ
        self.parent = parent

    def __eq__(self, elem):
        return (self.info[0], self.info[1], self.info[2]) == (elem.info[0], elem.info[1], elem.info[2])

    def _mal_text(self, b):
        return "stâng" if b == -1 else "drept"

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
        m_left, c_left, b = self.info
        m_right = self.n - m_left
        c_right = self.n - c_left
    
        return (
            "Stare curentă:\n"
            f"{m_left} misionari, {c_left} canibali  |  "
            f"{m_right} misionari, {c_right} canibali\n"
            f"Barca se află pe malul {self._mal_text(b)}"
        )

    def __repr__(self):
        return str(self.info)

    def printDrumRadacina(self, N):
        drum = self.drumRadacina()
        out = []

        def stare_text(stare):
            m_left, c_left, b = stare
            m_right, c_right = N - m_left, N - c_left
            return (
                "Stare curentă:\n"
                f"{m_left} misionari, {c_left} canibali  |  {m_right} misionari, {c_right} canibali\n"
                f"Barca se află pe malul {self._mal_text(b)}\n"
            )

        out.append(stare_text(drum[0].info))

        for i in range(1, len(drum)):
            prev = drum[i - 1].info
            cur = drum[i].info

            mL1, cL1, b1 = prev
            mL2, cL2, b2 = cur

            if b1 == -1 and b2 == 1:
                directie = "de pe malul stâng pe malul drept"
            elif b1 == 1 and b2 == -1:
                directie = "de pe malul drept pe malul stâng"
            else:
                directie = "între maluri"

            moved_m = abs(mL2 - mL1)
            moved_c = abs(cL2 - cL1)

            out.append(
                f"\nBarca s-a deplasat {directie} cu {moved_m} misionari și {moved_c} canibali.\n\n"
            )
            out.append(stare_text(cur))

        return "".join(out)



class Graf:
  def __init__(self,nodStart,noduriScop,n,m):
    self.nodStart=nodStart
    self.noduriScop=noduriScop
    self.n=n
    self.m=m

  def scop(self,nod):
    if nod in self.noduriScop:
      return True
    else:
        return False

  def succesori(self,nod):
    succ=[]
    n=self.n
    m=self.m

    # starea curenta
    m_left=nod.info[0]
    c_left=nod.info[1]
    b=nod.info[2]

    # unde e barca
    # stanga
    if b==-1:
      m_curent, c_curent = m_left, c_left
      m_op, c_op = n-m_left, n-c_left

    else:
      m_curent, c_curent  = n-m_left, n-c_left
      m_op, c_op = m_left, c_left

    # toate combinatiile in barca
    for mb in range(0,m+1):
      for cb in range(0,m+1):
        if mb+cb==0 or mb+cb>m or mb>m_curent or cb>c_curent:
          continue

        # mutare
        m_curent2 = m_curent - mb
        c_curent2 = c_curent - cb
        m_op2  = m_op + mb
        c_op2  = c_op + cb

        # safe
        if not (m_curent2 == 0 or m_curent2 >= c_curent2):
            continue
        if not (m_op2 == 0 or m_op2 >= c_op2):
            continue

        if b==-1:
            info_succ = (m_curent2, c_curent2, 1)
        else:
            info_succ = (m_op2, c_op2, -1)

        nod_nou = Nod(info_succ, parent=nod)


        # evitare ciclu
        if not nod.vizitat(nod_nou):
            succ.append(nod_nou)

    return succ



from collections import deque

def BFS(graf):
  n = int(input("n= "))

  q = deque()
  q.append(Nod(graf.nodStart))

  sol = 0

  while len(q) > 0 and sol < n:
    u = q.popleft()

    # verif daca e nod final
    if graf.scop(u.info):
      print(u.printDrumRadacina(N))
      sol += 1
      if sol >= n:
        break

    # vecinii lui u
    succ = graf.succesori(u)
    u.succ = succ

    for v in succ:
      q.append(v)


#DFS
def DFS(graf):
  n = int(input("n= "))
  start = Nod(graf.nodStart)
  sol = 0
  sol = DFS_recursiv(graf, start, n, sol)


def DFS_recursiv(graf, u, n, sol):
  if sol >= n:
    return sol

  if graf.scop(u.info):
    print(u.printDrumRadacina(N))
    sol += 1
    if sol >= n:
      return sol

  succ = graf.succesori(u)
  u.succ = succ

  for v in succ:
    sol = DFS_recursiv(graf, v, n, sol)
    if sol >= n:
      return sol

  return sol

import time
import builtins
import io
from contextlib import redirect_stdout

def ruleaza_si_scrie(graf, NSOL=2):
    cale = input("Calea fisierului: ").strip()

    input_original = builtins.input

    def input_fals(prompt=""):
        if "n" in prompt:
            return str(NSOL)
        return input_original(prompt)

    with open(cale, "w", encoding="utf-8") as f:
        # BFS
        builtins.input = input_fals
        buffer = io.StringIO()
        t0 = time.perf_counter()
        with redirect_stdout(buffer):
            BFS(graf)
        t1 = time.perf_counter()
        builtins.input = input_original

        f.write("-BFS-\n")
        f.write(buffer.getvalue())
        f.write(f"\nTimpul de rulare: {t1 - t0} secunde.\n")

        # DFS
        builtins.input = input_fals
        buffer = io.StringIO()
        t0 = time.perf_counter()
        with redirect_stdout(buffer):
            DFS(graf)
        t1 = time.perf_counter()
        builtins.input = input_original

        f.write("-DFS-\n")
        f.write(buffer.getvalue())
        f.write(f"\nTimpul de rulare: {t1 - t0} secunde.\n")

    print("Am scris in fisier:", cale)


if __name__ == "__main__":
    N = 3
    M = 2
    NSOL = 2

    start = (N, N, -1)
    scopuri = [(0, 0, 1)]

    graf = Graf(start, scopuri, N, M)

    ruleaza_si_scrie(graf, NSOL)


