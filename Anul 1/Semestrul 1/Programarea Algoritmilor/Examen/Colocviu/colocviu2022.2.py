#2
#a)
f=open("cinema.in")
d={}
for linie in f:
    numecinema,film,ore=linie.strip().split(' % ')
    ore=[x for x in ore.split()]
    if numecinema not in d:
        d[numecinema]={}
        d[numecinema][film]=ore
    else:
        d[numecinema][film]=ore
print(d)
f.close()

#b)
def sterge_ore(d,cinema,film,ore):
    for ora in ore:
        if ora in d[cinema][film]:
            d[cinema][film].remove(ora)
    return d[cinema][film]

#c=input("cinema=")
#f=input("film=")
#o=input("ore=")
print(sterge_ore(d,'Cinema 1', 'Minionii 2',{'12:30','12:00'}))
print(d)

#c
def cinema_fil (d,*numecinema,ora_minima,ora_maxima):
    sol=[]
    for cinema in numecinema:
        for film in d[cinema]:
            ok=1
            for o in d[cinema][film]:
                if ora_minima>o or ora_maxima<o:
                    ok=0
            if ok==1:
                tuplu=(film,cinema,d[cinema][film])
                sol.append(tuplu)
    sol.sort(key=lambda t:(t[0],-len(t[2])))
    return sol

print(cinema_fil(d,'Cinema 1','Cinema 2',ora_minima="14:00",ora_maxima="22:00"))