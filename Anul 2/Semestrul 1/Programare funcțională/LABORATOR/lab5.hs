
-- map - aplică o funcție unei liste, transformând fiecare element și întorcând o listă nouă
-- filter - filter păstrează doar elementele dintr-o listă care îndeplinesc o condiție (funcție booleană)
-- foldl - reduce o listă la un singur rezultat, aplicând funcția de la stânga la dreapta și acumulând un rezultat
-- foldr reduce lista începând de la dreapta spre stânga(pentru liste infinite si rezolvari recursive)


-- foldr - construirea de liste
-- foldl - operatii



-- 1.Calculați suma pătratelor elementelor impare dintr-o listă dată ca parametru.
sumPtImp :: [Int] -> Int
sumPtImp rez = foldr (+) 0 (map(^2) (filter odd rez))


-- 2.Scrieți o funcție care verifică că toate elementele dintr-o listă sunt True, folosind foldr.
verifElem :: [Bool] -> Bool
verifElem lista = foldr (&&) True lista



-- 3.Scrieți o funcție care verifică dacă toate elementele dintr-o listă de numere întregi satisfac o proprietate dată ca parametru.
allVerifies :: (Int -> Bool) -> [Int] -> Bool
allVerifies  proprietate lista = foldr (&&) True (map proprietate lista)


-- 4.Scrieți o funcție care verifică dacă există elemente într-o listă de numere întregi care satisfac o proprietate dată ca parametru.
anyVerifies  :: (Int -> Bool) -> [Int] -> Bool
anyVerifies proprietate lista = foldr (||) False (map proprietate lista) 


-- 5.Redefiniți funcțiile map și filter folosind foldr. Le puteți numi mapFoldr și filterFoldr.
mapFoldr :: (a -> b) -> [a] -> [b]
mapFoldr f lista = foldr (\x xs -> f x : xs) [] lista 

filterFoldr :: (a -> Bool) -> [a] -> [a]
filterFoldr p lista = foldr (\x xs -> if p x then x : xs else xs) [] lista



-- 6.Folosind funcția foldl, definiți funcția listToInt care transformă o listă de cifre (un număr foarte mare reprezentat ca listă) în numărul întreg asociat. Se presupune că lista de intrare este dată corect.
listToInt :: [Integer] -> Integer
listToInt lista = foldl (\ac x -> ac * 10 + x) 0 lista



-- 7.(a) Scrieți o funcție care elimină toată aparițiile unui caracter dat dintr-un șir de caractere.
rmChar :: Char -> String -> String
rmChar c sir = foldr(\x ac -> if c==x then ac else x:ac)[] sir


-- (b) Scrieți o funcție recursivă care elimină toate caracterele din al doilea argument care se găsesc în primul argument, folosind rmChar.
rmCharsRec :: String -> String -> String
rmCharsRec [] sir = sir
rmCharsRec (c:cs) sir = rmCharsRec cs (rmChar c sir)


-- (c) Scrieți o funcție echivalentă cu cea de la (b) care folosește însă rmChar și foldr.
rmCharsFoldr :: String -> String -> String
rmCharsFoldr chars sir = foldr rmChar sir chars


-- 8.Scrieți o funcție myReverse care primește ca parametru o listă de întregi și întoarce lista elementelor în ordine inversă.
myReverse :: [Int] -> [Int]
myReverse lista = foldl(\ac x -> x:ac)[] lista  --lista initiala si lista de parcurs




-- 9.Scrieți un predicat myElem care verifică apartenența unui întreg la o listă de întregi.
myElem :: Int -> [Int] -> Bool
myElem x lista = foldr(\y ac -> if x==y then True else ac) False lista



-- 10.Scrieți o funcție myUnzip care transformă o listă de perechi într-o pereche de liste: una a componentelor de pe prima poziție, iar cealaltă a componentelor de pe a doua poziție din perechile din lista inițială.
myUnzip :: [(Int, Int)] -> ([Int], [Int])
myUnzip lista = foldr (\(x,y) (ac1, ac2)-> (x:ac1, y:ac2)) ([], []) lista



-- 11.Scrieți o funcție union care întoarce lista reuniunii a două liste de întregi primite ca parametri.
union :: [Int] -> [Int] -> [Int]
union l1 l2 = foldr (\x ac -> if elem x ac then ac else x:ac) l2 l1



-- 12.Scrieți o funcție intersect care întoarce lista intersecției a două liste de întregi primite ca parametri.
intersect :: [Int] -> [Int] -> [Int]
intersect l1 l2 = foldr (\x ac -> if elem x l2 then x:ac else ac) [] l1



-- 13.Scrieți o funcție permutations care întoarce lista tuturor permutărilor elementelor unei liste de întregi primite ca parametru.
permutations :: [Int] -> [[Int]]
permutations [] = [[]]
permutations (x:xs) =
    concat [insertEverywhere x p | p <- permutations xs]
  where
    insertEverywhere :: Int -> [Int] -> [[Int]]
    insertEverywhere y [] = [[y]]
    insertEverywhere y (z:zs) =
        (y : z : zs) : [z : rest | rest <- insertEverywhere y zs]




