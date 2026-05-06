module Substitution where

import Data.List (intercalate)

import Syntax ( Expr(..), Equation(..), Variable(..), Clause(..), Query(..) )

-- | Substitution as a function from names of variables to expressions
newtype Substitution = Substitution { vapply :: Variable -> Expr }

-- | Substitution as a list of pairs between names of variables and expressions
newtype SubstitutionGraph = SubstitutionGraph [(Variable, Expr)]

instance Show SubstitutionGraph where
  show (SubstitutionGraph sg) = intercalate ", " (map (\(x, e) -> show x ++ " |-> " ++ show e) sg)

-- | Given a list of variables of interest computes the 'SubstitutionGraph' associated to
-- them from a given 'Substitution'
makeGraph :: [Variable] -> Substitution -> SubstitutionGraph
makeGraph vs subst = SubstitutionGraph (filter (\(x, e) -> e /= Var x) substPairs)
  where
    substPairs = vs `zip` map (vapply subst) vs

domain :: SubstitutionGraph -> [Variable]
domain (SubstitutionGraph sg) = map fst sg

{-| Class for operation which substitution-like structures should support.
We will make our 'unifyStep' algorithm below generic in the choice of substitution type.

We assume that our substitutions are always in solved form, that is, for any substitution s
if s x =/= x then x does not appear in s y for any variable y
-}
class SubstitutionLike s where
  -- | the identity substitution
  idSubst :: s
  -- | the singleton substitution. default implementation uses 'extend' on 'idSubst'
  singletonSubst :: Variable -> Expr -> s
  singletonSubst = extend idSubst
  -- | Composition / combination of substitutions
  -- (s1 >>> s2) x means that first we apply s1 on x then s2 on the result
  (>>>) :: s -> s -> s
  -- | Obtaining an actual 'Substitution' from self
  asSubstitution :: s -> Substitution

  -- | Substitution application. Defaults to applying the corresponding 'Substitution'
  apply :: s -> Expr -> Expr
  apply = apply . asSubstitution
  -- | Substitution application to an equation. Implemented based on 'apply'
  eapply :: s -> Equation -> Equation
  eapply s (e1 :=: e2) = apply s e1 :=: apply s e2
  -- | Extending a substitution with x |-> e. Should substitute x with e in all
  -- expessions assigned to variables and add the map x |-> e to the substitution.
  -- see corresponding step in the unification algorithm.
  -- Defaults to composing the substitution with the singleton substitution x |-> e
  extend :: s -> Variable -> Expr -> s
  extend s x e = s >>> singletonSubst x e
  -- | restricts substitution to the given variables
  restrict :: s -> [Variable] -> s
  restrict s vs = foldr (\(x, e) s -> extend s x e) idSubst sg
    where
      sg = map (\x -> (x, apply s (Var x))) vs


{-| A 'SubstitutionLike' instance for 'SubstitutionGraph'

Examples: 

>>> idSubst :: SubstitutionGraph

>>> singletonSubst "x" (Var "y") :: SubstitutionGraph
x |-> y

>>> extend (SubstitutionGraph [("x", Var "y")]) "y" (App "a" [])
y |-> a, x |-> a

>>> (SubstitutionGraph [("x", Var "y")]) >>> singletonSubst "y" (App "a" [])
y |-> a, x |-> a
-}

instance SubstitutionLike SubstitutionGraph where
  idSubst :: SubstitutionGraph
  idSubst = SubstitutionGraph []
  (>>>) :: SubstitutionGraph -> SubstitutionGraph -> SubstitutionGraph
  s1 >>> SubstitutionGraph s2 = foldr (\(x, e) sub -> extend sub x e) s1 s2
  asSubstitution :: SubstitutionGraph -> Substitution
  asSubstitution (SubstitutionGraph s) = foldr (\(x, e) sub -> extend sub x e) idSubst s
  -- Because we implemented '(>>>)' using extend, we cannot use here the default implementation of extend
  extend :: SubstitutionGraph -> Variable -> Expr -> SubstitutionGraph
  extend (SubstitutionGraph s) x e = SubstitutionGraph ((x, e): map (\(x', e') -> (x', apply xe e')) s)
    where
      xe :: SubstitutionGraph
      xe = singletonSubst x e

instance SubstitutionLike Substitution where
  idSubst :: Substitution
  idSubst = Substitution Var

  singletonSubst :: Variable -> Expr -> Substitution
  singletonSubst x e = Substitution subst
    where
      subst y
          | y == x = e
          | otherwise = Var y

  (>>>) :: Substitution -> Substitution -> Substitution
  s1 >>> s2 = Substitution (apply s2 . vapply s1)

  asSubstitution :: Substitution -> Substitution
  asSubstitution = id

  -- Because the default implementation uses 'toSubstitution' we cannot use it here.
  apply :: Substitution -> Expr -> Expr
  apply subst = go
    where
      go (Var x) = vapply subst x
      go (App f es) = App f (go <$> es)

capply :: SubstitutionLike s => s -> Clause -> Clause
capply s cl = Clause (apply s (clHead cl)) (map (apply s) (clBody cl))

qapply :: SubstitutionLike s => s -> Query -> Query
qapply s (Query q) = Query (map (apply s) q)
