
module Parser ( parseFirst, Parser, aconf, bconf, sconf, sstmt, state ) where

import Data.Char
import Control.Applicative (Alternative(empty, (<|>)), some, many)
import Data.Functor (($>))

import Syntax ( AExpr(..), BExpr(..), Stmt(..) )
import Configurations ( Conf(..) )
import State ( State(..) )

-- a parser is a wrapper for a function that takes a string, and returns a list of all the possibilities (as the grammar may be ambiguous) of: (i) the interpretation of the parsed portion and (ii) the remainder of the string
newtype Parser a = Parser
  { parse :: String -> [(a, String)]
  }

-- | Ensures that the parser consumes all the input (modulo trailing 'spaces')
parseAll :: Parser a -> Parser a
parseAll p = Parser (\cs -> filter (\(a, rest) -> null rest) (parse (p <* spaces) cs))

-- | Yields the unique result of the parser, if it consumes the entire string
-- If multiple parses are possible, it will return an error message
-- If no parses are possible, it will return an error message
parseFirst :: Show a => Parser a -> String -> Either String a
parseFirst p s =
  case parse (parseAll p) s of
    [] -> Left "No parse consuming all input"
    [(x,_)] -> Right x
    l -> Left $ "Ambiguous parse: " ++ show (map fst l)

-- | parser for characters which satisfy a predicate
sat :: (Char -> Bool) -> Parser Char
sat p = Parser checkChar
  where
    checkChar (c:cs) | p c = [(c, cs)] -- if the character satisfies the predicate, return the character and the remainder of the string
    checkChar _ = []

-- | parses exactly one character
item :: Parser Char
item = sat (const True)

instance Functor Parser where
  -- | Apply function @f@ on all results of the @parser@
  fmap f parser = Parser (\cs -> [(f a, cs') | (a, cs') <- parse parser cs])

{- | Applicative is a type class that represents computations that can be sequenced and combined
It provides access to combinators like '*>', '<*', which allow discarding uninteresting input (e.g., terminals).

For example:
>>> parse (char 'a' *> char 'b') "abc"
[('b',"c")]

>>> parse (char 'a' <* char 'b') "abc"
[('a',"c")]

One should also check the '$>' and '<$' combinators, which allow for replacing the result of a parser with a constant value.

For example:
>>> parse (char 'a' $> 'd') "abc"
[('d',"bc")]

>>> parse ('d' <$ char 'a') "abc"
[('d',"bc")]

Additionally, '<$>' and '<*>' allow for lifting a pure function and applying it to the results of multiple parsers.

For example:
>>> parse ((,) <$> char 'a' <*> char 'b') "abc"
[(('a','b'),"c")]

Moreover, 'Applicative' provides functions such as 'traverse' which can be used to apply a function to a list of parsers,
apply those parsers in order and collect the results in a list (See definition of 'string' parser below).
-}
instance Applicative Parser where
  -- | parser that always succeeds with the given value, without consuming any input
  pure a = Parser (\cs -> [(a, cs)])
  -- | apply any function parsed by the first parser to any value parsed by the second parser
  pf <*> pa = Parser (\cs -> [(f a, cs'') | (f, cs') <- parse pf cs, (a, cs'') <- parse pa cs'])

{- This instance is not needed as we can do everything with the Applicative instance
instance Monad Parser where
  -- | bind operator, used to chain parsers
  -- it applies the function f to any result of the parser p to get a new parser and then applies it to the remainder of the string
  p >>= f = Parser (\cs -> [(b, cs'') | (a, cs') <- parse p cs, (b, cs'') <- parse (f a) cs'])
-}

{-|
Alternative is a type class that represents computations that can return one of two possible results.

>>> parse (char 'a' <|> char 'b') "abc"
[('a',"bc")]

-- remember the definition of 'char', it creates a parser that recognizes and consumes a specific character
-- so <|> has as its arguments two parsers, one that recognize the characters 'a' and one that recognizes the character 'b'
-- <|> will use both parsers to try to parse the input "abc"
-- the first parser char 'a' succeeds and consumes 'a' from the input, the remainder of the string is "bc"
-- the second parser char 'b' fails giving []
-- the result of <|> is the concatenation of the results of the two parsers, so the result is [('a', "bc")]

-- Note: the order of the parsers in the <|> function is not important here, the two parsers are called independently
-- of each other and the results are concatenated (it would be another discussion if the parsers would be called
-- sequentially, like string is defined)
-- Check for yourself the result of:
>>> parse (char 'b' <|> char 'a') "abc"
[('a',"bc")]

>>> parse (char 'b' <|> char 'c') "abc"
[]

char 'b' will fail, char 'c' will fail, so the result is []

>>> parse (char 'a' <|> char 'b') "abc"
[('a',"bc")]

>>> parse (char 'a' <|> char 'a') "abc"
[('a',"bc"),('a',"bc")]

-- multiple choices (even though we used the same parser)

In addition of providing a way to combine two parsers, Alternative also provides implementation for some useful combinators like
'many' and 'some' that can be used to parse zero or more occurrences of a parser.
For example:
>>> parse (many (char 'a')) "aaaabc"
[("aaaa","bc"),("aaa","abc"),("aa","aabc"),("a","aaabc"),("","aaaabc")]

>>> parse (some (char 'a')) "aaaabc"
[("aaaa","bc"),("aaa","abc"),("aa","aabc"),("a","aaabc")]

-}
instance Alternative Parser where
  -- | this parser always fails
  empty = Parser (const [])
  -- | sum of parsers: will try to parse the input cs with both parsers p and q and return the concatenation of the results (all possibles)
  p <|> q = Parser (\cs -> parse p cs <|> parse q cs)



{- | char is a function that creates a parser for a specific character
example: char 'a' is a parser that recognizes and consumes the character 'a'
from the input string
>>> parse (char 'a') "abc"
[('a',"bc")]

'item' will consume 'a' and leave "bc"
'a' == 'a' is True, so the parser will return 'a' and the remainder of the string

>>> parse (char 'a') "xyz"
[]

'item' will consume @'x'@ and leave @"yz"@
@'x' == 'a'@ is @False@, so the parser will return @[]@

>>> parse (char 'a') ""
[]

'item' has nothing to consume, so it will return [] (it fails immediately)
-}
char :: Char -> Parser Char
char c = sat (c ==)


{- |  'string' is a function with a parameter of type 'String' that returns a parser for the given string

>>> parse (string "") "hello"
[("","hello")]
the parser does not consume any input and returns "" with the remainder of the string

>>> parse (string "hello") "hello world"
[("hello"," world")]
-}
string :: String -> Parser String
-- create a parser for each character in the input string and return the concatenation of the parsed characters
-- example:
-- >>> parse (string "abc") "abcdef"
-- [("abc","def")]
-- the parser will use 'char' with each of 'a', 'b', 'c' to consume them, collect the results and return "abc" with the remainder of the string "def"
string = traverse char

-- | define a parser that will consume zero or more whitespace characters, check hoogle for 'isSpace' and 'many' definitions
spaces :: Parser String
spaces = many (sat isSpace)

-- | a parser for p that ignores leading spaces (using '*>' to discard the result of the 'spaces' parser)
token :: Parser a -> Parser a
token p = spaces *> p

{- | a parser for a specific string that ignores leading spaces from the input
>>> parseFirst (symbol "hello") "  hello   "
Right "hello"

it will make more sense if you think about the following example 2  +   3 like it should be equivalent to 2+3
>>> parseFirst (symbol "+") "  +   "
Right "+"
-}
symbol :: String -> Parser String
symbol symb = token (string symb)

{-|
a parser combinator that matches zero or more occurrences of p separated by sep (a separator)
To ensure it never fails it uses a @pure []@ alternative.
it requires 2 parameters
- p, a parser for anything
- sep, a parser for the separator

Example:
a parser for digits separated by commas (to be used when parsing the insides of a list of digits, or a tuple for example)
>>> parseFirst (digit `sepBy0` symbol ",") "1,2,3"
Right [1,2,3]
-}
sepBy0 :: Parser a1 -> Parser a2 -> Parser [a1]
p `sepBy0` sep = (p `sepBy1` sep) <|> pure []

{-| sepBy1 behaves like 'sepBy0', but expects at least one occurrence of p, otherwise it fails

For example, both of these will fail to parse any digits, but 'sepBy0' will return the empty list and not consume the input
while sepBy1 will fail immediately and consume the input
>>> parse (digit `sepBy0` symbol ",") "a1,2,3"
[([],"a1,2,3")]

>>> parse (digit `sepBy1` symbol ",") "a1,2,3"
[]
-}
sepBy1 :: Parser a1 -> Parser a2 -> Parser [a1]
p `sepBy1` sep = (:) <$> p <*> many (sep *> p)

{- | look is a parser that looks ahead in the input string at the next character without consuming it
and returns the possible output of the parser and the remainder of the string

Examples:
>>> parse look "hello"
[(Just 'h',"hello")]

>>> parse look ""
[(Nothing,"")]
-}
look :: Parser (Maybe Char)
look =
  Parser
    (\cs ->
       case cs of
         []      -> [(Nothing, [])] -- if the input is empty, return Nothing, we can't look ahead
         (c:cs') -> [(Just c, c : cs')] -- return the first character and the remainder of the string
     )

{-| a parser that consumes characters until it finds a specific character, then consumes that character, too

Returns the consumed characters (excluding the specified one) and the remainder of the string
usage examples: take all until end of line, until a comma, until a closing parenthesis, etc.

Examples:
>>> parse (takeUntil ',') "hello,world"
[("hello","world")]

>>> parse (takeUntil ',') "hel,lo,world"
[("hel","lo,world")]
-}
takeUntil :: Char -> Parser [Char]
takeUntil stop = many (sat (/= stop)) <* char stop

-- | chainl1 is a parser combinator used to parse left-associative binary operators
-- examples: used for parsing arithmetic expressions where the operators are left-associative, like addition and multiplication
chainl1 :: Parser t -> Parser (t -> t -> t) -> Parser t
p `chainl1` op = reduce <$> p <*> many (flip <$> op <*> p)
  where
    reduce = foldl (\a f -> f a)

-- | chainr1 is a parser combinator used to parse right-associative binary operators
-- examples: used for parsing statament sequences
chainr1 :: Parser t -> Parser (t -> t -> t) -> Parser t
p `chainr1` op = reduce <$> p <*> many ((,) <$> op <*> p)
  where
    -- reduce = flip (foldr (\(op, p') a p -> p `op` a p') id)
    reduce p [] = p
    reduce p ((op, p'):opps) = p `op` reduce p' opps

identifier :: Parser String
identifier = spaces *> ((:) <$> sat isAlpha <*> many (sat isAlphaNum))

-- | digit is a parser for a single digit that will return it as an integer
digit :: Parser Integer
digit = fromIntegral . digitToInt <$> sat isDigit

-- | parser for an integer with optional leading spaces (uses 'some' to ensure it consumes at least one digit)
-- >>> parse integer " 1234 abc"
-- [(1234," abc"),(123,"4 abc"),(12,"34 abc"),(1,"234 abc")]
---
-- >>> parse integer " 01234 abc"
-- [(1234," abc"),(123,"4 abc"),(12,"34 abc"),(1,"234 abc"),(0,"1234 abc")]
integer :: Parser Integer
integer = asInt <$> (spaces *> some digit)
  where
    -- convert a list of digits to an integer
    asInt = foldl (\b a -> a + b * 10) 0

{-| parser for a floating point number, with or without a decimal point
Examples:
>>> parseFirst number "3.1415"
Right 3.1415

>>> parseFirst number "31415"
Right 31415.0
-}
number :: Parser Double
-- run both prasers: with or without a decimal point, and return the result
-- choice between 2 parsers, first with parser since it may have one, but if it doesn't check if it's an integer
-- check the definition of fromIntegral on hoogle, it converts an integer to a more general number type (like Double)
number =
  withoutDecimalPt <|>
  (mkFraction <$> withoutDecimalPt <* char '.' <*> many digit)
  where
    withoutDecimalPt = fromIntegral <$> integer
    mkFraction wholePt digits = wholePt + fractionalPart digits / 10
    -- convert a list of digits to a floating point number ([1,2,3,4] -> 1.234.. (check ieee754 for more details))
    fractionalPart = foldr (\a b -> fromIntegral a + b / 10) 0

-- | parser for addition and subtraction operators
addop :: Parser (Double -> Double -> Double)
-- use either the parser for addition or the parser for subtraction
addop = add <|> sub
  where
    add = symbol "+" $> (+)
      -- consumes the addition operator an returns (+), the addition operator
    sub = symbol "-" $> (-)

mulop :: Parser (Double -> Double -> Double)
-- use either the parser for multiplication or the parser for division
mulop = mul <|> div
  where
    mul = symbol "*" $> (*)
    div = symbol "/" $> (/)

-- | parser for a factor in an arithmetic expression, this can be a negative factor, a parenthesized expression or a 'number'
factor :: Parser Double
-- try to parse the input as a negative factor, if this fails try a parenthesized expression,
-- if this fails try to parse as a number (see above)
factor = negativeFactor <|> parensExpr <|> number
  where
    -- parser for a negative factor, like -3, or -3.14 or -(3+2)
    negativeFactor = negate <$> (symbol "-" *> factor)
    -- parser for a parenthesized expression, like (3+2), or (3*2) or (3+(2*..))
    parensExpr = symbol "(" *> expr <* symbol ")" -- consume the closing parenthesis

-- | a term in an arithmetic expression, this can be a factor or a multiplication or division of 'factor's
term :: Parser Double
term = factor `chainl1` mulop

-- | an expr here is defined using the 'term' above, since the multiplication and division operators have a higher precedence
-- than the addition and subtraction operators, so they are evaluated first
expr :: Parser Double
expr = term `chainl1` addop

-- Helper function to parse a string expression and return the possible evaluation of the expression
parseExpr :: String -> Either String Double
parseExpr = parseFirst expr

{-
Check the output of the following examples:
>>> parseExpr "1 + 2"
Right 3.0

>>> parseExpr "1 + (2 * 3)"
Right 7.0

>>> parseExpr "-3 + 4"
Right 1.0

>>> parseExpr "4 - 3"
Right 1.0

>>> parseExpr "10 / 2 + 3"
Right 8.0

>>> parseExpr "10 / 2 + 3*(5+(2*3))"
Right 38.0

-- failure of parsing
>>> parseExpr "10 / 2 + 3*(5+(2*3))a"
Left "No parse consuming all input"
-}

--1. Testati parser-ul de mai sus

--2. Modificati parser-ul astfel incat sa returneze o expresie de tipul de mai sus 'AExpr' (tip de date abstract, inductiv, pentru expresii aritmetice)

{- | a parser for a number, but using the Constructor 'ENum' to create an 'AExpr'
Examples:
>>> parseFirst enum "3.1415"
Right (ENum 3.1415)

>>> parseFirst enum "31415"
Right (ENum 31415.0)
-}
enum :: Parser AExpr
enum = ENum <$> integer

{- | a parser for an identifier, using the Constructor 'EId' to create an 'AExpr'
Examples:
>>> parseFirst eid "abc"
Right (EId "abc")
-}
eid :: Parser AExpr
eid = EId <$> identifier


-- | a parser for addition and subtraction operators, but using the Constructors 'EPlu' and 'EMinu' to create an 'AExpr' for
-- the addition and subtraction operators
eaddop :: Parser (AExpr -> AExpr -> AExpr)
eaddop = add <|> sub
  where
    add = symbol "+" $> EPlu
      -- consumes the addition operator an returns (+), the addition operator
    sub = symbol "-" $> EMinu


-- | a parser for multiplication and division operators, but using the Constructors 'EMul' and 'EDiv' to create an 'AExpr' for
-- the multiplication and division operators
emulop :: Parser (AExpr -> AExpr -> AExpr)
emulop = symbol "*" $> EMul

{- | a parser for a 'factor' in an arithmetic expression, this can be a negative factor, a parenthesized expression or a number
like above, but using the Constructors 'EminuU' to create an 'AExpr' for a negative factor
Examples:
>>> parseFirst efactor "-3"
Right (EminuU (ENum 3.0))

>>> parseFirst efactor "-(3)"
Right (EminuU (ENum 3.0))

>>> parseFirst efactor "-(-(3))"
Right (EminuU (EminuU (ENum 3.0)))
-}
efactor :: Parser AExpr
efactor = -- negativeFactor <|>
    parensExpr <|> enum <|> eid
  where
    -- parser for a negative factor, like -3, or -3.14 or -(3+2)
    -- negativeFactor = EminuU <$> (symbol "-" *> efactor)
    -- parser for a parenthesized expression, like (3+2), or (3*2) or (3+(2*..))
    parensExpr = symbol "(" *> eexpr <* symbol ")" -- consume the closing parenthesis


{- | a term in an arithmetic expression, this can be a factor or a multiplication or division of factors
same as above, but using the the new type of 'AExpr'
Examples:
>>> parseFirst eterm "3 * 2 / 5"
Right (EDiv (EMul (ENum 3.0) (ENum 2.0)) (ENum 5.0))

>>> parseFirst eterm "3 * (2 / 5)"
Right (EMul (ENum 3.0) (EDiv (ENum 2.0) (ENum 5.0)))
-}
eterm :: Parser AExpr
eterm = efactor `chainl1` emulop

{- | an expr here is defined using the term above, since the multiplication and division operators have a higher precedence
than the addition and subtraction operators, so they are evaluated first
same as above, but using the the new type of 'AExpr'
Examples:
>>> parseFirst eexpr "3 + 2 * 5"
Right (EPlu (ENum 3.0) (EMul (ENum 2.0) (ENum 5.0)))

>>> parseFirst eexpr "(3 + 2) * 5"
Right (EMul (EPlu (ENum 3.0) (ENum 2.0)) (ENum 5.0))

>>> parseFirst eexpr "1 + 2"
Right (EPlu (ENum 1.0) (ENum 2.0))

>>> parseFirst eexpr "1 + (2 * 3)"
Right (EPlu (ENum 1.0) (EMul (ENum 2.0) (ENum 3.0)))

>>> parseFirst eexpr "-3 + 4"
Right (EPlu (EminuU (ENum 3.0)) (ENum 4.0))

>>> parseFirst eexpr "4 - 3"
Right (EMinu (ENum 4.0) (ENum 3.0))

>>> parseFirst eexpr "10 / 2 + 3"
Right (EPlu (EDiv (ENum 10.0) (ENum 2.0)) (ENum 3.0))

>>> parseFirst eexpr "10 / 2 + 3*(5+(2*3))"
Right (EPlu (EDiv (ENum 10.0) (ENum 2.0)) (EMul (ENum 3.0) (EPlu (ENum 5.0) (EMul (ENum 2.0) (ENum 3.0)))))

-- failure of parsing
>>> parseFirst eexpr "10 / 2 + 3*(5+(2*3))a"
Left "No parse consuming all input"
-}
eexpr :: Parser AExpr
eexpr = eterm `chainl1` eaddop

bbool :: Parser BExpr
bbool = BTrue <$ symbol "true" <|> BFalse <$ symbol "false"

bcomp :: Parser BExpr
bcomp = BEq <$> eexpr <* symbol "==" <*> eexpr
  <|> BLe <$> eexpr <* symbol "<=" <*> eexpr

bfactor :: Parser BExpr
bfactor = negativeFactor <|> bbool <|> bcomp <|> parensExpr
  where
    negativeFactor = BNot <$> (symbol "!" *> bfactor)
    parensExpr = symbol "(" *> bexpr <* symbol ")"

bandop :: Parser (BExpr -> BExpr -> BExpr)
bandop = BAnd <$ symbol "&&"

bterm :: Parser BExpr
bterm = bfactor `chainl1` bandop

borop :: Parser (BExpr -> BExpr -> BExpr)
borop = BOr <$ symbol "||"

bexpr :: Parser BExpr
bexpr = bterm `chainl1` borop

sasgn :: Parser Stmt
sasgn = SAss <$> identifier <* symbol ":=" <*> eexpr

sskip :: Parser Stmt
sskip = SSkip <$ symbol "skip"

sfactor :: Parser Stmt
sfactor = sasgn <|> sskip <|> sparenExpr
  where
    sparenExpr = symbol "(" *> sstmt <* symbol ")"

sseqop :: Parser (Stmt -> Stmt -> Stmt)
sseqop = SSeq <$ symbol ";"

sif :: Parser Stmt
sif = SIf <$> (symbol "if" *> bexpr) <* symbol "then" <*> sfactor <* symbol "else" <*> sfactor

swhile :: Parser Stmt
swhile = SWhile <$> (symbol "while" *> bexpr) <* symbol "do" <*> sfactor

sterm :: Parser Stmt
sterm = sif <|> swhile <|> sfactor

sstmt :: Parser Stmt
sstmt = sterm `chainr1` sseqop

state :: Parser State
state = State <$> sepBy0 ((,) <$> identifier <* symbol "|->" <*> integer) (symbol ",")

aconf :: Parser (Conf AExpr)
aconf = Conf <$> (symbol "<" *> eexpr) <* symbol "," <*> state <* symbol ">"

bconf :: Parser (Conf BExpr)
bconf = Conf <$> (symbol "<" *> bexpr) <* symbol "," <*> state <* symbol ">"

sconf :: Parser (Conf Stmt)
sconf = Conf <$> (symbol "<" *> sstmt) <* symbol "," <*> state <* symbol ">"

{- Tests
>>> parseFirst sstmt "s := 0;\ni := 0;\nwhile i <= n do (\n    s := s + i;\n    i := i + 1\n)"
Right s := 0; i := 0; while i <= n do (s := s + i; i := i + 1)
-}
