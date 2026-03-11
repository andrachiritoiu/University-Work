{- | This module defines the syntax of the language. -}
module Syntax ( AExpr(..), BExpr(..), Stmt(..) ) where

{- | The data type 'AExpr' represents the abstract syntax Arithmetic Expressions. -}
data AExpr
  = ENum Integer
  | EId String
  | EPlu AExpr AExpr
  | EMinu AExpr AExpr
  | EMul AExpr AExpr
--   | EDiv AExpr AExpr
--   | EminuU AExpr

parens :: String -> String
parens s = "(" ++ s ++ ")"

showE :: AExpr -> String
showE e@(EPlu _ _) = parens (show e)
showE e@(EMinu _ _) = parens (show e)
showE e = show e

instance Show AExpr where
  show (ENum n) = show n
  show (EId x) = x
  show (EPlu e1 e2) = show e1 ++ " + " ++ show e2
  show (EMinu e1 e2@(EPlu _ _)) = show e1 ++ " - " ++ showE e2
  show (EMinu e1 e2@(EMinu _ _)) = show e1 ++ " - " ++ showE e2
  show (EMinu e1 e2) = show e1 ++ " - " ++ show e2
  show (EMul e1 e2) = showE e1 ++ " * " ++ showE e2

{- | The data type 'BExpr' represents the abstract syntax Boolean Expressions. -}
data BExpr
  = BTrue
  | BFalse
  | BEq AExpr AExpr
--   | BNeq AExpr AExpr
--   | BLt AExpr AExpr
--   | BGt AExpr AExpr
  | BLe AExpr AExpr
--   | BGe AExpr AExpr
  | BNot BExpr
  | BAnd BExpr BExpr
  | BOr BExpr BExpr

instance Show BExpr where
  show BTrue = "true"
  show BFalse = "false"
  show (BEq e1 e2) = show e1 ++ " == " ++ show e2
  show (BLe e1 e2) = show e1 ++ " <= " ++ show e2
  show (BNot b) = "! (" ++ show b ++ ")"
  show (BOr b1 b2) = show b1 ++ " || " ++ show b2
  show (BAnd b1 b2) = showB b1 ++ " && " ++ showB b2

showB :: BExpr -> String
showB b@(BOr _ _) = parens (show b)
showB b = show b

{- | The data type 'Stmt' represents the abstract syntax Statements. -}
data Stmt
  = SSkip
  | SAss String AExpr
  | SSeq Stmt Stmt
  | SIf BExpr Stmt Stmt
  | SWhile BExpr Stmt

instance Show Stmt where
  show SSkip = "skip"
  show (SAss x e) = x ++ " := " ++ show e
  show (SSeq s1 s2) = show s1 ++ "; " ++ show s2
  show (SIf b s1 s2) = "if " ++ show b ++ " then " ++ showS s1 ++ " else " ++ showS s2
  show (SWhile b s) = "while " ++ show b ++ " do " ++ showS s

showS :: Stmt -> String
showS s@(SSeq _ _) = parens (show s)
showS s = show s