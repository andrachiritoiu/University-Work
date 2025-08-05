#include "Operatie.h"


//constructor
Operatie::Operatie(const std::shared_ptr<Pacient> &pacient):Servicii(pacient){}

Operatie::Operatie(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient,int sala_operatie,
    std::string tip_anestezie, int timp_recuperare):Servicii(nume_serviciu, pacient) {
    this->sala_operatie=sala_operatie;
    this->tip_anestezie=std::move(tip_anestezie);
    this->timp_recuperare=timp_recuperare;
}

void Operatie::executa() {
    if (pacient->getSeveritateBoala()>7) {
        std::cout<<"Severitatea este mare. Se programeaza operatia.\n";

        std::cout<<"Alege sala de operatie: ";
        std::cin>>this->sala_operatie;
        std::cout<<"Tip anestezie(locala/generala): ";
        std::cin>>this->tip_anestezie;
        std::cout<<"Timp estimat de recuperare (zile): ";
        std::cin>>this->timp_recuperare;

        pacient->adaugaIstoric("Operatia: Sala - "+std::to_string(this->sala_operatie)+", Anestezie - "+this->tip_anestezie+", Timp recuperare - "+std::to_string(this->timp_recuperare));
    }
    else {
        std::cout<<"Severitatea este prea mica pentru operatie.\n";
    }
}
