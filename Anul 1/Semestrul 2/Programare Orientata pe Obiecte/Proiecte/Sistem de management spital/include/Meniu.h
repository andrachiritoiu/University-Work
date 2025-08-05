#ifndef MENIU_H
#define MENIU_H
#include"Pacient.h"
#include"Medic.h"
#include"Asistent.h"
#include"GestiuneProgramari.h"
#include<memory>

//Singleton(design pattern)

class Meniu {
private:
    static Meniu *instanta; //Singleton - se poate crea un singur obiect din aceasta clasa
    std::vector<std::shared_ptr<Pacient>> pacienti;
    std::vector<std::shared_ptr<Medic>> medici;
    std::vector<std::shared_ptr<Asistent>> asistenti;
    std::vector<std::shared_ptr<Servicii>> servicii;
    GestiuneProgramari gestiuneProgramari;
    //constructor privat - impiedica instantierea din exterior
    Meniu()= default;
    //destructor
    ~Meniu()= default;

public:
    //methods
    static Meniu* getInstanta();
    static bool inputValid(const std::string &input);
    void ruleaza();
    void ruleazaMeniuPacient();
    void ruleazaMeniuPersonalMedical();
    void ruleazaMeniuMedic();
    void ruleazaMeniuAsistent();
};


#endif //MENIU_H
