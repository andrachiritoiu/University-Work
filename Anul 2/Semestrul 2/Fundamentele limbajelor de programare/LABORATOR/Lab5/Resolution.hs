module Resolution where

import Syntax ( Clause (..), Expr(Var), Variable(..), Query (..), Program(..), Equation (..) )
import Substitution (capply, SubstitutionGraph (SubstitutionGraph), Substitution, makeGraph, SubstitutionLike (idSubst), qapply, (>>>), restrict)
import HasVars (HasVars(..))
import Unification (unify)
import Data.Either (rights)
import Data.Maybe (mapMaybe)
import Parser (pclause, pquery, parseFirst, psubst)

class Refresh r where
  refresh :: Integer -> r -> r

  refreshWrt :: HasVars q => r -> q -> r
  refreshWrt cl q = refresh (n + 1) cl
    where
      vqs = vars q
      n = if null vqs then 0 else maximum (map getFreshId vqs)
      getFreshId (V _ n) = n

{-
>>> testClauseRefresh "activateStructure(X, Y)" "activateStructure(powerModule(X), Y) :- verifyComponent(X), matchResource(Y, X)."
Right activateStructure(powerModule(X_1), Y_1) :-
  verifyComponent(X_1),
  matchResource(Y_1, X_1).
-}
instance Refresh Clause where
  refresh n cl = capply (SubstitutionGraph ps) cl
    where
      ps = [(x, Var (x `withIndex` n)) | x <- vars cl]
      withIndex (V x _) = V x

instance Refresh Program where
  refresh n (Program pgm) = Program (map (refresh n) pgm)

{- | This does the following:

0. Refreshes variables for 'Clause' w.r.t. the query
1. Unifies the head of the clause with the given expression.
2. If it succeeds, replaces head of query with the body of the (refreshed) clause
   and it applies the unifier on the thus obtained query
4. returns substitution and the new query

Examples:

>>> testResolutionStep "activateStructure(X, Y)" "activateStructure(powerModule(X), Y) :- verifyComponent(X), matchResource(Y, X)."
Right (Y_1 |-> Y, X |-> powerModule(X_1),verifyComponent(X_1), matchResource(Y, X_1))

>>> testResolutionStep "verifyComponent(X_1), matchResource(Y, X_1)" "verifyComponent(X) :- combineElements(craftToken(Y), X), matchResource(Y, Y)."
Right (X_2 |-> X_1,combineElements(craftToken(Y_2), X_1), matchResource(Y_2, Y_2), matchResource(Y, X_1))

>>> testResolutionStep "combineElements(craftToken(Y_2), X_1), matchResource(Y_2, Y_2), matchResource(Y, X_1)" "combineElements(craftToken(oakLog), redstoneBlock)."
Right (X_1 |-> redstoneBlock, Y_2 |-> oakLog,matchResource(oakLog, oakLog), matchResource(Y, redstoneBlock))

>>> testResolutionStep "matchResource(oakLog, oakLog), matchResource(Y, redstoneBlock)" "matchResource(oakLog, oakLog)."
Right (,matchResource(Y, redstoneBlock))

>>> testResolutionStep "matchResource(Y, redstoneBlock)" "matchResource(redstoneBlock, redstoneBlock)."
Right (Y |-> redstoneBlock,)
-}
resolutionStep
  :: SubstitutionLike s
  => Query -> Clause -> Either String (s, Query)
resolutionStep (Query (q : restulQ)) cl = do
  --1. Unify the head of the clause with the given expression.
  theta <- unify [q, head']
  --2. If it succeeds, replaces head of query with the body of the (refreshed) clause
  --3. applies the unifier on the thus obtained query
  Right (theta, qapply $ Query (restulQ ++ body'))
  where 
     --0. Refresh variables in the clause w.r.t. the query
      cl' :: Clause = refresh cl q 
      head' :: Expr = clHead cl' 
      body' :: [Expr] = clBody cl'



resolutionStep (Query []) _ = Left "nothing to resolve anymore"




{-| Given

- the solution computed so far,
- the current query,
- a clause from the program,
try to make a resolution step from the current query using the clause.
If successful:

- update the current solution (compose) with the unifier from the resolution step;
- return the new solution and the new query.

Examples:

>>> testRefutationStep "" "activateStructure(X, Y)" "activateStructure(powerModule(X), Y) :- verifyComponent(X), matchResource(Y, X)."
Right (Y_1 |-> Y, X |-> powerModule(X_1),verifyComponent(X_1), matchResource(Y, X_1))

>>> testRefutationStep "Y_1 |-> Y, X |-> powerModule(X_1)" "verifyComponent(X_1), matchResource(Y, X_1)" "verifyComponent(X) :- combineElements(craftToken(Y), X), matchResource(Y, Y)."
Right (X_2 |-> X_1, X |-> powerModule(X_1), Y_1 |-> Y,combineElements(craftToken(Y_2), X_1), matchResource(Y_2, Y_2), matchResource(Y, X_1))

>>> testRefutationStep "X_2 |-> X_1, X |-> powerModule(X_1), Y_1 |-> Y" "combineElements(craftToken(Y_2), X_1), matchResource(Y_2, Y_2), matchResource(Y, X_1)" "combineElements(craftToken(oakLog), redstoneBlock)."
Right (X_1 |-> redstoneBlock, Y_2 |-> oakLog, Y_1 |-> Y, X |-> powerModule(redstoneBlock), X_2 |-> redstoneBlock,matchResource(oakLog, oakLog), matchResource(Y, redstoneBlock))

>>> testRefutationStep "X_1 |-> redstoneBlock, Y_2 |-> oakLog, Y_1 |-> Y, X |-> powerModule(redstoneBlock), X_2 |-> redstoneBlock" "matchResource(oakLog, oakLog), matchResource(Y, redstoneBlock)" "matchResource(oakLog, oakLog)."
Right (X_2 |-> redstoneBlock, X |-> powerModule(redstoneBlock), Y_1 |-> Y, Y_2 |-> oakLog, X_1 |-> redstoneBlock,matchResource(Y, redstoneBlock))

>>> testRefutationStep "X_2 |-> redstoneBlock, X |-> powerModule(redstoneBlock), Y_1 |-> Y, Y_2 |-> oakLog, X_1 |-> redstoneBlock" "matchResource(Y, redstoneBlock)" "matchResource(redstoneBlock, redstoneBlock)."
Right (Y |-> redstoneBlock, X_1 |-> redstoneBlock, Y_2 |-> oakLog, Y_1 |-> redstoneBlock, X |-> powerModule(redstoneBlock), X_2 |-> redstoneBlock,)
-}


refutationStep
  :: SubstitutionLike s
  => s -> Query -> Clause -> Either String (s, Query)
refutationStep theta query clause = do 
  (theta', query') <- resolutionStep query clause
  Right (theta >>> theta', query')


{- | Computes all possible applications of a single resolution step to the first
literal in the 'Query'.
-}
allRefutationSteps
  :: SubstitutionLike s
  => s -> Query -> Program -> [(s, Query)]
allRefutationSteps theta q (Program cls) = rights (map (refutationStep theta q) cls)

{- | Computes all solutions to given 'Query' wrt. given 'Program'
-}
solutions
  :: SubstitutionLike s
  => Program -> Query -> [s]
solutions pgm q = map (`restrict` vars q) (go idSubst q)
  where
    go s (Query []) = [s]
    go s q = concatMap (uncurry go) (allRefutationSteps s q pgm)

-- Utilitare pentru testare --

testResolutionStep :: String -> String -> Either String (SubstitutionGraph, Query)
testResolutionStep queryStr clauseStr
  = do
    query <- parseFirst pquery queryStr
    clause <- parseFirst pclause clauseStr
    resolutionStep query clause

testRefutationStep :: String -> String -> String ->  Either String (SubstitutionGraph, Query)
testRefutationStep substStr queryStr clauseStr
  = do
    subst <- parseFirst psubst substStr
    query <- parseFirst pquery queryStr
    clause <- parseFirst pclause clauseStr
    refutationStep subst query clause
    

testClauseRefresh :: String -> String -> Either String Clause
testClauseRefresh queryStr clauseStr
  = do
    query <- parseFirst pquery queryStr
    clause <- parseFirst pclause clauseStr
    return (refreshWrt clause query)
