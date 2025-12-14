import Data.Maybe (fromJust)
import Data.List (nub)

data Prop
  = Var Nume
  | F
  | T
  | Not Prop
  | Prop :|: Prop
  | Prop :&: Prop
  | Prop :->: Prop   
  | Prop :<->: Prop  
  deriving Eq

infixr 2 :|:
infixr 3 :&:
infixr 1 :->:   
infixr 0 :<->:



--a. (P∨Q)∧(P∧Q)
pa :: Prop
pa = (Var "P" :|: Var "Q") :&: (Var "P" :&: Var "Q")

--b. (P∨Q)∧(¬P∧¬Q)
pb :: Prop
pb = (Var "P" :|: Var "Q") :&: (Not (Var "P") :&: Not (Var "Q"))

--c.(P∧(Q∨R))∧((¬P∨¬Q)∧(¬P∨¬R))
pc :: Prop
pc = (Var "P" :&: (Var "Q" :|: Var "R")) :&: ((Not (Var "P") :|: Not (Var "Q")) :&: (Not (Var "P") :|: Not (Var "R")))




--2.Faceți tipul Prop instanță a clasei de tipuri Show, înlocuind conectorii Not, :|: și :&: cu ~, | și & și folosind direct numele variabilelor în loc de construcția Var nume.
instance Show Prop where
    show (Var n) = n
    show F = "F"
    show T = "T"
    show (Not p) = "(~" ++ show p ++ ")"
    show (p1 :|: p2) = "(" ++ show p1 ++ "|" ++ show p2 ++ ")"
    show (p1 :&: p2) = "(" ++ show p1 ++ "&" ++ show p2 ++ ")"

test_ShowProp :: Bool
test_ShowProp =
    show (Not (Var "P") :&: Var "Q") == "((~P)&Q)"


--Evaluarea expresiilor logice

type Env = [(Nume, Bool)]   --lista cu numele variabilellor si valorile lor de adevar


--pt cautarea valorii unei variabile in mediu
impureLookup :: Eq a => a -> [(a,b)] -> b
impureLookup a = fromJust.lookup a      

--3.Definiți o funcție eval care, dată fiind o expresie logică și un mediu de evaluare, calculează valoarea de adevăr a expresiei.
eval :: Prop -> Env -> Bool
eval (Var n) env = impureLookup n env
eval F _ = False
eval T _ = True
eval (Not p) env = not (eval p env)
eval (p1 :|: p2) env = eval p1 env || eval p2 env
eval (p1 :&: p2) env = eval p1 env && eval p2 env 

test_eval = eval  (Var "P" :|: Var "Q") [("P", True), ("Q", False)] == True


--Satisfiabilitate
--4.Definiți o funcție variabile care colectează lista tuturor variabilelor dintr-o formulă. Hint: folosiți funcția nub.
variabile :: Prop -> [Nume]
variabile (Var n) = [n]
variabile F = []
variabile T = []
variabile (Not p) = variabile p
variabile (p :|: q) = nub (variabile p ++ variabile q)
variabile (p :&: q) = nub (variabile p ++ variabile q)

test_variabile =
  variabile (Not (Var "P") :&: Var "Q") == ["P", "Q"]




--5.Dată fiind o listă de nume, definiți toate atribuirile de valori de adevăr posibile pentru ea.
envs :: [Nume] -> [Env]
envs [] = [[]]
envs (n:ns) = [ (n, False):env | env <- envs ns ] ++ [ (n, True):env | env <- envs ns ]

test_envs = 
    envs ["P", "Q"]
    ==
    [ [ ("P",False)
      , ("Q",False)
      ]
    , [ ("P",False)
      , ("Q",True)
      ]
    , [ ("P",True)
      , ("Q",False)
      ]
    , [ ("P",True)
      , ("Q",True)
      ]
    ]


--6.Definiți o funcție satisfiabila care, dată fiind o propoziție, verifică dacă aceasta este satisfiabilă. Hint: puteți folosi rezultatele de la exercițiile 4 și 5. 
satisfiabila :: Prop -> Bool
satisfiabila p =
  let
    vars = variabile p
    allEnvs = envs vars
    
  in
    any (\env -> eval p env) allEnvs

test_satisfiabila1 = satisfiabila (Not (Var "P") :&: Var "Q") == True
test_satisfiabila2 = satisfiabila (Not (Var "P") :&: Var "P") == False 



--7.O propoziție este validă dacă se evaluează la True pentru orice interpretare a variabilelor. O formulare echivalentă este aceea că o propoziție este validă dacă negația ei este nesatisfiabilă. Definiți o funcție valida care verifică dacă o propoziție este validă.
valida :: Prop -> Bool
valida p = not (satisfiabila (Not p))

test_valida1 = valida (Not (Var "P") :&: Var "Q") == False
test_valida2 = valida (Not (Var "P") :|: Var "P") == True



--8.Extindeți tipul de date Prop și funcțiile definite până acum pentru a include conectorii logici -> (implicație) și <-> (echivalență), folosind constructorii :->: și :<->:.
-- type Nume = String

-- -- data Prop
-- --   = Var Nume
-- --   | F
-- --   | T
-- --   | Not Prop
-- --   | Prop :|: Prop
-- --   | Prop :&: Prop
-- --   | Prop :->: Prop   
-- --   | Prop :<->: Prop  
-- --   deriving Eq

-- infixr 2 :|:
-- infixr 3 :&:
-- infixr 1 :->:   
-- infixr 0 :<->:



--9.Două propoziții sunt echivalente dacă au mereu aceeași valoare de adevăr, indiferent de valorile variabilelor propoziționale. Scrieți o funcție care verifică dacă două propoziții sunt echivalente.
echivalenta :: Prop -> Prop -> Bool
echivalenta = \p1 p2 ->
  let
    vars = nub (variabile p1 ++ variabile p2)
    allEnvs = envs vars
  in
    all (\env -> eval p1 env == eval p2 env) allEnvs

test_echivalenta1 =
  True
  ==
  (Var "P" :&: Var "Q") `echivalenta` (Not (Not (Var "P") :|: Not (Var "Q")))
test_echivalenta2 =
  False
  ==
  (Var "P") `echivalenta` (Var "Q")
test_echivalenta3 =
  True
  ==
  (Var "R" :|: Not (Var "R")) `echivalenta` (Var "Q" :|: Not (Var "Q"))