#ifndef CONSULTATIEINITIALA_H
#define CONSULTATIEINITIALA_H
#include "Consultatie.h"
#include<string>

class ConsultatieInitiala: public Consultatie {
private:
    std::string simptome_initiale;
public:
    //constructors
    ConsultatieInitiala()=default;
    explicit ConsultatieInitiala(const std::shared_ptr<Pacient> &pacient);
    ConsultatieInitiala(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient, int pret, bool urgenta, const std::string &simptome_initiale_n);

    //methods
    void executa()override;

    //destructor
    ~ConsultatieInitiala()override = default;
};


#endif //CONSULTATIEINITIALA_H
