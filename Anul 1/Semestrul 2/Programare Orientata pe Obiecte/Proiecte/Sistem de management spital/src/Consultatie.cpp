#include "Consultatie.h"

#include <utility>
//conswtructors
Consultatie::Consultatie(const std::shared_ptr<Pacient> &pacient) {
    this->pacient=pacient;
}

Consultatie::Consultatie(const std::string& nume_serviciu,std::shared_ptr<Pacient>pacient, int pret, bool urgenta): Servicii(nume_serviciu,std::move(pacient)) {
    this->pret=pret;
    this->urgenta=urgenta;
}

//methods
void Consultatie::executa(){
    std::string diagnostic;
    std::cout<<"Introduceti diagnosticul: ";
    std::cin>>diagnostic;
    this->pacient->setDiagnostic(diagnostic);

    int severitate;
    std::cout<<"Severitate: ";
    std::cin>>severitate;
    this->pacient->setSeveritate(severitate);

    std::string data_internare;
    std::cout<<"Data internare: ";
    std::cin>>data_internare;
    this->pacient->setData_internare(data_internare);

    std::string data_externare;
    std::cout<<"Data externare: ";
    std::cin>>data_externare;
    this->pacient->setData_externare(data_externare);

    int pret_n;
    std::cout<<"Introduceti pretul consultatiei: ";
    std::cin>>pret_n;
    this->pret=pret_n;

    bool urgenta_n;
    std::cout<<"Este urgenta? (1-da, 0-nu): ";
    std::cin>>urgenta_n;
    this->urgenta=urgenta_n;

    this->pacient->adaugaIstoric("Evaluare: Diagnostic:" + diagnostic +", Severitate:" +
        std::to_string(severitate) + ", Internare:" + data_internare + ", Externare:" + data_externare+" ");
    std::cout << "Evaluare adaugata cu succes.\n";

}