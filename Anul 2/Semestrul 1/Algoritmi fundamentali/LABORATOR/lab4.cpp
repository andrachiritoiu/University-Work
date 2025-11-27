//1.Drum critic (Critical Path Method)

#include <iostream>
#include <fstream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

struct Activitate {
    int id;
    int durata;
    vector<int> succ;
};

int main() {
    ifstream f("activitati.in");

    int n;
    f>>n;

    vector<Activitate> act(n + 1);
    for (int i=1; i<=n; i++) {
        act[i].id = i;
        f>>act[i].durata;
    }

    int m;
    f>>m;
    vector<int> grad_intrare(n + 1, 0);
    for (int i=0; i<m; i++) {
        int u, v;
        f>>u>>v;
        act[u].succ.push_back(v);
        grad_intrare[v]++;
    }
    f.close();

    // Sortare Topologica si Earliest Start
    vector<int> ES(n+1, 0);
    queue<int> q;
    vector<int> topo;

    for (int i = 1; i <= n; i++)
        if (grad_intrare[i] == 0) {
            q.push(i);
            ES[i] = 0; //momentul de start
        }

    while (!q.empty()) {
        int u = q.front(); q.pop();
        topo.push_back(u);

        for (int v : act[u].succ) {
            // trebui sa alegem cea mai tarzie activitate precedenta
            if (ES[u] + act[u].durata > ES[v]) {
                ES[v] = ES[u] + act[u].durata;
            }
            grad_intrare[v]--;
            if (grad_intrare[v] == 0) q.push(v);
        }
    }

    int timp_total = 0;
    for (int i=1; i<=n; i++) {
        int finish_time = ES[i] + act[i].durata;
        if (finish_time > timp_total) {
            timp_total = finish_time;
        }
    }

    //Latest Start
    // initializare: fiecare activitate se termina la sfarsitul proiectului
    vector<int> LS(n + 1);
    for(int i=1; i<=n; i++) {
        LS[i] = timp_total - act[i].durata;
    }

    reverse(topo.begin(), topo.end());

    for (int u : topo) {
        // pentru a nu intarzia proiectul, u trebuie sa se termine inainte sa inceapa oricare succesor v
        for (int v : act[u].succ) {
            if (LS[v] - act[u].durata < LS[u]) {
                LS[u] = LS[v] - act[u].durata;
            }
        }
    }

    vector<int> drum_critic;
    for (int i=1; i<=n; i++) {
        // o activitate e critica daca nu are timp de asteptare (ES == LS)
        if (ES[i] == LS[i]) {
            drum_critic.push_back(i);
        }
    }

    cout<<"Timp minim "<<timp_total<<endl;

    cout<<"Activitati critice: ";
    for (int a : drum_critic) cout<<a<<" ";
    cout<<endl;

    for (int i=1; i<=n; i++) {
        cout<<i<<": "<<ES[i]<<" "<<(ES[i] + act[i].durata)<<endl;
    }

    return 0;
}





//2. Punct de control (Dijkstra)
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <queue>
// #include <algorithm>
// using namespace std;
//
// const int INF = 1e9;
//
// int main() {
//     ifstream f("grafpond.in");
//     ofstream g("grafpond.out");
//
//     int n, m;
//     f>>n>>m;
//
//     //{vecin,cost}
//     vector<vector<pair<int,int>>> G(n+1); //graf neorintat
//
//     for(int i=0; i<m; i++){
//         int a, b, c;
//         f>>a>>b>>c;
//         G[a].push_back({b, c});
//         G[b].push_back({a, c});
//     }
//
//     int k;
//     f>>k;
//     vector<int> control(k);
//     for(int i=0; i<k; i++)
//         f>>control[i];
//
//     int s;
//     f>>s;
//
//     //Dijkstra
//     vector<int> dist(n+1, INF);
//     vector<int> prev(n+1, -1);
//
//     //min heap - ne da accesc la nodul nevizitat care e cel mai aproape de sursa
//     priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
//
//     dist[s] = 0;
//
//     //distanta pana la nod, nod
//     pq.push({0, s});
//
//     while(!pq.empty()) {
//         auto [d, node] = pq.top();
//         pq.pop();
//
//         if (d != dist[node]) continue;
//
//         //relaxarea muchiilor
//         for(auto &x : G[node]){
//             int vec = x.first;
//             int cost = x.second;
//
//             if(dist[node] + cost < dist[vec]){
//                 dist[vec] = dist[node] + cost;
//                 prev[vec] = node;
//                 pq.push({dist[vec], vec});
//             }
//         }
//     }
//
//
//     int bestNode = -1;
//     int bestDist = INF;
//
//     for(int pc : control){
//         if(dist[pc] < bestDist){
//             bestDist = dist[pc];
//             bestNode = pc;
//         }
//     }
//
//     g<<bestNode<<"\n";
//
//     //reconstruire drum
//     vector<int> drum;
//     for(int x = bestNode; x != -1; x = prev[x])
//         drum.push_back(x);
//
//     reverse(drum.begin(), drum.end());
//
//     for(int x : drum) g<<x<<" ";
//     g<<"\n";
//
//     return 0;
// }



//3.Drum de siguranta maxima - Dijkstra
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <queue>
// #include <stack>
// #include <cmath>
//
// using namespace std;
//
// const int INF = 1e9;
// typedef pair<int, int> pii;
//
// int main() {
//     ifstream fin("retea.in");
//
//     int n, m;
//     fin>>n>>m;
//
//     // Lista de adiacenta: adj[u] = {v, p}
//     // p este exponentul(COST)
//     vector<vector<pair<int, int>>> adj(n + 1);
//
//     for (int k=0; k<m; k++) {
//         int u, v, p;
//         fin>>u>>v>>p;
//         adj[u].push_back({v, p}); //graf orientat
//     }
//     fin.close();
//
//     int start, end;
//     cout<<"Introduceti nodul de start (s) si destinatie (t): ";
//     cin>>start>>end;
//
//     //Dijkstra
//     // dist[i]=SUMA MINIMA a exponentilor p de la start la i
//     vector<int> dist(n + 1, INF);
//     vector<int> parent(n + 1, 0);
//
//     priority_queue<pii, vector<pii>, greater<pii>> pq;
//
//     dist[start] = 0;
//     pq.push({0, start});
//
//     while (!pq.empty()) {
//         int d = pq.top().first;
//         int u = pq.top().second;
//         pq.pop();
//
//         if (d > dist[u]) continue;
//
//         //daca am ajuns la destinatie
//         if (u == end) break;
//
//         for (auto edge : adj[u]) {
//             int v = edge.first;
//             int cost_p = edge.second;
//
//             //relaxare
//             if (dist[u] + cost_p < dist[v]) {
//                 dist[v] = dist[u] + cost_p;
//                 parent[v] = u;
//                 pq.push({dist[v], v});
//             }
//         }
//     }
//
//
//     if (dist[end] == INF) {
//         cout<<"Nu exista drum intre "<<start<<" si "<<end<<"."<<endl;
//     } else {
//         cout<<"Suma minima a exponentilor (costul): "<<dist[end]<<endl;
//
//         double siguranta = pow(2.0, -dist[end]);
//         cout<<"Siguranta maxima (Probabilitatea): 2^-"<<dist[end]<<" ("<<siguranta<<")"<<endl;
//
//         cout << "Drumul de siguranta maxima: ";
//         stack<int> drum;
//         int curr = end;
//         while (curr != 0) {
//             drum.push(curr);
//             curr = parent[curr];
//         }
//
//         while (!drum.empty()) {
//             cout<<drum.top()<<" ";
//             drum.pop();
//         }
//         cout<<endl;
//     }
//
//     return 0;
// }


//4.Drumuri minime din surse multiple - Dijkstra
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <queue>
// #include <algorithm>
//
// using namespace std;
//
// const int INF = 1e9;
// const int MAXN = 10000;
//
// // {distanta, nod}
// typedef pair<int, int> pii;
//
// int dist[MAXN];
// int stapan[MAXN];
// bool e_fortareata[MAXN];
//
// int main() {
//     ifstream fin("catun.in");
//     ofstream fout("catun.out");
//
//     int n, m, k;
//     fin>>n>>m>>k;
//
//     for (int i=1; i<=n; i++) {
//         dist[i] = INF;
//         stapan[i] = 0;
//         e_fortareata[i] = false;
//     }
//
//     priority_queue<pii, vector<pii>, greater<pii>> pq;
//
//     for (int i = 0; i < k; i++) {
//         int id_fortareata;
//         fin>>id_fortareata;
//
//         dist[id_fortareata] = 0;
//         stapan[id_fortareata] = id_fortareata;
//         e_fortareata[id_fortareata] = true;
//
//         pq.push({0, id_fortareata});
//     }
//
//     vector<vector<pair<int, int>>> adj(n + 1);
//     for (int i = 0; i < m; i++) {
//         int u, v, c;
//         fin>>u>>v>>c;
//         adj[u].push_back({v, c});
//         adj[v].push_back({u, c});
//     }
//
//     // DIJKSTRA MULTI-SURSA
//     while (!pq.empty()) {
//         int d = pq.top().first;
//         int u = pq.top().second;
//         pq.pop();
//
//         if (d > dist[u]) continue;
//
//         for (auto edge : adj[u]) {
//             int v = edge.first;
//             int cost = edge.second;
//
//             if (dist[u] + cost < dist[v]) {
//                 dist[v] = dist[u] + cost;
//                 stapan[v] = stapan[u];
//                 pq.push({dist[v], v});
//             }
//             else if (dist[u] + cost == dist[v]) {
//                 if (stapan[u] < stapan[v]) {
//                     stapan[v] = stapan[u];
//                     pq.push({dist[v], v});
//                 }
//             }
//         }
//     }
//
//     for (int i=1; i<=n; i++) {
//         if (e_fortareata[i]) {
//             fout<<"0 ";
//         } else {
//             fout << stapan[i] << " ";
//         }
//     }
//     return 0;
// }




//5.Bellman-Ford - pt grafuri cu ponderi negative
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <algorithm>
//
// using namespace std;
//
// const int INF = 1e9;
//
// struct Muchie {
//     int u, v, cost;
// };
//
// int main() {
//     ifstream fin("grafpond.in");
//
//     int n, m;
//     fin>>n>>m;
//
//     vector<Muchie> muchii;
//     for (int i=0; i<m; i++) {
//         int u, v, c;
//         fin>>u>>v>>c;
//         muchii.push_back({u, v, c});
//     }
//
//     int start;
//     fin>>start;
//
//     vector<int> dist(n + 1, INF);
//     vector<int> parinte(n + 1, 0);
//     dist[start] = 0;
//
//     int x = -1;
//
//     for (int i=0; i<n; i++) {
//         x = -1;
//         for (const auto& m : muchii) {
//             if (dist[m.u] != INF && dist[m.u] + m.cost < dist[m.v]) {
//                 dist[m.v] = dist[m.u] + m.cost;
//                 parinte[m.v] = m.u;
//                 x = m.v; //retinem ca s-a facut modificare
//             }
//         }
//         // daca intr-un pas nu s-a relaxat nimic, ne oprim (avem deja drumurile minime)
//         // continuam pana la n daca vrem sa detectam ciclul exact la pasul n-1
//     }
//
//     if (x != -1) {
//         //in ciclu
//         cout<<"Circuit de cost negativ:"<<endl;
//
//         //verif ca suntem in ciclu
//         for (int i = 0; i < n; i++) {
//             x = parinte[x];
//         }
//
//         vector<int> ciclu;
//         int curr = x;
//         while (true) {
//             ciclu.push_back(curr);
//             if (curr == x && ciclu.size() > 1) break;
//             curr = parinte[curr];
//         }
//
//         reverse(ciclu.begin(), ciclu.end());
//         for (int node : ciclu) cout<<node<<" ";
//         cout << endl;
//
//     } else {
//         //fara ciclu
//         for (int i = 1; i <= n; i++) {
//             if (i == start) continue;
//             if (dist[i] == INF) continue;
//
//             cout << "Drum: ";
//
//             vector<int> drum;
//             int curr = i;
//             while (curr != 0) {
//                 drum.push_back(curr);
//                 curr = parinte[curr];
//             }
//             reverse(drum.begin(), drum.end());
//
//             for (int node : drum) cout<<node<<" ";
//             cout<<" Cost: "<<dist[i]<<endl;
//         }
//     }
//
//     return 0;
// }




//6.Floyd-Warhsall
//a)matricea distantelor sau ciclul negativ - graf orientat
// #include <iostream>
// #include <fstream>
// #include <vector>
//
// using namespace std;
//
// const int INF = 1e9;
//
// int dist[105][105];
// int next_node[105][105];  //pt reconstruirea drumului
//
// int main() {
//     ifstream fin("grafpond.in");
//     ofstream fout("grafpond.out");
//
//     int n, m;
//     fin>>n>>m;
//
//     for (int i=1; i<=n; i++) {
//         for (int j=1; j<=n; j++) {
//             if (i == j) dist[i][j] = 0;
//             else dist[i][j] = INF;
//             next_node[i][j] = -1;
//         }
//     }
//
//     for (int i=0; i<m; i++) {
//         int u, v, w;
//         fin>>u>>v>>w;
//         dist[u][v] = w;
//         next_node[u][v] = v; // urmatorul nod de la u spre v este v
//     }
//
//     //Floyd-Warshall - O(n^3)
//     for (int k=1; k<=n; k++) {
//         for (int i=1; i <= n; i++) {
//             for (int j=1; j<=n; j++) {
//                 if (dist[i][k] != INF && dist[k][j] != INF) {
//                     if (dist[i][k] + dist[k][j] < dist[i][j]) {
//                         dist[i][j] = dist[i][k] + dist[k][j];
//                         next_node[i][j] = next_node[i][k];
//                     }
//                 }
//             }
//         }
//     }
//
//     //circuit negativ
//     int nod_ciclu = -1;
//     for (int i = 1; i <= n; i++) {
//         if (dist[i][i] < 0) {
//             nod_ciclu = i;
//             break;
//         }
//     }
//
//     if (nod_ciclu != -1) {
//         fout << "Circuit de cost negativ:" << endl;
//         int curr = nod_ciclu;
//         do {
//             fout<<curr<<" ";
//             curr = next_node[curr][nod_ciclu];
//         } while (curr != nod_ciclu && curr != -1);
//         fout<<endl;
//     } else {
//         for (int i=1; i<=n; i++) {
//             for (int j=1; j<=n; j++) {
//                 if (dist[i][j] == INF) fout<<"0 ";
//                 else fout<<dist[i][j]<<" ";
//             }
//             fout<<endl;
//         }
//     }
//
//     return 0;
// }




//b)graf neorientat
// #include <iostream>
// #include <fstream>
// #include <vector>
// #include <algorithm>
//
// using namespace std;
//
// const int INF = 1e9;
// int dist[105][105];
// int next_node[105][105];
//
// int main() {
//     ifstream fin("grafpond.in");
//     ofstream fout("grafpond.out");
//
//     int n, m;
//     fin>>n>>m;
//
//     for (int i=1; i<=n; i++) {
//         for (int j=1; j<=n; j++) {
//             dist[i][j] = (i == j) ? 0 : INF;
//             next_node[i][j] = 0;
//         }
//     }
//
//     for (int i=0; i<m; i++) {
//         int u, v, w;
//         fin>>u>>v>>w;
//
//         dist[u][v] = w;
//         dist[v][u] = w;
//
//         next_node[u][v] = v;
//         next_node[v][u] = u;
//     }
//
//     // Floyd-Warshall
//     for (int k = 1; k <= n; k++) {
//         for (int i = 1; i <= n; i++) {
//             for (int j = 1; j <= n; j++) {
//                 if (dist[i][k] != INF && dist[k][j] != INF) {
//                     if (dist[i][k] + dist[k][j] < dist[i][j]) {
//                         dist[i][j] = dist[i][k] + dist[k][j];
//                         next_node[i][j] = next_node[i][k];
//                     }
//                 }
//             }
//         }
//     }
//
//     // Excentricitati, Raza si Diametru
//     vector<int> e(n + 1); // Excentricitatile
//     int raza = INF;
//     int diametru = 0;
//
//     int start_node = 0, end_node = 0;
//
//     for (int i = 1; i <= n; i++) {
//         int max_dist = 0;
//         for (int j = 1; j <= n; j++) {
//             if (dist[i][j] != INF) {
//                 max_dist = max(max_dist, dist[i][j]);
//             }
//         }
//         e[i] = max_dist;
//
//         // actualizare Raza (minimul excentricitatilor)
//         if (e[i] < raza) raza = e[i];
//
//         // actualizare Diametru (maximul excentricitatilor)
//         if (e[i] > diametru) diametru = e[i];
//     }
//
//     // perechea exacta care da diametrul pentru afisare drum
//     for(int i=1; i<=n; i++){
//         for(int j=1; j<=n; j++){
//             if(dist[i][j] == diametru){
//                 start_node = i;
//                 end_node = j;
//                 goto gasit;
//             }
//         }
//     }
//     gasit:;
//
//     fout<<"Raza: "<<raza<<endl;
//
//     fout<<"Centrul: ";
//     for (int i=1; i<=n; i++) {
//         if (e[i] == raza) fout<<i<<" ";
//     }
//     fout<<endl;
//
//     fout<<"Diametrul: "<<diametru<<endl;
//
//     fout<<"Lant diametral: ";
//     if (start_node != 0 && end_node != 0) {
//         int curr = start_node;
//         while (curr != end_node) {
//             fout<<curr<<" ";
//             curr = next_node[curr][end_node];
//         }
//         fout<<end_node<<endl;
//     } else {
//         fout<<"Graf deconectat sau eroare."<<endl;
//     }
//
//     return 0;
// }