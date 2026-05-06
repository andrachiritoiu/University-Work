{- | This module defines the syntax of the language. -}
module Syntax where
import Data.List (intercalate, nub)

data Expr
  = Var String
  | App String [Expr]
  deriving (Eq)

instance Show Expr where
  show (Var x) = x
  show (App a []) = a
  show (App f l) = f ++ "(" ++ intercalate ", " (show <$> l) ++ ")"

data Clause = Clause
  { clHead :: Expr
  , clBody :: [Expr]
  }
instance Show Clause where
  show cl
    | null (clBody cl) = show (clHead cl) ++ "."
    | otherwise =  show (clHead cl) ++ " :-\n  " ++ intercalate ",\n  " (show <$> clBody cl) ++ "."

newtype Query = Query [Expr]
instance Show Query where
  show (Query es) = intercalate ", " (show <$> es) ++ "."

newtype Program = Program [Clause]

instance Show Program where
  show (Program cs) = intercalate "\n\n" (show <$> cs)

data Equation = Expr :=: Expr

instance Show Equation where
  show (e1 :=: e2) = show e1 ++ " = " ++ show e2
