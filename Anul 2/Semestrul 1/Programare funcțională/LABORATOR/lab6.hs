--1.
data Fruct
  = Mar String Bool
  | Portocala String Int

ionatanFaraVierme = Mar "Ionatan" False
goldenCuVierme = Mar "Golden Delicious" True
portocalaSicilia10 = Portocala "Sanguinello" 10
cosFructe = [Mar "Ionatan" False,
                Portocala "Sanguinello" 10,
                Portocala "Valencia" 22,
                Mar "Golden Delicious" True,
                Portocala "Sanguinello" 15,
                Portocala "Moro" 12,
                Portocala "Tarocco" 3,
                Portocala "Moro" 12,
                Portocala "Valencia" 2,
                Mar "Golden Delicious" False,
                Mar "Golden" False,
                Mar "Golden" True]  

-- a) Scrieți un predicat care verifică dacă un fruct este o portocală de Sicilia. Soiurile de portocale din Sicilia sunt Tarocco, Moro și Sanguinello


ePortocalaDeSicilia :: Fruct -> Bool
ePortocalaDeSicilia (Portocala soi _) = soi `elem` ["Tarocco", "Moro", "Sanguinello"]
ePortocalaDeSicilia (Mar _ _) = False


--b)Scrieți o funcție care calculează numărul total de felii ale portocalelor de Sicilia dintr-o listă de fructe.

nrFeliiSicilia :: [Fruct] -> Int
nrFeliiSicilia listaFructe = sum [felii | Portocala soi felii <- listaFructe, soi `elem` ["Tarocco", "Moro", "Sanguinello"]] 


--c)Scrieți o funcție care calculează numărul de mere care au viermi dintr-o listă de fructe.

nrMereViermi :: [Fruct] -> Int
nrMereViermi listaFructe = sum [1 | Mar _ True <- listaFructe]





--2.Paw Patrol
--type - un alis
--deriving show - face ca valorile de tip Animal sa poata fi afisate lizinil pe ecran

type NumeA = String
type Rasa = String
data Animal = Pisica NumeA | Caine NumeA Rasa
    deriving Show


--a)Scrieți o funcție care întoarce "Meow!" pentru pisică și "Woof!" pentru câine.

vorbeste :: Animal -> String
vorbeste (Caine _ _ ) = "Woof!"
vorbeste (Pisica _ ) = "Meow!"


--b)Reamintiți-vă tipul de date predefinit Maybe.
--maybe a - este un tip care poate contine valoarea de tip a(constuctorul Just), sau nimic(Nothing)

-- data Maybe a = Nothing | Just a

rasa :: Animal -> Maybe String
rasa (Caine _ r) = Just r   
rasa (Pisica _)  = Nothing


-- Matrix Resurrections
-- 3.Se dau următoarele tipuri de date ce reprezintă matrici cu linii de lungimi diferite:
-- care întoarce rasa unui câine dat ca parametru sau Nothing dacă parametrul este o pisică.

data Linie = L [Int]
   deriving Show
data Matrice = M [Linie]
   deriving Show

-- a)Scrieți o funcție care verifică dacă suma elementelor de pe fiecare linie este egală cu o valoare dată n. Rezolvați cerința folosind foldr.

sumaLinie :: Linie -> Int
sumaLinie (L lista) = sum lista

verifica :: Matrice -> Int -> Bool
verifica (M linii) n = foldr (\linie acc -> sumaLinie linie == n && acc) True linii


--b) Scrieți o funcție doarPozN care are ca parametri un element de tip Matrice și un număr întreg n, și care verifică dacă toate liniile de lungime n din matrice au numai elemente strict pozitive.

areDoarPozitive :: Linie -> Bool
areDoarPozitive (L lista) = all (> 0) lista

lungimeLinie :: Linie -> Int
lungimeLinie (L lista) = length lista

doarPozN :: Matrice -> Int -> Bool
doarPozN (M linii) n =
    let
        liniiDeLungimeN = filter (\linie -> lungimeLinie linie == n) linii
    in
        all areDoarPozitive liniiDeLungimeN



--c)Definiți predicatul corect care verifică dacă toate liniile dintr-o matrice au aceeași lungime.
corect :: Matrice -> Bool
corect (M []) = True
corect (M (L primaLinie : restLinii)) =
    let
        lungimePrimaLinie = length primaLinie
        toateLiniileSuntEgalLungime [] = True
        toateLiniileSuntEgalLungime (L linie : rest) =
            length linie == lungimePrimaLinie && toateLiniileSuntEgalLungime rest
    in
        toateLiniileSuntEgalLungime restLinii




