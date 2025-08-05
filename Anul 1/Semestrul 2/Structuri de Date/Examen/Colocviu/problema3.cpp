#include<iostream>
#include <unordered_map>
#include<string>

using namespace std;

int main(){
  int n;
  unordered_map<string, unordered_map<string,int>> arhiva;
  string op;

  cout<<"n=";
  cin>>n;
  for (int i=0;i<n;i++) {
    cout<<"\nOptiune: ";
    cin>>op;

    if (op=="ADD") {
      string T,C;
      int K;
      cout<<"Titlu: ";
      cin>>T;
      cout<<"Categoria: ";
      cin>>C;
      if (C!="ISTORIE" || C!="MAGIE" || C!="POEZIE")
      cout<<"Cantitatea: ";
      cin>>K;

      //daca a fost gasit
      auto carte=arhiva.find(T);
      if (carte!=arhiva.end()) {
        // cout<<carte->first<<"\n";
        for (auto &p:carte->second) {
          if (p.first==C) {
            p.second+=K;
          }
        }

      }
      else {
        arhiva[T]={};
        arhiva[T][C]=K;
      }
    }

    else if (op=="REMOVE") {
      string T;
      int K;
      cout<<"Titlu: ";
      cin>>T;
      cout<<"Cantitatea: ";
      cin>>K;

      auto carte=arhiva.find(T);
      if (carte!=arhiva.end()) {
        for (auto &p:carte->second) {
          p.second-=K;
        }
      }

      bool sterge=false;
      for (auto &p:carte->second) {
        if (p.second<=0) {
          sterge=true;
        }
      }

      if (sterge) {
        arhiva.erase(T);
      }
    }

    else if (op=="CHECK") {
      string T,C;
      int K;
      cout<<"Titlu: ";
      cin>>T;

      auto carte=arhiva.find(T);
      if (carte!=arhiva.end()) {
        for (auto p:carte->second) {
          C=p.first;
        }
        cout<<C;
      }
      else cout<<"NU";
    }

    else if (op=="COUNT") {
      int nr=0;
      string C;
      cout<<"Categoria: ";
      cin>>C;
      for (auto titlu:arhiva) {
        for (auto p:titlu.second) {
          if (p.first==C)
            nr+=p.second;
          }
        }
      cout<<nr;
      }

  }

  return 0;
}