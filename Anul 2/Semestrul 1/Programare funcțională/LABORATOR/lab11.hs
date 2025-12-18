import GHC.Event.Windows (HandleData)
-- class Functor f where
-- fmap :: ( a -> b ) -> f a -> f b

--aplicam f pe functia din interior
newtype Identity a = Identity a
instance Functor Identity where
    fmap f (Identity a) = Identity(f a)

data Pair a = Pair a a
instance Functor Pair where
    fmap f(Pair a b) = Pair (f a)(f b)

data Constant a b = Constant b
instance Functor(Constant a) where
    fmap f (Constant b) = Constant (f b)       

            
data Two a b = Two a b
instance Functor(Two a) where
    fmap f(Two a b)=Two a(f b) 


data Three a b c = Three a b c
instance Functor(Three a b) where
    fmap f(Three a b c)=Three a b(f c)


data Three' a b = Three' a b b
instance Functor(Three' a) where
    fmap f(Three' a b c)=Three' a(f b)(f c)


data Four a b c d = Four a b c d
instance Functor(Four a b c)where
    fmap f (Four a b c d)=Four a b c (f d)


data Four'' a b = Four'' a a a b
instance Functor(Four'' a) where
    fmap f(Four'' a b c d)=Four'' a b c (f d)



data Quant a b = Finance | Desk a | Bloor b
instance Functor(Quant a) where
    fmap _ Finance = Finance
    fmap _ (Desk x) = Desk x
    fmap f (Bloor y) = Bloor (f y)



--constrangere pe f sa fie functor 

data LiftItOut f a = LiftItOut (f a)
instance Functor f => Functor (LiftItOut f) where
    fmap g (LiftItOut fa) = LiftItOut (fmap g fa)



data Parappa f g a = DaWrappa (f a) (g a)
instance (Functor f, Functor g) => Functor(Parappa f g) where
    fmap h (DaWrappa fa ga) = DaWrappa (fmap h fa) (fmap h ga)


data IgnoreOne f g a b = IgnoringSomething (f a) (g b)
instance Functor g => Functor (IgnoreOne f g a) where
    fmap h (IgnoringSomething fa gb) = IgnoringSomething fa (fmap h gb)



data Notorious g o a t = Notorious (g o) (g a) (g t)
instance Functor g => Functor (Notorious g o a) where
    fmap f (Notorious go ga gt) = Notorious go ga (fmap f gt)


--recursiv
data GoatLord a = NoGoat | OneGoat a 
                | MoreGoats (GoatLord a) (GoatLord a) (GoatLord a)
instance Functor GoatLord where
    fmap _ NoGoat = NoGoat
    fmap f (OneGoat x) = OneGoat (f x)
    fmap f (MoreGoats x y z) = MoreGoats (fmap f x) (fmap f y) (fmap f z)            




data TalkToMe a = Halt | Print String a | Read (String -> a)
instance Functor TalkToMe where
    fmap _ Halt = Halt
    fmap f(Print s a) = Print s (f a)
    fmap f(Read g) = Read(f.g)