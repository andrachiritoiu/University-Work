module BigStep ( bsStmt ) where

import Syntax ( AExpr(..), BExpr(..), Stmt(..) )
import State ( get, set, State )
import Configurations ( Conf(..), Conf1(..) )
import Parser ( aconf, bconf, parseFirst, sconf, Parser ) -- for testing purposes

{- big-step semantics for arithmetic expressions

Examples:

>>> testExpr "< 5 , >"
< 5 >

>>> testExpr "< x , a |-> 3, x |-> 4 >"
< 4 >

>>> testExpr "< x + a, a |-> 3, x |-> 4 >"
< 7 >

>>> testExpr "< x - a, a |-> 3, x |-> 4 >"
< 1 >

>>> testExpr "< x * a, a |-> 3, x |-> 4 >"
< 12 >
-}
bsExpr :: Conf AExpr -> Conf1 Integer
bsExpr (Conf (ENum n) sigma) = Conf1 n  --regula(Num)
bsExpr (Conf (EId x) sigma) = Conf1 (get sigma x)    --regula Id
bsExpr (Conf (EPlu a1 a2) sigma) =
  let Conf1 i1 = bsExpr (Conf a1 sigma) 
      Conf1 i2 = bsExpr (Conf a2 sigma)
  in Conf1 (i1 + i2)
bsExpr (Conf (EMinu a1 a2) sigma) =
  let Conf1 i1 = bsExpr (Conf a1 sigma)
      Conf1 i2 = bsExpr (Conf a2 sigma)
  in Conf1 (i1 - i2)
bsExpr (Conf (EMul a1 a2) sigma) =
  let Conf1 i1 = bsExpr (Conf a1 sigma)
      Conf1 i2 = bsExpr (Conf a2 sigma)
  in Conf1 (i1 * i2)


{- big-step semantics for boolean expressions

Examples:
>>> testBExpr "< true, >"
< True >

>>> testBExpr "< false, >"
< False >

>>> testBExpr "< x == a, a |-> 3, x |-> 4 >"
< False >

>>> testBExpr "< a <= x, a |-> 3, x |-> 4 >"
< True >

>>> testBExpr "< !(a <= x), a |-> 3, x |-> 4 >"
< False >

>>> testBExpr "< true && false, >"
< False >

>>> testBExpr "< true || false, >"
< True >
-}
bsBExpr :: Conf BExpr -> Conf1 Bool
bsBExpr (Conf BTrue sigma) = Conf1 True
bsBExpr (Conf BFalse sigma) = Conf1 False
bsBExpr (Conf (BEq a1 a2) sigma) = 
  let Conf1 i1 =  bsExpr (Conf a1 sigma) 
      Conf1 i2 =  bsExpr (Conf a2 sigma) 
  in Conf1 (i1 == i2)
bsBExpr (Conf (BLe a1 a2) sigma) = 
  let Conf1 i1 =  bsExpr (Conf a1 sigma) 
      Conf1 i2 =  bsExpr (Conf a2 sigma) 
  in Conf1 (i1 <= i2)
bsBExpr (Conf (BNot b) sigma) = 
  let Conf1 v =  bsBExpr (Conf b sigma) 
  in Conf1 (not v)
bsBExpr (Conf (BAnd b1 b2) sigma) = 
  let Conf1 v1 =  bsBExpr (Conf b1 sigma) 
      Conf1 v2 =  bsBExpr (Conf b2 sigma) 
  in Conf1 (v1 && v2)
bsBExpr (Conf (BOr b1 b2) sigma) = 
  let Conf1 v1 =  bsBExpr (Conf b1 sigma) 
      Conf1 v2 =  bsBExpr (Conf b2 sigma) 
  in Conf1 (v1 || v2)


{- big-step semantics for statements

Examples:

>>> testStmt "< skip, >"
<  >

>>> testStmt "< x := x + 1, a |-> 3, x |-> 4 >"
< x |-> 5, a |-> 3 >

>>> testStmt "< x := x + 1; a := x + a, a |-> 3, x |-> 4 >"
< a |-> 8, x |-> 5 >

>>> testStmt "< if a <= x then max := x else max := a, a |-> 3, x |-> 4 >"
< max |-> 4, a |-> 3, x |-> 4 >

>>> testStmt "< while a <= x do x := x - a, a |-> 7, x |-> 33 >"
< x |-> 5, a |-> 7 >
-}
-- bsStmt :: Conf Stmt -> Conf1 State
-- bsStmt (Conf SSkip sigma) = Conf1 sigma
-- bsStmt (Conf (SAss x a) sigma) = 
--   let Conf1 i = bsExpr(Conf a sigma)
--       sigma' = set sigma x i
--   in 
--     Conf1 sigma'
-- bsStmt (Conf (SSeq s1 s2) sigma) = 
--   let Conf1 sigma' = bsStmt(Conf s1 sigma)
--       Conf1 sigma'' = bsStmt(Conf s2 sigma')
--   in 
--     Conf1 sigma''
-- bsStmt (Conf (SIf b s1 s2) sigma) = 
--   let Conf1 cndEval = bsExpr(Conf cnd sigma)
--   in 
--     if cndEval then
--       bsStmt (Conf bl1 sigma)  --IfTrue
--     else
--       bsStmt (Conf bl2 sigma)

-- --while
-- bsStmt (Conf (SWhile b s) sigma) =
--   let Conf1 cndEval = bsBExpr (Conf b sigma)
--   in if cndEval
--      then
--        let Conf1 sigma' = bsStmt (Conf s sigma)
--        in bsStmt (Conf (SWhile b s) sigma')
--      else
--        Conf1 sigma

bsStmt :: Conf Stmt -> Conf1 State
bsStmt (Conf SSkip sigma) = Conf1 sigma
bsStmt (Conf (SAss x a) sigma) =
  let Conf1 i = bsExpr (Conf a sigma)
      sigma' = set sigma x i
  in Conf1 sigma'
bsStmt (Conf (SSeq s1 s2) sigma) =
  let Conf1 sigma' = bsStmt (Conf s1 sigma)
      Conf1 sigma'' = bsStmt (Conf s2 sigma')
  in Conf1 sigma''
bsStmt (Conf (SIf b s1 s2) sigma) =
  let Conf1 cndEval = bsBExpr (Conf b sigma)
  in if cndEval
     then bsStmt (Conf s1 sigma)
     else bsStmt (Conf s2 sigma)
bsStmt (Conf (SWhile b s) sigma) =
  let Conf1 cndEval = bsBExpr (Conf b sigma)
  in if cndEval
     then
       let Conf1 sigma' = bsStmt (Conf s sigma)
       in bsStmt (Conf (SWhile b s) sigma')
     else
       Conf1 sigma



-- Below are the functions used for a nice testing experience
-- they combine running the actual function being tested with parsing
-- to allow specifying the input configuration as a string
--
-- These, together with the Show instances in the Configurations, State, and Syntax modules
-- make the input and output look closer to how it would look on paper.

test :: Show c => (c -> c') -> Parser c -> String -> c'
test f p s = f c
  where
    c = case parseFirst p s of
      Right c -> c
      Left err -> error ("parse error: " ++ err)

testExpr :: String -> Conf1 Integer
testExpr = test bsExpr aconf

testBExpr :: String -> Conf1 Bool
testBExpr = test bsBExpr bconf

testStmt :: String -> Conf1 State
testStmt = test bsStmt sconf
