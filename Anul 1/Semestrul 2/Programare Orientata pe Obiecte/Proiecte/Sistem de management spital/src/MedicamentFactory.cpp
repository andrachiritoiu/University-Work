#include "MedicamentFactory.h"

std::shared_ptr<Medicament> MedicamentFactory :: antibiotic_pastila() {
    return std::make_shared<Medicament>("Amoxicilina",35,"amoxicilina");
}
std::shared_ptr<Medicament> MedicamentFactory :: antibiotic_injectabil() {
    return std::make_shared<Medicament>("Augumentin",50,"acid clavulanic");
}
std::shared_ptr<Medicament> MedicamentFactory :: analgezic_pastila() {
    return std::make_shared<Medicament>("Paracetamol",10,"paracetamol");
}
std::shared_ptr<Medicament> MedicamentFactory :: analgezic_sirop() {
    return std::make_shared<Medicament>("Panadol",30,"paracetamol");
}
std::shared_ptr<Medicament> MedicamentFactory :: analgezic_injectabil() {
    return std::make_shared<Medicament>("Algocalmin",20,"metamizol");
}
std::shared_ptr<Medicament> MedicamentFactory :: antiinflamator_pastila() {
    return std::make_shared<Medicament>("Ibuprofen",12,"ibuprofen");
}
std::shared_ptr<Medicament> MedicamentFactory :: antiinflamator_crema() {
    return std::make_shared<Medicament>("Voltaren",45,"diclofenac");
}


