#include "Analize.h"

//constructors
Analize::Analize(const std::string &tip_analiza, const std::string &rezulatat) {
        this->tip_analiza=tip_analiza;
        this->rezulatat=rezulatat;
}
Analize::Analize(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient, const std::string &tip_analiza, const std::string &rezulatat):
        Servicii(nume_serviciu, pacient) {
        this->tip_analiza=tip_analiza;
        this->rezulatat=rezulatat;
}

//methods
void Analize::executa() {
        std::cout<<"Executam analiza: "<<this->tip_analiza<<"\n";
        // std::cout<<"Rezultatul este: "<<this->rezulatat<<"\n";
}