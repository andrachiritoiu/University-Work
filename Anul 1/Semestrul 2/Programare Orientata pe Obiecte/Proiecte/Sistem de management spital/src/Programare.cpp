#include "Programare.h"

//constructors
Programare::Programare(const std::string& data, int ora_inceput, int ora_sfarsit, const std::shared_ptr<Pacient> &pacient, const std::shared_ptr<Medic> &medic,const std::shared_ptr<Consultatie> &consultatie){
  this->data=data;
  this->ora_inceput=ora_inceput;
  this->ora_sfarsit=ora_sfarsit;
  this->pacient=pacient;
  this->medic=medic;
  this->consultatie=consultatie;
}

//getters
std::string Programare::getData() const {
  return this->data;
}
int Programare::getOraInceput() const {
  return this->ora_inceput;
}
int Programare::getOraSfarsit() const {
  return this->ora_sfarsit;
}
const std::shared_ptr<Pacient>& Programare::getPacient() const {
  return this->pacient;
}
const std::shared_ptr<Medic>& Programare::getMedic() const {
  return this->medic;
}
const std::shared_ptr<Consultatie>& Programare::getConsultatie() const {
  return this->consultatie;
}


