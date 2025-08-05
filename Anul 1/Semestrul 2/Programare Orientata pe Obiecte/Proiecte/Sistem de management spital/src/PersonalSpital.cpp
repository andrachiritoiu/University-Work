#include "PersonalSpital.h"
#include<iostream>

int PersonalSpital::next_id=1;

//constructors
PersonalSpital::PersonalSpital():Persoana() {
    this->id_angajat=next_id++;
    this->salariu=0;
    this->experienta=0;
}
PersonalSpital::PersonalSpital(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu,
    int experienta, const std::map<std::string, std::vector<std::pair<int,int>>> &program) : Persoana(nume, prenume, CNP){
    this->id_angajat=next_id++;
    this->salariu=salariu;
    this->experienta=experienta;
    this->program=program;
}
//copy constructor
PersonalSpital::PersonalSpital(const PersonalSpital &p): Persoana(p){
    this->id_angajat=p.id_angajat;
    this->salariu=p.salariu;
    this->experienta=p.experienta;
    this->program=p.program;
}

//getters
int PersonalSpital :: getId() const {
    return this->id_angajat;
}
std::map<std::string, std::vector<std::pair<int,int>>> PersonalSpital :: getProgram() const {
    return this->program;
}


//operators
PersonalSpital& PersonalSpital :: operator=(const PersonalSpital &p) {
    if (this!=&p) {
        Persoana::operator=(p);
        this->id_angajat=p.id_angajat;
        this->salariu=p.salariu;
        this->experienta=p.experienta;
        this->program=p.program;
    }
    return *this;
}
std::istream& operator>>(std::istream &in, PersonalSpital &p) {
    //static_cast - converteste
    in>>static_cast<Persoana&>(p); //upcasting
    std::cout<<"Salariu: ";
    in>>p.salariu;
    std::cout<<"Experienta: ";
    in>>p.experienta;

    int nr_zile;
    std::cout<<"Numar de zile cu program: ";
    in>>nr_zile;
    for (int i=0;i<nr_zile;i++) {
        std::string zi;
        std::cout<<"Ziua "<<i+1<<" (luni-duminica)"<<": ";
        in>>zi;

        int nr_intervale;
        std::cout<<"Numar de intervale orare pentru "<<zi<<": ";
        in>>nr_intervale;

        std::vector<std::pair<int,int>> ore;
        std::string interval;
        for (int j=0;j<nr_intervale;j++) {
            std::cout << "Introduceti intervalul de ore "<<"(ora inceput - ora sfarsit): ";
            in>>interval;

            int poz=interval.find('-');
            int ora_inceput=std::stoi(interval.substr(0,poz));
            int ora_sfarsit=std::stoi(interval.substr(poz+1));

            if (ora_inceput<0 || ora_inceput>24 || ora_sfarsit<0 || ora_sfarsit>24 || ora_inceput>=ora_sfarsit){
                std::cout<<"Interval invalid. Reintroduceti intervalul.\n";
                --j;
            }

            ore.emplace_back(ora_inceput,ora_sfarsit);
        }
        p.program[zi]=ore;
    }

    return in;
}
std::ostream& operator<<(std::ostream &out, const PersonalSpital &p) {
    out<<static_cast<const Persoana&>(p);
    out<<"Id angajat: "<<p.id_angajat<<"\n"
       <<"Salariu: "<<p.salariu<<"\n"
       <<"Experienta: "<<p.experienta<<"\n"
       <<"Program: ";
    for (const auto& zi : p.program) {
        out << zi.first << ": ";
        for (const auto& interval : zi.second)
            out <<"["<<interval.first<<"-"<<interval.second<<"] ";
        out<<"\n";
    }
    return out;
}
