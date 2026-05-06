module HasVars where

import Syntax ( Equation(..), Expr(..), Clause(..), Query(..), Variable )
import Data.List (nub)

{-| Class for types for which the set of variables can be computed.
-}
class HasVars e where
  vars :: e -> [Variable]

{-| Extends a 'HasVars' instance to lists
-}
instance HasVars e => HasVars [e] where
  vars = nub . concatMap vars

instance HasVars Expr where
  vars (Var x) = [x]
  vars (App _ es) = vars es

instance HasVars Equation where
  vars (e1 :=: e2) = vars [e1, e2]

instance HasVars Clause where
  vars cl = nub (vars (clHead cl) ++ vars (clBody cl))

instance HasVars Query where
  vars (Query es) = vars es
