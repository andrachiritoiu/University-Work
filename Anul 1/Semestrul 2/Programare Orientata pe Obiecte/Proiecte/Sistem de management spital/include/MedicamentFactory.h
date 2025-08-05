#ifndef MEDICAMENTFACTORY_H
#define MEDICAMENTFACTORY_H
#include<memory>
#include "Medicament.h"

//design pattern Factory(creational)
class MedicamentFactory {
  public:
    static std::shared_ptr<Medicament> antibiotic_pastila();
    static std::shared_ptr<Medicament> antibiotic_injectabil();
    static std::shared_ptr<Medicament> analgezic_pastila();
    static std::shared_ptr<Medicament> analgezic_sirop();
    static std::shared_ptr<Medicament> analgezic_injectabil();
    static std::shared_ptr<Medicament> antiinflamator_pastila();
    static std::shared_ptr<Medicament> antiinflamator_crema();
};

#endif //MEDICAMENTFACTORY_H
