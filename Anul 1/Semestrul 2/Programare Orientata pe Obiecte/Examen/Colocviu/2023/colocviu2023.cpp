#include<iostream>
#include<string>
#include<vector>
#include<math.h>

class Unealta{
  private:
    static std::string serie;
    static int numar_serie;
    std::vector<std::string> culoare;

  public:
    Unealta(const std::string &serie,int numar_serie,std::vector<std::string> culoare){
      this->serie=serie;
      this->numar_serie=numar_serie;
      this->culoare=culoare;
    }
    virtual float timp_dezapezire(float suprafata_curatata)=0;
    virtual float consum_energie(float suprafata_curatata)=0;

};

class Lopeti:public Unealta{
  private:
    int suprafata;
    int capacitate;

  public:
    Lopeti(const std::string &serie,int numar_serie,std::vector<std::string> culoare,int suprafta,int capacitate):Unealta(serie,numar_serie,culoare){
      this->suprafata=suprafata;
      this->capacitate=capacitate;
    }
    float timp_dezapezire(float suprafata_curatata){
      return suprafata_curatata/std::sqrt(this->suprafata);
    }
    float consum_energie(float suprafata_curatata){
      return std::pow(suprafata_curatata,2)*this->capacitate;
    }
  };

class Drone:public Unealta{
private:
  int altitudine;
  int nr_motoare;

public:
  Drone(const std::string &serie,int numar_serie,std::vector<std::string> culoare, int altitudine,int nr_motoare):Unealta(serie,numar_serie,culoare){
    this->altitudine=altitudine;
    this->nr_motoare=nr_motoare;
  }
  float timp_dezapezire(float suprafata_curatata){
    return std::log(suprafata_curatata)*std::tanh(this->altitudine);
  }
  float consum_energie(float suprafata_curatata){
    return suprafata_curatata*std::pow(nr_motoare,3);
  }
};

class UneltePrototip:public Unealta{
private:
  int atribut_1;
  int atribut_2;

public:
  UneltePrototip(const std::string &serie,int numar_serie,std::vector<std::string> culoare, int atribut_1,int atribut_2):Unealta(serie,numar_serie,culoare){
    this->atribut_1=atribut_1;
    this->atribut_2=atribut_2;
  }
  float timp_dezapezire(float suprafata_curatata){
    return std::log(suprafata_curatata)*std::tanh(this->atribut_1);
  }
  float consum_energie(float suprafata_curatata){
    return suprafata_curatata*std::pow(this->atribut_2,2);
  }
};

class Echipa{
  private:
    std::string nume;
    std::string motto;
    std::vector<Unealta>unelte;

  public:
  Echipa(const std::string &nume, const std::string &motto, std::vector<Unealta>unelte){
    this->nume=nume;
    this->motto=motto;
  }
};

int main(){
  return 0;
}