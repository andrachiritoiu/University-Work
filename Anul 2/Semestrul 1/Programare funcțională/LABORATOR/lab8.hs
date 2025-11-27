--figuri geometrice

--6. Instanțiați clasa GeoOps pentru tipul de date Geo. Hint: pentru valoarea pi puteți folosi funcția cu același nume (pi).
data Geo a = Square a | Rectangle a a | Circle a
    deriving Show

class GeoOps g where
  perimeter :: (Floating a) => g a -> a
  area :: (Floating a) =>  g a -> a    

--formule matematice
instance GeoOps Geo where
  perimeter (Square a)      = 4 * a
  perimeter (Rectangle a b) = 2 * (a + b)
  perimeter (Circle r)      = 2 * pi * r

  area (Square a)      = a * a
  area (Rectangle a b) = a * b
  area (Circle r)      = pi * r * r


--7.Instanțiați clasa Eq pentru tipul de date Geo, astfel încât două figuri geometrice să fie egale dacă au perimetrul egal

instance (Floating a, Eq a) => Eq (Geo a) where
    g1 == g2 = perimeter g1 == perimeter g2   



--clasa collection 

class Collection c where
  empty :: c key value
  singleton :: key -> value -> c key value
  insert :: Ord key => key -> value -> c key value -> c key value
  clookup :: Ord key => key -> c key value -> Maybe value
  delete :: Ord key => key -> c key value -> c key value
  toList :: c key value -> [(key, value)]
  
  keys :: c key value -> [key]
  values :: c key value -> [value]
  fromList :: Ord key => [(key,value)] -> c key value

  --1.Adăugați definiții implicite (folosind celelalte funcții din clasă) pentru keys, values și fromList.

  -- doar cheile
  keys c = map fst (toList c)

  -- doar valorile
  values c = map snd (toList c)

  -- Implementare fromList
  fromList xs = foldr (\(k,v) acc -> insert k v acc) empty xs



--2.Fie tipul listelor de perechi cheie-valoare:
newtype PairList k v
  = PairList { getPairList :: [(k, v)] }
    deriving Show

instance Collection PairList where
  empty = PairList []

  singleton k v = PairList [(k, v)]

  insert k v (PairList l) = PairList ((k, v) : filter (\(key, _) -> key /= k) l)

  clookup k (PairList l) = lookup k l
  delete k (PairList l) = PairList (filter (\(key, _) -> key /= k) l)

  toList (PairList l) = l


--3.Amintiți-vă exercițiul din laboratorul trecut în care ați definit tipul arborilor de căutare cu noduri constând în perechi chei-valoare cu chei numere întregi. Vom generaliza acest tip definind arbori binari de căutare (ne-echilibrați) cu chei de tip oarecare:

data SearchTree key value
  = Empty
  | BNode
      (SearchTree key value) -- subarbore stânga (chei mai mici)
      key                    -- cheia
      (Maybe value)          -- valoarea (Nothing = șters)
      (SearchTree key value) -- subarbore dreapta (chei mai mari)
  deriving Show


instance Collection SearchTree where
  empty = Empty
  singleton k v = BNode Empty k (Just v) Empty

  insert k v Empty = singleton k v
  insert k v (BNode l key val r)
    | k == key  = BNode l key (Just v) r
    | k < key   = BNode (insert k v l) key val r
    | k > key   = BNode l key val (insert k v r)

  delete k Empty = Empty
  delete k (BNode l key val r)
    | k == key  = BNode l key Nothing r
    | k < key   = BNode (delete k l) key val r
    | k > key   = BNode l key val (delete k r)

  clookup k Empty = Nothing
  clookup k (BNode l key val r)
    | k == key  = val
    | k < key   = clookup k l     
    | k > key   = clookup k r

  toList Empty = []
  toList (BNode l k val r) = toList l ++ elemCurent ++ toList r
    where 
      elemCurent = case val of
                     Just v -> [(k, v)]
                     Nothing -> []



--Puncte
data Punct = Pt [Int]

data Arb = Vid | F Int | N Arb Arb
          deriving Show

class ToFromArb a where
 	    toArb :: a -> Arb
	    fromArb :: Arb -> a

--4.  Scrieți o instanță a clasei Show pentru tipul de date Punct, astfel încât lista coordonatelor să fie afișată ca tuplu.    
instance Show Punct where
  show (Pt []) = "()"
  
  show (Pt xs) = "(" ++ afiseazaLista xs ++ ")"
    where
      afiseazaLista [] = ""
      afiseazaLista [x] = show x  
      afiseazaLista (x:restul) = show x ++ ", " ++ afiseazaLista restul
              



-- 5.Scrieți o instanță a clasei ToFromArb pentru tipul de date Punct astfel încât lista coordonatelor punctului să coincidă cu frontiera arborelui.
instance ToFromArb Punct where
  toArb (Pt lista) = transformaLista lista
    where
      transformaLista [] = Vid
      transformaLista (x:xs) = N (F x) (transformaLista xs)

  fromArb arbore = Pt (transformaArb arbore)
    where
      transformaArb Vid = []
      transformaArb (N (F x) r) = x : transformaArb r
      transformaArb _ = []
