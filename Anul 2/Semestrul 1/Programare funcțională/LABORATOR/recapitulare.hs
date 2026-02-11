myInt = 31415926535897932384626433832795028841971693993751058209749445923
-- double :: Integer -> Integer
-- double x = x+x

--lab2
double :: Integer -> Integer
double x = x+x

maxim :: Integer -> Integer -> Integer 
maxim x y = if (x>y) 
            then x 
            else y


-- maxim3 :: Integer -> Integer -> Integer -> Integer
-- maxim3 x y z = maxim x (maxim y z)

maxim3 :: Integer -> Integer -> Integer -> Integer
maxim3 x y z = 
    if (x>y && y>z)
        then x
    else if (y>x && y>z) 
        then y
    else z


--6
--a
sumpatr :: Int -> Int -> Int
sumpatr x y = x*x + y*y

--b
verif :: Int -> String
verif x = if even x then "Par"
            else "Impar"

--c 
factorial :: Int -> Int
factorial 0 = 1
factorial n = n * factorial (n-1)

--e
maxList :: [Int] -> Int
maxList [x] = x 
maxList (x:xs) = max x (maxList xs)

--9
fizzbuzz :: Integer -> String
fizzbuzz x = if x `mod` 5 == 0  &&  x `mod` 3 == 0 then "FizzBuzz"
        else if x `mod` 3 == 0 then "Fizz"
        else if x `mod` 5 == 0 then "Buzz"
        else ""


--10
tibonacciEcuational :: Integer -> Integer
tibonacciEcuational 1 = 1
tibonacciEcuational 2 = 1
tibonacciEcuational 3 = 2
tibonacciEcuational n =
    tibonacciEcuational (n - 1) + tibonacciEcuational (n - 2) + tibonacciEcuational (n - 3)

--11
binomial :: Integer -> Integer -> Integer
binomial n 0 = 1
binomial 0 k = 0
binomial n k = binomial (n-1) k + binomial (n-1) (k-1)




--lab 3
--1
--a
verifL :: [Int] -> Bool
verifL x = if length(x) `mod`2 == 0 then True
            else False

--b
takefinal :: [Int] -> Int -> [Int]
takefinal l n = if length(l) < n then l
                else reverse(take n  (reverse l)) 


--c
remove :: [Int] -> Int -> [Int]
-- remove l n = take (n-1) l ++ reverse(take (length l - n) (reverse l))

remove l n = take (n-1) l ++ drop n l


--recursivitate
semiPareRec :: [Int] -> [Int]
semiPareRec [] = []
semiPareRec (x:xs)
    |even x = x `div` 2 : semiPareRec(xs)
    |otherwise = semiPareRec(xs)


--2
--a
myreplicate :: Int -> Int -> [Int]
myreplicate 0 v = []
myreplicate n v = v : myreplicate (n-1) v 

--b
sumImp :: [Int] -> Int
sumImp [] = 0
sumImp (x:xs) 
    |even x = sumImp xs
    |otherwise = x + sumImp xs

--c
totalLen :: [String] -> Int
totalLen [] = 0
totalLen (x:xs)
        |head x == 'A' = length(x) + totalLen(xs)
        |otherwise= totalLen(xs)


--4
ad :: Int -> [Int] -> [Int]
ad _ [] = []
ad k (x:xs)
    |even x = x : k : ad k xs
    |otherwise = x : ad k xs


--5
divizori :: Int -> [Int]
divizori n =[i | i <- [1..n], n `mod` i == 0 ]




--lab4
myzip3 :: [a] -> [b] -> [c] -> [(a,b,c)]
myzip3 (x:xs) (y:ys) (z:zs) = (x,y,z) : myzip3 xs ys zs
myzip3 _ _ _ = []


--lambda expresii

--se scrie in terminal ghci
-- map(\x -> x+2) [1..5]

--6
firstEl :: [(a,b)] -> [a]
firstEl xs = map fst xs

--7
sumList :: [[Int]] -> [Int]
--sum e default
sumList list = map sum list

--8
prel2 :: [Int] -> [Int]
-- prel2 xs = map f xs
--     where 
--         f x |even x = x `div` 2
--             |otherwise = x*2

prel2 xs = map (\x -> if even x then x `div` 2 else x*2) xs

--9
fct :: Char -> [String] -> [String]
fct c xs = filter (\s -> c `elem` s) xs


--10
pozimp :: [Int] -> [Int]
pozimp xs =
    [x^2 | (i,x) <- zip [0..] xs, odd i]




--lab 5
--fold

--1.suma patratelor elememntelor impare 
sums :: [Int] -> Int
sums xs = foldr (+) 0 (map (^2) (filter odd xs))

--2
allT :: [Bool] -> Bool
allT = foldr (&&) True

--3 
allVerifies :: (Int -> Bool) -> [Int] -> Bool
allVerifies p = foldr (\x acc -> p x && acc) True

--5
mapFoldr f xs = foldr (\x acc -> f x : acc ) [] xs

--sau fara xs
-- mapFoldr f = foldr (\x acc -> f x : acc) []

--6
listToInt :: [Integer] -> Integer
listToInt xs = foldl (\acc x -> acc*10 + x ) 0 xs



--lab6
--1
data Fruct
  = Mar String Bool
  | Portocala String Int

ionatanFaraVierme = Mar "Ionatan" False
goldenCuVierme = Mar "Golden Delicious" True
portocalaSicilia10 = Portocala "Sanguinello" 10
cosFructe = [Mar "Ionatan" False,
                Portocala "Sanguinello" 10,
                Portocala "Valencia" 22,
                Mar "Golden Delicious" True,
                Portocala "Sanguinello" 15,
                Portocala "Moro" 12,
                Portocala "Tarocco" 3,
                Portocala "Moro" 12,
                Portocala "Valencia" 2,
                Mar "Golden Delicious" False,
                Mar "Golden" False,
                Mar "Golden" True]

--a
ePortocalaDeSicilia :: Fruct -> Bool
ePortocalaDeSicilia (Portocla soi _) = soi `elem`  ["Tarocco","Moro","Sanguinello"]
ePortocalaDeSicilia _ = False

--c
nrMereViermi :: [Fruct] -> Int
nrMereViermi = foldr add 0
  where
    add (Mar _ True) acc = 1 + acc
    add _ acc = acc


