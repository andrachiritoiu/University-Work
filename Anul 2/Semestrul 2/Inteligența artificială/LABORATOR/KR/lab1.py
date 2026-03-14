#tema
# graf = Graf(0,
#             [4, 6],
#             [(0, 1, 3), (0, 2, 5), (0, 3, 10), (0, 6, 100),
#              (1, 3, 4), (2, 3, 4), (2, 4, 9), (2, 5, 3),
#              (3, 1, 3), (3, 4, 2), (5, 4, 4), (6, 2, 3)],
#             {1: 1, 2: 6, 3: 2, 4: 0, 5: 3, 6: 0})


#1.clasa nod
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



#2.clasa Graf
class Graf:
  def __init__(self, nodStart, noduriScop, muchii):
    self.nodStart = nodStart
    self.noduriScop = noduriScop

    self.lista_vecini = {}
    for (u, v, cost) in muchii:
      if u not in self.lista_vecini:
        self.lista_vecini[u] = []
      self.lista_vecini[u].append((v, cost))

  def scop(self, nod):
    if nod in self.noduriScop:
      return True
    else:
      return False

  def succesori(self, nod):
    succ = []

    if nod.info in self.lista_vecini:
      vecini = self.lista_vecini[nod.info]
    else:
      vecini = []

    for (v, cost) in vecini:
      nod_nou = Nod(v, parent=nod)
      if not nod.vizitat(nod_nou):
        succ.append(nod_nou)

    return succ




# 3.BFS
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
      print(u)
      sol += 1
      if sol >= n:
        break

    # vecinii lui u
    succ = graf.succesori(u)
    u.succ = succ

    for v in succ:
      q.append(v)




#4.DFS
def DFS(graf):
  n = int(input("n= "))
  start = Nod(graf.nodStart)
  sol = 0
  sol = DFS_recursiv(graf, start, n, sol)


def DFS_recursiv(graf, u, n, sol):
  if sol >= n:
    return sol

  if graf.scop(u.info):
    print(u)
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


# TEST

graf = Graf(
    0,
    [4, 6],
    [
        (0, 1, 3), (0, 2, 5), (0, 3, 10), (0, 6, 100),
        (1, 3, 4),
        (2, 3, 4), (2, 4, 9), (2, 5, 3),
        (3, 1, 3), (3, 4, 2),
        (5, 4, 4),
        (6, 2, 3)
    ]
)

# 1) Test Nod: drumRadacina(), vizitat(), __str__(), to_string()
print("Test clasa Nod")
r = Nod(0)
a = Nod(2, parent=r)
b = Nod(5, parent=a)

print("drumRadacina pentru b (info noduri):",
      [n.info for n in b.drumRadacina()])
#[0, 2, 5]

print("__str__ pentru b:", b)
#5 (0 -> 2 -> 5)

print("to_string([r,a,b]):", Nod.to_string([r, a, b]))
#[ 0, 2, 5 ]

print("vizitat(Nod(2, parent=b)) (2 e deja în drum):",
      b.vizitat(Nod(2, parent=b)))
#True

print("vizitat(Nod(9, parent=b)) (9 nu e în drum):",
      b.vizitat(Nod(9, parent=b)))
#False


# 2) Test Graf: scop(), succesori()
print("\nTest clasa Graf")

print("scop(4):", graf.scop(4))
# True
print("scop(6):", graf.scop(6))
# True
print("scop(2):", graf.scop(2))
# False

start = Nod(graf.nodStart)
succ_start = graf.succesori(start)
print("Succesori(start=0):", Nod.to_string(succ_start))
# [ 1, 2, 3, 6 ]


# 3) BFS
print("\nTest BFS (n=6)")
BFS(graf)

# 6 (0 -> 6)
# 4 (0 -> 2 -> 4)
# 4 (0 -> 3 -> 4)
# 4 (0 -> 2 -> 3 -> 4)
# 4 (0 -> 2 -> 5 -> 4)
# 4 (0 -> 1 -> 3 -> 4)


# 4) DFS
print("\nTest DFS (n=5)")
DFS(graf)

# 4 (0 -> 1 -> 3 -> 4)
# 4 (0 -> 2 -> 3 -> 4)
# 4 (0 -> 2 -> 4)
# 4 (0 -> 2 -> 5 -> 4)
# 6 (0 -> 6)

