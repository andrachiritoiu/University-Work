import System.Environment (getArgs, getProgName)
import System.Exit (exitSuccess)

import Parser (parseFirst, program, pquery)
import Syntax (Program, Query)
import System.IO (hGetContents)
import Resolution (solutions)
import Substitution (makeGraph)
import HasVars (vars)

usage :: IO ()
usage   = getProgName >>= \main -> putStr $ unlines [
  "Usage: " ++ main ++ " [-vh] file query"
  , "  -h  Display this help message"
  , "  -v  Display version information"
  , "  file  The file containing the Prolog program"
  , "  query The query to be resolved"
  , "  n   How many solutions to display"
  ]

version :: IO ()
version = putStrLn "Version 0.1"

retrievePgm :: String -> Program
retrievePgm str = case parseFirst program str of
    Left err -> error ("Error while parsing program:\n\t" ++ err)
    Right pgm -> pgm

retrieveQuery :: String -> Query
retrieveQuery str = case parseFirst pquery str of
    Left err -> error ("Error while parsing query:\n\t" ++ err)
    Right query -> query

main :: IO ()
main = do
  cmd <- getArgs
  args <- parseArgs cmd
  let pgm = retrievePgm (pgmStr args)
  let q = retrieveQuery (query args)
  print (makeGraph (vars q) <$> take (sol args) (solutions pgm q))

data InterpreterType = VerificationCondition | SmtLib | Check

data Args = Args { pgmStr :: String, query :: String, sol :: Int }

parseArgs :: [String] -> IO Args
parseArgs ["-h"]      = usage   >> exit
parseArgs ["-v"]      = version >> exit
parseArgs [fileName, query, nStr]  = readFile fileName >>= \pgmStr -> return (Args pgmStr query (read nStr))

exit :: IO a
exit    = exitSuccess
