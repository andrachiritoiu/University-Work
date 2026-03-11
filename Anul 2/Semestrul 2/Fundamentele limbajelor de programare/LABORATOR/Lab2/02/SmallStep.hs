module SmallStep ( ssStmt, ss, ssTrace, Trace ) where

import State ( get, set, State )
import Syntax ( AExpr(..), BExpr(..), Stmt(..) )
import Configurations ( Conf(..) )
import Parser ( parseFirst, Parser, aconf, bconf, sconf ) -- for testing purposes

{- small-step (one-step) semantics for arithmetic expressions

Examples

>>> testExpr "< 5, >"
ssExpr: ENum cannot be advanced one step

>>> testExpr "< x, a |-> 3, x |-> 4 >"
< 4, a |-> 3, x |-> 4 >

>>> testExpr "< x + a, a |-> 3, x |-> 4 >"
< 4 + a, a |-> 3, x |-> 4 >

>>> testExpr "< 4 + a, a |-> 3, x |-> 4 >"
< 4 + 3, a |-> 3, x |-> 4 >

>>> testExpr "< 4 + 3, a |-> 3, x |-> 4 >"
< 7, a |-> 3, x |-> 4 >

>>> testExpr "< x - a, a |-> 3, x |-> 4 >"
< 4 - a, a |-> 3, x |-> 4 >

>>> testExpr "< 4 - a, a |-> 3, x |-> 4 >"
< 4 - 3, a |-> 3, x |-> 4 >

>>> testExpr "< 4 - 3, a |-> 3, x |-> 4 >"
< 1, a |-> 3, x |-> 4 >

>>> testExpr "< x * a, a |-> 3, x |-> 4 >"
< 4 * a, a |-> 3, x |-> 4 >

>>> testExpr "< 4 * a, a |-> 3, x |-> 4 >"
< 4 * 3, a |-> 3, x |-> 4 >

>>> testExpr "< 4 * 3, a |-> 3, x |-> 4 >"
< 12, a |-> 3, x |-> 4 >
-}
ssExpr :: Conf AExpr -> Conf AExpr
ssExpr (Conf (ENum _ ) _ ) = error "ENum cannot be advenced one step"
ssExpr (Conf (EId x) sigma) = Conf (ENum (get sigma x)) sigma
ssExpr (Conf (EPlu (ENum i1) (ENum i2)) sigma) =
   Conf (ENum (i1 + i2)) sigma
  
-- ssExpr (Conf (EPlu (Enum i1) a2) sigma) = undefined
ssExpr (Conf (EPlu a1 a2) sigma) = 
  let 
    Conf a2' sigma' = ssExpr (Conf a2 sigma)
  in Conf (EPlu a1 a2') sigma'


{- small-step (one-step) semantics for boolean expressions

Examples:
>>> testBExpr "< true, >"
ssBExpr: BTrue cannot be advanced one step

>>> testBExpr "< false, >"
ssBExpr: BFalse cannot be advanced one step

>>> testBExpr "< x == a, a |-> 3, x |-> 4 >"
< 4 = a, a |-> 3, x |-> 4 >

>>> testBExpr "< 4 == a, a |-> 3, x |-> 4 >"
< 4 = 3, a |-> 3, x |-> 4 >

>>> testBExpr "< 4 == 3, a |-> 3, x |-> 4 >"
< false, a |-> 3, x |-> 4 >

>>> testBExpr "< a <= x, a |-> 3, x |-> 4 >"
< 3 <= x, a |-> 3, x |-> 4 >

>>> testBExpr "< 3 <= x, a |-> 3, x |-> 4 >"
< 3 <= 4, a |-> 3, x |-> 4 >

>>> testBExpr "< 3 <= 4, a |-> 3, x |-> 4 >"
< true, a |-> 3, x |-> 4 >

>>> testBExpr "< !(x <= a), a |-> 3, x |-> 4 >"
< ! (4 <= a), a |-> 3, x |-> 4 >

>>> testBExpr "< ! true, >"
< false,  >

>>> testBExpr "< ! false, >"
< true,  >

>>> testBExpr "< a <= x && false, a |-> 3, x |-> 4 >"
< 3 <= x && false, a |-> 3, x |-> 4 >

>>> testBExpr "< true && a <= x, >"
< a <= x,  >

>>> testBExpr "< false && a <= x, >"
< false,  >

>>> testBExpr "< a <= x || true, a |-> 3, x |-> 4 >"
< 3 <= x || true, a |-> 3, x |-> 4 >

>>> testBExpr "< true || a <= x, >"
< true,  >

>>> testBExpr "< false || a <= x, >"
< a <= x,  >
-}
ssBExpr :: Conf BExpr -> Conf BExpr
ssBExpr = undefined

{- small-step (one-step) semantics for statements

Examples:
>>> testStmt "< skip, >"
ssStmt: `skip` cannot be advanced one step

>>> testStmt "< x := x + 1, a |-> 3, x |-> 4 >"
< x := 4 + 1, a |-> 3, x |-> 4 >

>>> testStmt "< x := 5, a |-> 3, x |-> 4 >"
< skip, x |-> 5, a |-> 3 >

>>> testStmt "< x := x + 1; a := x + a, a |-> 3, x |-> 4 >"
< x := 4 + 1; a := x + a, a |-> 3, x |-> 4 >

>>> testStmt "< skip; a := x + a, a |-> 3, x |-> 4 >"
< a := x + a, a |-> 3, x |-> 4 >

>>> testStmt "< if a <= x then max := x else max := a, a |-> 3, x |-> 4 >"
< if 3 <= x then max := x else max := a, a |-> 3, x |-> 4 >

>>> testStmt "< if true then max := x else max := a, a |-> 3, x |-> 4 >"
< max := x, a |-> 3, x |-> 4 >

>>> testStmt "< if false then max := x else max := a, a |-> 3, x |-> 4 >"
< max := a, a |-> 3, x |-> 4 >

>>> testStmt "< while a <= x do x := x - a, a |-> 7, x |-> 33 >"
< if a <= x then (x := x - a; while a <= x do x := x - a) else skip, a |-> 7, x |-> 33 >
-}
ssStmt :: Conf Stmt -> Conf Stmt
ssStmt = undefined


-- | Executes a configuration completely (until reaching `skip`)
-- by iteratively calling 'ssStmt'
ss :: Conf Stmt -> Conf Stmt
ss (Conf SSkip sigma) = Conf SSkip sigma
ss (Conf s sigma) = ss (Conf s' sigma')
  where
    Conf s' sigma' = ssStmt (Conf s sigma)

-- | Structure to store an execution trace
newtype Trace = Trace [Conf Stmt]

instance Show Trace where
  show (Trace trace) = unlines (map show trace)

-- | Traces the step-by-step execution by iteratively calling 'ssStmt' and
-- recording each intermediate transition.
ssTrace :: Conf Stmt -> Trace
ssTrace cfg = Trace (go cfg)
  where
    go cfg@(Conf SSkip _) = [cfg]
    go cfg = cfg : go (ssStmt cfg)

-- Below are the functions used for a nice testing experience
-- they combine running the actual function being tested with parsing
-- to allow specifying the input configuration as a string
--
-- These, together with the Show instances in the Configurations, State, and Syntax modules
-- make the input and output look closer to how it would look on paper.

test :: Show c => (c -> c) -> Parser c -> String -> c
test f p s = f c
  where
    c = case parseFirst p s of
      Right c -> c
      Left err -> error ("parse error: " ++ err)

testExpr :: String -> Conf AExpr
testExpr = test ssExpr aconf

testBExpr :: String -> Conf BExpr
testBExpr = test ssBExpr bconf

testStmt :: String -> Conf Stmt
testStmt = test ssStmt sconf
