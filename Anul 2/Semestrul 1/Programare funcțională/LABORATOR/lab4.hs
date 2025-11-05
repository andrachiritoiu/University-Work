
-- 2.Definiți o funcție factori care întoarce lista divizorilor pozitivi ai unui număr primit ca parametru. Folosiți doar metoda de definire a listelor prin selecție.

factori :: Int -> [Int]
factori n = [x | x <- [1..n], n `mod` x == 0 ]

-- 3.Folosind funcția factori, definiți predicatul prim, care verifică dacă un număr primit ca parametru este prim.

prim :: Int -> Bool
prim n = factori n == [1,n]

-- 4.Definiți funcția numerePrime, care pentru un număr n primit ca parametru, întoarce lista numerelor prime din intervalul [2..n]. Folosiți metoda de definire a listelor prin selecție și funcțiile definite anterior.

numerePrime :: Int -> [Int]
numerePrime n = [x | x <- [2..n], prim x ]

-- 5.Definiți funcția myzip3 ca o generalizare a funcției zip pentru trei argumente:

myzip3 :: [Int] -> [Int] -> [Int] -> [(Int, Int, Int)]
myzip3 [] _ _ = []
myzip3 _ [] _ = []
myzip3 _ _ [] = []
myzip3 (x:xs) (y:ys) (z:zs) = (x, y, z) : myzip3 xs ys zs


-- map : o opeatie aplicata pe o lista si rezultatul e o alta lista
-- filetr : o conditie aplicata pe o lista si returenaza lista filstrata


-- 6.Scrieți o funcție generică firstEl care primește ca parametru o listă de perechi de tip (a,b) și întoarce lista primelor elementelor din fiecare pereche:

-- firstEl :: [(Int, Int)] -> [Int]
-- firstEl xs = [x | (x, _) <- xs]

firstEl :: [(Int, Int)] -> [Int]
firstEl xs = map fst xs            -- fst extrage primul element


-- 7.Scrieți funcția sumList care are ca parametru o listă de liste de valori Int și întoarce lista sumelor elementelor din fiecare listă (suma elementelor unei liste de întregi se calculează cu funcția sum):

-- sumList :: [[Int]] -> [Int]
-- sumList l = [sum x | x <- l]

sumList :: [[Int]] -> [Int]
sumList l = map sum l

-- 8.Scrieți o funcție prel2 care are ca parametru o listă de întregi (Int) și întoarce o listă în care elementele pare sunt înjumătățite, iar cele impare sunt dublate:

-- prel2 :: [Int] -> [Int]
-- prel2 [] = []
-- prel2 (x:xs) 
--     |odd x = (x*2) : prel2 xs
--     |otherwise = x`div`2 : prel2 xs

prel2 :: [Int] -> [Int]
prel2 xs = map (\x -> if odd x then x * 2 else x `div` 2) xs


-- 9.Scrieți o funcție care primește ca parametri un caracter și o listă de șiruri de caractere, și întoarce lista șirurilor care conțin caracterul primit ca argument (hint: folosiți funcția elem).

functie :: Char -> [String] -> [String]
functie c ss = filter (elem c) ss

-- 10.Scrieți o funcție care are ca parametru o listă de întregi și întoarce lista pătratelor numerelor impare din acea listă.

functie2 :: [Int] -> [Int]
functie2 xs = map(^2) (filter odd xs)


-- 11.Scrieți o funcție care primește ca argument o listă de întregi și întoarce lista pătratelor elementelor din poziții impare. Hint: folosiți zip pentru a avea acces la poziția elementelor.
patrateImpare :: [Int] -> [Int]
patrateImpare xs = [x^2 | (i, x) <- zip [0..] xs, odd i]


-- 12.Scrieți o funcție care primește ca parametru o listă de șiruri de caractere și întoarce lista obținută prin eliminarea consoanelor din fiecare șir.

numaiVocale :: [String] -> [String]
numaiVocale ss = [[c | c <- s, c `elem` "aeiouAEIOU"] | s <- ss]


-- 13.Definiți recursiv funcțiile mymap și myfilter cu aceeași funcționalitate ca a funcțiilor map și filter predefinite.
mymap :: (a -> b) -> [a] -> [b]
mymap _ [] = []
mymap f (x:xs) = f x : mymap f xs
myfilter :: (a -> Bool) -> [a] -> [a]
myfilter _ [] = []
myfilter p (x:xs)
    | p x       = x : myfilter p xs
    | otherwise = myfilter p xs