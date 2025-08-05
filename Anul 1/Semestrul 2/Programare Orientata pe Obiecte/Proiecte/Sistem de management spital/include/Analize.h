#ifndef ANALIZE_H
#define ANALIZE_H
#include<string>
#include "Servicii.h"


class Analize:public Servicii {
private:
    std::string tip_analiza;
    std::string rezulatat;

public:
    //constructor
    Analize(const std::string &tip_analiza, const std::string &rezulatat);
    Analize(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient, const std::string &tip_analiza, const std::string &rezulatat);

    //methods
    void executa()override;

    //destructor
    ~Analize()override=default;
};



#endif //ANALIZE_H
