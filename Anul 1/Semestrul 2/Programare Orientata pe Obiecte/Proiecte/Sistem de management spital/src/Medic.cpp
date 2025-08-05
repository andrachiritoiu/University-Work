#include "Medic.h"
#include "PersonalSpital.h"
#include<iostream>

//constructors
Medic::Medic() : PersonalSpital() {
    this->specializare="";
    this->pacienti={};
}
Medic::Medic(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu, int experienta,
       const std::map<std::string, std::vector<std::pair<int,int>>> &program, const std::string &specializare, std::map<int, std::shared_ptr<Pacient>> pacienti) : PersonalSpital(nume,
       prenume, CNP, salariu, experienta, program) {
    this->specializare=specializare;
    this->pacienti=std::move(pacienti);
}
//copy constructor
Medic::Medic(const Medic &m): PersonalSpital(m) {
    this->specializare=m.specializare;
    this->pacienti=m.pacienti;
}

//getters
std::string Medic :: getSpecializare() const {
    return this->specializare;
}

//operators
Medic& Medic::operator=(const Medic &m) {
    if (this!=&m) {
        PersonalSpital::operator=(m);
        this->specializare=m.specializare;
        this->pacienti=m.pacienti;
    }
    return *this;
}
std::istream& operator>>(std::istream &in,  Medic &m) {
    in>>static_cast<PersonalSpital&>(m);
    std::cout<<"Specializare: ";
    in>>m.specializare;

    return in;
}
std::ostream& operator<<(std::ostream &out, const  Medic &m) {
    out<<static_cast<const PersonalSpital&>(m);
    out<<"Specializare: "<< m.specializare<< "\n";
    out<<"Pacienti:\n";

    return out;
}

//methods
void Medic::adaugaPacient(const std::shared_ptr<Pacient>& p) {
    this->pacienti[p->getId()]=p;
}
void Medic :: calculeazaBonus() {
    int bonus=this->salariu*0.1*this->experienta/10;
    std::cout<<"Bonus pentru medicul "<<this->nume<< " " <<this->prenume<<": "<<bonus<<" RON\n";
    this->salariu+=bonus;
    std::cout<<"Salariu actualizat: "<<salariu<<" RON\n";
}
