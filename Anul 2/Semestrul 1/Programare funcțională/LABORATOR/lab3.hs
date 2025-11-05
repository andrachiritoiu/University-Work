import Data.Char (isDigit, digitToInt)

-- lab 3
-- 1.
-- a) verifL - verifică dacă lungimea unei liste date ca parametru este pară.

verifL :: [Int] -> Bool
verifL [] = True
verifL (_:[]) = False
verifL (_:_:xs) = verifL xs


--b) takefinal - pentru o listă l dată ca parametru și un număr n, întoarce o listă 
--care conține ultimele n elemente ale listei l. Dacă lista are mai puțin de n elemente, întoarce lista nemodificată.

takefinal :: [Int] -> Int -> [Int]
takefinal l n
  | n >= length l = l
  | otherwise = drop (length l - n) l


--c) remove - pentru o listă și un număr n, întoarce lista primită ca parametru din care se șterge elementul 
--de pe poziția n. (Hint: puteți folosi funcțiile take și drop). Scrieți și prototipul funcției.

--take: returneaza primelel n elemente
--take n [L]

--drop: sterge primle n elemente din lista
--drop n [L]

--indexarea de la 0
-- let l = [10, 20, 30, 40]
-- l !! 0   -- 10  (primul element)
-- l !! 1   -- 20  (al doilea element)


remove :: [Int] -> Int -> [Int]
remove l n
   | n < 0 || n>= length l = l
   | otherwise = take n l ++ drop (n+1) l




--Recursivitate 

--2.Scrieți următoarele funcții folosind conceptul de recursivitate:
--a)myreplicate - pentru un întreg n și o valoare v, întoarce
--lista ce conține n elemente egale cu v. Să se scrie și prototipul funcției.

myreplicate :: Int -> Int -> [Int]
myreplicate 0 v = [] 
myreplicate n v = v : myreplicate (n-1) v


-- b) sumImp - pentru o listă de numere întregi, calculează suma elementelor impare. 
-- Să se scrie și prototipul funcției.

sumImp :: [Int] -> Int
sumImp [] = 0
sumImp (x:xs) 
    | odd x = x + sumImp xs
    | otherwise = sumImp xs


-- c) totalLen - pentru o listă de șiruri de caractere, calculează suma lungimilor șirurilor care încep cu caracterul 'A'.

totalLen :: [String] -> Int
totalLen [] = 0   
totalLen (s:ss)
    | head s == 'A' = length s + totalLen ss
    | otherwise = totalLen ss




-- 3.Scrieți o funcție nrVocale care primește ca parametru o listă de șiruri de caractere și calculează numărul total de vocale din 
-- șirurile palindrom. Pentru a verifica dacă un șir e palindrom, puteți folosi funcția reverse, iar pentru a căuta un element într-o listă, puteți folosi funcția elem. Puteți defini funcții auxiliare.

palindrom :: String -> Bool
palindrom s = s == reverse s

nrVocaleStr :: String -> Int
nrVocaleStr s = length [c | c <- s, c `elem` "aeiouAEIOU"]

nrVocale :: [String] -> Int
nrVocale ss = sum [nrVocaleStr s | s <- ss, palindrom s]





--4.Scrieți o funcție care primește ca parametri un număr și o listă de întregi și adaugă numărul dat după fiecare element par din listă. Să se scrie și prototipul funcției.
f :: Int -> [Int] -> [Int]
f _ [] = []
f n (x:xs)
    | even x = x : n : f n xs
    | otherwise = x : f n xs




--5.Scrieți o funcție care determină lista divizorilor unui număr întreg primit ca parametru. Să se scrie și prototipul funcției.
divizori :: Int -> [Int]
divizori n = [x | x <- [1..n], n `mod` x == 0]





--6.Scrieți o funcție care primește ca parametru o listă de numere întregi și întoarce lista listelor de divizori.
listadiv :: [Int] -> [[Int]]
listadiv xs = [divizori x | x <- xs]




--7.Scrieți o funcție care primește ca parametri:
--a)Definiți funcția recursiv și denumiți-o inIntervalRec
inIntervalRec :: Int -> Int -> [Int] -> [Int]

inIntervalRec _ _ [] = []
inIntervalRec a b (x:xs)
  | x >= a && x <= b = x : inIntervalRec a b xs
  | otherwise = inIntervalRec a b xs

--b)Folosiți descrieri de liste. Denumiți funcția inIntervalComp.
inIntervalComp :: Int -> Int -> [Int] -> [Int]
inIntervalComp a b xs = [x | x <- xs, x >= a, x <= b]




--8.Scrieți o funcție care numără câte numere strict pozitive sunt într-o listă dată ca argument. De exemplu:
--a) Definiți funcția recursiv și denumiți-o pozitiveRec. 
 
pozitiveRec :: [Int] -> Int
pozitiveRec [] = 0
pozitiveRec (h:t)
    | h>0 = h + pozitiveRec(t)
    |otherwise= pozitiveRec(t)

--b) Folosiți descrieri de liste. Denumiți funcția pozitiveComp.
pozitiveComp :: [Int] -> Int
pozitiveComp xs = sum [1 | x <- xs, x > 0]



--9.Scrieți o funcție care întoarce lista pozițiilor elementelor impare dintr-o listă de numere primită ca parmetru.
-- a) Definiți funcția recursiv și denumiți-o pozitiiImpareRec.

pozitiiImpareRec :: [Int] -> [Int]
pozitiiImpareRec xs = aux xs 0
  where
    aux [] _ = []
    aux (y:ys) i
      | odd y = i : aux ys (i+1)
      | otherwise = aux ys (i+1)
    

-- b) Folosiți descrieri de liste. Denumiți funcția pozitiiImpareComp.
pozitiiImpareComp :: [Int] -> [Int]
pozitiiImpareComp xs = [ i | (x, i) <- zip xs [0..], odd x ]


--10.Scrieți o funcție care calculează produsul tuturor cifrelor care apar într-un șir de caractere primit ca parametru. Dacă șirul nu conține cifre, funcția întoarce 1 .

-- a) Definiți funcția recursiv și denumiți-o multDigitsRec
multDigitsRec :: String -> Int
multDigitsRec [] = 1
multDigitsRec (h:t)
  | isDigit h  = digitToInt h * multDigitsRec t
  | otherwise  = multDigitsRec t

-- b) Folosiți descrieri de liste. Denumiți funcția multDigitsComp.
inter :: Int -> Int -> [Int] -> [Int]
inter a b l = [x | x <- l, x >= a, x <= b]




-- EXTRA
-- 11.Scrieți o funcție care primește ca argument o listă și întoarce toate permutările ei. 
permutari :: Eq a => [a] -> [[a]]
permutari [] = [[]]
permutari xs = [y:zs | y <- xs, zs <- permutari (removeFirst y xs)]
  where
    removeFirst _ [] = []
    removeFirst y (z:zs)
      | y == z    = zs
      | otherwise = z : removeFirst y zs


-- 12.Scrieți o funcție care primește ca argument o listă și un număr întreg k, și întoarce toate combinările de k elemente din listă.
combinari :: Eq a => Int -> [a] -> [[a]]
combinari 0 _ = [[]]
combinari _ [] = []
combinari k (x:xs) = map (x:) (combinari (k-1) xs) ++ combinari k xs


-- 13.Scrieți o funcție care primește ca argument o listă și un număr întreg k, și întoarce toate aranjamentele de k elemente din listă.
aranjamente :: Eq a => Int -> [a] -> [[a]]
aranjamente 0 _ = [[]]
aranjamente _ [] = []
aranjamente k (x:xs) = map (x:) (aranjamente (k-1) (removeFirst x xs)) ++ aranjamente k xs
  where
    removeFirst _ [] = []
    removeFirst y (z:zs)
      | y == z    = zs
      | otherwise = z : removeFirst y zs



-- 14.Scrieți o funcție care primește ca argument un număr întreg ce reprezintă dimensiunea unei table de șah și un numar întreg ce reprezintă numărul de dame ce trebuie așezate pe tablă, și întoarce lista pozițiilor în care pot fi așezate damele fără să se atace.
type Pozitie = (Int, Int)
dame :: Int -> Int -> [[Pozitie]]
dame n k = aranjamente k [(i, j) | i <- [1..n], j <- [1..n]]
  where
    aranjamente 0 _ = [[]]
    aranjamente _ [] = []
    aranjamente m (p:ps)
      | esteSigur p ps = map (p:) (aranjamente (m-1) ps) ++ aranjamente m ps
      | otherwise = aranjamente m ps

    esteSigur _ [] = True
    esteSigur (x1, y1) ((x2, y2):ys)
      | x1 == x2 || y1 == y2 || abs (x1 - x2) == abs (y1 - y2) = False
      | otherwise = esteSigur (x1, y1) ys