--4.Turtle Graphics

-- a) Definirea tipului Turtle și a direcțiilor posibile

data Directie = Nord
              | NordEst
              | Est
              | SudEst
              | Sud
              | SudVest
              | Vest
              | NordVest
              deriving (Show, Eq, Enum, Bounded)

type Coordonata = Int

-- Țestoasa: poziție (x, y) și orientare (Directie)
data Turtle = Turtle Coordonata Coordonata Directie
    deriving Show


-- Rotire cu 45° în sensul acelor de ceasornic
mutaTurn :: Turtle -> Turtle
mutaTurn (Turtle x y dir) =
    let urmatoareaDirectie =
            if dir == maxBound
            then minBound
            else succ dir
    in Turtle x y urmatoareaDirectie

mutaStep :: Turtle -> Turtle
mutaStep (Turtle x y dir) =
    case dir of
        Nord     -> Turtle x (y+1) dir
        NordEst  -> Turtle (x+1) (y+1) dir
        Est      -> Turtle (x+1) y dir
        SudEst   -> Turtle (x+1) (y-1) dir
        Sud      -> Turtle x (y-1) dir
        SudVest  -> Turtle (x-1) (y-1) dir
        Vest     -> Turtle (x-1) y dir
        NordVest -> Turtle (x-1) (y+1) dir



-- b) Tipul Action

data Action = Step | Turn
    deriving Show



-- c) Tipul Command

data Command = Do Action
             | Repeat Int Action
    deriving Show


-- d) Funcția getPizza pentru lista de comenzi simple

executaActiune :: Action -> Turtle -> Turtle
executaActiune Step = mutaStep
executaActiune Turn = mutaTurn

-- Execută o comandă
executaComanda :: Command -> Turtle -> Turtle
executaComanda (Do act) t = executaActiune act t
executaComanda (Repeat n act) t
    | n <= 0    = t
    | otherwise = executaComanda (Repeat (n-1) act) (executaActiune act t)

-- Execută o listă de comenzi și returnează poziția finală
getPizza :: Turtle -> [Command] -> (Coordonata, Coordonata)
getPizza t cmds =
    let finalTurtle = foldl (flip executaComanda) t cmds
    in case finalTurtle of
        Turtle x y _ -> (x, y)


-- e) Extinderea cu Wait și Seq

data CommandE = DoE ActionE
              | RepeatE Int ActionE
              | WaitE
    deriving Show

data ActionE = StepE
             | TurnE
             | Seq CommandE CommandE
    deriving Show

-- Execută o acțiune extinsă
executaActiuneE :: ActionE -> Turtle -> Turtle
executaActiuneE StepE t = mutaStep t
executaActiuneE TurnE t = mutaTurn t
executaActiuneE (Seq c1 c2) t =
    let t' = executaComandaE c1 t
    in executaComandaE c2 t'


-- Execută o comandă extinsă
executaComandaE :: CommandE -> Turtle -> Turtle
executaComandaE WaitE t = t
executaComandaE (DoE act) t = executaActiuneE act t
executaComandaE (RepeatE n act) t
    | n <= 0    = t
    | otherwise = executaComandaE (RepeatE (n-1) act) (executaActiuneE act t)

-- getPizza pentru comenzi extinse
getPizzaE :: Turtle -> [CommandE] -> (Coordonata, Coordonata)
getPizzaE t cmds =
    let finalTurtle = foldl (flip executaComandaE) t cmds
    in case finalTurtle of
        Turtle x y _ -> (x, y)



-- f) Agregarea comenzilor într-o singură comandă (cu fold)

-- Combină două comenzi într-o secvență
combinaComenzi :: CommandE -> CommandE -> CommandE
combinaComenzi c1 c2 = DoE (Seq c1 c2)

-- Agregă lista de comenzi într-una echivalentă
agregareComenzi :: [CommandE] -> CommandE
agregareComenzi [] = WaitE
agregareComenzi cs = foldr combinaComenzi WaitE cs
