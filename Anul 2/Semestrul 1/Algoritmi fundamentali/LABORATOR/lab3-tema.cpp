//Lab3

//1.a) Implementați algoritmul lui Kruskal pentru determinarea unui arbore parţial de cost minim al unui graf conex
// ponderat cu n vârfuri și m muchii. Graful se va citi din fişierul grafpond.in. O(m log n)  (+ și versiunea O(n2 + m log n))

// //V1 - O(m*log m + m*n)
//
// #include<iostream>
// #include<fstream>
// #include<vector>
// #include<algorithm>
// using namespace std;
//
// int i_curent,j_curent,cost_curent;
//
// struct Muchie{
//   int i,j,cost;
// };
//
// void citireVal(ifstream &f, vector<Muchie> &listaMuchii){
//   while(f>>i_curent>>j_curent>>cost_curent){
//     Muchie muchie;
//     muchie.i=i_curent;
//     muchie.j=j_curent;
//     muchie.cost=cost_curent;
//
//     listaMuchii.push_back(muchie);
//   }
// }
//
// int main() {
//     int n,m,S=0,nr=0;
//     vector<Muchie>listaMuchii;
//     vector<Muchie>apm;
//
//     ifstream f("grafponderat.in");
//     f>>n>>m;
//
//    vector<int>parent(n,0); //reprezentatntul fiecarui set(Union Find simplificat)
//
//
//     citireVal(f,listaMuchii);
//
//     // for (const auto& muchie : listaMuchii) {
//     //   cout<<"("<<muchie.i<<", "<<muchie.j<<", "<<muchie.cost<<")"<<endl;
//     // }
//
//    sort(listaMuchii.begin(),listaMuchii.end(),[](const Muchie &a, const Muchie &b){return a.cost<b.cost;});
//
//   //fiecare nod este intr-o componenta conexa diferita(un subarbore)
//   parent.resize(n+1);
//   for (int i=0; i<n ; i++) {
//     parent[i]=i;
//   }
//
//   //determinare APM
//   for (int i=0;i<m;i++) {
//     //extremitatile fac parte din subarbori diferiti (componente dierite - ca sa nu apara un ciclu) - adica nu sunt conectate la APMul de pana acum
//     if (parent[listaMuchii[i].i] != parent[listaMuchii[i].j]) {
//       S+=listaMuchii[i].cost;
//       apm.push_back(listaMuchii[i]);
//       nr++;
//
//       //UNION: reunim subarborii - ca sa putem verifica la uramatorul pas ca nu se formeaza ciclu
//       int ai=parent[listaMuchii[i].i],  aj=parent[listaMuchii[i].j];
//
//       for (int j=1; j<=n;j++) {
//         //daca au acelasi parinte - le actualizam parintele
//         if (parent[j]==aj) {
//           parent[j]=ai;
//         }
//       }
//     }
//   }
//
//   cout<<S;
//   cout<<"\n";
//   cout<<nr;
//   cout<<"\n";
//   cout<<"Muchiile din APM sunt:\n";
//   for(const auto &m : apm) {
//     cout<<m.i<<" - "<<m.j<<" (cost "<<m.cost<<")\n";
//   }
// }






// //V2 - O(m*log m)
//
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <algorithm>
// using namespace std;
//
// struct Muchie {
//     int u, v, cost;
// };
//
// bool comparaMuchii(const Muchie &a, const Muchie &b) {
//     return a.cost<b.cost;
// }
//
// vector<int> parent;
// //rank[i] aproximează înălțimea/mărimea arborelui
// vector<int> rank_dsu;
//
// // FIND cu compresia căii
// int Find(int i) {
//     //radacina
//     if (parent[i] == i) {
//         return i;
//     }
//     // atașăm i direct la rădăcina sa
//     return parent[i] = Find(parent[i]);
// }
//
// // UNION după rang
// // Returnează true dacă s-a realizat uniunea (nu a existat ciclu), false altfel
// bool Union(int i, int j) {
//     int root_i=Find(i);
//     int root_j=Find(j);
//
//     if (root_i != root_j) {
//         // atașam arborele cu rang mai mic la rădăcina celui mai mare
//         if (rank_dsu[root_i] < rank_dsu[root_j]) {
//             parent[root_i]=root_j;
//         } else if (rank_dsu[root_i] > rank_dsu[root_j]) {
//             parent[root_j]=root_i;
//         } else {
//             // rangurile sunt egale, atașăm j la i și creștem rangul lui i
//             parent[root_j]=root_i;
//             rank_dsu[root_i]++;
//         }
//         return true;
//     }
//     return false; //ciclu detectat
// }
//
//
// void kruskal(int n, int m, vector<Muchie> &listaMuchii) {
//     sort(listaMuchii.begin(), listaMuchii.end(), comparaMuchii);
//
//     parent.resize(n+1);
//     rank_dsu.assign(n+1, 0);
//     for (int i=1; i<=n; i++) {
//         parent[i] = i;
//     }
//
//     vector<Muchie> apm;
//     long long cost_total = 0;
//     int muchii_selectate = 0;
//
//     for (const auto &muchie : listaMuchii) {
//         if (Union(muchie.u, muchie.v)) {
//             // daca muchia nu formează ciclu
//             cost_total += muchie.cost;
//             apm.push_back(muchie);
//             muchii_selectate++;
//
//             if (muchii_selectate == n - 1) {
//                 break;
//             }
//         }
//     }
//
//     cout<<"Costul total al APM: "<<cost_total<<"\n";
//     cout<<"Numar de muchii in APM: "<<muchii_selectate<<"\n";
//     if (muchii_selectate == n - 1) {
//         cout<<"Muchiile din APM sunt:\n";
//         for (const auto &m : apm) {
//             cout<<m.u<<" - "<< m.v <<" (cost "<<m.cost<<")\n";
//         }
//     } else {
//         cout<<"Graful nu este conex sau nu s-a putut forma un APM complet.\n";
//     }
// }
//
// int main() {
//     ifstream f("grafponderat.in");
//     int n, m;
//     f>>n>>m;
//
//     vector<Muchie> listaMuchii;
//     int u_curent, v_curent, cost_curent;
//
//     for(int i=0; i<m; i++) {
//         if (f >> u_curent >> v_curent >> cost_curent) {
//             listaMuchii.push_back({u_curent, v_curent, cost_curent});
//         }
//     }
//     f.close();
//
//     kruskal(n, m, listaMuchii);
//
//     return 0;
// }




//b) Modificați programul de la a) astfel încât să determine (dacă există) un arbore parțial de cost cât mai mic care
//să conțină 3 muchii ale căror extremități se citesc de la tastatură. Se vor afișa muchiile arborelui determinat.

//adaugam primele 3 muchiile impuse si de acolo pornim algoritmul lui Kruskal - O(m*log n)

// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <algorithm>
// #include <tuple>
// using namespace std;
//
// struct Muchie {
//     int u, v, cost;
// };
//
// bool comparaMuchii(const Muchie &a, const Muchie &b) {
//     return a.cost<b.cost;
// }
//
// vector<int> parent;
// vector<int> rank_dsu;
//
// // FIND cu compresia căii
// int Find(int i) {
//     if (parent[i] == i) {
//         return i;
//     }
//     return parent[i]=Find(parent[i]);
// }
//
// // UNION după rang
// // false dacă s-a detectat ciclu
// bool Union(int i, int j) {
//     int root_i=Find(i);
//     int root_j=Find(j);
//
//     if (root_i != root_j) {
//         if (rank_dsu[root_i] < rank_dsu[root_j]) {
//             parent[root_i]=root_j;
//         } else if (rank_dsu[root_i] > rank_dsu[root_j]) {
//             parent[root_j]=root_i;
//         } else {
//             parent[root_j]=root_i;
//             rank_dsu[root_i]++;
//         }
//         return true;
//     }
//     return false;
// }
//
// vector<Muchie> citeste_muchii_impuse(int n, const vector<Muchie>& listaMuchii) {
//     cout<<"Introdu extremitatile celor 3 muchii ce trebuie incluse in APM (u v):\n";
//
//     vector<Muchie> muchii_impuse;
//
//     for (int k=0; k<3; k++) {
//         int u_impus, v_impus;
//         cout<<"Muchia "<<k+1<<" (u v): ";
//         cin>>u_impus>>v_impus;
//
//         bool gasit = false;
//         for (const auto& m : listaMuchii) {
//             if ((m.u==u_impus && m.v==v_impus) || (m.u==v_impus && m.v==u_impus)) {
//                 muchii_impuse.push_back(m);
//                 gasit=true;
//                 break;
//             }
//         }
//
//         if (!gasit) {
//             return {};
//         }
//     }
//     return muchii_impuse;
// }
//
//
// void kruskal_modificat(int n, int m, vector<Muchie> listaMuchii) {
//     vector<Muchie> muchii_impuse = citeste_muchii_impuse(n, listaMuchii);
//
//     parent.assign(n+1, 0);
//     rank_dsu.assign(n+1, 0);
//     for (int i=1; i<=n; i++) {
//         parent[i]=i;
//     }
//
//     vector<Muchie> apm;
//     long long cost_total=0;
//     int muchii_selectate=0;
//     bool ciclu_impus=false;
//
//     //adaugarea muchiilor impuse
//     for (const auto &muchie : muchii_impuse) {
//         if (Union(muchie.u, muchie.v)) {
//             cost_total += muchie.cost;
//             apm.push_back(muchie);
//             muchii_selectate++;
//         } else {
//             // muchiile impuse formează un ciclu
//             ciclu_impus = true;
//             break;
//         }
//     }
//
//     if (ciclu_impus) return;
//
//     // eliminarea muchiilor impuse din lista generală pentru a evita dublarea
//     vector<Muchie> muchii_ramase;
//     for (const auto& m_list : listaMuchii) {
//         bool este_impusa = false;
//         for (const auto& m_impusa : muchii_impuse) {
//             if (((m_list.u == m_impusa.u && m_list.v == m_impusa.v) || (m_list.u == m_impusa.v && m_list.v == m_impusa.u))
//                 && m_list.cost == m_impusa.cost) {
//                 este_impusa=true;
//                 break;
//             }
//         }
//         if (!este_impusa) {
//             muchii_ramase.push_back(m_list);
//         }
//     }
//
//     sort(muchii_ramase.begin(), muchii_ramase.end(), comparaMuchii);
//
//     for (const auto &muchie : muchii_ramase) {
//         if (muchii_selectate == n - 1) {
//             break;
//         }
//
//         if (Union(muchie.u, muchie.v)) {
//             cost_total += muchie.cost;
//             apm.push_back(muchie);
//             muchii_selectate++;
//         }
//     }
//
//     if (muchii_selectate == n - 1) {
//         cout<<"Costul total al APM: "<<cost_total<<"\n";
//         cout<<"Muchiile din APM sunt:\n";
//         for (const auto &m : apm) {
//             cout<<m.u<<" - "<<m.v<<" (cost "<<m.cost<<")\n";
//         }
//     } else {
//         cout<<"APM nu poate fi construit\n";
//     }
// }
//
// int main() {
//     ifstream f("grafponderat.in");
//     int n, m;
//     f>>n>>m;
//
//     vector<Muchie> listaMuchii;
//     int u_curent, v_curent, cost_curent;
//
//     for(int i = 0; i < m; ++i) {
//         if (f>>u_curent>>v_curent>>cost_curent) {
//             listaMuchii.push_back({u_curent, v_curent, cost_curent});
//         }
//     }
//     f.close();
//
//     kruskal_modificat(n, m, listaMuchii);
//
//     return 0;
// }






// //2. Implementați algoritmul lui Prim pentru determinarea unui arbore parţial de cost minim al unui graf conex ponderat
// //cu n vârfuri și m muchii. Graful se va citi din fişierul grafpond.in. O(m log n) (+ și versiunea O(n2))
//
#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

// pereche (vecin, cost)
using Pair=pair<int, int>;
using Graph=vector<vector<Pair>>;

// structura pentru a stoca rezultatul
struct MuchieAPM {
    int u, v, cost;
};

void prim(int n, const Graph& adj) {
    // (cost, nod_destinatie)
    priority_queue<Pair, vector<Pair>, greater<Pair>> pq;

    // vârfurile incluse deja în APCM
    vector<bool> inAPM(n+1, false);

    // vector pentru a stoca costul minim de a ajunge la fiecare nod din APM
    // max_int reprezintă infinitul
    const int INF = numeric_limits<int>::max();
    vector<int> min_cost(n+1, INF);

    // vector pentru a stoca nodul din APCM care oferă costul minim către nodul curent
    vector<int> parent(n+1, -1);

    int start_node=1;
    min_cost[start_node]=0;

    //(cost,nod)
    pq.push({0, start_node});

    int muchii_selectate = 0;
    long long cost_total = 0;
    vector<MuchieAPM> apm_edges;

    while (!pq.empty() && muchii_selectate < n) {
        int u_cost=pq.top().first;
        int u=pq.top().second;
        pq.pop();

        if (inAPM[u]) {
            //daca e in APM
            continue;
        }

        inAPM[u]=true;
        cost_total += u_cost;

        //u nu este nodul de start și are un părinte, adăugăm muchia la rezultat
        if (u != start_node) {
            apm_edges.push_back({parent[u], u, u_cost});
            muchii_selectate++;
        }

        for (const auto& edge : adj[u]) {
            int v=edge.first;
            int v_cost=edge.second;

            if (!inAPM[v] && v_cost < min_cost[v]) {
                min_cost[v] = v_cost;
                parent[v] = u;
                pq.push({v_cost, v});
            }
        }
    }

    cout<<"APCM este: "<<cost_total<<"\n";
    cout<<"Muchiile care formeaza APCM sunt:\n";

    if (muchii_selectate == n - 1) {
        for (const auto& m : apm_edges) {
            cout<<min(m.u, m.v)<<" - "<<max(m.u, m.v)<<" (cost "<<m.cost<<")\n";
        }
    } else {
        cout<<"Graful nu este conex. APM nu a putut fi format complet.\n";
    }
}

int main() {
    ifstream f("grafponderat.in");

    int n, m;
    f>>n>>m;

    Graph adj(n + 1);
    int u, v, cost;

    for(int i=0; i<m; i++) {
        if (f>>u>>v>>cost) {
            adj[u].push_back({v, cost});
            adj[v].push_back({u, cost});
        }
    }
    f.close();

    prim(n, adj);

    return 0;
}



//TEMA
//1. (2.5p) Clustering. Fişierul cuvinte.in conţine cuvinte separate prin spaţiu. Se citeşte de la tastatură un număr
//natural k. Se consideră distanţa Levenshtein între două cuvinte. https://en.wikipedia.org/wiki/Levenshtein_distance
//Să se împartă cuvintele din fişier în k clase (categorii) nevide astfel încât gradul de separare al claselor să fie maxim
//( = distanţa minimă între două cuvinte din clase diferite) - v. curs; se vor afişa pe câte o linie cuvintele din fiecare clasă și pe
//o altă linie gradul de separare al claselor.

// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <string>
// #include <algorithm>
//
// using namespace std;
//
// vector<int> parent;
// vector<int> rank_dsu;
//
// int Find(int i) {
//     if (parent[i] == i) return i;
//     return parent[i]=Find(parent[i]);
// }
//
// bool Union(int i, int j) {
//     int root_i=Find(i);
//     int root_j=Find(j);
//
//     if (root_i != root_j) {
//         if (rank_dsu[root_i] < rank_dsu[root_j]) {
//             parent[root_i]=root_j;
//         } else if (rank_dsu[root_i] > rank_dsu[root_j]) {
//             parent[root_j]=root_i;
//         } else {
//             parent[root_j] = root_i;
//             rank_dsu[root_i]++;
//         }
//         return true;
//     }
//     return false;
// }
//
// //Distanța Levenshtein
// int levenshteinDistance(const string& s1, const string& s2) {
//     int n=s1.length();
//     int m=s2.length();
//     if (n == 0) return m;
//     if (m == 0) return n;
//
//     vector<int> dp(m + 1);
//
//     //distanța de la "" la prefixul de lungime j al lui s2
//     for (int j=0; j<=m; j++) {
//         dp[j]=j;
//     }
//
//     for (int i=1; i<=n; i++) {
//         int prev_diag = dp[0];
//         dp[0] = i;
//
//         for (int j=1; j<=m; j++) {
//             int current_diag=dp[j];
//
//             int cost=(s1[i-1] == s2[j-1]) ? 0 : 1;
//
//             // Calculăm d(i, j)
//             dp[j] = min({
//                 dp[j]+1,       // Ștergere (d(i-1, j) + 1)
//                 dp[j-1]+1,   // Inserare (d(i, j-1) + 1)
//                 prev_diag+cost // Substituție (d(i-1, j-1) + cost)
//             });
//
//             prev_diag = current_diag; // setează pentru iterația următoare
//         }
//     }
//     return dp[m];
// }
//
// struct Muchie {
//     int u, v, cost;
// };
//
// bool comparaMuchii(const Muchie& a, const Muchie& b) {
//     return a.cost<b.cost;
// }
//
// void solveClustering(const vector<string>& cuvinte, int k) {
//     int n=cuvinte.size();
//     if (n < k || n == 0) {
//         return;
//     }
//
//     // generarea tuturor muchiilor (noduri = cuvinte)
//     vector<Muchie> listaMuchii;
//     for (int i=0; i<n; i++) {
//         for (int j=i+1; j<n; j++) {
//             int dist=levenshteinDistance(cuvinte[i], cuvinte[j]);
//             listaMuchii.push_back({i, j, dist});
//         }
//     }
//
//     sort(listaMuchii.begin(), listaMuchii.end(), comparaMuchii);
//
//     parent.resize(n);
//     rank_dsu.assign(n, 0);
//     for (int i=0; i<n; i++) {
//         parent[i]=i;
//     }
//
//     int numar_clustere=n;
//     int grad_separare=0;
//
//     for (const auto& muchie : listaMuchii) {
//         // daca nodurile sunt în clustere diferite, le unim
//         if (Union(muchie.u, muchie.v)) {
//             numar_clustere--;
//         }
//
//
//         // oprire: ajungem la k clustere, muchia curentă
//         if (numar_clustere == k) {
//             for (size_t i = 0; i < listaMuchii.size(); ++i) {
//                 if (Find(listaMuchii[i].u) != Find(listaMuchii[i].v)) {
//                     grad_separare=listaMuchii[i].cost;
//                     break;
//                 }
//             }
//             break;
//         }
//     }
//
//     vector<vector<string>> clase(n);
//     for (int i = 0; i < n; ++i) {
//         int root = Find(i);
//         clase[root].push_back(cuvinte[i]);
//     }
//
//     for (int i=0; i<n; i++) {
//         if (!clase[i].empty()) {
//             for (size_t j=0; j<clase[i].size(); j++) {
//                 cout<<clase[i][j]<<(j == clase[i].size() - 1 ? "" : " ");
//             }
//             cout<<"\n";
//         }
//     }
//
//     cout<<"Gradul de separare al claselor: "<<grad_separare<<"\n";
// }
//
// int main() {
//     int k;
//     cout << "Introduceti numarul de clase (k): ";
//
//     ifstream f("cuvinte.in");
//     vector<string> cuvinte;
//     string cuvant;
//     while (f>>cuvant) {
//         cuvinte.push_back(cuvant);
//     }
//     f.close();
//
//     if (cuvinte.empty()) {
//         cout << "Fisierul cuvinte.in este gol.\n";
//         return 0;
//     }
//
//     solveClustering(cuvinte, k);
//
//     return 0;
// }






// //2.Conectarea cu cost minim a nodurilor la mai multe surse:
//
// //2.1. Problema solicită găsirea costului minim total de energie necesar pentru a distribui un program de mărime S de
// //la un set inițial de L stații la toate cele N stații.Costul total al distribuției este compus din două părți:
// //-Costul de Activare (Activare Channel): Cu,v unități de energie pentru a activa canalul (u, v).
// //-Costul de Transmitere (Transfer Program): S unități de energie pentru a trimite programul de S bytes, odată ce canalul (u, v) este activat.
//
// //=> Algoritmul lui Prim - O(N^2*log N)
//
// #include <iostream>
// #include <vector>
// #include <queue>
// #include <algorithm>
// #include <limits> // Pentru numeric_limits, deși nu e strict necesar aici
//
// using namespace std;
//
// // (vecin, cost_activare)
// using Edge=pair<int, int>;
// using Graph=vector<vector<Edge>>;
//
// // (cost_total, nod)
// using PQElement = pair<long long, int>;
//
// // N nr de statii, M nr de canale, S nr programului (bytes), L nr de statii initiale
// long long solve_dataset(int N, int M, long long S, int L,
//                         const vector<int>& initial_stations,
//                         const Graph& adj) {
//
//     // Algoritmul Prim: Costul total W_uv = Cost_activare + S
//
//     // Min-Heap: stochează (cost_total_minim, nod)
//     priority_queue<PQElement, vector<PQElement>, greater<PQElement>> pq;
//
//     // Vârfurile incluse APCM
//     vector<bool> inAPM(N+1, false);
//
//     long long cost_total=0;
//     // Câte noduri NOI (care nu sunt inițiale) au fost incluse în APM
//     int muchii_selectate=0;
//
//     // 1. Inițializare: Adăugăm stațiile inițiale cu cost 0
//     for (int start_node : initial_stations) {
//         pq.push({0, start_node});
//     }
//
//     // 2. Extinderea
//     while (!pq.empty()) {
//         long long u_cost_total=pq.top().first;
//         int u=pq.top().second;
//         pq.pop();
//
//         // Nodul u este deja în APCM (sau este o intrare veche cu cost mai mare)
//         if (inAPM[u]) {
//             continue;
//         }
//
//         // Adăugăm u la APCM
//         inAPM[u]=true;
//         cost_total+=u_cost_total;
//
//         // Numărăm muchiile/nodurile noi adăugate
//         if (u_cost_total > 0) {
//             muchii_selectate++;
//         }
//
//         // Dacă am conectat toate cele N-L stații noi, ne oprim.
//         if (muchii_selectate == N - L) {
//              break;
//         }
//
//         // 3. Parcurgem vecinii nodului u
//         for (const auto& edge : adj[u]) {
//             int v=edge.first;
//             int v_cost_activare=edge.second;
//
//             // Ponderea modificată: W_uv = C_uv + S
//             long long v_cost_total=(long long)v_cost_activare+S;
//
//             // Dacă vecinul v nu este în APM, îl adăugăm în coada de priorități
//             if (!inAPM[v]) {
//                 pq.push({v_cost_total, v});
//             }
//         }
//     }
//
//     return cost_total;
// }
//
//
// void read_and_solve() {
//     int num_datasets;
//     // CORECTIE 1: Citirea numărului de seturi de date
//     if (!(cin >> num_datasets)) return;
//
//     while (num_datasets--) {
//         int N, M, L;
//         long long S;
//
//         // Citirea N, M, S, L
//         if (!(cin>>N>>M>>S>>L)) break;
//
//         vector<int> initial_stations(L);
//         // Citirea stațiilor inițiale
//         for (int i=0; i<L; i++) {
//             if (!(cin>>initial_stations[i])) break; // CORECTIE: folosim break
//         }
//
//         // Citirea M canale
//         Graph adj(N+1);
//         for (int i=0; i<M; i++) {
//             int u, v, c;
//             if (!(cin>>u>>v>>c)) break; // CORECTIE: folosim break
//             adj[u].push_back({v, c});
//             adj[v].push_back({u, c});
//         }
//
//         long long min_energy=solve_dataset(N, M, S, L, initial_stations, adj);
//         cout<<min_energy<<"\n";
//     }
// }
//
// int main() {
//     read_and_solve();
//
//     return 0;
// }




// //2.2. Retea electrica: Problema solicită determinarea costului minim necesar pentru a conecta toate cele $M$ blocuri, astfel
// //încât fiecare bloc să primească energie electrică. Un bloc primește energie dacă este conectat la o centrală sau la un alt bloc
// //care primește deja energie
//
// //costul intre 2 puncte - distanta euclidiana
//
// //=> Algoritmul lui Prim -  O(M^2)
//
// #include <iostream>
// #include <vector>
// #include <cmath>
// #include <iomanip>
// #include <algorithm>
//
// using namespace std;
//
// struct Point {
//     long long x, y;
// };
//
// // distanta euclidiana
// double euclidean_distance(const Point& p1, const Point& p2) {
//     long long dx=p1.x-p2.x;
//     long long dy=p1.y-p2.y;
//     return sqrt((double)dx*dx + (double)dy*dy);
// }
//
// // "infinit"
// const double INF = numeric_limits<double>::infinity();
//
// void solve_retea2() {
//     int N, M;
//     if (!(cin>>N>>M)) return;
//
//     vector<Point> centrale(N);
//     for (int i=0; i<N; i++) {
//         cin>>centrale[i].x>>centrale[i].y;
//     }
//
//     vector<Point> blocuri(M);
//     for (int i=0; i<M; i++) {
//         cin>>blocuri[i].x>>blocuri[i].y;
//     }
//
//     if (M == 0) {
//         cout << fixed << setprecision(6) << 0.0 << "\n";
//         return;
//     }
//
//     vector<double> D(M, INF);
//     vector<bool> inAPM(M, false);
//
//     for (int j=0; j<M; j++) {
//         for (int i=0; i<N; i++) {
//             D[j]=min(D[j], euclidean_distance(blocuri[j], centrale[i]));
//         }
//     }
//
//     double cost_total = 0.0;
//     int muchii_selectate = 0;
//
//     for (int count = 0; count < M; ++count) {
//         double min_cost = INF;
//         int u = -1;
//
//         // a) Caută nodul u cu distanța minimă, neincluse încă în APM (O(M))
//         for (int j=0; j<M; j++) {
//             if (!inAPM[j] && D[j] < min_cost) {
//                 min_cost=D[j];
//                 u=j;
//             }
//         }
//
//         if (u==-1) break;
//
//         // b) Include nodul u în APM
//         inAPM[u]=true;
//         cost_total+=min_cost;
//         muchii_selectate++;
//
//         // c) Actualizează distanțele vecinilor neincluși (O(M))
//         for (int v=0; v<M; v++) {
//             if (!inAPM[v]) {
//                 double dist_uv = euclidean_distance(blocuri[u], blocuri[v]);
//
//                 if (dist_uv < D[v]) {
//                     D[v]=dist_uv;
//                 }
//             }
//         }
//     }
//
//     cout<<fixed<<setprecision(6)<<cost_total<< "\n";
// }
//
// int main() {
//     solve_retea2();
//
//     return 0;
// }



//
// //3.Graf dinamic
// #include <iostream>
// #include <vector>
// #include <algorithm>
// #include <cmath>
//
// using namespace std;
//
// const int MAXN = 10005;
// const int MAX_LOG = 14;
//
// struct Edge {
//     int u, v, cost;
// };
//
// bool compareEdges(const Edge& a, const Edge& b) {
//     return a.cost<b.cost;
// }
//
// int parent_dsu[MAXN];
// int rank_dsu[MAXN];
//
// int Find(int i) {
//     if (parent_dsu[i] == i) return i;
//     return parent_dsu[i]=Find(parent_dsu[i]);
// }
//
// bool Union(int i, int j) {
//     int root_i=Find(i);
//     int root_j=Find(j);
//     if (root_i!=root_j) {
//         if (rank_dsu[root_i] < rank_dsu[root_j]) {
//             parent_dsu[root_i]=root_j;
//         } else if (rank_dsu[root_i] > rank_dsu[root_j]) {
//             parent_dsu[root_j]=root_i;
//         } else {
//             parent_dsu[root_j]=root_i;
//             rank_dsu[root_i]++;
//         }
//         return true;
//     }
//     return false;
// }
//
// //LCA
// vector<pair<int, int>> adj[MAXN]; // (vecin, cost)
// int depth[MAXN];
// int P[MAXN][MAX_LOG]; // stramoșul de la distanță 2^k
// int M[MAXN][MAX_LOG]; // costul maxim pe drumul de la u la P[u][k]
//
// // DFS pentru a construi arborele și a pre-calcula P[u][0], M[u][0] și depth
// void dfs(int u, int p, int d, int cost_p) {
//     depth[u]=d;
//     P[u][0]=p;
//     M[u][0]=cost_p;
//
//     for (const auto& edge : adj[u]) {
//         int v=edge.first;
//         int cost=edge.second;
//         if (v != p) {
//             dfs(v, u, d+1, cost);
//         }
//     }
// }
//
// void preprocess(int N) {
//     dfs(1, 0, 0, 0);
//
//     for (int k=1; k<MAX_LOG; k++) {
//         for (int u=1; u<=N; u++) {
//             int ancestor=P[u][k-1];
//             P[u][k]=P[ancestor][k-1];
//
//             M[u][k] = max(M[u][k - 1], M[ancestor][k - 1]);
//         }
//     }
// }
//
// int query_max_cost(int u, int v) {
//     int max_c = 0;
//
//     if (depth[u] < depth[v]) swap(u, v);
//
//     for (int k =MAX_LOG-1; k>=0; k--) {
//         if (depth[u] - (1 << k) >= depth[v]) {
//             max_c=max(max_c, M[u][k]);
//             u=P[u][k];
//         }
//     }
//
//     if (u == v) return max_c;
//
//     for (int k = MAX_LOG - 1; k >= 0; --k) {
//         if (P[u][k] != P[v][k]) {
//             max_c = max(max_c, M[u][k]);
//             max_c = max(max_c, M[v][k]);
//             u = P[u][k];
//             v = P[v][k];
//         }
//     }
//
//     max_c = max(max_c, M[u][0]);
//     max_c = max(max_c, M[v][0]);
//
//     return max_c;
// }
//
// void solve_apm2() {
//     int N, M, Q;
//     if (!(cin>>N>>M>>Q)) return;
//
//     vector<Edge> initial_edges(M);
//     for (int i=0; i<M; i++) {
//         cin>>initial_edges[i].u>>initial_edges[i].v>>initial_edges[i].cost;
//     }
//
//     vector<pair<int, int>> queries(Q);
//     for (int i=0; i<Q; i++) {
//         cin>>queries[i].first>>queries[i].second;
//     }
//
//     sort(initial_edges.begin(), initial_edges.end(), compareEdges);
//
//     for (int i=1; i<=N; i++) {
//         parent_dsu[i]=i;
//         rank_dsu[i]=0;
//     }
//
//     for (const auto& edge : initial_edges) {
//         if (Union(edge.u, edge.v)) {
//             // Muchie in APCM
//             adj[edge.u].push_back({edge.v, edge.cost});
//             adj[edge.v].push_back({edge.u, edge.cost});
//         }
//     }
//
//
//     preprocess(N);
//
//     for (const auto& q : queries) {
//         int A = q.first;
//         int B = q.second;
//
//         int max_cost_on_path = query_max_cost(A, B);
//         int result = max_cost_on_path - 1;
//
//         cout << max(1, result) << "\n";
//     }
// }
//
// int main() {
//     solve_apm2();
//
//     return 0;
// }






// //4.Second best minimum spanning tree.
// #include <iostream>
// #include <vector>
// #include <algorithm>
// #include <numeric>
// #include <limits>
//
// using namespace std;
//
// const int MAXN=105;
// const int MAX_LOG=8;
//
// struct Edge {
//     int u, v, cost;
//     bool in_mst;
// };
//
// bool cmp(const Edge &a, const Edge &b) {
//     return a.cost<b.cost;
// }
//
// int parent_dsu[MAXN];
//
// void init_dsu(int n) {
//     iota(parent_dsu, parent_dsu+n+1, 0);
// }
//
// int Find(int x) {
//     if (parent_dsu[x]==x) return x;
//     return parent_dsu[x] = Find(parent_dsu[x]);
// }
//
// bool Union(int a, int b) {
//     int ra=Find(a);
//     int rb=Find(b);
//     if (ra==rb) return false;
//     parent_dsu[rb]=ra;
//     return true;
// }
//
// vector<pair<int, int>> adj[MAXN];
// int depth_[MAXN];
// int P[MAXN][MAX_LOG];
// int M[MAXN][MAX_LOG]; // costul maxim de pe drum
//
// void dfs(int u, int p, int cost_p) {
//     P[u][0]=p;
//     M[u][0]=cost_p;
//     for (auto [v, cost] : adj[u]) {
//         if (v!=p) {
//             depth_[v]=depth_[u]+1;
//             dfs(v, u, cost);
//         }
//     }
// }
//
// void preprocess(int N) {
//     dfs(1, 0, 0);
//     for (int k=1; k<MAX_LOG; k++) {
//         for (int u=1; u<=N; u++) {
//             int ancestor=P[u][k-1];
//             if (ancestor == 0) {
//                 P[u][k]=0;
//                 M[u][k]=M[u][k-1];
//             } else {
//                 P[u][k]=P[ancestor][k-1];
//                 M[u][k]=max(M[u][k-1], M[ancestor][k-1]);
//             }
//         }
//     }
// }
//
// int query_max_cost(int u, int v) {
//     if (u==v) return 0;
//     int max_c=0;
//
//     if (depth_[u] < depth_[v]) swap(u, v);
//
//     // urcăm u până la același nivel cu v
//     for (int k=MAX_LOG-1; k>=0; k--) {
//         if (depth_[u]-(1<<k) >= depth_[v]) {
//             max_c=max(max_c, M[u][k]);
//             u=P[u][k];
//         }
//     }
//
//     if (u == v) return max_c;
//
//     // urcăm amândoi până la LCA
//     for (int k=MAX_LOG-1; k>=0; k--) {
//         if (P[u][k] != P[v][k]) {
//             max_c=max(max_c, M[u][k]);
//             max_c=max(max_c, M[v][k]);
//             u=P[u][k];
//             v=P[v][k];
//         }
//     }
//
//     max_c=max(max_c, M[u][0]);
//     max_c=max(max_c, M[v][0]);
//
//     return max_c;
// }
//
// void solve() {
//     int N, M_edges;
//     cin>>N>>M_edges;
//
//     vector<Edge> edges(M_edges);
//     for (int i=0; i<M_edges; i++) {
//         cin>>edges[i].u>>edges[i].v>>edges[i].cost;
//         edges[i].in_mst=false;
//     }
//
//     sort(edges.begin(), edges.end(), cmp);
//     init_dsu(N);
//
//     long long S1=0;
//
//     for (int i=1; i<=N; i++) adj[i].clear();
//
//     // Kruskal
//     for (int i=0; i<M_edges; i++) {
//         if (Union(edges[i].u, edges[i].v)) {
//             S1+=edges[i].cost;
//             edges[i].in_mst=true;
//             adj[edges[i].u].push_back({edges[i].v, edges[i].cost});
//             adj[edges[i].v].push_back({edges[i].u, edges[i].cost});
//         }
//     }
//
//     preprocess(N);
//
//     long long S2 = numeric_limits<long long>::max();
//
//     //fiecare muchie care NU e în MST
//     for (int i=0; i<M_edges; i++) {
//         if (!edges[i].in_mst) {
//             int u=edges[i].u;
//             int v=edges[i].v;
//             int c=edges[i].cost;
//
//             int max_on_path=query_max_cost(u, v);
//             long long candidate=S1 - max_on_path + c;
//             if (candidate > S1) S2=min(S2, candidate);
//             else if (candidate==S1) S2=S1; // exista două MST egale
//         }
//     }
//
//     cout<<S1<<" "<<S2<<"\n";
// }
//
// int main() {
//     solve();
//     return 0;
// }

