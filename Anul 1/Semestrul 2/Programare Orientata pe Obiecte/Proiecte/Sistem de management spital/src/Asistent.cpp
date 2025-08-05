#include "Asistent.h"
#include "Pacient.h"
#include<iostream>

//constructors
Asistent::Asistent() : PersonalSpital() {
    this->sectie="";
    this->proceduri_efectuate={};
}
Asistent::Asistent(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu, int experienta,
         const std::map<std::string, std::vector<std::pair<int,int>>> &program, const std::string &sectie, const std::vector<std::string> &proceduri_efectuate) : PersonalSpital(nume,
        prenume, CNP, salariu, experienta, program) {
    this->sectie=sectie;
    this->proceduri_efectuate=proceduri_efectuate;
}
//copy constructor
Asistent::Asistent(const Asistent &a): PersonalSpital(a) {
    this->sectie=a.sectie;
    this->proceduri_efectuate=a.proceduri_efectuate;
}

//operators
Asistent& Asistent :: operator=(const Asistent &a) {
    if (this!=&a) {
        PersonalSpital::operator=(a);
        this->sectie=a.sectie;
        this->proceduri_efectuate=a.proceduri_efectuate;
    }
    return *this;
}
std::istream& operator>>(std::istream &in, Asistent &a) {
    in>>static_cast<PersonalSpital&>(a);
    std::cout<<"Sectie: ";
    in>>a.sectie;

    int nr_proceduri;
    std::cout<<"Numarul de proceduri : ";
    in>>nr_proceduri;
    std::string temp;
    std::getline(in,temp);//goleste buffer
    for (auto i=0;i<nr_proceduri;i++) {
        std::cout<<"Introduceti procedura "<<i+1<<" :";
        std::string procedura;
        in>>procedura;
        a.addProcedura(procedura);
    }
    return in;
}
std::ostream& operator<<(std::ostream &out,const Asistent &a) {
    out<<static_cast<const PersonalSpital&>(a);
    out<<"Sectie: "<<a.sectie<<"\n"
       <<"Proceduri efectuate: \n";
    int i=1;
    for (const auto &p:a.proceduri_efectuate){
        out<<" - Procedura "<<i<<": "<<p<<" \n";
        i++;
    }
    return out;
}

void Asistent :: addProcedura(const std::string &procedura) {
    this->proceduri_efectuate.push_back(procedura);
}

void Asistent :: calculeazaBonus() {
    int bonus=this->salariu*0.05*this->experienta/10;
    std::cout<<"Bonus pentru asistentul "<<this->nume<< " " <<this->prenume<<": "<<bonus<<" RON\n";
    this->salariu+=bonus;
    std::cout<<"Salariu actualizat: "<<salariu<<" RON\n";
}

void Asistent :: administrareTratament(const std::vector<Programare> &programari, int id_pacient) {
    bool gasit=false;
    bool gasit_reteta=false;
    for (const auto &prog:programari) {
        if (prog.getPacient()->getId()==id_pacient) {
            gasit=true;
            std::cout<<"Tratament administrat: "<<"\n";
            for (const auto &reteta_var : prog.getPacient()->getRetete()) {
                gasit_reteta=true;
                //std::visit - este din std::variant si apeleaza functia corecta pentru tipul actual tinut de variant
                std::visit([](const auto &reteta) {
                    std::cout<<reteta<<"\n";
                },reteta_var);
            }
            if (!gasit_reteta) {
                std::cout<<"Nu are retete recomandate";
            }
        }
    }

    if (!gasit) {
        std::cout<<"Pacientul nu a fost gasit.\n";
    }
}
