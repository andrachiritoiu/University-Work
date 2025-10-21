//Laborator 1

//A.Memorarrea unui graf
//1.Scrieți un subprogram pentru construirea în memorie a matricei de adiacență a unui graf (neorientat/orientat în
// funcție de un parametru trimis subprogramului) citit din fișierul graf.in cu structura precizată mai sus și un subprogram pentru afișarea matricei de adiacență

#include<iostream>
#include<fstream>
#include<vector>
using namespace std;

vector<vector<int>> construiesteMatrice(int n, int m, int ok, ifstream &f){
  // vector<int>(m,0) - creeaza un vector de int cu m elemente initializate cu 0

  vector<vector<int>> mat(n, vector<int>(n,0));

  for(int i=0;i<m;i++){
    int x,y;
    f>>x>>y;
    //graf neorientat
    if (ok==0) {
      mat[x-1][y-1]=1;
      mat[y-1][x-1]=1;
    }
    //graf orientat
    else {
      mat[x-1][y-1]=1;
    }
  }
  return mat;
}

void afisareMatrice(vector<vector<int>>mat) {
  int n=mat.size();
  for (int i=0;i<n;i++) {
    for (int j=0;j<n;j++) {
      cout<<mat[i][j]<<" ";
    }
    cout<<endl;
  }
}

int main(){
  ifstream f("graf.in");
  int n,m,ok;
  f>>n>>m;
  cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
  vector<vector<int>> mat=construiesteMatrice(n,m,ok,f);
  afisareMatrice(mat);
  return 0;
}






//2.Scrieți un subprogram pentru construirea în memorie a listelor de adiacență pentru un graf (neorientat/orientat în
//funcție de un parametru trimis subprogramului) citit din fișierul graf.in cu structura precizată mai sus și un subprogram pentru afișarea listelor de adiacență

// #include<iostream>
// #include<fstream>
// #include<vector>
// using namespace std;
//
// vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
//     vector<vector<int>>listaVecini(n); //trebuie initiliazata cu numarul de elemente,altfel da segmentation fault
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         if (!ok) {
//             listaVecini[x-1].push_back(y-1);
//             listaVecini[y-1].push_back(x-1);
//         }
//         else {
//             listaVecini[x-1].push_back(y-1);
//         }
//     }
//     return listaVecini;
// }
//
// void afisare(vector<vector<int>> listaVecini) {
//   for (int i=0;i<listaVecini.size();i++) {
//       cout<<i+1<<": ";
//       for (int vecin:listaVecini[i])
//           cout<<vecin+1<<" ";
//       cout<<endl;
//   }
// }
//
//
// int main() {
//     int n,m,ok;
//     ifstream f("graf.in");
//     f>>n>>m;
//
//     cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//
//     vector<vector<int>>listaVecini=construiesteVecini(n,m,ok,f);
//     afisare(listaVecini);
//     return 0;
// }



//3.Implementați algoritmi de trecere de la o modalitate de reprezentare la alta.

// #include<iostream>
// #include<fstream>
// #include<vector>
// using namespace std;
//
// //M1. Matrice → Liste de adiacență
// vector<vector<int>> matriceToLista(int ok,vector<vector<int>> &matrice) {
//     int n=matrice.size();
//     vector<vector<int>>listaVecini(n);
//
//     for (int i=0;i<n;i++) {
//         for (int j=0;j<n;j++) {
//             if (matrice[i][j] && i<j) {
//                 if (!ok) {
//                     listaVecini[i].push_back(j);
//                     listaVecini[j].push_back(i);
//                 }
//                 else listaVecini[i].push_back(j);
//             }
//         }
//     }
//     return listaVecini;
// }
//
// void afisareLV(vector<vector<int>> listaVecini) {
//   for (int i=0;i<listaVecini.size();i++) {
//       cout<<i+1<<": ";
//       for (int vecin:listaVecini[i])
//           cout<<vecin+1<<" ";
//       cout<<endl;
//   }
// }
//
//
//
// //M2. Liste de adiacenta → Matrice
// vector<vector<int>>listaToMatrice(vector<vector<int>> listaVecini) {
//     int n=listaVecini.size();
//     vector<vector<int>> matrice(n,vector<int>(n,0));
//
//     for (int i=0;i<n;i++)
//         //e la fel si pentru orientat si neorientat
//         for (int vecin:listaVecini[i])
//             matrice[i][vecin]=1;
//
//     return matrice;
// }
//
// void afisareMatrice(vector<vector<int>>matrice) {
//     int n=matrice.size();
//     for (int i=0;i<n;i++) {
//         for (int j=0;j<n;j++) {
//             cout<<matrice[i][j]<<" ";
//         }
//         cout<<endl;
//     }
// }
//
//
//
// //M3.Matrice → Listă de muchii
// vector<pair<int,int>>matriceToMuchii(vector<vector<int>>mat, int ok) {
//     vector<pair<int,int>> muchii;
//     int n=mat.size();
//
//     for (int i=0;i<n;i++) {
//         for (int j=0;j<n;j++) {
//             if (mat[i][j]) {
//                 //neorientat
//                 if (ok==0 && i<j)muchii.push_back({i+1,j+1});
//                 //orientat
//                 else if (ok!=0)muchii.push_back({i+1,j+1});
//             }
//         }
//     }
//     return muchii;
// }
//
// void afisareMuchii(vector<pair<int,int>>muchii) {
//     for (auto [x,y]: muchii)
//         cout<<"["<<x<<", "<<y<<"] ";
// }
//
//
//
// //M4.Listă de muchii → Matrice
// vector<vector<int>> muchiiToMatrice(vector<pair<int,int>>muchii, int n, int ok){
//     vector<vector<int>> matrice(n,vector<int>(n,0));
//     for (auto [x,y]:muchii) {
//         if (ok) matrice[x-1][y-1]=1;
//         else {
//             matrice[x-1][y-1]=1;
//             matrice[y-1][x-1]=1;
//         }
//     }
//     return matrice;
// }
//
//
//
// //M5. Listă de muchii → Liste de adiacență
// vector<vector<int>> muchiiToLista(int ok,vector<pair<int,int>> muchii,int n) {
//     vector<vector<int>>listaVecini(n);
//
//     for (auto [x,y]:muchii){
//         if (!ok) {
//             listaVecini[x-1].push_back(y-1);
//             listaVecini[y-1].push_back(x-1);
//             }
//         else listaVecini[x-1].push_back(y-1);
//     }
//
//     return listaVecini;
// }
//
//
//
//
// int main() {
//     int ok;
//
//     //pentru input de la tastatura
//     // int n;
//     // cout<<"Numarul de noduri ale grafului este: ";cin>>n;
//     // vector<vector<int>> matrice(n,vector<int>(n));
//     // for(int i=0;i<n;i++)
//     //    for (int j=0;j<n;j++)
//     //           cin>>matrice[i][j];
//     // cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//
//
//
//     //ex M1. Matrice → Liste de adiacență
//     ok=0;
//     vector<vector<int>> matrice={
//         {0,1,1,0},
//         {1,0,1,0},
//         {1,1,0,1},
//         {0,0,1,0}
//     };
//
//     vector<vector<int>> listaVecini=matriceToLista(ok,matrice);
//     afisareLV(listaVecini);
//
//
//
//     //ex M2.Liste de adiacenta → Matrice
//     // vector<vector<int>> mat=listaToMatrice(listaVecini);
//     // afisareMatrice(mat);
//
//
//     //ex M3.Matrice → Listă de muchii
//     vector<pair<int,int>>muchii=matriceToMuchii(matrice,ok);
//     afisareMuchii(muchii);
//
//
//     //ex M4.Listă de muchii → Matrice
//     int n;
//     cout<<"Numarul de noduri este: ";cin>>n;
//     vector<vector<int>> mat2=muchiiToMatrice(muchii,n,ok);
//     afisareMatrice(mat2);
//
//
//     //ex M5. Listă de muchii → Liste de adiacență
//     // int n;
//     // cout<<"Numarul de noduri este: ";cin>>n;
//     vector<vector<int>> lista=muchiiToLista(ok,muchii,n);
//     afisareLV(lista);
//     return 0;
// }
//




//4. Propuneţi modalităţi de reprezentare şi pentru grafuri orientate și pentru multigrafuri neorientate/orientate
//(care admit muchii/arce multiple şi bucle)

//
// #include<iostream>
// #include<fstream>
// #include<vector>
// using namespace std;
//
// //1)lista de vecini
// vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
//     vector<vector<int>>listaVecini(n); //trebuie initiliazata cu numarul de elemente,a latfel da segmentation fault
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         if (!ok) {
//             listaVecini[x-1].push_back(y-1);
//             listaVecini[y-1].push_back(x-1);
//         }
//         else {
//             listaVecini[x-1].push_back(y-1);
//         }
//     }
//     return listaVecini;
// }
//
// void afisare(vector<vector<int>> listaVecini) {
//     for (int i=0;i<listaVecini.size();i++) {
//         cout<<i+1<<": ";
//         for (int vecin:listaVecini[i])
//             cout<<vecin+1<<" ";
//         cout<<endl;
//     }
// }
//
//
//
// //2)matrice de adiacenta cu contor
// vector<vector<int>> construiesteMatrice(int n, int m, int ok, ifstream &f){
//   vector<vector<int>> mat(n, vector<int>(n,0));
//
//   for(int i=0;i<m;i++){
//     int x,y;
//     f>>x>>y;
//     //graf neorientat
//     if (ok==0) {
//       mat[x-1][y-1]++;
//       mat[y-1][x-1]++;
//     }
//     //graf orientat
//     else {
//       mat[x-1][y-1]++;
//     }
//   }
//   return mat;
// }
//
// void afisareMatrice(vector<vector<int>>mat) {
//   int n=mat.size();
//   for (int i=0;i<n;i++) {
//     for (int j=0;j<n;j++) {
//       cout<<mat[i][j]<<" ";
//     }
//     cout<<endl;
//   }
// }
//
// int main() {
//    //grafuri orientate - toate varinatele de mai sus in care ok=1
//    //multigrafuri - 1)lista de vecini
//
//     // int n,m,ok;
//     // ifstream f("graf.in");
//     // f>>n>>m;
//     // cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//     //
//     // vector<vector<int>>listaVecini=construiesteVecini(n,m,ok,f);
//     // afisare(listaVecini);
//
//
//
//
//     //2)matrice de adiacenta cu contor
//     ifstream f("graf.in");
//     int n,m,ok;
//     f>>n>>m;
//     cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//     vector<vector<int>> mat=construiesteMatrice(n,m,ok,f);
//     afisareMatrice(mat);

//     return 0;
// }




// B. Parcurgerea în lățime BFS
//1.a)Fiind dat un nod S, sa se determine, pentru fiecare nod X, numarul minim de arce ce trebuie parcurse pentru a
//ajunge din nodul sursa S la nodul X.

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<queue>
// using namespace std;
//
// vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
//         vector<vector<int>>listaVecini(n);
//         int x,y;
//
//         for (int i=0;i<m;i++) {
//             f>>x>>y;
//             if (!ok && x<y) {
//                 listaVecini[x-1].push_back(y-1);
//                 listaVecini[y-1].push_back(x-1);
//             }
//             else {
//                 listaVecini[x-1].push_back(y-1);
//             }
//         }
//         return listaVecini;
//     }
//
//
// int main() {
//     int n,m,s,ok;
//     ifstream f("bfs.in");
//     f>>n>>m>>s;
//     cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//     //facem lista de vecini
//     vector<vector<int>>listaVecini = construiesteVecini(n,m,ok,f);
//
//
//     vector<int>dist(n,-1); //-1 pt nodurile nevizitate
//     //aplicam bfs
//     queue<int>q;
//     q.push(s-1);
//     dist[s-1]=0;
//     while (!q.empty()) {
//        int p=q.front(); q.pop();
//        for (int vecin:listaVecini[p]) {
//            //un nod nevizitat pana acum, care nu a mai fost in coada
//            if (dist[vecin]==-1) {
//                dist[vecin]=dist[p]+1;
//                q.push(vecin);
//            }
//        }
//    }
//
//     ofstream g("bfs.out");
//     for (int d:dist)
//         g<<d<<" ";
//
//     f.close();
//     g.close();
//     return 0;
// }



//b)Se citește în plus (față de a)) de la tastatură două vârfuri s și x. Să se afișeze un drum minim (cu număr minim de
//arce) de la s la x

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<queue>
// using namespace std;
//
// vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
//     vector<vector<int>>listaVecini(n);
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         if (!ok && x<y) {
//             listaVecini[x-1].push_back(y-1);
//             listaVecini[y-1].push_back(x-1);
//         }
//         else {
//             listaVecini[x-1].push_back(y-1);
//         }
//     }
//     return listaVecini;
// }
//
// vector<int> distanta(int n, int s, vector<vector<int>> listaVecini) {
//     vector<int>dist(n,-1);
//     //aplicam bfs
//     queue<int>q;
//     q.push(s-1);
//     dist[s-1]=0;
//     while (!q.empty()) {
//         int p=q.front(); q.pop();
//         for (int vecin:listaVecini[p]) {
//             if (dist[vecin]==-1) {
//                 dist[vecin]=dist[p]+1;
//                 q.push(vecin);
//             }
//         }
//     }
//     return dist;
// }
//
//
// int main() {
//     int n,m,s,ok,S,X;
//     ifstream f("bfs.in");
//     f>>n>>m>>s;
//     cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//     cin>>S>>X;
//
//     //facem lista de vecini
//     vector<vector<int>>listaVecini = construiesteVecini(n,m,ok,f);
//
//     //calculam distantele pentru S
//     vector<int> dist=distanta(n,S,listaVecini);
//
//     //vedem ce se afla pe poz X
//     if (dist[X-1]==-1)cout<<"Inaccesibil unul dintre noduri";
//     else cout<<"Numarul minim de arce este: "<<dist[X-1];
//
//     f.close();
//     return 0;
// }



//C. Parcurgerea în adâncime DFS
//1.Se da un graf neorientat cu N noduri si M muchii.Sa se determine numarul componentelor conexe ale grafului.

// #include<iostream>
// #include<fstream>
// #include<vector>
// using namespace std;
//
// //lista de vecini
// vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
//     vector<vector<int>>listaVecini(n);
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         if (!ok) {
//             listaVecini[x-1].push_back(y-1);
//             listaVecini[y-1].push_back(x-1);
//         }
//         else {
//             listaVecini[x-1].push_back(y-1);
//         }
//     }
//     return listaVecini;
// }
//
// //dfs
// void dfs(int node, vector<vector<int>> &listaVecini,vector<bool> &vizitat) {
//     vizitat[node]=true;
//
//     for (auto vecin:listaVecini[node]) {
//         //daca vecinul nu a fost vizitat, continuam cautarea
//         if (!vizitat[vecin]) {
//             dfs(vecin,listaVecini,vizitat);
//         }
//     }
// }
//
// int main() {
//     int n,m,ok;
//     ifstream f("dfs.in");
//     f>>n>>m;
//     cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
//
//     vector<vector<int>>listaVecini=construiesteVecini(n,m,ok,f);
//
//     vector<bool>vizitat(n,0);
//
//     int cc=0;
//     for (int i=0;i<n;i++) {
//         if (!vizitat[i]) {
//             cc++;
//             dfs(i, listaVecini, vizitat);
//         }
//     }
//     cout<<cc;
// }




// // + afișarea arcelor de întoarcere(in curs de vizitare), traversare(nu a fost vizitat), avansare
// #include <iostream>
// #include <vector>
// #include <fstream>
// #include <string>
//
// using namespace std;
//
// enum StareNod {NEVIZITAT, IN_VIZITARE, VIZITAT_COMPLET};
//
// int n, m;
// vector<vector<int>> listaVecini;
// vector<StareNod> status;
//
// vector<pair<int, int>> arceAvansare;
// vector<pair<int, int>> arceIntoarcere;
// vector<pair<int, int>> arceTraversare;
//
// void dfs_clasificare(int u) {
//     status[u]=IN_VIZITARE;
//
//     for (int v : listaVecini[u]) {
//         if (status[v]==NEVIZITAT) {
//             arceAvansare.push_back({u, v});
//             dfs_clasificare(v);
//         } else if (status[v]==IN_VIZITARE) {
//             arceIntoarcere.push_back({u, v});
//         } else {
//             arceTraversare.push_back({u, v});
//         }
//     }
//     status[u]=VIZITAT_COMPLET;
// }
//
// int main() {
//     ifstream f("dfs.in");
//     f >> n >> m;
//
//     listaVecini.resize(n);
//     status.assign(n, NEVIZITAT);
//
//     for (int i = 0; i < m; i++) {
//         int x, y;
//         f>>x>>y;
//         listaVecini[x-1].push_back(y-1);
//     }
//     f.close();
//
//
//     for (int i = 0; i < n; i++) {
//         if (status[i] == NEVIZITAT) {
//             dfs_clasificare(i);
//         }
//     }
//
//
//     cout<<"Arce de Avansare"<<endl;
//     for(const auto& arc : arceAvansare) {
//         cout<<arc.first+1<<" -> "<<arc.second+1<<endl;
//     }
//
//     cout<<"\nArce de Intoarcere"<<endl;
//     for(const auto& arc : arceIntoarcere) {
//         cout<<arc.first+1<<" -> "<<arc.second+1<<endl;
//     }
//
//     cout<<"\nArce de Traversare"<<endl;
//     for(const auto& arc : arceTraversare) {
//         cout<<arc.first+1<<" -> "<<arc.second+1<<endl;
//     }
//
//     return 0;
// }




// // 2. Dat un graf neorientat (nu neapărat conex), să se verifice dacă graful conține un ciclu elementar (nu este aciclic).
// // În caz afirmativ să se afișeze un astfel de ciclu.
//
//  #include<iostream>
//  #include<fstream>
//  #include<vector>
//  #include<algorithm>
//  using namespace std;
//
//
//  bool dfs_cicluri(int u, int p, vector<vector<int>> &listaVecini, vector<bool> &visited, vector<int> &parent) {
//      visited[u]=true;
//      parent[u]=p;
//
//      for(int v:listaVecini[u]) {
//          if (visited[v]) {
//              // ciclu: v este vizitat si nu este parintele lui u
//              cout<<"Ciclu gasit: ";
//              vector<int> ciclu;
//
//
//              int current=u;
//              while (current!=v) {
//                  ciclu.push_back(current + 1);
//                  current=parent[current];
//              }
//              ciclu.push_back(v + 1);
//              reverse(ciclu.begin(), ciclu.end());
//              ciclu.push_back(ciclu[0]);
//
//              for(auto i=0; i<ciclu.size(); i++) {
//                  cout<<ciclu[i]<<" ";
//              }
//              cout<<endl;
//
//              return true;
//          }
//
//
//          if (dfs_cicluri(v, u, listaVecini, visited, parent)) {
//              return true; // daca s-a gasit un ciclu in subarbore, ne oprim
//          }
//      }
//      return false;
//  }
//
//
//  vector<vector<int>> construiesteVecini(int n, int m, ifstream &f) {
//      vector<vector<int>> listaVecini(n);
//      int x, y;
//
//      for (int i=0; i<m; i++) {
//          if (!(f>>x>>y)) break;
//
//          listaVecini[x-1].push_back(y-1);
//          listaVecini[y-1].push_back(x-1);
//      }
//      return listaVecini;
//  }
//
//  int main() {
//      int n, m;
//      ifstream f("graf.in");
//
//      vector<vector<int>> listaVecini=construiesteVecini(n, m, f);
//      f.close();
//
//
//      vector<bool> visited(n, false);
//      vector<int> parent(n, -1);
//      bool ciclu_gasit = false;
//
//
//      for (int i=0; i<n; i++) {
//          if (!visited[i]) {
//              if (dfs_cicluri(i, -1, listaVecini, visited, parent)) {
//                  ciclu_gasit=true;
//                  break;
//              }
//          }
//      }
//
//      if (!ciclu_gasit) {
//          cout<<"Graful este aciclic."<<endl;
//      }
//
//      return 0;
//  }
