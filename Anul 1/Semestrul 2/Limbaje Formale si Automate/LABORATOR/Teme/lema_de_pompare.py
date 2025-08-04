# Tema-lab2
# Chirițoiu Andra-Florentina, grupa 134

# Lema de pompare
def PumpingLemaRegular(s,p):
    #p is the pumping length
    if len(s)<p:
        # string is shorter than pumping length
        return [s]
    results=[]
    #for all possible divisions of the string into xyz where |xy|<=p and |y|>0
    # generate strings xy^kz for different values of k
    for i in range(p+1):
        x=s[:i]
        for j in range(i+1,len(s)+1):
            y=s[i:j]
            z=s[j:]
            if len(y)>=1 and len(x+y)<=p:
                for k in range(1,p+1):
                    rez=x+y*k+z
                    if rez not in results:
                        results.append((x,y,z,k,rez))
    return results

# example usage for language a^nb^n
def IsAnBn(s):
    # find where 'b' starts
    # count 'b's
    # check if all chars are accounted for and counts match

    nr_a=0
    nr_b=0
    poz_b=-1

    for i in range(len(s)):
        if s[i]=='b':
            poz_b=i
            break
    if poz_b!=-1:
        for i in range(poz_b,len(s)):
            if s[i]!='b':
                return False

    for c in range(len(s)):
        if s[c]!='a' and s[c]!='b':
            return False
        elif s[c]=='a':
            nr_a+=1
        else:
            nr_b+=1
    if nr_a!=nr_b:
        return False

    return nr_a==nr_b

# main
test_string="aaabbb"
p=3
pumped_strings=PumpingLemaRegular(test_string,p)
# print(pumped_strings)
for (x,y,z,k,pumped) in pumped_strings:
    print(f" x={x} ,y={y} ,z={z} ,k={k}")
    print(f" Pumped string: {pumped}")
    print(f" Is in language:  {IsAnBn(pumped)}")
    print()



