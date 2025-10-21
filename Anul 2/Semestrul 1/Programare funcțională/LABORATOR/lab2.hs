--max3
max3 :: (Ord a) => a -> a -> a -> a
max3 x y z = 
    if x >= y
        then if x >= z
            then x  
            else z  
    else             
        if y >= z
            then y  
            else z

--maxim4 folosind let..in și indentări
maxim4 :: (Ord a) => a -> a -> a -> a -> a
maxim4 w x y z = let
                    u = if w >= x 
                            then w  
                            else x  
                    v = if y >= z
                            then y  
                            else z
                 in if u >= v
                        then u  
                        else v            
        

--6

--a)suma patratelor
patrate :: Integer -> Integer -> Integer
patrate x y = x^2 + y^2

--b) o funcție cu un parametru ce întoarce stringul "par" dacă parametrul este par și "impar" altfel
paritate :: Integer -> String
paritate x = if x`mod`2==0 then "par" else "impar"      --even x

--c) o funcție care calculează factorialul unui număr; 
factorial :: Integer -> Integer
factorial 0=1
factorial n=n*factorial(n-1)

--d) o funcție care verifică dacă primul parametru este mai mare decât dublul celui de-al doilea parametru; 
dublu :: Integer -> Integer -> Bool
dublu x y = if x>2*y then True else False

--e) o funcție care calculează elementul maxim al unei liste.
maxim :: (Ord a) => [a] -> a
maxim [x]=x
maxim (x:xs) = if x > maxim xs then x else maxim xs

--7.Scrieți o funcție poly cu patru argumente de tip Double (a,b,c,x) care calculează a*x^2+b*x+c. Scrieți și signatura funcției (poly :: ??).
poly :: Double -> Double -> Double -> Double -> Double
poly a b c x = a*x^2 + b*x + c


--8.Scrieți o funcție eeny care întoarce stringul "eeny" atunci când primește ca input un număr par și "meeny" când primeste ca input un număr impar. Hint: puteți folosi funcția even, despre care puteți citi pe https://hoogle.haskell.org/.
eeny:: Integer -> String
eeny x = if even x then "eeny" else "meeny"

--9.Scrieți o funcție fizzbuzz care întoarce "Fizz" pentru numerele divizibile cu 3, "Buzz" pentru numerele divizibile cu 5 și "FizzBuzz" pentru numerele divizibile cu ambele. Pentru orice alt număr întoarce șirul vid. Scrieți două definiții pentru funcția fizzbuzz: una folosind if și una folosind gărzi (condiții). Hint: pentru a calcula restul împărțirii unui număr la un alt număr puteți folosi funcția mod.
--var 1
fizzbuzz :: Integer -> String
fizzbuzz n = if n `mod` 15 == 0 then "FizzBuzz" else if n `mod` 3 == 0 then "Fizz" else if n `mod` 5 == 0 then "Buzz" else ""

--var 2
fizzbuzz' :: Integer -> String  
fizzbuzz' n
    | n `mod` 15 == 0 = "FizzBuzz"
    | n `mod` 3 == 0  = "Fizz"
    | n `mod` 5 == 0  = "Buzz"
    | otherwise       = ""

--10.   Numerele tribonacci sunt definite astfel:
--var 1
-- tribonacci :: Integer -> Integer
-- tribonacci 1 = 1
-- tribonacci 2 = 1
-- tribonacci 3 = 2
-- tribonacci n = tribonacci (n - 1) + tribonacci (n - 2)  + tribonacci (n - 3)


--var 2
tribonacci :: Integer -> Integer
tribonacci n
  | n == 1    = 1
  | n == 2    = 1
  | n == 3    = 2
  | n > 3     = tribonacci (n-1) + tribonacci (n-2) + tribonacci (n-3)


  --11.Scrieți o funcție recursivă care calculează coeficienții binomiali. Coeficienții sunt determinați folosind următoarele ecuații (pentru orice întregi n, k, astfel încât 1 ≤ k < n):

binomial :: Integer -> Integer -> Integer
binomial n k
    | k == 0 = 1
    | k == n = 1
    | otherwise = binomial (n - 1) (k - 1) + binomial (n - 1) k