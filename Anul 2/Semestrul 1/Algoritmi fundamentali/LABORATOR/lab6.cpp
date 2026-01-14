//colcviu
//pb1.1. Un grup de studenți pasionați de dezbateri a organizat un turneu regional. Regulile turneului sunt clare: echipele trebuie să participe la meciuri în ordine, iar unele echipe trebuie să joace înaintea altora, conform unui program de priorități.
//Fiecare echipă este numerotată de la  la , iar programul include o listă de  reguli:
//
//Dacă echipa  trebuie să joace înaintea echipei , atunci în program este o regulă
//Dacă nu există o regulă între două echipe, ele pot juca în orice ordine.
//Pentru ca turneul să se desfășoare fără probleme:
//
//Trebuie să determinăm ordinea completă a meciurilor, astfel încât să respectăm toate regulile date.
//Dacă există mai multe variante posibile de organizare, alegem varianta care este minim lexicografică (cea în care echipele cu numere mai mici apar cât mai devreme posibil).

//sortare topologica
//alg Kahn

#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
#include <set>
using namespace std;


int main() {
    int n, m;
    cin>>n>>m;

    vector<vector<int>> g(n+1);
    vector<int> indeg(n+1, 0);

    for(int i=0;i<m;i++){
        int x,y;
        cin>>x>>y;
        g[x].push_back(y);
        indeg[y]++;
    }

    set<int> rez;
    for(int i=1;i<=n;i++)
      if(indeg[i]==0) rez.insert(i);

    vector<int> ord;

    while(!rez.empty()){
      int v=*rez.begin();  //cel mai mic cu indeg 0
      rez.erase(rez.begin());
      ord.push_back(v);

      for(int u: g[v]){
        indeg[u]--;
        if(indeg[u]==0)rez.insert(u);
      }

    }

    for(int i=0;i<(int)ord.size();i++){
        if(i) cout<<' ';
        cout<<ord[i];
    }

    return 0;
}
