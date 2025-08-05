#ifndef MEDIC_H
#define MEDIC_H
#include<string>
#include<map>
#include<memory>
#include "PersonalSpital.h"
#include "Pacient.h"

class Medic: public PersonalSpital {
private:
  std::string specializare;
  std::map<int, std::shared_ptr<Pacient>>pacienti;//dictionar cu cheia id_pacient

public:
    //constructors
    Medic();
    Medic(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu, int experienta, const std::map<std::string, std::vector<std::pair<int,int>>> &program,
        const std::string &specializare, std::map<int, std::shared_ptr<Pacient>> pacienti);
    //copy constructor
    Medic(const Medic &m);

    //getters
    [[nodiscard]] std::string getSpecializare() const;

    //operators
    Medic& operator=(const Medic &m);
    friend std::istream& operator>>(std::istream &in,  Medic &m);
    friend std::ostream& operator<<(std::ostream &out, const  Medic &m);

    //methods
    void adaugaPacient(const std::shared_ptr<Pacient>& p);
    void calculeazaBonus() override;


    //destructor
    ~Medic() override = default;

};

#endif //MEDIC_H
