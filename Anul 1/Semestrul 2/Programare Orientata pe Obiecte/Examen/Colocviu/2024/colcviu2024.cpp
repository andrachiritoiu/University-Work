#include<iostream>

class Probe{
private:
public:
  virtual int estimare_valoare()=0;
};

class Sprint: public Probe{
  private:
    int timp_secunde;

  public:
    Sprint(int timp_secunde);
    int estimare_valoare()override;
  };


class Cros: public Probe{
private:
  int timp_minute;

public:
  Cros(int timp_minute);
  int estimare_valoare()override;
};


class Semi_maraton: public Probe{
private:
  int distanta_km;

public:
  Semi_maraton(int distanta_km);
  int estimare_valoare()override;
};

class Maraton: public Probe{
private:
  int distanta_km;

public:
  Maraton(int distanta_km);
  int estimare_valoare()override;
};


class Candidat{
  private:
    std::string nume;
    std::string prenume;
    int data_nasterii;
    Probe *proba;

  public:
    Candidat()=default;

    Candidat(const std::string &nume,const std::string &prenume, int data_nasterii, Probe *proba);
    friend std::istream& operator>>(std::istream &in, Candidat &p);
    friend std::ostream& operator<<(std::ostream &out, const Candidat &p);
};

Sprint::Sprint(int timp_secunde){
  this->timp_secunde=timp_secunde;
}
int Sprint::estimare_valoare(){
  if(this->timp_secunde<10) return 10;
  else return 90/this->timp_secunde;
}

Cros::Cros(int timp_minute){
  this->timp_minute=timp_minute;
}
int Cros::estimare_valoare(){
  if(this->timp_minute<30) return 10;
  else return 120/this->timp_minute;
}


Semi_maraton::Semi_maraton(int distanta_km){
  this->distanta_km=distanta_km;
  }
int Semi_maraton::estimare_valoare(){
  if(this->distanta_km>50) return 10;
  else return this->distanta_km/5;
}


Maraton::Maraton(int distanta_km){
  this->distanta_km=distanta_km;
}
int Maraton::estimare_valoare(){
  if(this->distanta_km>50) return 10;
  else return this->distanta_km/5;
}


Candidat::Candidat(const std::string &nume,const std::string &prenume, int data_nasterii, Probe *proba){
  this->nume=nume;
  this->prenume=prenume;
  this->data_nasterii=data_nasterii;
  this->proba=proba;
}

std::istream& operator>>(std::istream &in, Candidat &p) {
  std::cout<<"Numele: ";
  in>>p.nume;
  std::cout<<"Prenumele: ";
  in>>p.prenume;
  std::cout<<"Data nastere: ";
  in>>p.data_nasterii;
  // std::cout<<"Proba: ";
  // in>>p.proba;
  return in;
}

std::ostream& operator<<(std::ostream &out, const Candidat &p) {
  out <<"Nume: "<<p.nume<<"\n"
      <<"Prenume: "<<p.prenume<<"\n"
      <<"Data nastere: "<<p.data_nasterii<<"\n";
      // <<"Proba: "<<p.proba<<"\n";
  return out;
}

int main(){
  Candidat candidat;

  }