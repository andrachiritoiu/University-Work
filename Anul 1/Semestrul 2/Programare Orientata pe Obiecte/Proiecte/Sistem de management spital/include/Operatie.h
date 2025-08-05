#ifndef OPERATIE_H
#define OPERATIE_H
#include "Servicii.h"

class Operatie:public Servicii{
  private:
    int sala_operatie{};
    std::string tip_anestezie;
    int timp_recuperare{};

  public:
  //constructor
  explicit Operatie(const std::shared_ptr<Pacient> &pacient);
  Operatie(const std::string &nume_serviciu, const std::shared_ptr<Pacient> &pacient,int sala_operatie,
    std::string tip_anestezie, int timp_recuperare);

  //methods
  void executa()override;

  //destructor
  ~Operatie()override = default;

};



#endif //OPERATIE_H
