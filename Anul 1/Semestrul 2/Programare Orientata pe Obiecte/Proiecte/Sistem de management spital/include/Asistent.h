#ifndef ASISTENT_H
#define ASISTENT_H
#include<string>
#include<vector>
#include "PersonalSpital.h"
#include "Pacient.h"
#include "Programare.h"

class Asistent: public PersonalSpital {
private:
   std::string sectie;
   std::vector<std::string> proceduri_efectuate;

public:
    //constructors
    Asistent();
    Asistent(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu, int experienta,
         const std::map<std::string, std::vector<std::pair<int,int>>> &program, const std::string &sectie, const std::vector<std::string> &proceduri_efectuate);
    //copy constructor
    Asistent(const Asistent &a);

    //operators
    Asistent& operator=(const Asistent &a);
    friend std::istream& operator>>(std::istream &in, Asistent &a);
    friend std::ostream& operator<<(std::ostream &out,const Asistent &a);

    //methods
    void calculeazaBonus() override;
    void addProcedura(const std::string &procedura);
    static void administrareTratament(const std::vector<Programare> &programari, int id_pacient);

    //destructor
    ~Asistent() override = default;
};


#endif //ASISTENT_H
