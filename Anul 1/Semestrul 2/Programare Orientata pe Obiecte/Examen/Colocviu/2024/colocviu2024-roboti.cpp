#include<iostream>
#include<vector>
#include<memory>
#include<algorithm>
using namespace std;

class Stream{
public:
  virtual ~Stream()=default;
  friend std::istream& operator>>(std::istream &in, Stream &obj);
  friend std::ostream& operator<<(std::ostream &out,const Stream &obj);
  virtual void citeste(std::istream &in)=0;
  virtual void afiseaza(std::ostream &out)const=0;
};

std::istream& operator>>(std::istream &in, Stream &obj){
  obj.citeste(in);
  return in;
}
std::ostream& operator<<(std::ostream &out,const Stream &obj){
  obj.afiseaza(out);
  return out;
}

class Obiect:public Stream{
protected:
  static int contor;
  int id;
public:
  Obiect();

  void citeste(std::istream &in) override;
  void afiseaza(std::ostream &out) const override;
  virtual void upgrade()=0;
  virtual int costUpgrade()=0;

  int getId() const;

  ~Obiect()=default;
};
int Obiect::contor=1;

Obiect::Obiect() {
  this->id=contor++;
}

void Obiect::citeste(std::istream &in) {}
void Obiect::afiseaza(std::ostream &out) const {}

int Obiect::getId() const {
  return id;
}


class ZidAparare:public Obiect{
private:
  int inaltime;
  int lungime;
  int grosime;
public:
  ZidAparare() = default;
  ZidAparare(int inaltime, int lungime, int grosime);
  ZidAparare(const ZidAparare &other);
  ZidAparare & operator=(const ZidAparare &other);

  void citeste(std::istream &in) override;
  void afiseaza(std::ostream &out) const override;
  void upgrade()override;
  int costUpgrade()override;

  int getinaltime() const;
  int getlungime() const;
  int getgrosime() const;
};

ZidAparare::ZidAparare(const ZidAparare &other)
    : Obiect(other),
      inaltime(other.inaltime),
      lungime(other.lungime),
      grosime(other.grosime) {
}
ZidAparare & ZidAparare::operator=(const ZidAparare &other) {
  if (this == &other)
    return *this;
  Obiect::operator =(other);
  inaltime = other.inaltime;
  lungime = other.lungime;
  grosime = other.grosime;
  return *this;
}
ZidAparare::ZidAparare(int inaltime, int lungime, int grosime): inaltime(inaltime),lungime(lungime),grosime(grosime) {}
void ZidAparare::citeste(std::istream &in) {
  cout<<"Inaltime: ";
  in>>inaltime;
  cout<<"Lungime: ";
  in>>lungime;
  cout<<"Grosime: ";
  in>>grosime;
}
void ZidAparare::afiseaza(std::ostream &out) const {
  out<<"Inaltime: "<<inaltime
     <<"Lungime: "<<lungime
     <<"Grosime: "<<grosime;
}
void ZidAparare::upgrade() {
  this->inaltime+=1;
  this->lungime+=1;
  this->grosime+=1;
}
int ZidAparare::costUpgrade(){
  return 100*lungime*inaltime*grosime;
}


int ZidAparare::getinaltime() const {
  return inaltime;
}
int ZidAparare::getlungime() const {
  return lungime;
}
int ZidAparare::getgrosime() const {
  return grosime;
}


class Turnuri:public Obiect {
private:
  int putere_raza;
public:
  Turnuri()=default;
  Turnuri(int putere_raza);
  Turnuri(const Turnuri &other);
  Turnuri & operator=(const Turnuri &other);

  void citeste(std::istream &in) override;
  void afiseaza(std::ostream &out) const override;
  void upgrade()override;
  int costUpgrade()override;

  ~Turnuri()override=default;
};

Turnuri::Turnuri(int putere_raza):putere_raza(putere_raza) {}
Turnuri::Turnuri(const Turnuri &other): Obiect(other),putere_raza(other.putere_raza) {}
Turnuri & Turnuri::operator=(const Turnuri &other) {
  if (this == &other)
    return *this;
  Obiect::operator =(other);
  putere_raza = other.putere_raza;
  return *this;
}
void Turnuri::citeste(std::istream &in) {
  //
}
void Turnuri::afiseaza(std::ostream &out) const {
  Obiect::afiseaza(out);
  out<<"Putere raza: "<<putere_raza;
}
void Turnuri::upgrade() {
  this->putere_raza+=500;
}
int Turnuri::costUpgrade(){
  return 500*putere_raza;
}


class Roboti:public Obiect {
protected:
  int damage;
  int nivel;
  int viata;
public:
  Roboti() = default;
  Roboti(int damage, int nivel, int viata);
  Roboti(const Roboti &other);

  Roboti & operator=(const Roboti &other);

  void citeste(std::istream &in) override;
  void afiseaza(std::ostream &out) const override;
  void upgrade()override;
  int costUpgrade()override;

  int damage1() const;
  int nivel1() const;
  int viata1() const;

  ~Roboti()override=default;

};
 Roboti::Roboti(int damage, int nivel, int viata): damage(damage),nivel(nivel),viata(viata) {}
 Roboti::Roboti (const Roboti &other): Obiect(other),damage(other.damage),nivel(other.nivel),viata(other.viata) {}

Roboti&  Roboti::operator=(const Roboti &other) {
   if (this == &other)
     return *this;
   Obiect::operator =(other);
   damage = other.damage;
   nivel = other.nivel;
   viata = other.viata;
   return *this;
 }

void Roboti::citeste(std::istream &in) {
  //
}
void Roboti::afiseaza(std::ostream &out) const {
  //
}
void Roboti::upgrade() {}
int Roboti::costUpgrade() {return 0;}


int Roboti::damage1() const {
  return damage;
}
int Roboti::nivel1() const {
  return nivel;
}
int Roboti::viata1() const {
  return viata;
}


class RobotTerestru:public Roboti {
 private:
   int nr_gloante;
   bool scut;
 public:
   RobotTerestru() = default;
   RobotTerestru(int damage, int nivel, int viata, int nr_gloante, bool scut);
   RobotTerestru(const RobotTerestru &other);
   RobotTerestru(int damage, int nivel, int viata, int nr_gloante);

   void citeste(std::istream &in) override;
   void afiseaza(std::ostream &out) const override;
   void upgrade()override;
   int costUpgrade()override;

   RobotTerestru & operator=(const RobotTerestru &other);
   ~RobotTerestru()override=default;
};

RobotTerestru::RobotTerestru(int damage, int nivel, int viata, int nr_gloante, bool scut): Roboti(damage, nivel, viata),nr_gloante(nr_gloante),scut(scut) {}
RobotTerestru::RobotTerestru(const RobotTerestru &other)
     : Roboti(other),
       nr_gloante(other.nr_gloante),
       scut(other.scut) {
}
RobotTerestru::RobotTerestru(int damage, int nivel, int viata, int nr_gloante)
     : Roboti(damage, nivel, viata),
       nr_gloante(nr_gloante) {
}
RobotTerestru & RobotTerestru::operator=(const RobotTerestru &other) {
  if (this == &other)
    return *this;
  Roboti::operator =(other);
  nr_gloante = other.nr_gloante;
  scut = other.scut;
  return *this;
}
void RobotTerestru::citeste(std::istream &in) {
  //
}
void RobotTerestru::afiseaza(std::ostream &out)const{
  Obiect::afiseaza(out);
  out<<"Numar gloante: "<<nr_gloante
  <<"Scut: "<<scut;
}
void RobotTerestru::upgrade() {
  this->nr_gloante+=100;
  this->nivel+=1;
  this->damage+=50;
  if (nivel==5)this->scut=1;
  else this->scut=0;
  this->viata+=scut*50;
}
int RobotTerestru::costUpgrade() {
  return 10*nr_gloante;
}

class RobotAerian:public Roboti {
private:
  int autonomie;
public:
  RobotAerian() = default;
  RobotAerian(int damage, int nivel, int viata, int autonomie);
  RobotAerian(const RobotAerian &other);

  void citeste(std::istream &in) override;
  void afiseaza(std::ostream &out) const override;
  void upgrade()override;
  int costUpgrade()override;

  RobotAerian & operator=(const RobotAerian &other);
  ~RobotAerian()override=default;
};

RobotAerian::RobotAerian(int damage, int nivel, int viata, int autonomie): Roboti(damage, nivel, viata),autonomie(autonomie) {}
RobotAerian::RobotAerian(const RobotAerian &other)
     : Roboti(other),
       autonomie(other.autonomie) {
}
RobotAerian & RobotAerian::operator=(const RobotAerian &other) {
  if (this == &other)
    return *this;
  Roboti::operator =(other);
  autonomie=other.autonomie;
  return *this;
}

void RobotAerian::citeste(std::istream &in) {
  //
}
void RobotAerian::afiseaza(std::ostream &out)const{
  Obiect::afiseaza(out);
  out<<"Autonomie: "<<autonomie;
}
void RobotAerian::upgrade() {
  this->autonomie+=1;
  this->nivel+=1;
  this->damage+=25;
}
int RobotAerian::costUpgrade() {
  return 50*autonomie;
}


class Inventar {
private:
  Inventar() = default;
  Inventar(const Inventar &meniu) = delete;
  Inventar &operator=(const Inventar &meniu) = delete;
  static Inventar *instanta;
  int puncte=50000;
  const int puncte_vanzare=500;
  ~Inventar()=default;

  std::vector<std::shared_ptr<ZidAparare>>ziduri;
  std::vector<std::shared_ptr<Turnuri>>turnuri;
  std::vector<std::shared_ptr<Roboti>>roboti;
  std::vector<std::shared_ptr<Obiect>>obiecte;

public:
  static Inventar *getInstance();
  void ruleaza();
  void adaugaZid();
  void adaugaTurn();
  void adaugaRobotT();
  void adaugaRobotA();
  void upgradeZid(int id);
  void upgradeTurn(int id);
  void upgradeRobotT(int id);
  void upgradeRobotA(int id);
  std::shared_ptr<Obiect> getObiect(int id);
  void sortarecost();
  void vinde(int id);

};

Inventar* Inventar::getInstance() {
  if (instanta == nullptr)
    instanta = new Inventar();
  return instanta;
}
void Inventar::adaugaZid() {
  if (puncte<300) {
    throw std::runtime_error("Nu");
  }

  auto zid=std::make_shared<ZidAparare> (2,1,0.5);
  this->ziduri.push_back(zid);
  this->obiecte.push_back(zid);
  this->puncte-=300;
  cout<<"Zid adaugat";
}
void Inventar::adaugaTurn() {
  if (puncte<500) {
    throw std::runtime_error("Nu");
  }

  auto turn1=std::make_shared<Turnuri>(1000);
  this->turnuri.push_back(turn1);
  this->obiecte.push_back(turn1);
  this->puncte-=500;
  cout<<"Turn adaugat";

}
void Inventar::adaugaRobotT() {
  if (puncte<50) {
    throw std::runtime_error("Nu");
  }

  auto robot=std::make_shared<RobotTerestru>(100,1,100,500,4);
  this->roboti.push_back(robot);
  this->obiecte.push_back(robot);
  this->puncte-=50;
  cout<<"Robot terestru adaugat";
}
void Inventar::adaugaRobotA() {
  if (puncte<100) {
    throw std::runtime_error("Nu");
  }

  auto robot=std::make_shared<RobotAerian>(100,1,100,10);
  this->roboti.push_back(robot);
  this->obiecte.push_back(robot);
  this->puncte-=100;
  cout<<"Robot aerian adaugat";
}
void Inventar::upgradeZid(int id) {
  if (auto zid=dynamic_pointer_cast<ZidAparare>(getObiect(id))) {
    if (zid->costUpgrade()>this->puncte) {
      throw std::runtime_error("Insuficiente puncte");
    }
    zid->upgrade();
    cout<<"Da";
  }
  else throw std::runtime_error("Nu");
}

void Inventar::upgradeTurn(int id) {
  if (auto zid=dynamic_pointer_cast<Turnuri>(getObiect(id))) {
    if (zid->costUpgrade()>this->puncte) {
      throw std::runtime_error("Insuficiente puncte");
    }
    zid->upgrade();
    cout<<"Da";
  }
  else throw std::runtime_error("Nu");
}

void Inventar::upgradeRobotT(int id) {
  if (auto zid=dynamic_pointer_cast<RobotTerestru>(getObiect(id))) {
    if (zid->costUpgrade()>this->puncte) {
      throw std::runtime_error("Insuficiente puncte");
    }
    zid->upgrade();
    cout<<"Da";
  }
  else throw std::runtime_error("Nu");
}
void Inventar::upgradeRobotA(int id) {
  if (auto zid=dynamic_pointer_cast<RobotAerian>(getObiect(id))) {
    if (zid->costUpgrade()>this->puncte) {
      throw std::runtime_error("Insuficiente puncte");
    }
    zid->upgrade();
    cout<<"Da";
  }
  else throw std::runtime_error("Nu");
}

std::shared_ptr<Obiect> Inventar::getObiect(int id) {
  for (auto obiect:obiecte) {
    if (obiect->getId()==id)
      return obiect;
  }
  return 0;
}
void Inventar::sortarecost() {
  sort(obiecte.begin(),obiecte.end(),[](std::shared_ptr<Obiect> obj1, std::shared_ptr<Obiect> obj2){
    return obj1->costUpgrade()<obj2->costUpgrade();});
  for (auto obiect:obiecte) {
    cout<<obiect->getId()<<" "<<*obiect<<" "<<obiect->costUpgrade()<<"\n";
  }
}
void Inventar::vinde(int id) {
  if (getObiect(id)!=0) {
    puncte+=puncte_vanzare;
    obiecte.erase(obiecte.begin()+id-1);
  }
  else throw std::runtime_error("Nu");
}

void Inventar::ruleaza() {
  int op=-1;
  do {
    try {
      cout<<"\n1.Adauga zid\n";
      cout<<"2.Adauga turn\n";
      cout<<"3.Adauga robot terestru\n";
      cout<<"4.Adauga robot aerian\n";
      cout<<"5.Upgrade zid\n";
      cout<<"6.Upgrade turn\n";
      cout<<"7.Upgrade robotA\n";
      cout<<"8.Upgrade robotT\n";
      cout<<"9.Asisare elemente inventar\n";
      cout<<"10.Afisare roboti\n";
      cout<<"11.Sell\n";
      cout<<"12.Exit\n";
      cout<<"Alege: ";
      cin>>op;

      switch (op) {
        case 1: {
          adaugaZid();
          break;
        }
        case 2: {
          adaugaTurn();
          break;
        }
        case 3: {
          adaugaRobotA();
          break;
        }

        case 4: {
          adaugaRobotT();
          break;
        }
        case 5: {
          cout<<"ID: ";
          int id;
          cin>>id;
          upgradeZid(id);
          break;
        }
        case 6: {
          cout<<"ID: ";
          int id;
          cin>>id;
          upgradeTurn(id);
          break;
        }
        case 7: {
          cout<<"ID: ";
          int id;
          cin>>id;
          upgradeRobotA(id);
          break;
        }
        case 8: {
          cout<<"ID: ";
          int id;
          cin>>id;
          upgradeRobotT(id);
          break;
        }
        case 9: {
          sortarecost();
          break;
        }
        case 10: {
          for (auto robot:roboti) {
            cout<<*robot<<"\n";
          }
          break;
        }
        case 11: {
          cout<<"Vinde ID: ";
          int id;
          cin>>id;
          vinde(id);
          break;
        }
        case 12: {
          break;
        }

      }

    }
    catch (const exception &e) {
      cout<<"Eroare: "<<e.what();
    }

  }while (op!=0);
}

Inventar* Inventar::instanta=nullptr;

int main(){
  Inventar::getInstance()->ruleaza();
}
