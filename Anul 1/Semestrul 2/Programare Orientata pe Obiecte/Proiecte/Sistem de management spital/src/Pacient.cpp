#include "Pacient.h"
#include<iostream>
#include<vector>

int Pacient::next_id=1;
int Pacient::total_pacienti=0;

//constructors
Pacient :: Pacient(): Persoana(){
    this->id_pacient=next_id++;
    this->total_pacienti++;
    this->diagnostic = "";
    this->severitate_boala = 0;
    this->data_internare = "";
    this->data_externare = "";
    this->asigurat = false;
    this->istoric_medical={};
}

Pacient :: Pacient (const std::string &nume, const std::string &prenume, const std::string &CNP, const std::string &diagnostic,
        int severitate_boala, const std::string &data_internare, const std::string &data_externare, bool asigurat, const std::vector<std::string> &istoric_medical):
        Persoana(nume, prenume, CNP){
    this->id_pacient=next_id++;
    this->total_pacienti++;
    this->diagnostic=diagnostic;
    this->severitate_boala=severitate_boala;
    this->data_internare=data_internare;
    this->data_externare=data_externare;
    this->asigurat=asigurat;
    this->istoric_medical=istoric_medical;
}
//copy constructor
Pacient::Pacient(const Pacient &p):Persoana(p){
    this->id_pacient=p.id_pacient;
    this->total_pacienti=p.total_pacienti;
    this->diagnostic=p.diagnostic;
    this->severitate_boala=p.severitate_boala;
    this->data_internare=p.data_internare;
    this->data_externare=p.data_externare;
    this->asigurat=p.asigurat;
    this->istoric_medical=p.istoric_medical;
    this->retete=p.retete;
}

//getters
int Pacient :: getId() const {
    return this->id_pacient;
}
int Pacient :: getSeveritateBoala() const {
    return this->severitate_boala;
}
const std::vector<std::string>& Pacient :: getIstoricMedical() const {
    return this->istoric_medical;
}
const std::vector<RetetaVariant>& Pacient :: getRetete() const {
    return this->retete;
}

//setters
void Pacient :: setDiagnostic(const std::string &diagnostic_n) {
    this->diagnostic=diagnostic_n;
}
void Pacient :: setSeveritate(int severitate_n) {
    this->severitate_boala=severitate_n;
}
void Pacient :: setData_internare(const std::string &data_internare_n) {
    this->data_internare=data_internare_n;
}
void Pacient :: setData_externare(const std::string &data_externare_n) {
    this->data_externare=data_externare_n;
}

//operators
Pacient& Pacient :: operator=(const Pacient &p) {
    if (this!=&p) {
        Persoana::operator=(p);
        this->id_pacient = p.id_pacient;
        this->total_pacienti=p.total_pacienti;
        this->diagnostic = p.diagnostic;
        this->severitate_boala = p.severitate_boala;
        this->data_internare = p.data_internare;
        this->data_externare = p.data_externare;
        this->asigurat = p.asigurat;
        this->istoric_medical=p.istoric_medical;
    }
    return *this;
}
std::istream& operator>>(std::istream &in, Pacient &p) {
    //static_cast - converteste
    in>>static_cast<Persoana&>(p); //upcasting
    std::cout<<"Asigurat(0-nu/1-da): ";
    in>>p.asigurat;
    std::cout<<"Istoric medical: \n";

    int nr_intrari;
    std::cout<<"Numar intrari in istoric medical: ";
    in>>nr_intrari;
    p.istoric_medical.clear();
    std::string intrare;
    std::getline(in,intrare);//in-flux intarare, intrare - var care stocheaza textul citit
    for(int i=0;i<nr_intrari;i++) {
        std::cout<<"Intrare "<< i + 1 <<": ";
        std::getline(in,intrare);
        p.istoric_medical.push_back(intrare);
    }
    return in;
}
std::ostream& operator<<(std::ostream &out, const Pacient &p) {
    out<<static_cast<const Persoana&>(p);
    out<<"Id pacient: "<<p.id_pacient<<"\n"
       <<"Asigurat: "<<(p.asigurat?"Da" : "Nu")<<"\n" //accepta 1 si 0
       <<"Istoric medical: "<<"\n";
    for (const auto& intrare: p.istoric_medical)
        out<<" - "<<intrare<<"\n";
    return out;
}

//methods
void Pacient :: adaugaIstoric(const std::string &noua_interventie) {
    this->istoric_medical.push_back(noua_interventie);
}
void Pacient :: adaugaReteta(const RetetaVariant& reteta) {
    this->retete.push_back(reteta);
}
void Pacient :: afiseazaTotalPacienti() {
    std::cout<<"Total pacienti inregistrati: "<<total_pacienti<<"\n";
}

//destructor
Pacient::~Pacient() {
    if (total_pacienti>0) {
        total_pacienti--;
    }
}
