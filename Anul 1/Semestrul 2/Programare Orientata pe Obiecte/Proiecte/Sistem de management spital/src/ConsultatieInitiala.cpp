#include "ConsultatieInitiala.h"

//constructors
ConsultatieInitiala::ConsultatieInitiala(const std::shared_ptr<Pacient> &pacient) {
    this->pacient=pacient;
}
ConsultatieInitiala::ConsultatieInitiala(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient, int pret, bool urgenta, const std::string &simptome_initiale_n):Consultatie(nume_serviciu,pacient,pret,urgenta) {
    this->simptome_initiale=simptome_initiale_n;
}

//methods
void ConsultatieInitiala::executa(){
    std::string diagnostic_n;
    std::cout<<"Introduceti diagnosticul: ";
    std::cin>>diagnostic_n;
    this->pacient->setDiagnostic(diagnostic_n);

    int severitate_n;
    std::cout<<"Severitate: ";
    std::cin>>severitate_n;
    this->pacient->setSeveritate(severitate_n);

    std::string data_internare_n;
    std::cout<<"Data internare: ";
    std::cin>>data_internare_n;
    this->pacient->setData_internare(data_internare_n);

    std::string data_externare_n;
    std::cout<<"Data externare: ";
    std::cin>>data_externare_n;
    this->pacient->setData_externare(data_externare_n);

    int pret_n;
    std::cout<<"Introduceti pretul consultatiei: ";
    std::cin>>pret_n;
    this->pret=pret_n;

    bool urgenta_n;
    std::cout<<"Este urgenta? (1-da, 0-nu): ";
    std::cin>>urgenta_n;
    this->urgenta=urgenta_n;

    std::string simptome_initiale_n;
    std::cout<<"Simptome initiale: ";
    std::cin>>simptome_initiale_n;
    this->simptome_initiale=simptome_initiale_n;

    this->pacient->adaugaIstoric("Evaluare: Diagnostic:" + diagnostic_n +", Severitate:" +
        std::to_string(severitate_n) + ", Internare:" + data_internare_n + ", Externare:" + data_externare_n + ", Simptome initiale:" + simptome_initiale);
    std::cout << "Evaluare initiala adaugata cu succes.\n";
}

