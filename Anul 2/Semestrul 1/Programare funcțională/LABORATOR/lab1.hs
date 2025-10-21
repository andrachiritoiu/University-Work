myInt :: Integer
myInt = 31415926535897932384626433832795028841971693993751058209749445923

-- Functii simple (existente/corectate)
double :: Integer -> Integer
double x = x+x

maxim :: Integer -> Integer -> Integer
maxim x y = if (x > y)
                then x
             else y

max3 :: Integer -> Integer -> Integer -> Integer
max3 x y z = let
             u = maxim x y
             in (maxim u z)

-- Functii de implementat
--------------------------------------------------------------------------------
--maxim3 x y z = maxim x (maxim y z)
--Scrieți funcția maxim3 fără a folosi maxim, utilizând direct if și indentări.

maxim3 :: (Ord a) => a -> a -> a -> a
maxim3 x y z = 
    if x >= y
        then if x >= z
            then x  
            else z  
    else             
        if y >= z
            then y  
            else z


            

eeny :: Integer -> String
eeny x
    | even x    = "Eeny"
    | otherwise = "Meeny"

fizzbuzz :: Integer -> String
fizzbuzz n
    | n `mod` 15 == 0 = "FizzBuzz"
    | n `mod` 3 == 0  = "Fizz"
    | n `mod` 5 == 0  = "Buzz"
    | otherwise       = show n

fibonacciCazuri :: Integer -> Integer
fibonacciCazuri n
    | n < 2     = n
    | otherwise = fibonacciCazuri (n - 1) + fibonacciCazuri (n - 2)
    
fibonacciEcuational :: Integer -> Integer
fibonacciEcuational 0 = 0
fibonacciEcuational 1 = 1
fibonacciEcuational n =
    fibonacciEcuational (n - 1) + fibonacciEcuational (n - 2)
    
tribonacci :: Integer -> Integer
tribonacci 0 = 0
tribonacci 1 = 0
tribonacci 2 = 1
tribonacci n =
    tribonacci (n - 1) + tribonacci (n - 2) + tribonacci (n - 3)

binomial :: Integer -> Integer -> Integer
binomial n 0 = 1
binomial n k
    | n == k    = 1
    | otherwise = binomial (n - 1) (k - 1) + binomial (n - 1) k




-- Functia main
main :: IO ()
main = do
    putStrLn ("double 10: " ++ show (double 10))
    putStrLn ("maxim 5 10: " ++ show (maxim 5 10))
    putStrLn ("fizzbuzz 15: " ++ show (fizzbuzz 15))
    putStrLn ("tribonacci 6: " ++ show (tribonacci 6))
    putStrLn ("binomial 5 2: " ++ show (binomial 5 2))