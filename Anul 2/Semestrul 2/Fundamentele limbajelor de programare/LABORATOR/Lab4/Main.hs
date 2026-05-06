import System.Environment (getArgs, getProgName)
import System.Exit (exitSuccess)

import Parser (parseFirst, pexprs)
import Syntax (Expr)
import System.IO (hGetContents)
import Unification (unifyAsList)

usage :: IO ()
usage   = getProgName >>= \main -> putStr $ unlines [
  "Usage: " ++ main ++ " [-vh] file"
  , "  -h  Display this help message"
  , "  -v  Display version information"
  , "  file  The file containing the list of expressions to be unified"
  , "        If no file is provided, the program reads from standard input"
  ]

version :: IO ()
version = putStrLn "Version 0.1"

retrieveExprs :: String -> [Expr]
retrieveExprs str = case parseFirst pexprs str of
    Left err -> error ("Error while parsing expressions:\n\t" ++ err)
    Right exprs -> exprs

main :: IO ()
main = do
  cmd <- getArgs
  args <- parseArgs cmd
  let exprs = retrieveExprs (pgmStr args)
  case unifyAsList exprs of
    Right subst -> print subst
    Left err -> error err

data InterpreterType = VerificationCondition | SmtLib | Check

newtype Args = Args { pgmStr :: String }

parseArgs :: [String] -> IO Args
parseArgs ["-h"]      = usage   >> exit
parseArgs ["-v"]      = version >> exit
parseArgs []          = getContents >>= \pgmStr -> return (Args pgmStr)
parseArgs [fileName]  = readFile fileName >>= \pgmStr -> return (Args pgmStr)

exit :: IO a
exit    = exitSuccess
