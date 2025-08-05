#include<iostream>
#include<vector>
#include<memory>
using namespace std;

class Ruta{
protected:
    string oras_plecare;
    string oras_destinatie;
public:
    Ruta()=default;
    Ruta(const string &oras_plecare, const string &oras_destinatie);

    ~Ruta()=default;
};

class Cursa{
protected:
    string id;
    shared_ptr<Ruta> ruta;
    int pret{};
    int data_inceput{};
    int data_sfarsit{};
    int discount{};
public:
    Cursa()=default;
    Cursa(const string &id, shared_ptr<Ruta> ruta, int pret, int data_inceput,int data_sfarsit,int discount);
    virtual ~Cursa()=default;
};

class Cursa_temp:public Cursa{
private:
    int disponibilitate;
public:
    Cursa_temp(const string &id, shared_ptr<Ruta> ruta, int pret, int data_inceput,int data_sfarsit,int discount);
    ~Cursa_temp() override=default;
};


class Container{
private:
    std::vector<Cursa>zboruri;
public:
    Container()=default;
    ~Container()=default;

};

class Meniu{
private:
    vector<Container>containere;
public:

};


Ruta::Ruta(const string &oras_plecare, const string &oras_destinatie){
    this->oras_plecare=oras_plecare;
    this->oras_destinatie=oras_destinatie;
}

Cursa::Cursa(const string &id, shared_ptr<Ruta> ruta, int pret, int data_inceput,int data_sfarsit,int discount){
  this->id=id;
  this->ruta=ruta;
  this->pret=pret;
  this->data_inceput=data_inceput;
  this->data_sfarsit=data_sfarsit;
  this->discount=discount;
}

Cursa_temp::Cursa_temp(const string &id, shared_ptr<Ruta> ruta, int pret, int data_inceput,int data_sfarsit,int discount):Cursa(id,ruta,pret,data_inceput,data_sfarsit,discount){
    this->disponibilitate=disponibilitate;
}





int main(){


}

