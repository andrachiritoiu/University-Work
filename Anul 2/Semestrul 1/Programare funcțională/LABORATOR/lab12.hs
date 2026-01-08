-- lab12.hs  

import Prelude hiding (Functor, fmap, Applicative, pure, (<*>))

-- <*>=apply
-- <$>=fmap


class Functor f where
  fmap :: (a -> b) -> f a -> f b

class Functor f => Applicative f where
  pure  :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b

infixl 4 <*>   

instance Functor Maybe where
  fmap _ Nothing  = Nothing
  fmap g (Just x) = Just (g x)

instance Applicative Maybe where
  pure = Just
  Nothing <*> _ = Nothing
  _ <*> Nothing = Nothing
  Just f <*> Just x = Just (f x)



--1
data List a = Nil
  | Cons a (List a)
  deriving (Eq, Show)

instance Functor List where
  fmap _ Nil = Nil
  fmap g (Cons x xs) = Cons (g x) (fmap g xs)

-- concatenare 
append :: List a -> List a -> List a
append Nil ys = ys
append (Cons x xs) ys = Cons x (append xs ys)

--clasa applicative permite aplicarea unei functii intr-un context peste o valoare din acelasi context
--toate combinatiile functie-valoare
instance Applicative List where
  pure x = Cons x Nil

  Nil <*> _ = Nil
  _   <*> Nil = Nil
  (Cons f fs) <*> xs = append (fmap f xs) (fs <*> xs)


--2
data Dog = Dog {
        name :: String
        , age :: Int
        , weight :: Int
        } deriving (Eq, Show)

-- a) 
noEmpty :: String -> Maybe String
noEmpty s
  | null s = Nothing
  | otherwise = Just s

noNegative :: Int -> Maybe Int
noNegative n
  | n < 0 = Nothing
  | otherwise = Just n


-- b) construire element dog
dogFromString :: String -> Int -> Int -> Maybe Dog
dogFromString n a w = do
  n' <- noEmpty n
  a' <- noNegative a
  w' <- noNegative w
  return (Dog n' a' w')


-- c) 
--dog este aplicat doar daca validarile sunt just
dogFromStringA :: String -> Int -> Int -> Maybe Dog
dogFromStringA n a w =
  Dog <$> noEmpty n <*> noNegative a <*> noNegative w



--3.
newtype Name = Name String deriving (Eq, Show)
newtype Address = Address String deriving (Eq, Show)

data Person = Person Name Address
  deriving (Eq, Show)

-- a)
validateLength :: Int -> String -> Maybe String
validateLength maxLen s
  | length s < maxLen = Just s
  | otherwise = Nothing



-- b) tarnsforma un element in tipul de date asociat
mkName :: String -> Maybe Name
mkName s =
  case validateLength 25 s of
    Nothing -> Nothing
    Just x  -> Just (Name x)

mkAddress :: String -> Maybe Address
mkAddress s =
  case validateLength 100 s of
    Nothing -> Nothing
    Just x  -> Just (Address x)


-- c) 
mkPerson :: String -> String -> Maybe Person
mkPerson n a = do
  n' <- mkName n
  a' <- mkAddress a
  return (Person n' a')


-- d) 
mkNameF :: String -> Maybe Name
mkNameF = fmap Name . validateLength 25

mkAddressF :: String -> Maybe Address
mkAddressF = fmap Address . validateLength 100

mkPersonA :: String -> String -> Maybe Person
mkPersonA n a =
  Person <$> mkNameF n <*> mkAddressF a
