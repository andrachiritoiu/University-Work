#include "Medicament.h"

//constructors
Medicament::Medicament(const std::string& nume, int pret,const  std::string &substanta_activa) {
    this->nume=nume;
    this->pret=pret;
    this->substanta_activa=substanta_activa;
}

//getters
std::string Medicament::getNume()const{
    return this->nume;
}
int Medicament::getPret()const{
    return this->pret;
}
std::string Medicament::getSubstantaActiva()const{
    return this->substanta_activa;
}

//operators
std::istream& operator>>(std::istream &in, Medicament &m) {
    std::cout<<"Introduceti numele medicamentului: ";
    in>>m.nume;
    std::cout<< "Introduceti pretul medicamentului: ";
    in>>m.pret;
    std::cout<<"Introduceti cantitatea medicamentului: ";
    in>>m.substanta_activa;

    return in;
}
std::ostream& operator<<(std::ostream &out, const Medicament &m) {
    out<<"Medicament: "<< m.nume << "\n"
       <<"Pret: "<<m.pret<<"\n"
       <<"Cantitate: "<<m.substanta_activa<<"\n";
    return out;
}

//methods


