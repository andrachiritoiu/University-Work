/* const int f() - functia returneaza ceva care e o constanta
int f(const int i)- parametrul e o constanta
int f(int i)const{} - nu modifica atributele obiectului

int* p==int *p


b=5
int* const a=&b;//pointerul este constanta(adresa),dar var b poate fi modificata
int* c=&b;

functiaMeaF - camel
functia_mea_f - snake
 */

#include <iostream>
using namespace std;

//1
//class Player{
//  int x,y;
//  public:
//    void sety(int a){
//      this->y=a;
//      }
//      void setx(int a) const{
//        //this->x=a;
//        std::cout<<a;
//        }

//int main() {
//  int* c= &b,a;
//  b=10;
//  cout<<*a<<'\n';
//
//  Player x1;
//  x1.setx(5);
//  x1.sety(10);
//  return 0;

//2
//int const
//const int a=5;
//int const* b=&a;
//const int c=7;
//b=&c;
//cout<<*b;

////un pointer constant
//int b=5;
//int c=7;
//int * const a = &c;//fac o constanta si ii dau valoarea atunci
////a=&b;  Eroare
//cout<<*a<<"\n";
////a=&c;
////cout<<*a;
//}
//
////un pointer constant catre o constanta int
//const int a=10;
//int * const b = &a;

//const inaite de steluta (const *)- tine un pointer catre un int constant
//const dupa steluta(* const) - un pointer constant


//const-eraore de compliare in principiu

int& f(int& a, int b){
  return a;
  }
  //ia a ul dinainte
  //il modifica pe a prin refereinta: f(a,b)=20 =>a=20

int main() {
  int a=5,b=2;
  cout<<f(a,b);
  }

  //a=b=c toate iau valoarea lui c
