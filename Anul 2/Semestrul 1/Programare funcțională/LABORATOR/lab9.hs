--tipul de date
data Tree = Empty  -- arbore vid
  | Node Int Tree Tree Tree -- arbore cu valoare de tip Int in radacina
                            -- si 3 fii
  
-- extree :: Tree
-- extree = Node 4 (Node 5 Empty Empty Empty) 
--                 (Node 3 Empty Empty (Node 1 Empty Empty Empty)) Empty



-- 1.Instanțiați clasa următoare pentru tipul Tree.(un set de reguli pe care trebuie sa le aiba orice instata care vraa sa fie ArboreInfo)
class ArbInfo t where
  level :: t -> Int -- intoarce inaltimea arborelui; 
                    -- consideram ca un arbore vid are inaltimea 0
  sumval :: t -> Int -- intoarce suma valorilor din arbore
  nrFrunze :: t -> Int -- intoarce nr de frunze al arborelui

-- level extree
-- 3
-- sumval extree
-- 13
-- nrFrunze extree
-- 2

instance ArbInfo Tree where
    level Empty = 0
    level (Node _ l m r) = 1 + maximum [level l, level m, level r]
    
    sumval Empty = 0
    sumval (Node v l m r) = v + sumval l + sumval m + sumval r
    nrFrunze Empty = 0
    nrFrunze (Node _ Empty Empty Empty) = 1
    nrFrunze (Node _ l m r) = nrFrunze l + nrFrunze m + nrFrunze r





 --Vectori
class Scalar a where
  zero :: a 
  one :: a 
  adds :: a -> a -> a
  mult :: a -> a -> a
  negates :: a -> a
  recips :: a -> a

-- 2.Instanțiați clasa Scalar folosindu-vă de tipuri primitive (hint: nu uitați, trebuie 
--să fie corpuri comutative). Apoi, considerați clasa de mai jos a vectorilor.


instance Scalar Int where
  zero = 0
  one = 1
  adds x y = x + y
  mult x y = x * y
  negates x = -x
  recips x = 1 `div` x


instance Scalar Float where
  zero = 0.0 
  one = 1.0
  adds x y = x + y
  mult x y = x * y
  negates x = -x  

  recips x = 1.0 / x 



data Vector2D a = V2 a a deriving Show
data Vector3D a = V3 a a a deriving Show

class (Scalar a) => Vector v a where
  zerov :: v a
  onev :: v a
  addv :: v a -> v a -> v a -- adunare vector
  smult :: a -> v a -> v a  -- inmultire cu scalare
  negatev :: v a -> v a -- negare vector




--3.  Scrieți două instanțe ale clasei Vector pentru a reprezenta vectori bidimensionali și tridimensionali.

--2D
instance (Scalar a) => Vector Vector2D a where
    zerov = V2 zero zero
    onev = V2 one one
  
    addv (V2 x1 y1) (V2 x2 y2) = V2 (adds x1 x2) (adds y1 y2)
  
    smult s (V2 x y) = V2 (mult s x) (mult s y)
  
    negatev (V2 x y) = V2 (negates x) (negates y)




--3D
instance (Scalar a) => Vector Vector3D a where
  zerov = V3 zero zero zero
  onev = V3 one one one
  
  addv (V3 x1 y1 z1) (V3 x2 y2 z2) = V3 (adds x1 x2) (adds y1 y2) (adds z1 z2)
  
  smult s (V3 x y z) = V3 (mult s x) (mult s y) (mult s z)
  
  negatev (V3 x y z) = V3 (negates x) (negates y) (negates z)    


