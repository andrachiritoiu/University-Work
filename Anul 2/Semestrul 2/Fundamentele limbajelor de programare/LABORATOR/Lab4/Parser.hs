
module Parser where

import           Data.Char
import Control.Applicative (Alternative(empty, (<|>)), some, many)
import Data.Functor (($>))

import Syntax ( Expr(..), Equation(..), Clause(..), Program(..), Query(..) )

-- a parser is a wrapper for a function that takes a string, a list of all the possibilities (as the grammar may be ambiguous) of: (i) the interpretation of the parsed portion and (ii) the remainder of the string
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

commaSep0 :: Parser a1 -> Parser [a1]
commaSep0 = (`sepBy0` symbol ",")

commaSep1 :: Parser a1 -> Parser [a1]
commaSep1 = (`sepBy1` symbol ",")

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

-- | a parser for identifier-like strings having a first letter of a special form, followed by a (maybe empty) sequence
-- of similar characters
idLike :: Parser Char -> Parser Char -> Parser String
idLike first rest = spaces *> ((:) <$> first <*> many rest)

{-| a Prolog identifier starts with a lower letter followed by alphanumerical characters

Examples:

>>> parseFirst identifier "aliBaba"
Right "aliBaba"

>>> parseFirst identifier "X1"
Left "No parse consuming all input"

>>> parseFirst identifier "_X1"
Left "No parse consuming all input"
-}
identifier :: Parser String
identifier = idLike (sat isLower) (sat isAlphaNum)

{-| a Prolog variable starts with an upper letter or `_` followed by alphanumerical characters

Examples:

>>> parseFirst variable "X1"
Right "X1"

>>> parseFirst variable "_X1"
Left "No parse consuming all input"

>>> parseFirst variable "aliBaba"
Left "No parse consuming all input"
-}
variable :: Parser String
variable = idLike (sat isUpper) (sat isAlphaNum)

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

{- | a parser for a constant
Examples:

>>> parseFirst pconst "abc"
Right abc
-}
pconst :: Parser Expr
pconst = App <$> identifier <*> pure []

{- | a parser for a variable
Examples:

>>> parseFirst pvar "Abc"
Right Abc

>>> parseFirst pvar "_"
Left "No parse consuming all input"
-}
pvar :: Parser Expr
pvar = Var <$> variable


pexprs :: Parser [Expr]
pexprs = commaSep1 pexpr

{- | a parser for application
Examples:

>>> parseFirst papp "f(Abc, d)"
Right f(Abc, d)

>>> parseFirst pvar "f()"
Left "No parse consuming all input"
-}
papp :: Parser Expr
papp = App <$> identifier <*> (symbol "(" *> pexprs  <* symbol ")")

pexpr :: Parser Expr
pexpr = pconst <|> pvar <|> papp

{-| a parser for proper clauses, i.e., of the form head :- body .

Examples

>>> parseFirst properClause "odd(s(X)) :- even(X)."
Right odd(s(X)) :-
  even(X).
-}
properClause :: Parser Clause
properClause = Clause <$> pexpr <*> (symbol ":-" *> commaSep1 pexpr  <* symbol ".")

{-| a parser for facts, i.e., of the form head.

Examples

>>> parseFirst pfact "odd(s(zero))."
Right odd(s(zero)).
-}
pfact :: Parser Clause
pfact = Clause <$> pexpr <*> (symbol "." $> [])

pclause :: Parser Clause
pclause = pfact <|> properClause

pquery :: Parser Query
pquery = Query <$> commaSep1 pexpr <* symbol "."

{-| a parser for programs

>>> parseFirst program "odd(s(X)):-even(X). even(s(X)) :- odd(X). even(zero). odd(s(zero))."
Right odd(s(X)) :-
  even(X).
<BLANKLINE>
even(s(X)) :-
  odd(X).
<BLANKLINE>
even(zero).
<BLANKLINE>
odd(s(zero)).
-}
program :: Parser Program
program = Program <$> some pclause

pequation :: Parser Equation
pequation = (:=:) <$> pexpr <*> (symbol "=" *> pexpr)

pequations :: Parser [Equation]
pequations = commaSep1 pequation
