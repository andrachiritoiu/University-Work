#ifndef RETETA_H
#define RETETA_H
#include<string>
#include<vector>
#include<memory>
#include "Medicament.h"

template<typename T>
class Reteta{
    private:
        std::string nume_pacient;
        std::vector<std::pair<std::shared_ptr<Medicament>,T>> medicamente;

    public:
      //constructors
      Reteta()=default;
      Reteta(const std::string &nume_pacient,const std::vector<std::pair<std::shared_ptr<Medicament>,T>> &medicamente);

      //methods
      void adaugaMedicament(std::shared_ptr<Medicament> medicament, T info);

      //operator
      //trebuie declarat in header pt template pt ca nu este instatiat corect de compliator la likare
      friend std::ostream& operator<<(std::ostream& out, const Reteta<T>& reteta) {
          for (const auto &pereche:reteta.medicamente) {
              out<<"Medicament: "<<pereche.first->getNume()
                 <<", Pret: "<<pereche.first->getPret()
                 <<", Substanta activa: "<<pereche.first->getSubstantaActiva()
                 << ", Doza: "<<pereche.second<<"\n";
          }
          return out;
      }

};

//constructor
template<typename T>
Reteta<T>::Reteta(const std::string &nume_pacient,const std::vector<std::pair<std::shared_ptr<Medicament>,T>> &medicamente){
  this->nume_pacient=nume_pacient;
  this->medicamente=medicamente;
}
 //methods
template<typename T>
void Reteta<T>::adaugaMedicament(std::shared_ptr<Medicament> medicament, T info){
    this->medicamente.push_back(std::make_pair(medicament,info));
}

#endif //RETETA_H
