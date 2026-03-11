import System.Environment (getArgs, getProgName)
import System.Exit (exitSuccess)

import Parser (sstmt, state, parseFirst)
import Syntax (Stmt)
import State (State)
import BigStep (bsStmt)
import SmallStep (Trace, ssStmt, ssStmt, ssTrace, ss)
import Configurations ( Conf1, Conf(..) )

main :: IO ()
main = getArgs >>= parseArgs >>= \args -> print (execute (parseFirst sstmt (pgmStr args)) (parseFirst state (stateStr args)) (interpreter args))

data Config
  = CBigStep (Conf1 State)
  | CSmallStep (Conf Stmt)
  | CSmallStepTrace Trace

instance Show Config where
  show (CBigStep sigma) = show sigma
  show (CSmallStep cfg) = show cfg
  show (CSmallStepTrace trace) = show trace

execute :: Either String Stmt -> Either String State -> InterpreterType -> Config
execute (Left err) _ _ = error ("Error while parsing program" ++ err)
execute _ (Left err) _ = error ("Error while parsing state" ++ err)
execute (Right stmt) (Right state) Parse = CSmallStep (Conf stmt state)
execute (Right stmt) (Right state) BigStep = CBigStep $ bsStmt (Conf stmt state)
execute (Right stmt) (Right state) OneStep = CSmallStep $ ssStmt (Conf stmt state)
execute (Right stmt) (Right state) SmallStep = CSmallStep $ ss (Conf stmt state)
execute (Right stmt) (Right state) SmallStepTrace = CSmallStepTrace $ ssTrace (Conf stmt state)

data InterpreterType = Parse | BigStep | OneStep | SmallStep | SmallStepTrace

data Args = Args { pgmStr :: String, stateStr :: String, interpreter :: InterpreterType }

parseInterpreter :: String -> InterpreterType
parseInterpreter "parse" = Parse
parseInterpreter "bs" = BigStep
parseInterpreter "one" = OneStep
parseInterpreter "ss" = SmallStep
parseInterpreter "trace" = SmallStepTrace
parseInterpreter _ = error "Invalid interpreter type"

parseArgs :: [String] -> IO Args
parseArgs ["-h"] = usage   >> exit
parseArgs ["-v"] = version >> exit
parseArgs []     = getContents >>= \pgmStr -> return (Args pgmStr "" BigStep)
parseArgs [fileName]            = readFile fileName >>= \pgmStr -> return (Args pgmStr "" BigStep)
parseArgs [fileName, stateStr]  = readFile fileName >>= \pgmStr -> return (Args pgmStr stateStr BigStep)
parseArgs [fileName, stateStr, interpreter]    = readFile fileName >>= \pgmStr -> return (Args pgmStr stateStr (parseInterpreter interpreter))


usage :: IO ()
usage   = getProgName >>= \main -> putStrLn ("Usage: " ++ main ++ " [-vh] [file [state [parse | bs | one | ss | trace]]]")
version :: IO ()
version = putStrLn "Version 0.1"
exit :: IO a
exit    = exitSuccess
