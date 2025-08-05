#include<iostream>
#include<string>
#include<vector>
#include<memory>

class Obiect {
protected:
  static int id;
  std::string nume;
  std::string data;
  int era;
  int pret_initial;

public:
  Obiect(const std::string &nume, const std::string &data, int era, int pret_initial);
  virtual void colectabilitate()=0;
  virtual ~Obiect();

  std::string getNume() const;
  std::string getData() const;
  int getEra() const;
  int getPretInitial() const;
};

class Artefact_istoric:public Obiect {
private:
  std::vector<std::string>persoane_asociate;

public:
  Artefact_istoric(const std::string &nume, const std::string &data, int era, int pret_initial,std::vector<std::string>persoane_asociate);
  void colectabilitate()override;

};

class Artefact_artistic:public Obiect {
private:
  std::string tip;
  std::string material;
public:
  Artefact_artistic(const std::string &nume, const std::string &data, int era, int pret_initial,const std::string &tip,const std::string &material);
  void colectabilitate()override;
};

class Artefact_pretios:public Obiect {
private:
  std::string designer;
  int greutate;
public:
  Artefact_pretios(const std::string &nume, const std::string &data, int era, int pret_initial, const std::string &designer, int greutate);
  void colectabilitate()override;
};


class Entitate {
protected:
  int numar_unic;
  int buget;
  int pas_de_licitare;
  int val_comf;
  std::shared_ptr<Obiect>obiect_preferat;
  std::shared_ptr<Obiect>obiect_ignorat;


public:
  Entitate( int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat);
};

class Persoana_fizica: public Entitate {
private:
  std::string nume;
public:
  Persoana_fizica(int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat, const std::string &nume);
};

class Persoana_juridica: public Entitate {
private:
  std::string nume_organizatie;
  std::vector<std::shared_ptr<Persoana_fizica>> persoane_fizice;

public:
  Persoana_juridica(int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat, const std::string &nume_organizatie,std::vector<std::shared_ptr<Persoana_fizica>> persoane_fizice);
};

class Meniu {
private:
  Meniu()=default;

public:
  Meniu(const Meniu&) = delete;
  Meniu& operator=(const Meniu&) = delete;
  static Meniu& get_menu() {
    static Meniu menu;
    return menu;
  }
  void afiseazaMeniu();
};





Obiect::Obiect(const std::string &nume, const std::string &data, int era, int pret_initial)
 {this->nume=nume;
  this->data=data;
  this->era=era;
  this->pret_initial=pret_initial;
  id++;
}
std::string Obiect::getNume() const {
  return this->nume;
}
std::string  Obiect::getData() const {
  return this->data;
}
int  Obiect::getEra() const {
  return this->era;
}
int  Obiect::getPretInitial() const {
  return this->pret_initial;
}

Artefact_istoric::Artefact_istoric(const std::string &nume, const std::string &data, int era, int pret_initial,std::vector<std::string> persoane_asociate):Obiect(nume,data,era,pret_initial) {
  this->persoane_asociate=persoane_asociate;
}
void Artefact_istoric::colectabilitate() {
  std::cout<<"Grad de colectibilitate: ";
  if (this->persoane_asociate.size()>=3) std::cout<<"ridicat";
  else std::cout<<"scazut";
}

Artefact_artistic::Artefact_artistic(const std::string &nume, const std::string &data, int era, int pret_initial,const std::string &tip,const std::string &material):Obiect(nume,data,era,pret_initial){
  this->tip=tip;
  this->material=material;
}
void Artefact_artistic::colectabilitate() {
  std::cout<<"Grad de colectibilitate: ";
  if (this->material=="ulei" || this->material=="marmura" ) std::cout<<"ridicat";
  else std::cout<<"scazut";
}

Artefact_pretios::Artefact_pretios(const std::string &nume, const std::string &data, int era, int pret_initial, const std::string &designer, int greutate):Obiect(nume,data,era,pret_initial) {
  this->designer=designer;
  this->greutate=greutate;
}
void Artefact_pretios::colectabilitate() {
  std::cout<<"Grad de colectibilitate: ";
  if (this->greutate>250 && this->designer!="") std::cout<<"ridicat";
  else std::cout<<"scazut";
}

Entitate::Entitate( int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat) {
  this->numar_unic=numar_unic;
  this->pas_de_licitare=pas_de_licitare;
  this->val_comf=val_comf;
  this->obiect_preferat=obiect_preferat;
  this->obiect_ignorat=obiect_ignorat;
}
Persoana_fizica::Persoana_fizica(int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat, const std::string &nume):Entitate(numar_unic,buget, pas_de_licitare,val_comf,obiect_preferat, obiect_ignorat){
  this->nume=nume;
}
Persoana_juridica:: Persoana_juridica(int numar_unic, int buget, int pas_de_licitare, int val_comf, std::shared_ptr<Obiect>obiect_preferat, std::shared_ptr<Obiect>obiect_ignorat, const std::string &nume_organizatie,std::vector<std::shared_ptr<Persoana_fizica>> persoane_fizice):Entitate(numar_unic,buget, pas_de_licitare,val_comf,obiect_preferat, obiect_ignorat){
  this->nume_organizatie=nume_organizatie;
  this->persoane_fizice=persoane_fizice;
}

void Meniu::afiseazaMeniu() {
  int op;

do {
  std::cout<<"1. Adauga artefact\n";
  std::cout<<"2. Adauga participant\n";
  std::cout<<"3. Afiseaza artefacte\n";
  std::cout<<"4. Simuleaza licitatie\n";
  std::cout<<"5. Iesire\n";

  std::cout<<"Alege optiune";
  std::cin>>op;

  switch (op) {
    case 1:
      std::vector<std::shared_ptr<Entitate>>participanti;
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
  }
}while (op!=5);
}


int Obiect::id=0;
int main(){
  auto& x = Meniu::get_menu();
  x.afiseazaMeniu();
}