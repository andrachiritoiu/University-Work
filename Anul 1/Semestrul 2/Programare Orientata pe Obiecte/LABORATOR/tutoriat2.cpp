#include<iostream>
#include<string>
#include<cstring>

using namespace std;

class Calculator{
private:
  string procesor;
  bool placa_video;
  int ram;
  char* nume;
  //static-sunt toate comune clasei; se creeaza in acelasi timp cu clasa
  //o variabila a intregii clase
  //poate fi si o metoda
  //daca avem o clasa fara variabile,pot sa fac le fac pe toate static ca sa le apelez(fara sa mai instantiez un obiect)
  //ex: ClassName::function();
  static int counter_id;
  const int id;
  char* versiune;

public:
  //Constructori
  //overload la o functie-supraincarcarea functiei(mai multe metode cu acelasi nume)
    Calculator();
    Calculator(string procesor, bool placa_video, int ram, char* versiune);
    //se pot face constructori si cu mai putini param
    Calculator(string procesor);
    //constructor de copiere
    Calculator(const Calculator& obj);

    //destructor -se apleaza automat cand trebuie eliberata memoria alocata dinamic
    ~Calculator();

  //Metode
  //getter
  int getId()const{return this->id;}
  int getRam()const;

  //Funcțiile statice nu pot accesa direct membri non-statice ale clasei, deoarece nu au un obiect specific pe care să-l folosească
  //Ele pot accesa doar membri statici ai clasei

  // static void functie() {
  //   counter_id=10;
  //  cout<<counter_id<<endl;
  // }

  //operatori
  //Returnează o referință (Calculator&) către obiectul curent(*this) =>permite ca obiectul sa fie modificat fara sa se creeze copii inutile
  //perimite atribuiri in lant:Calculator a, b, c;
  //                            a=b=c; // Echivalent cu: a = (b = c);

  Calculator& operator= (const Calculator& obj);

  //Calculator fara & - ca nu se modifica
  Calculator operator+ (const Calculator& obj);
  };

//este mai usor de citit codul daca functiile sunt in afara clasei
int Calculator::getRam()const{return this->ram;}

//construcitr fara param
Calculator::Calculator():id(counter_id++) {
  this->procesor="unknown";
  this->placa_video=true;
}

//constructor cu param
//:id-lista de initializare
Calculator::Calculator(string procesor,bool placa_video,int ram, char* versiune):id(counter_id++)  {
  this->versiune=new char[strlen("default")+1]; //cuv random="default"
  strcpy(this->versiune,"default");

  this->procesor=procesor;
  this->placa_video=placa_video;
  this->ram=ram;
}

//construcotr de copiere
//Calcualator(Calculator obj)-fara referinta face o copie(ocupa mai multa memorie)
//const- sa nu schimbe valoarea obiectului original

Calculator::Calculator(const Calculator &obj):id(counter_id++) {
  this->procesor=obj.procesor;
  this->placa_video=obj.placa_video;
  this->ram=obj.ram;
}

//operator
Calculator &Calculator::operator=(const Calculator &obj) {
  this->versiune=new char[strlen(obj.versiune)+1]; //cuv random=default
  strcpy(this->versiune,"default");

  this->procesor=obj.procesor;
  this->placa_video=obj.placa_video;
  this->ram=obj.ram;

 //gresit-are un pointer la o spatiu din memorie dezalocat
  //this->versiune=obj.versiune;

  if (this->versiune!=nullptr) {
    delete [] this->versiune;
    this->versiune=nullptr;
  }
  this->versiune=new char[strlen(obj.versiune)+1];
  strcpy(this->versiune,"default");

  return *this;
}

Calculator::~Calculator() {
  if (this->versiune!= nullptr) {
    delete[] this->versiune;
    this->versiune=nullptr;
  }
}

Calculator Calculator::operator+(const Calculator &obj) {
  Calculator temp=*this;

  temp.ram+=obj.ram;
  temp.placa_video+=obj.placa_video;

  return temp;
}


//static-ul
int Calculator::counter_id=1;

int main(){

    // Calculator a,b,c;
   // cout<<a.getId()<<b.getId()<<c.getId()<<endl;

  Calculator x;
  //Calculator b=a; --copy constructor
  //sau: Calculator b(a);
  //x=a --operator egal

  //1.Copy Constructor (Copy Constructor) → creează un nou obiect prin copierea datelor dintr-un alt obiect existent.
  //2.Operatorul de Atribuire (=) → actualizează un obiect deja existent, copiind valorile din alt obiect.



  //Calculator a("proc",0,10000,"noua");

  //cout<<x<<endl;
  cout<<(x+x).getRam();

  return 0;
}


//dinamic-pe heap
//static-pe stiva

//-> = este un pointer
//this->ram=(*temp).ram

//  BONUS

//Principii OOP:
//-incapsularea
//-mostenirea
//-polimorfismul
//-abstractizarea
//  virtual void deseneaza() = 0;   -O funcție pur virtuală este o funcție definită într-o clasă de bază, dar care nu are implementare acolo.Clasa care conține cel puțin o funcție pur virtuală devine o clasă abstractă
// clase derivate sunt obligate sa suprascrie(override) si ele acesta functie, altfel devin si ele abstractie

// //Clasă abstractă
// class Forma {
// public:
//   virtual void deseneaza() = 0;  // Funcție pur virtuală (obligatoriu de implementat în clasele derivate)
// };
//
// // Clasă derivată care implementează funcția
// class Cerc : public Forma {
// public:
//   void deseneaza() override {
//     std::cout << "Desenez un cerc\n";
//   }
// };

//Diferența dintre override și overload în C++
//- Override (suprascrierea unei funcții) → se aplică în moștenire, când o clasă derivată înlocuiește o metodă virtuală din clasa de bază.
//- Overload (supraincărcarea unei funcții) → permite definirea mai multor funcții cu același nume, dar cu semnături diferite (diferență în numărul sau tipurile parametrilor).