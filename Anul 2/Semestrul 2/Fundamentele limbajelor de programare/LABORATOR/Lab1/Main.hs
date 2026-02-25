import System.Environment (getArgs, getProgName)
import System.Exit (exitSuccess)

import Solution.Lab1 (eexpr, parseFirst)

main :: IO ()
main = getArgs >>= parseArgs >>= print . parseFirst eexpr

tac  = unlines . reverse . lines

parseArgs :: [String] -> IO String
parseArgs ["-h"] = usage   >> exit
parseArgs ["-v"] = version >> exit
parseArgs []     = getContents
parseArgs [fileName]     = readFile fileName

usage :: IO ()
usage   = getProgName >>= \main -> putStrLn ("Usage: " ++ main ++ " [-vh] [file]")
version :: IO ()
version = putStrLn "Version 0.1"
exit :: IO a
exit    = exitSuccess
