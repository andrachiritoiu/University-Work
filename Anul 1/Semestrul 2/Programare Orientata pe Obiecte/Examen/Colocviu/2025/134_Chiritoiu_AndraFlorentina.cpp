//Chiritoiu Andra-Florentina
//grupa 134
//Bahrim Dragos
//Clion
// g++.exe (Rev1, Built by MSYS2 project) 15.1.0
#include<iostream>
#include<memory>
#include<vector>
#include<string>

using namespace std;

class Stream {
public:
    virtual ~Stream()=default;
    friend istream& operator>>(istream &in, Stream &obj);
    friend ostream& operator<<(ostream &out,const Stream &obj);
    virtual void citeste(istream &in)=0;
    virtual void afiseaza(ostream &out)const=0;
};
istream& operator>>(istream &in, Stream &obj) {
    obj.citeste(in);
    return in;
}
ostream& operator<<(ostream &out,const Stream &obj) {
    obj.afiseaza(out);
    return out;
}


class Produs {
protected:
    string nume;
    float gramaj;
public:
    Produs()=default;
    Produs(string nume, float gramaj);

    virtual float valoare_energie()=0;

    virtual ~Produs()=default;
};
Produs::Produs(string nume, float gramaj) {
    this->nume=nume;
    this->gramaj=gramaj;
}



class Bautura:public Produs {
private:
    bool sticla;
public:
    Bautura()=default;
    Bautura(string nume, float gramaj,bool sticla);

    float valoare_energie()override;

    ~Bautura()=default;

};
Bautura::Bautura(string nume, float gramaj,bool sticla):Produs(nume, gramaj) {
    this->sticla=sticla;
}
float Bautura::valoare_energie() {
    if (sticla) {
        return 25;
    }
    else {
        return 0.25*this->gramaj;
    }
}



class Desert:public Produs {
private:
    string format_servire;
public:
    Desert()=default;
    Desert(string nume, float gramaj,string format_servire);

    float valoare_energie()override;

    ~Desert()=default;

};
Desert::Desert(string nume, float gramaj,string format_servire):Produs(nume, gramaj) {
    this->format_servire=format_servire;
}
float Desert::valoare_energie() {
    if (this->format_servire=="felie") {
        return 25;
    }
    else if (this->format_servire=="portie") {
        return 0.25*this->gramaj;
    }
    else if (this->format_servire=="cupa") {
        return 0.2*this->gramaj;
    }
    else throw runtime_error("Gresit");
}


class Burger:public Produs {
private:
    vector<string>ingrediente;
public:
    Burger()=default;
    Burger(string nume, float gramaj, vector<string>ingrediente);

    float valoare_energie()override;

    ~Burger()=default;

};
Burger::Burger(string nume, float gramaj, vector<string>ingrediente):Produs(nume, gramaj) {
    this->ingrediente=ingrediente;
}
float Burger::valoare_energie() {
    return this->gramaj*0.25*this->ingrediente.size();
}



class Angajat {
protected:
    int pct_energie;
public:
    Angajat()=default;
    virtual void preluare()=0;
    virtual void preparare()=0;
    virtual void livrare()=0;

    int getPct()const;

    virtual ~Angajat()=default;
};
int Angajat::getPct()const {
    return this->pct_energie;
}

class Casier:public Angajat {
public:
    Casier()=default;
    void preluare()override;
    void preparare()override;
    void livrare()override;

    ~Casier()override=default;
};
void Casier::preluare() {
    this->pct_energie-=25;
}
void Casier::preparare() {
    this->pct_energie-=100;
}
void Casier::livrare() {
    this->pct_energie-=100;
}



class Livrator:public Angajat {
public:
    Livrator()=default;
    void preluare()override;
    void preparare()override;
    void livrare()override;

    ~Livrator()override=default;
};
void Livrator::preluare() {
    this->pct_energie-=100;
}
void Livrator::preparare() {
    this->pct_energie-=100;
}
void Livrator::livrare() {
    this->pct_energie-=25;
}



class Bucatar:public Angajat {
public:
    Bucatar()=default;
    void preluare()override;
    void preparare()override;
    void livrare()override;

    ~Bucatar()override=default;
};
void Bucatar::preluare() {
    this->pct_energie-=100;
}
void Bucatar::preparare() {
    this->pct_energie-=25;
}
void Bucatar::livrare() {
    this->pct_energie-=100;
}



class Comanda :public Stream{
private:
    static int contor;
    int id;
    int nr_produse;
    vector<shared_ptr<Produs>>produse;
public:
    Comanda() {
        this->id=contor++;
    }
    Comanda(int id, int nr_produse):id(contor++),nr_produse(nr_produse){};

    void citeste(istream &in)override;
    void afiseaza(ostream &out)const override;
    Comanda(const Comanda &other);
    Comanda & operator=(const Comanda &other);

    ~Comanda()=default;
};
int Comanda::contor=1;
void Comanda::citeste(istream &in){
    //daca aveam tip faceam la toate tipurile de produs suprascrierea functie de citire

    cout<<"Numar produse: ";
    in>>nr_produse;

    for (int i=0;i<nr_produse;i++) {
        cout<<"Alege tip: ";
        string tip;
        in>>tip;

    if (tip=="bautura"){auto produs=make_shared<Bautura>(); this->produse.push_back(produs);}
    else  if (tip=="desert"){auto produs=make_shared<Desert>(); this->produse.push_back(produs);}
    else if (tip=="burger"){auto produs=make_shared<Burger>(); this->produse.push_back(produs);}
    else runtime_error("Tip gresit");
    }
}
void Comanda::afiseaza(ostream &out)const {
    //
}
Comanda::Comanda(const Comanda &other): id(other.id),nr_produse(other.nr_produse) {}

Comanda & Comanda::operator=(const Comanda &other) {
    if (this == &other)
        return *this;
    id = other.id;
    nr_produse = other.nr_produse;
    return *this;
}


class Simulator {
private:
    Simulator()=default;
    Simulator(const Simulator &simulator)=delete;
    Simulator &operator=(const Simulator &simulator)=delete;
    static Simulator *simulator;
    vector<shared_ptr<Angajat>>angajati;
    vector<shared_ptr<Comanda>>comenzi;
public:
    static Simulator *getInstance();
    void ruleaza();
    void comanda();
    void adaugareAngajati();
    void afisareAngajati();

};
Simulator * Simulator::getInstance() {
    if (simulator==nullptr)
        simulator=new Simulator();
    return simulator;
}
Simulator * Simulator::simulator=nullptr;

void  Simulator::adaugareAngajati() {
    cout<<"Alege tipul angajatului: ";
    string tip;
    cin>>tip;
    if (tip=="casier") {
        auto casier=make_shared<Casier>();
        angajati.push_back(casier);
    }
    else if (tip=="livrator") {
        auto livrator=make_shared<Livrator>();
        angajati.push_back(livrator);
    }
    else if (tip=="bucatar") {
        auto bucatar=make_shared<Bucatar>();
        angajati.push_back(bucatar);
    }
    else {
        throw runtime_error("Tip Gresit");
    }
}
void Simulator::afisareAngajati() {
    int nr_casieri=0,nr_livratori=0,nr_bucatari=0;
    for (auto angajat:angajati) {
        if (dynamic_pointer_cast<Casier>(angajat))nr_casieri++;
        if (dynamic_pointer_cast<Livrator>(angajat))nr_livratori++;
        if (dynamic_pointer_cast<Bucatar>(angajat))nr_bucatari++;
    }
    cout<<"Casieri: "<<nr_casieri<<"\n";
    cout<<"Livratori: "<<nr_livratori<<"\n";
    cout<<"Bucatari: "<<nr_bucatari<<"\n";
}
void Simulator::comanda() {
    int ok=1;
    do{
        cout<<"Adaugare comanda?(0/1)\n";
        int op;
        cin>>op;
        if (op==1) {
            auto comanda=make_shared<Comanda>();
            cin>>*comanda;
        }


        for (auto angajat:angajati) {
            if (angajat->getPct()==0)
                ok=0;
        }
    }while (ok==1);
}
void Simulator::ruleaza() {
    int optiune=-1;
    do{
        try {
            cout<<"\n1.Adauga angajat\n";
            cout<<"2.Vezi numarul de angajati\n";
            cout<<"3.Da o comanda\n";
            cout<<"0.Exit\n";
            cout<<"Alege: ";
            cin>>optiune;

            switch (optiune) {
                case 1: {
                    adaugareAngajati();
                    break;
                }
                case 2: {
                    afisareAngajati();
                    break;
                }
                case 3: {
                    comanda();
                    break;
                }
                case 0: {
                    break;
                }
            }
        }
        catch (const exception &e) {
            cout<<"Eroare: "<<e.what();
        }

    }while (optiune!=0);
}


int main(){
    Simulator::getInstance()->ruleaza();
return 0;
}