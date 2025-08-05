#ifndef PERSONALSPITAL_H
#define PERSONALSPITAL_H
#include<string>
#include<vector>
#include<map>
#include "Persoana.h"
#include "Medicament.h"

class PersonalSpital: public Persoana {
protected:
  int id_angajat;
  static int next_id;
  int salariu;
  int experienta;
  //{ziua:[(ora_inceput,ora_sfarsit),.....], ..... }
  std::map<std::string, std::vector<std::pair<int,int>>> program;

public:
  //constructors
  PersonalSpital();
  PersonalSpital(const std::string &nume, const std::string &prenume, const std::string &CNP, int salariu,
      int experienta, const std::map<std::string, std::vector<std::pair<int,int>>> &program);
  //copy constructor
  explicit PersonalSpital(const PersonalSpital &p);

  //getters
  [[nodiscard]] int getId() const;
  [[nodiscard]] std::map<std::string, std::vector<std::pair<int,int>>> getProgram() const;

  //operators
  PersonalSpital& operator=(const PersonalSpital &p);
  friend std::istream& operator>>(std::istream &in, PersonalSpital &p);
  friend std::ostream& operator<<(std::ostream &out, const PersonalSpital &p);

  //methods
  virtual void calculeazaBonus() = 0 ;

  //destructor
  ~PersonalSpital() override=default;
};



#endif //PERSONALSPITAL_H
