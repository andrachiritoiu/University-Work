#include "Servicii.h"

//constructors
Servicii::Servicii(std::shared_ptr<Pacient>pacient) {
  this->pacient=std::move(pacient);
}

Servicii::Servicii(const std::string &nume_serviciu,std::shared_ptr<Pacient>pacient){
  this->nume_serviciu=nume_serviciu;
  this->pacient=std::move(pacient);
}

