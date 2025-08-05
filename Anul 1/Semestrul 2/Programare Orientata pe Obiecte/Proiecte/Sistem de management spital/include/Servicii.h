#ifndef SERVICII_H
#define SERVICII_H
#include<string>
#include<memory>
#include "Pacient.h"

class Servicii {
protected:
  std::string nume_serviciu;
  std::shared_ptr<Pacient>pacient;

public:
  //constructors
  Servicii()=default;
  explicit Servicii(std::shared_ptr<Pacient>pacient);
  Servicii(const std::string &nume_serviciu, std::shared_ptr<Pacient>pacient);

  //methods
  virtual void executa() =0;

  //destructor
  virtual ~Servicii()=default;
};



#endif //SERVICII_H
