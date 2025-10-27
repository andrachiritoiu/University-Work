//Laborator 2
//1.Graf bipartit

#include<iostream>
#include<fstream>
#include<vector>
#include<queue>
using namespace std;


vector<vector<int>> construiesteVecini(int n,int m, int ok, ifstream &f) {
    vector<vector<int>>listaVecini(n);
    int x,y;

    for (int i=0;i<m;i++) {
        f>>x>>y;
        if (!ok) {
            listaVecini[x-1].push_back(y-1);
            listaVecini[y-1].push_back(x-1);
        }
        else {
            listaVecini[x-1].push_back(y-1);
        }
    }
    return listaVecini;
}


bool bipartit(int start, vector<vector<int>>listaVecini,int n, vector<int>& vizitat) {
    queue<int>q;
    int ok=1;

    q.push(start);
    vizitat[start-1]=1;

    while (!q.empty() && ok!=0) {
        int p=q.front();
        p--;
        q.pop();

        for (int vecin:listaVecini[p]) {
            if (vizitat[vecin]==0) {
                vizitat[vecin]=3-vizitat[p]; //culoarea diferita de prieten
                q.push(vecin);
            }
            else if (vizitat[vecin]==vizitat[p])
                ok=0; //nu este bipartit
        }
    }
    return ok;
}

int main() {
    int n,m,ok,gasit=1;
    ifstream f("bipartit.in");
    f>>n>>m;

    cout<<"Graful este orientat(1) sau neorientat(0): ";cin>>ok;
    vector<vector<int>> listaVecini=construiesteVecini(n,m,ok,f);

    // for(const auto& vecini : listaVecini) {
    //     for (int vecin : vecini) {
    //         cout<<vecin+1<<" ";
    //     }
    //     cout<<"| ";
    // }
    // cout<<endl;

    vector<int>vizitat(n,0);

    //iteram prin toate nodurile
    for (int i=0;i<n;i++) {
        if (vizitat[i]==0) {
            if (bipartit(i+1,listaVecini,n,vizitat)==0) {
                cout<<"Nu se poate";
                gasit=0; break;
            }
        }
        else continue;
    }

    if (gasit) {
        for (int nod:vizitat) {
            cout<<nod<<" ";
        }
    }
}




//2.  a)Sortare topologică. (Kahn's Algorithm)
//Se poate vedea ca un graf orientat in care nu trebuie sa fie niciun ciclu, nodurile sa poata fi inlantuite

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<queue>
// using namespace std;
//
// vector<vector<int>> construiesteVecini(int n,int m, ifstream &f, vector<int> &gradIntern) {
//     vector<vector<int>>listaVecini(n);
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         listaVecini[x-1].push_back(y-1);
//         gradIntern[y-1]++;
//
//     }
//     return listaVecini;
// }
//
// bool topologic(vector<vector<int>> listaVecini,vector<int> &gradIntern,  queue<int> &order) {
//     queue<int> q;
//     int n=listaVecini.size();
//     int ok=1;
//
//     for (int i=0;i<n;i++) {
//         //nodurile de la care se pleaca in graf
//         if (gradIntern[i]==0)
//             q.push(i);
//     }
//
//     while (!q.empty()) {
//         int a=q.front();
//         q.pop();
//         order.push(a);
//
//         for (int vecin:listaVecini[a]) {
//             gradIntern[vecin]--;
//             if (gradIntern[vecin] == 0) q.push(vecin);
//         }
//     }
//
//
//     for (int grad:gradIntern)
//         if (grad!=0) return 0;
//
//     return 1;
// }
//
//
//
// int main() {
//     int n,m;
//     vector<vector<int>> listaVecini;
//     vector<int> gradIntern(n,0);
//     queue<int> order;
//
//     ifstream f("topologic");
//     f>>n>>m;
//     listaVecini=construiesteVecini(n,m,f,gradIntern);
//
//     gradIntern.resize(n); //altfel ii aloca prea multa memorie
//
//     if (topologic(listaVecini,gradIntern,order)) {
//         while (!order.empty()){
//             cout<<order.front()+1<<" ";
//             order.pop();
//         }
//     }
//     else cout<<"Imposibil";
//
//     return 0;
// }





//b)Modificați programul de la a) astfel încât în cazul în care nu pot fi urmate toate cursurile (deci se afișează
//IMPOSSIBLE), să afișeze și o listă de cursuri [c1, c2, …, ck, c1] care depind circular unele de altele (orice curs
//ci trebuie urmat înaintea cursului ci-1, iar ck înaintea cursului c1).

//folosim un DFS pentru a identifica ciclul

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<queue>
// #include<algorithm>
// using namespace std;
//
// vector<int> state; //0-nevizitat,1-in curs de vizitare,2-vizitat
// vector<int> parent;
// vector<int> ciclu;
// int ok=1;
//
// vector<vector<int>> construiesteVecini(int n,int m, ifstream &f, vector<int> &gradIntern) {
//     vector<vector<int>>listaVecini(n);
//     int x,y;
//
//     for (int i=0;i<m;i++) {
//         f>>x>>y;
//         listaVecini[x-1].push_back(y-1);
//         gradIntern[y-1]++;
//
//     }
//     return listaVecini;
// }
//
// vector<int> topologic(vector<vector<int>> listaVecini,vector<int> &gradIntern) {
//     queue<int> q;
//     vector<int> order;
//     int n=listaVecini.size();
//     int ok=1;
//
//     for (int i=0;i<n;i++) {
//         //nodurile de la care se pleaca in graf
//         if (gradIntern[i]==0)
//             q.push(i);
//     }
//
//     while (!q.empty()) {
//         int a=q.front();
//         q.pop();
//         order.push_back(a); //order e vector
//
//         for (int vecin:listaVecini[a]) {
//             gradIntern[vecin]--;
//             if (gradIntern[vecin] == 0) q.push(vecin);
//         }
//     }
//
//     return order;
// }
//
// bool dfs(int n, vector<vector<int>> listaVecini) {
//     state[n]=1; //incepe vizitarea
//
//
//     for (int vecin:listaVecini[n]) {
//         if (state[vecin]==0) {
//             parent[vecin]=n;
//             dfs(vecin,listaVecini);  //aplez recursiv pana  nu mai are vecini
//         }
//         else if (state[vecin]==1) {
//             //insemna ca este deja in curs de vizitare => ciclu
//             //refacem ciclul
//             int nodCurent=n;
//             while (nodCurent!=vecin) {
//                 ciclu.push_back(nodCurent);
//                 nodCurent=parent[nodCurent];
//             }
//             ciclu.push_back(nodCurent);
//             reverse(ciclu.begin(),ciclu.end());
//
//             ok=0;
//             return ok;
//         }
//
//         //daca s-a terminat de vizitat
//
//         state[n]=2;
//     }
//
//     return ok;
// }
//
//
// int main() {
//     int n,m;
//     vector<vector<int>> listaVecini;
//     vector<int> gradIntern(n,0);
//     vector<int> order;
//
//     ifstream f("topologic");
//     f>>n>>m;
//     listaVecini=construiesteVecini(n,m,f,gradIntern);
//
//     gradIntern.resize(n);
//
//     order=topologic(listaVecini,gradIntern);
//
//     if (order.size()==n){
//         for (auto v:order) {
//             cout<<v+1<<" ";
//         }
//     }
//     else {
//         cout<<"Impoaibil\n";
//
//         state.assign(n, 0);
//         parent.assign(n, -1); //lipsa parinte
//         for (int i=0;i<n;i++) {
//             if (state[i]==0) {
//                 dfs(i,listaVecini);
//                 if (ok==0)break;
//             }
//         }
//
//         if (!ciclu.empty()) {
//             for (int nod:ciclu)
//                 cout<<nod+1<<" ";
//         }
//     }
//
//     return 0;
// }






//3.Fill - Counting rooms
// You are given a map of a building, and your task is to count the number of its rooms. The size of the map is n \times
// m squares, and each square is either floor or wall. You can walk left, right, up, and down through the floor squares.
// Input:
// The first input line has two integers n and m: the height and width of the map.
// Then there are n lines of m characters describing the map. Each character is either . (floor) or # (wall).
// Output:
// Print one integer: the number of rooms.

//=>este un graf neorientat si trebuie sa aflam cate componente conexe sunt

//
// #include<iostream>
// #include<fstream>
// #include<vector>
// using namespace std;
//
// int n,m;
// char x;
//
// //transformare matrice
// vector<vector<int>> matrice(ifstream &f, int n, int m) {
//     vector<vector<int>> mat(n,vector<int>(m,0));
//
//     for (int i=0;i<n;i++)
//         for (int j=0;j<m;j++) {
//             f>>x;
//             if (x == '#') mat[i][j]=0;
//             else mat[i][j]=1;
//         }
//
//     return mat;
// }
//
//
// // Matrice → Liste de adiacență
// vector<vector<int>> matriceToLista(int n,int m,vector<vector<int>> &mat) {
//     int nr_noduri=n*m;
//     vector<vector<int>>listaVecini(nr_noduri);
//
//     for (int i=0;i<n;i++) {
//         for (int j=0;j<m;j++) {
//             if (mat[i][j]==1) {
//                 // Transformam coordonatele (i, j) in index de nod
//                 int nod_curent = i*m+j;
//
//                 //vecinul de jos
//                 if (i+1<n && mat[i+1][j]==1) {
//                     int nod_vecin =(i+1)*m+j;
//                     listaVecini[nod_curent].push_back(nod_vecin);
//                     listaVecini[nod_vecin].push_back(nod_curent);
//                 }
//
//                 //vecinul din dreapta
//                 if (j+1<m && mat[i][j+1]==1) {
//                     int nod_vecin = i*m+(j+1);
//                     listaVecini[nod_curent].push_back(nod_vecin);
//                     listaVecini[nod_vecin].push_back(nod_curent);
//                 }
//             }
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
//         if (!vizitat[vecin]) {
//             dfs(vecin,listaVecini,vizitat);
//         }
//     }
// }
//
//
// int main() {
//     ifstream f("fill.in");
//     f>>n>>m;
//
//     vector<vector<int>> mat = matrice(f,n,m);
//     vector<vector<int>> listaVecini=matriceToLista(n,m,mat);
//
//     int total_noduri =n*m;
//     vector<bool>vizitat(total_noduri,0);
//
//     int cc=0;
//     for (int i=0;i<total_noduri;i++) {
//         //coordonatele corespunzatoare nodului 'i'
//         int linie=i/m;  //pe ce rand se afla, peste cate randuri complete
//         int coloana=i%m;
//
//         if (mat[linie][coloana]==1 && !vizitat[i]) {
//             cc++;
//             dfs(i, listaVecini, vizitat);
//         }
//     }
//     cout<<cc;
// }






//4. Componente tare conexe (Kosaraju)

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<algorithm>
// using namespace std;
//
// vector<vector<int>> g, gt;   // g=graf original, gt=graf transpus
// vector<bool> used;
// vector<int> order;
// vector<vector<int>> scc;  // lista componentelor tare conexe
//
// void dfs1(int v) {
//     used[v]=true;
//     for (int to : g[v])
//         if (!used[to])
//             dfs1(to);
//     order.push_back(v);
// }
//
// void dfs2(int v, vector<int>& comp) {
//     used[v]=true;
//     comp.push_back(v);
//     for (int to : gt[v])
//         if (!used[to])
//             dfs2(to, comp);
// }
//
// int main() {
//     int n, m;
//     ifstream f("Kosaraju.in");
//     f>>n>>m;
//
//     g.resize(n);
//     gt.resize(n);
//     used.assign(n, false);
//
//     for (int i=0; i<m; i++) {
//         int a, b;
//         f>>a>>b;
//         g[a].push_back(b);
//         gt[b].push_back(a);
//     }
//
//     // 1. DFS pe graful original
//     for (int i=0; i<n; i++)
//         if (!used[i])
//             dfs1(i);
//
//     // 2. DFS pe graful transpus în ordinea inversă
//     used.assign(n, false);
//     reverse(order.begin(), order.end());
//
//     for (int v : order) {
//         if (!used[v]) {
//             vector<int> comp;
//             dfs2(v, comp);
//             scc.push_back(comp);
//         }
//     }
//
//     cout<<"Numar de componente tare conexe: "<<scc.size()<<"\n";
//     for (auto &comp : scc) {
//         for (int v : comp) {
//             cout<<v<<" ";
//         }
//         cout<<"\n";
//     }
//     return 0;
// }




//5.Puncte critice (de articulație).

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<algorithm>
// using namespace std;
//
// vector<vector<int>> g;
// vector<int> disc, low, parent_;
// vector<bool> articulation;
// int timer, n, m;
//
// void dfs(int u) {
//     disc[u]=low[u]=++timer;
//     int children=0;
//
//     for (int v : g[u]) {
//         if (disc[v]==0) {
//             // nevizitat
//             parent_[v]=u;
//             children++;
//             dfs(v);
//
//             low[u]=min(low[u], low[v]);
//
//             //u este root și are >= 2 copii
//             if (parent_[u]==-1 && children>1)
//                 articulation[u]=true;
//
//             //u nu e root și low[v] >= disc[u]
//             if (parent_[u] != -1 && low[v]>=disc[u])
//                 articulation[u]=true;
//         }
//         else if (v!=parent_[u]) {
//             // back-edge
//             low[u]=min(low[u], disc[v]);
//         }
//     }
// }
//
// int main() {
//     ifstream fin("puncteCritice.in");
//
//     while (true) {
//         fin>>n>>m;
//         if (n==0 && m==0) break;
//
//         g.assign(n+1, {});
//         disc.assign(n+1, 0);
//         low.assign(n+1, 0);
//         parent_.assign(n+1, -1);
//         articulation.assign(n+1, false);
//         timer=0;
//
//         // citire muchii (graf neorientat)
//         for (int i=0; i<m; i++) {
//             int a, b;
//             fin>>a>>b;
//             g[a].push_back(b);
//             g[b].push_back(a);
//         }
//
//         // pot exista componente neconectate
//         for (int i=1; i<=n; i++)
//             if (disc[i]==0)
//                 dfs(i);
//
//         int ans=0;
//         for (int i=1; i<=n; i++)
//             if (articulation[i])
//                 ans++;
//
//         cout<<ans<<"\n";
//     }
//
//     return 0;
// }





//6.Distanțe și drumuri minime.

// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<queue>
// using namespace std;
//
// int main() {
//     ifstream fin("graf.in");
//     ofstream fout("graf.out");
//
//     int n, m;
//     fin>>n>>m;
//
//     vector<vector<int>> g(n+1);
//     for (int i=0; i<m; i++) {
//         int a, b;
//         fin>>a>>b;
//         g[a].push_back(b);
//         g[b].push_back(a);
//     }
//
//     vector<int> control;
//     int x;
//     while (fin>>x) {
//         control.push_back(x);
//     }
//
//     vector<int> dist(n+1, -1);
//     queue<int> q;
//
//     for (int c : control) {
//         dist[c]=0;
//         q.push(c);
//     }
//
//     while (!q.empty()) {
//         int u=q.front();
//         q.pop();
//         for (int v : g[u]) {
//             if (dist[v] == -1) {
//                 // nevizitat
//                 dist[v]=dist[u]+1;
//                 q.push(v);
//             }
//         }
//     }
//
//     for (int i=1; i<=n; i++)
//         fout<<dist[i]<<" ";
//
//     fin.close();
//     fout.close();
//
//     return 0;
// }
