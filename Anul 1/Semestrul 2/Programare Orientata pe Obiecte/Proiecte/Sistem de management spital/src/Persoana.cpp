#include "Persoana.h"
#include "ExceptieCNPInvalid.h"
#include<iostream>
#include<string>

bool Persoana::isCNPvalid(const std::string &cnp) {
    if (cnp.length()!=13) return false;

    for (const char c :cnp) {
        if (!isdigit(c)) return false;
    }

    //1-b,pana in 1999
    //2-f,pana in 1999
    //3-b,pana in 1899
    //4-f,pana in 1899
    //5-b,dupa 2000
    //6-f,dupa 2000
    if (cnp[0]=='0' || cnp[0]>='7') return false;

    //substr(poz,lungime)
    const int an=std::stoi(cnp.substr(1,2));
    const int luna=std::stoi(cnp.substr(3,2));
    const int zi=std::stoi(cnp.substr(5,2));

    if (luna<1 || luna>12)return false;

    //an bisect
    const char p=cnp[0];
    int an_intreg=0;
    switch (p) {
        case '1': case '2': an_intreg = 1900 + an; break;  // 1900-1999
        case '3': case '4': an_intreg = 1800 + an; break;  // 1800-1899
        case '5': case '6': an_intreg = 2000 + an; break;  // 2000-2099
        default: return false;
    }

    if (an_intreg%4==0 && (an_intreg%100!=0 || an_intreg%400==0)) {
        if (luna==2 && (zi<1 || zi>29)) return false;
        else if ((luna==1 || luna==3 || luna==5 || luna==7 || luna==8 || luna==10 || luna==12)
                 && (zi<1 || zi>31)) return false;
        else if ((luna==4 || luna==6 || luna==9 || luna==11)&&(zi<1 || zi>30)) return false;
    }
    else {
        if (luna==2 && (zi<1 || zi>28)) return false;
        else if ((luna==1 || luna==3 || luna==5 || luna==7 || luna==8 || luna==10 || luna==12)
                 && (zi<1 || zi>31)) return false;
        else if ((luna==4 || luna==6 || luna==9 || luna==11)&&(zi<1 || zi>30)) return false;
    }

    //cifra de control
    const std::string control="279146358279";
    int s=0;
    for (int i=0; i<12;i++) {
        s+=(control[i]-'0')*(cnp[i]-'0');
    }
    int cifraControl=s%11;
    if (cifraControl==10)cifraControl=1;
    if (cifraControl != (cnp[12]-'0'))return false;

    return true;
}

//constructors
Persoana::Persoana(const std::string &nume, const std::string &prenume, const std::string &CNP) {
    if (!isCNPvalid(CNP)) {
        throw ExceptieCNPInvalid();
    }

    this->nume=nume;
    this->prenume=prenume;
    this->CNP=CNP;
}

//copy constructor
Persoana::Persoana(const Persoana &p) {
    this->nume=p.nume;
    this->prenume=p.prenume;
    this->CNP=p.CNP;
}

//getters
std::string Persoana :: getNume() const {
    return this->nume;
}
std::string Persoana :: getPrenume() const {
    return this->prenume;
}
std::string Persoana :: getCNP() const {
    return this->CNP;
}

//setters
void Persoana :: setCNP(const std::string &CNP_n) {
    this->CNP = CNP_n;
}

//operators
Persoana& Persoana::operator= (const Persoana &p) {
    if (this != &p) {
        this->nume=p.nume;
        this->prenume=p.prenume;
        this->CNP=p.CNP;
    }
    return *this;
}
bool Persoana::operator== (const Persoana &p) const {
    return this->CNP==p.CNP;
}
std::istream& operator>>(std::istream &in, Persoana &p) {
    std::cout<<"\nNumele: ";
    in>>p.nume;
    std::cout<<"Prenumele: ";
    in>>p.prenume;

    return in;
}
std::ostream& operator<<(std::ostream &out, const Persoana &p) {
    out <<"Nume: "<<p.nume<<"\n"
        <<"Prenume: "<<p.prenume<<"\n"
        <<"CNP: "<<p.CNP<<"\n";
    return out;
}



