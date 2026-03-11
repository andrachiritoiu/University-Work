module State (State(..), empty, get, set) where
import Data.List (intercalate)

-- | a state maps memory location (strings) to values (integers)
newtype State = State [(String, Integer)]

instance Show State where
  show (State s) = intercalate ", " (map (\(x, v) -> x ++ " |-> " ++ show v) s)

empty :: State
empty = State []

get :: State -> String -> Integer
get (State s) x =
  case lookup x s of
    Nothing -> error ("Variable " ++ x ++ " not found")
    Just v -> v

set :: State -> String -> Integer -> State
set (State s) x v = State ((x, v) : filter (\p -> fst p /= x) s)
