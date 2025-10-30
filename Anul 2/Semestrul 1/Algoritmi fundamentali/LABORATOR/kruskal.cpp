//Implementați algoritmul lui Kruskal pentru determinarea unui arbore parţial de cost minim al unui graf conex
// ponderat cu n vârfuri și m muchii. Graful se va citi din fişierul grafpond.in. O(m log n)  (+ și versiunea O(n2 + m log n))

#include<iostream>
#include<fstream>
#include<vector>
#include<algorithm>
using namespace std;

int i_curent,j_curent,cost_curent;

struct Muchie{
  int i,j,cost;
};

void citireVal(ifstream &f, vector<Muchie> &listaMuchii){
  while(f>>i_curent>>j_curent>>cost_curent){
    Muchie muchie;
    muchie.i=i_curent;
    muchie.j=j_curent;
    muchie.cost=cost_curent;

    listaMuchii.push_back(muchie);
  }
}

int main() {
    int n,m,S=0,nr=0;
    vector<Muchie>listaMuchii;
    vector<Muchie>apm;

    ifstream f("grafponderat.in");
    f>>n>>m;

   vector<int>parent(n,0); //reprezentatntul fiecarui set(Union Find simplificat)


    citireVal(f,listaMuchii);

    // for (const auto& muchie : listaMuchii) {
    //   cout<<"("<<muchie.i<<", "<<muchie.j<<", "<<muchie.cost<<")"<<endl;
    // }

   sort(listaMuchii.begin(),listaMuchii.end(),[](const Muchie &a, const Muchie &b){return a.cost<b.cost;});

  //fiecare nod este intr-o componenta conexa diferita(un subarbore)
  parent.resize(n+1);
  for (int i=0; i<n ; i++) {
    parent[i]=i;
  }

  //determinare APM
  for (int i=0;i<m;i++) {
    //extremitatile fac parte din subarbori diferiti (componente dierite - ca sa nu apara un ciclu) - adica nu sunt conectate la APMul de pana acum
    if (parent[listaMuchii[i].i] != parent[listaMuchii[i].j]) {
      S+=listaMuchii[i].cost;
      apm.push_back(listaMuchii[i]);
      nr++;

      //UNION: reunim subarborii - ca sa putem verifica la uramatorul pas ca nu se formeaza ciclu
      int ai=parent[listaMuchii[i].i],  aj=parent[listaMuchii[i].j];

      for (int j=1; j<=n;j++) {
        //daca au acelasi parinte - le actualizam parintele
        if (parent[j]==aj) {
          parent[j]=ai;
        }
      }
    }
  }

  cout<<S;
  cout<<"\n";
  cout<<nr;
  cout<<"\n";
  cout<<"Muchiile din APM sunt:\n";
  for(const auto &m : apm) {
    cout<<m.i<<" - "<<m.j<<" (cost "<<m.cost<<")\n";
  }
}
