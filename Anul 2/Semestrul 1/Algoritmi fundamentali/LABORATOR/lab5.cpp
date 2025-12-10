//1.Flux maxim
//#include <iostream>
//#include <vector>
//#include <queue>
//#include <algorithm>
//
//using namespace std;
//
//const int INF = 1000000;
//
//struct Arc {
//    int u, v, capacitate, flux_initial;
//};
//
//vector<vector<int>> capacitate;
//vector<vector<int>> flux;
//int N;
//
////a)
//bool verifica_flux_initial(int s, int t, const vector<Arc>& arce) {
//    // 1.marginirea (0 <= f(u,v) <= c(u,v))
//    for (const auto& arc : arce) {
//        if (arc.flux_initial < 0 || arc.flux_initial > arc.capacitate) {
//            cout << "Incalcarea constrangerii de marginire pe arcul (" << arc.u << "," << arc.v << ")." << endl;
//            return false;
//        }
//        flux[arc.u][arc.v] = arc.flux_initial;
//    }
//
//    // 2.conservarea fluxului
//    for (int i = 1; i <= N; ++i) {
//        if (i == s || i == t) continue; // sursa si destinatia sunt exceptii
//
//        int flux_intrare = 0;
//        int flux_iesire = 0;
//
//        for (int j = 1; j <= N; ++j) {
//            flux_intrare += flux[j][i];
//
//            flux_iesire += flux[i][j];
//        }
//
//        if (flux_intrare != flux_iesire) {
//            cout << "Incalcarea constrangerii de conservare a fluxului in varful " << i << ". Intrare=" << flux_intrare << ", Iesire=" << flux_iesire << "." << endl;
//            return false;
//        }
//    }
//
//    return true;
//}
//
////b) Algoritmul Ford-Fulkerson (Folosind BFS pentru lanturi minime)
//
//// BFS pentru a gasi un s-t lant nesaturat de capacitate minima in retea reziduala
//int bfs(int s, int t, vector<int>& parinte, const vector<vector<int>>& capacitate_reziduala) {
//    fill(parinte.begin(), parinte.end(), -1);
//    parinte[s] = -2; //\nodul de start
//    queue<pair<int, int>> q;
//    q.push({s, INF}); // nod, capacitatea fluxului pe lantul gasit pana la acest nod
//
//    while (!q.empty()) {
//        int u = q.front().first;
//        int flow = q.front().second;
//        q.pop();
//
//        for (int v = 1; v <= N; ++v) {
//            // arce cu capacitate reziduala pozitiva
//            if (parinte[v] == -1 && capacitate_reziduala[u][v] > 0) {
//                parinte[v] = u;
//                int new_flow = min(flow, capacitate_reziduala[u][v]);
//                if (v == t)
//                    return new_flow;
//                q.push({v, new_flow});
//            }
//        }
//    }
//
//    return 0;
//}
//
//void ford_fulkerson(int s, int t, vector<Arc>& arce) {
//    long long flux_total = 0;
//
//    vector<vector<int>> capacitate_reziduala = capacitate;
//
//    for (const auto& arc : arce) {
//        capacitate_reziduala[arc.u][arc.v] = arc.capacitate - flux[arc.u][arc.v];
//        capacitate_reziduala[arc.v][arc.u] = flux[arc.u][arc.v]; // Arcul invers
//        flux_total += (arc.u == s) ? flux[arc.u][arc.v] : 0; // suma fluxului initial din sursa
//    }
//
//    int flux_crescut = 0;
//    vector<int> parinte(N + 1);
//
//    // bucle Ford-Fulkerson: se cauta lanturi nesaturate pana nu se mai gaseste niciunul
//    while (flux_crescut = bfs(s, t, parinte, capacitate_reziduala)) {
//        flux_total += flux_crescut;
//        int curr = t;
//
//        // revizuirea fluxului pe lantul gasit
//        while (curr != s) {
//            int prev = parinte[curr];
//
//            // actualizarea fluxului in retea
//            // arcul (prev, curr) direct - crestem fluxul
//            if (flux[prev][curr] > 0 || capacitate[prev][curr] > 0) {
//                 flux[prev][curr] += flux_crescut;
//            } else { // arc invers (se reduce fluxul pe arcul (curr, prev))
//                flux[curr][prev] -= flux_crescut;
//            }
//
//            // actualizarea retelei reziduale
//            capacitate_reziduala[prev][curr] -= flux_crescut;
//            capacitate_reziduala[curr][prev] += flux_crescut;
//
//            curr = prev;
//        }
//    }
//
//
//    cout << "Valoarea fluxului obtinut: " << flux_total << endl;
//    cout << "Fluxul final pe fiecare arc (u, v):" << endl;
//
//    for (const auto& arc : arce) {
//        cout << "(" << arc.u << ", " << arc.v << "): " << flux[arc.u][arc.v] << "/" << arc.capacitate << endl;
//    }
//
//
//    // tăieturii minime (Max-Flow Min-Cut Theorem)
//    cout << "Capacitatea minima a unei taieturi: " << flux_total << endl;
//
//    vector<bool> accesibil(N + 1, false);
//    queue<int> q_cut;
//    q_cut.push(s);
//    accesibil[s] = true;
//
//    while (!q_cut.empty()) {
//        int u = q_cut.front();
//        q_cut.pop();
//
//        for (int v = 1; v <= N; ++v) {
//            if (!accesibil[v] && capacitate_reziduala[u][v] > 0) {
//                accesibil[v] = true;
//                q_cut.push(v);
//            }
//        }
//    }
//
//    cout << "Arcele directe ale unei taieturi minime (S, T):" << endl;
//    for (const auto& arc : arce) {
//        if (accesibil[arc.u] && !accesibil[arc.v]) {
//            cout << "(" << arc.u << ", " << arc.v << ") (capacitate: " << arc.capacitate << ")" << endl;
//        }
//    }
//}
//
//void problema1() {
//    int m, s, t;
//    cout << "Introdu n (numarul de varfuri), s (sursa), t (destinatia): ";
//    cin >> N >> s >> t;
//    cout << "Introdu m (numarul de arce): ";
//    cin >> m;
//
//    capacitate.assign(N + 1, vector<int>(N + 1, 0));
//    flux.assign(N + 1, vector<int>(N + 1, 0));
//    vector<Arc> arce;
//
//    cout << "Introdu cele " << m << " arce (u, v, c, f_initial):" << endl;
//    for (int i = 0; i < m; ++i) {
//        int u, v, c, f_initial;
//        cin >> u >> v >> c >> f_initial;
//        arce.push_back({u, v, c, f_initial});
//        capacitate[u][v] = c;
//    }
//
//    cout << "\n--- Verificare Flux Initial ---\n";
//    if (verifica_flux_initial(s, t, arce)) {
//        cout << "Fluxul initial este corect. DA" << endl;
//
//        ford_fulkerson(s, t, arce);
//    } else {
//        cout << "Fluxul initial nu este corect. NU" << endl;
//    }
//}
//
//int main() {
//    problema1();
//    return 0;
//}





///2.Cuplaj maxim în graf bipartit
// Se presupune ca graful este deja bipartit si ca varfurile sunt partitionate (ex. 1..X si X+1..N)
// Pentru simplitate, vom presupune ca varfurile sunt citite intr-o singura secventa 1..N
// si ca bipartitia trebuie determinata.

//#include <iostream>
//#include <vector>
//#include <queue>
//#include <algorithm>
//
//using namespace std;
//
//const int INF = 1000000;
//
//struct Arc {
//    int u, v, capacitate, flux_initial;
//};
//
//vector<vector<int>> capacitate;
//vector<vector<int>> flux;
//int N;
//
//
//bool este_bipartit(int n, const vector<vector<int>>& adj, vector<int>& culoare) {
//    // 0: necolorat, 1: culoarea 1, 2: culoarea 2
//    culoare.assign(n + 1, 0);
//    queue<int> q;
//
//    // BFS de la fiecare nod necolorat
//    for (int start_node = 1; start_node <= n; ++start_node) {
//        if (culoare[start_node] == 0) {
//            q.push(start_node);
//            culoare[start_node] = 1;
//
//            while (!q.empty()) {
//                int u = q.front();
//                q.pop();
//
//                for (int v : adj[u]) {
//                    if (culoare[v] == 0) {
//                        culoare[v] = 3 - culoare[u]; // Culoarea opusa
//                        q.push(v);
//                    } else if (culoare[v] == culoare[u]) {
//                        // un ciclu impar (nu este bipartit)
//                        return false;
//                    }
//                }
//            }
//        }
//    }
//    return true;
//}
//
//void ford_fulkerson(int s, int t, vector<Arc>& arce) {
//    long long flux_total = 0;
//
//    vector<vector<int>> capacitate_reziduala = capacitate;
//
//    for (const auto& arc : arce) {
//        capacitate_reziduala[arc.u][arc.v] = arc.capacitate - flux[arc.u][arc.v];
//        capacitate_reziduala[arc.v][arc.u] = flux[arc.u][arc.v]; // Arcul invers
//        flux_total += (arc.u == s) ? flux[arc.u][arc.v] : 0; // suma fluxului initial din sursa
//    }
//
//    int flux_crescut = 0;
//    vector<int> parinte(N + 1);
//
//    // bucle Ford-Fulkerson: se cauta lanturi nesaturate pana nu se mai gaseste niciunul
//    while (flux_crescut = bfs(s, t, parinte, capacitate_reziduala)) {
//        flux_total += flux_crescut;
//        int curr = t;
//
//        // revizuirea fluxului pe lantul gasit
//        while (curr != s) {
//            int prev = parinte[curr];
//
//            // actualizarea fluxului in retea
//            // arcul (prev, curr) direct - crestem fluxul
//            if (flux[prev][curr] > 0 || capacitate[prev][curr] > 0) {
//                 flux[prev][curr] += flux_crescut;
//            } else { // arc invers (se reduce fluxul pe arcul (curr, prev))
//                flux[curr][prev] -= flux_crescut;
//            }
//
//            // actualizarea retelei reziduale
//            capacitate_reziduala[prev][curr] -= flux_crescut;
//            capacitate_reziduala[curr][prev] += flux_crescut;
//
//            curr = prev;
//        }
//    }
//
//
//    cout << "Valoarea fluxului obtinut: " << flux_total << endl;
//    cout << "Fluxul final pe fiecare arc (u, v):" << endl;
//
//    for (const auto& arc : arce) {
//        cout << "(" << arc.u << ", " << arc.v << "): " << flux[arc.u][arc.v] << "/" << arc.capacitate << endl;
//    }
//
//
//    // tăieturii minime (Max-Flow Min-Cut Theorem)
//    cout << "Capacitatea minima a unei taieturi: " << flux_total << endl;
//
//    vector<bool> accesibil(N + 1, false);
//    queue<int> q_cut;
//    q_cut.push(s);
//    accesibil[s] = true;
//
//    while (!q_cut.empty()) {
//        int u = q_cut.front();
//        q_cut.pop();
//
//        for (int v = 1; v <= N; ++v) {
//            if (!accesibil[v] && capacitate_reziduala[u][v] > 0) {
//                accesibil[v] = true;
//                q_cut.push(v);
//            }
//        }
//    }
//
//    cout << "Arcele directe ale unei taieturi minime (S, T):" << endl;
//    for (const auto& arc : arce) {
//        if (accesibil[arc.u] && !accesibil[arc.v]) {
//            cout << "(" << arc.u << ", " << arc.v << ") (capacitate: " << arc.capacitate << ")" << endl;
//        }
//    }
//}
//
//void problema2() {
//    int N_bipartit, M;
//    cout << "\nIntrodu N (numar varfuri) si M (numar muchii) pentru graful bipartit: ";
//    cin >> N_bipartit >> M;
//
//    vector<vector<int>> adj(N_bipartit + 1);
//    vector<pair<int, int>> muchii_intrare;
//
//    cout << "Introdu cele " << M << " muchii (u, v):" << endl;
//    for (int i = 0; i < M; ++i) {
//        int u, v;
//        cin >> u >> v;
//        adj[u].push_back(v);
//        adj[v].push_back(u);
//        muchii_intrare.push_back({u, v});
//    }
//
//    // verificare bipartitie
//    vector<int> culoare;
//    if (!este_bipartit(N_bipartit, adj, culoare)) {
//        cout << "Graful dat la intrare NU ESTE BIPARTIT. Trebuie afisat un ciclu impar." << endl;
//        return;
//    }
//
//    // constructia retelei de flux
//    N = N_bipartit + 2;
//    int s = 0; // Sursa
//    int t = N_bipartit + 1; // Destinatie
//
//    capacitate.assign(N + 1, vector<int>(N + 1, 0));
//    flux.assign(N + 1, vector<int>(N + 1, 0));
//    vector<Arc> arce;
//
//    for (int i = 1; i <= N_bipartit; ++i) {
//        if (culoare[i] == 1) { // varf in U (conectat s -> i)
//            capacitate[s][i] = 1;
//            arce.push_back({s, i, 1, 0});
//        } else { // varf in V (conectat i -> t)
//            capacitate[i][t] = 1;
//            arce.push_back({i, t, 1, 0});
//        }
//    }
//
//    // add arcele U -> V
//    for (const auto& muchie : muchii_intrare) {
//        int u1 = muchie.first;
//        int v1 = muchie.second;
//
//        // daca culorile sunt C1 si C2, arcul este orientat de la C1 la C2
//        int u_start = (culoare[u1] == 1) ? u1 : v1;
//        int v_end = (culoare[u1] == 1) ? v1 : u1;
//
//        capacitate[u_start][v_end] = 1;
//        arce.push_back({u_start, v_end, 1, 0});
//    }
//
//    ford_fulkerson(s, t, arce);
//
//
//    cout << "Muchile cuplajului maxim (flux f=1 pe arcul u->v):" << endl;
//    for (const auto& arc : arce) {
//        // un arc u->v din graful bipartit face parte din cuplaj daca f(u,v) = 1
//        if (arc.u != s && arc.v != t && flux[arc.u][arc.v] == 1) {
//            cout << arc.u << " " << arc.v << endl;
//        }
//    }
//}
//
//int main() {
//    problema2();
//    return 0;
//}
//



//3. Construcția unui graf orientat cu secvențele de grade de intrare și ieșire date
//#include <iostream>
//#include <vector>
//#include <queue>
//#include <algorithm>
//#include <numeric>
//
//using namespace std;
//
//const int INF = 100000;
//
//struct Arc {
//    int u, v, capacitate, flux_initial;
//};
//
//vector<vector<int>> capacitate;
//vector<vector<int>> flux;
//int N;
//
//int bfs(int s, int t, vector<int>& parinte, const vector<vector<int>>& capacitate_reziduala) {
//    fill(parinte.begin(), parinte.end(), -1);
//    parinte[s] = -2;
//    queue<pair<int, int>> q;
//    q.push({s, INF});
//
//    while (!q.empty()) {
//        int u = q.front().first;
//        int flow = q.front().second;
//        q.pop();
//
//        for (int v = 0; v <= N; ++v) {
//            if (parinte[v] == -1 && capacitate_reziduala[u][v] > 0) {
//                parinte[v] = u;
//                int new_flow = min(flow, capacitate_reziduala[u][v]);
//                if (v == t)
//                    return new_flow;
//                q.push({v, new_flow});
//            }
//        }
//    }
//    return 0;
//}
//
//long long ford_fulkerson(int s, int t, vector<Arc>& arce) {
//    long long flux_total = 0;
//
//    vector<vector<int>> capacitate_reziduala = capacitate;
//
//    // fluxul total initial
//    for (int v = 0; v <= N; ++v) {
//        flux_total += flux[s][v];
//    }
//
//    int flux_crescut = 0;
//    vector<int> parinte(N + 1);
//
//    while (flux_crescut = bfs(s, t, parinte, capacitate_reziduala)) {
//        flux_total += flux_crescut;
//        int curr = t;
//
//        while (curr != s) {
//            int prev = parinte[curr];
//
//            // actualizarea fluxului in retea
//            if (capacitate[prev][curr] > 0) {
//                 flux[prev][curr] += flux_crescut;
//            } else {
//                flux[curr][prev] -= flux_crescut;
//            }
//
//            // actualizarea retelei reziduale
//            capacitate_reziduala[prev][curr] -= flux_crescut;
//            capacitate_reziduala[curr][prev] += flux_crescut;
//
//            curr = prev;
//        }
//    }
//    return flux_total;
//}
//
//void problema3() {
//    int n;
//    cout << "Introdu n (numarul de varfuri ale grafului G, numerotate 1..n): ";
//    if (!(cin >> n) || n <= 2) {
//        cerr << "N trebuie sa fie > 2.\n";
//        return;
//    }
//
//    // S1 (grade interne, d_in) si S2 (grade externe, d_out).
//    vector<int> S1(n + 1);
//    vector<int> S2(n + 1);
//    long long suma_S1 = 0;
//    long long suma_S2 = 0;
//
//    cout << "Introdu secventa S1 (n grade interne, despartite prin spatiu):" << endl;
//    for (int i = 1; i <= n; ++i) {
//        if (!(cin >> S1[i])) { cerr << "Eroare la citire.\n"; return; }
//        suma_S1 += S1[i];
//    }
//    cout << "Introdu secventa S2 (n grade externe, despartite prin spatiu):" << endl;
//    for (int i = 1; i <= n; ++i) {
//        if (!(cin >> S2[i])) { cerr << "Eroare la citire.\n"; return; }
//        suma_S2 += S2[i];
//    }
//
//    if (suma_S1 != suma_S2) {
//        cout << "NU. Suma gradelor interne (" << suma_S1 << ") nu este egala cu suma gradelor externe (" << suma_S2 << ")." << endl;
//        return;
//    }
//
//    // constructia retelei de flux
//    // Varfuri: s(0), t(2n+1), u_1...u_n (1...n), v_1...v_n (n+1...2n)
//    int s = 0;
//    N = 2 * n + 1; //nr de vf in retea
//    int t = N;
//
//    capacitate.assign(N + 1, vector<int>(N + 1, 0));
//    flux.assign(N + 1, vector<int>(N + 1, 0));
//    vector<Arc> arce_retea;
//
//    // arcele s -> u_i (Varfuri u: 1..n, Capacitate = grad extern S2)
//    for (int i = 1; i <= n; ++i) {
//        capacitate[s][i] = S2[i];
//        arce_retea.push_back({s, i, S2[i], 0});
//    }
//
//    // arcele v_j -> t (Varfuri v: n+1..2n, Capacitate = grad intern S1)
//    for (int j = 1; j <= n; ++j) {
//        int v_j = n + j;
//        capacitate[v_j][t] = S1[j];
//        arce_retea.push_back({v_j, t, S1[j], 0});
//    }
//
//    // arcele u_i -> v_j (Varfuri u: 1..n, Varfuri v: n+1..2n, Capacitate = 1)
//    for (int i = 1; i <= n; ++i) { // u_i
//        for (int j = 1; j <= n; ++j) {
//            int v_j = n + j;
//            capacitate[i][v_j] = 1;
//            arce_retea.push_back({i, v_j, 1, 0});
//        }
//    }
//
//    long long flux_maxim = ford_fulkerson(s, t, arce_retea);
//
//    if (flux_maxim == suma_S1) {
//        cout << "\nGraful poate fi construit." << endl;
//        cout << "Arcele grafului orientat G (i -> j):" << endl;
//
//        for (int i = 1; i <= n; ++i) { // i este varful sursa in G
//            for (int j = 1; j <= n; ++j) { // j este varful destinatie in G
//                int v_j = n + j;
//                if (flux[i][v_j] == 1) {
//                    cout << i << " " << j << endl;
//                }
//            }
//        }
//    } else {
//        cout << "Fluxul maxim (" << flux_maxim << ") este mai mic decat suma totala a gradelor (" << suma_S1 << ")." << endl;
//    }
//}
//
//int main() {
//    problema3();
//    return 0;
//}




//4.LCS
//#include <iostream>
//#include <vector>
//#include <string>
//#include <algorithm>
//
//using namespace std;
//
//string gaseste_lcs(const string& X, const string& Y) {
//    int m = X.length();
//    int n = Y.length();
//
//    // DP[i][j] va stoca lungimea LCS-ului pentru prefixul X[0..i-1] si Y[0..j-1]
//    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
//
//
//    for (int i = 1; i <= m; ++i) {
//        for (int j = 1; j <= n; ++j) {
//            if (X[i - 1] == Y[j - 1]) {
//                // creste lungimea LCS-ului gasit pe prefixele anterioare
//                dp[i][j] = dp[i - 1][j - 1] + 1;
//            } else {
//                // daca caracterele sunt diferite, preluam lungimea maxima
//                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
//            }
//        }
//    }
//
//    cout << "Lungimea LCS: " << dp[m][n] << endl;
//
//    string lcs = "";
//    int i = m;
//    int j = n;
//
//    while (i > 0 && j > 0) {
//        if (X[i - 1] == Y[j - 1]) {
//            lcs += X[i - 1];
//            i--;
//            j--;
//        } else if (dp[i - 1][j] > dp[i][j - 1]) {
//            i--;
//        } else {
//            j--;
//        }
//    }
//
//    reverse(lcs.begin(), lcs.end());
//
//    return lcs;
//}
//
//void problema4() {
//    string X, Y;
//    cout << "Introdu primul sir de caractere (X): ";
//    cin >> X;
//    cout << "Introdu al doilea sir de caractere (Y): ";
//    cin >> Y;
//
//    string lcs = gaseste_lcs(X, Y);
//    cout << "Cel mai lung subsir comun (LCS): " << lcs << endl;
//}
//
//int main() {
//    problema4();
//    return 0;
//}




//5.Ciclu eulerian
//#include <iostream>
//#include <vector>
//#include <algorithm>
//#include <stack>
//#include <list>
//
//using namespace std;
//
//// este eulerian dacă graful este conex și toate vârfurile au grad par
//bool verifica_eulerian(int n, const vector<vector<int>>& adj, const vector<int>& grad, bool& este_conex) {
//    if (n <= 0) return false;
//
//    bool toate_gradele_sunt_pare = true;
//    for (int i = 1; i <= n; ++i) {
//        if (grad[i] % 2 != 0) {
//            toate_gradele_sunt_pare = false;
//            break;
//        }
//    }
//    if (!toate_gradele_sunt_pare) {
//        return false;
//    }
//
//    int nod_start = -1;
//    for (int i = 1; i <= n; ++i) {
//        if (grad[i] > 0) {
//            nod_start = i;
//            break;
//        }
//    }
//
//    if (nod_start == -1) {
//        este_conex = true;
//        return true;
//    }
//
//    vector<bool> vizitat(n + 1, false);
//    stack<int> s;
//    s.push(nod_start);
//    vizitat[nod_start] = true;
//    int numar_vizitate = 0;
//
//    // DFS pentru conexitate
//    while (!s.empty()) {
//        int u = s.top();
//        s.pop();
//        numar_vizitate++;
//
//        for (int v : adj[u]) {
//            if (!vizitat[v]) {
//                vizitat[v] = true;
//                s.push(v);
//            }
//        }
//    }
//
//    int noduri_cu_muchii = 0;
//    for(int i = 1; i <= n; ++i) {
//        if (grad[i] > 0) {
//            noduri_cu_muchii++;
//        }
//    }
//
//    este_conex = (numar_vizitate == noduri_cu_muchii);
//
//    return este_conex;
//}
//
//// Algoritmul lui Hierholzer pentru gasirea ciclului Eulerian
//vector<int> gaseste_ciclu_eulerian(int n, list<pair<int, int>> (&adj_indexed)[101]) {
//    vector<int> ciclu;
//    stack<int> path;
//
//    // un nod de start (orice nod cu grad > 0)
//    int start_node = -1;
//    for (int i = 1; i <= n; ++i) {
//        if (!adj_indexed[i].empty()) {
//            start_node = i;
//            break;
//        }
//    }
//
//    if (start_node == -1) return ciclu;
//
//    path.push(start_node);
//
//    while (!path.empty()) {
//        int u = path.top();
//
//        if (adj_indexed[u].empty()) {
//            // varful u nu mai are muchii adiacente nevizitate
//            ciclu.push_back(u);
//            path.pop();
//        } else {
//            // o muchie nevizitata: (u, v)
//            pair<int, int> next_edge = adj_indexed[u].front();
//            int v = next_edge.first;
//            int muchie_idx = next_edge.second;
//
//            adj_indexed[u].pop_front();
//
//            for(auto it = adj_indexed[v].begin(); it != adj_indexed[v].end(); ++it) {
//                if (it->second == muchie_idx) {
//                    adj_indexed[v].erase(it);
//                    break;
//                }
//            }
//            path.push(v);
//        }
//    }
//
//    reverse(ciclu.begin(), ciclu.end());
//
//    return ciclu;
//}
//
//
//void problema5() {
//    int n, m;
//    cout << "Introdu n (numar varfuri, 1..n) si m (numar muchii) pentru multigraf: ";
//    cin >> n >> m;
//
//    vector<vector<int>> adj_simple(n + 1);
//    vector<int> grad(n + 1, 0);
//    list<pair<int, int>> adj_indexed[101];
//
//    cout << "Introdu cele " << m << " muchii (u, v):" << endl;
//    for (int i = 1; i <= m; ++i) {
//        int u, v;
//        cin >> u >> v;
//
//        adj_simple[u].push_back(v);
//        adj_simple[v].push_back(u);
//        grad[u]++;
//        grad[v]++;
//
//        adj_indexed[u].push_back({v, i}); // {vecin, index_muchie}
//        adj_indexed[v].push_back({u, i}); // {vecin, index_muchie}
//    }
//
//    bool este_conex = false;
//
//    if (verifica_eulerian(n, adj_simple, grad, este_conex)) {
//        cout << "Graful ESTE eulerian (toate gradele pare si conex)." << endl;
//
//        vector<int> ciclu = gaseste_ciclu_eulerian(n, adj_indexed);
//
//        cout << "Ciclul eulerian gasit:" << endl;
//        for (size_t i = 0; i < ciclu.size(); ++i) {
//            cout << ciclu[i] << ((i < ciclu.size() - 1) ? " " : "");
//        }
//        cout << endl;
//
//    } else {
//        cout << "Graful NU este eulerian. Cauze posibile:" << endl;
//        bool grade_pare = true;
//         for (int i = 1; i <= n; ++i) {
//            if (grad[i] % 2 != 0) {
//                cout << "- Varful " << i << " are grad impar (" << grad[i] << ")." << endl;
//                grade_pare = false;
//            }
//        }
//        if (grade_pare && !este_conex) {
//             cout << "- Graful nu este conex (sau nu toate varfurile cu muchii sunt conectate)." << endl;
//        }
//    }
//}
//
//int main() {
//    problema5();
//    return 0;
//}



//6.Ciclu hamiltonian de cost minim
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <numeric>

using namespace std;

const int INF_COST = 100000;

void problema6() {
    int n, m;
    cout << "Introdu n (numar varfuri, 0..n-1) si m (numar arce) pentru graf orientat cu costuri: ";
    if (!(cin >> n) || !(cin >> m)) {
        cerr << "Eroare la citire N sau M.\n";
        return;
    }

    if (n > 20) {
        cout << "Avertisment: Algoritmul de Programare Dinamica pe Masti de biti este O(n^2 * 2^n) si devine foarte lent pentru n > 20." << endl;
    }

    vector<vector<int>> cost(n, vector<int>(n, INF_COST));

    for (int i = 0; i < n; ++i) {
        cost[i][i] = 0;
    }

    cout << "Introdu cele " << m << " arce (u, v, c) [u si v in intervalul 0.." << n-1 << "]:" << endl;
    for (int i = 0; i < m; ++i) {
        int u, v, c;
        if (!(cin >> u >> v >> c)) {
            cerr << "Eroare la citirea arcelor.\n";
            return;
        }
        if (u >= 0 && u < n && v >= 0 && v < n) {
            cost[u][v] = c;
        } else {
             cout << "Avertisment: Varf invalid in arcul " << u << "->" << v << ". Ignorat." << endl;
        }
    }

    // Programare Dinamica pe Masti de biti
    // DP[mask][v]: costul minim al unui drum care viziteaza nodurile in 'mask' si se termina in 'v'
    int num_masks = 1 << n; // 2^n
    vector<vector<int>> dp(num_masks, vector<int>(n, INF_COST));
    vector<vector<int>> parent(num_masks, vector<int>(n, -1)); // Pentru reconstructia drumului

    // cazul de baza: drumul de la nodul de start (0) la el insusi
    // masca: 1 (doar bitul 0 setat)
    dp[1][0] = 0;

    // iteram prin toate mastile (submultimile de varfuri)
    for (int mask = 1; mask < num_masks; ++mask) {
        // iteram prin toate nodurile 'u' care pot fi ultimul nod in drum
        for (int u = 0; u < n; ++u) {
            // daca u este in masca (bitul u este setat) si costul e valid
            if ((mask & (1 << u)) && dp[mask][u] != INF_COST) {
                // iteram prin toate nodurile 'v' care urmeaza dupa 'u'
                for (int v = 0; v < n; ++v) {
                    // daca v nu este deja in masca SAU (daca v este nodul de start 0)
                    if (!(mask & (1 << v)) && cost[u][v] != INF_COST) {
                        int next_mask = mask | (1 << v); // Noua masca include si v

                        int new_cost = dp[mask][u] + cost[u][v];

                        if (new_cost < dp[next_mask][v]) {
                            dp[next_mask][v] = new_cost;
                            parent[next_mask][v] = u;
                        }
                    }
                }
            }
        }
    }

    // costului minim al ciclului Hamiltonian
    int final_mask = num_masks - 1; // toti bitii setati (toate nodurile vizitate)
    int min_cost_cycle = INF_COST;
    int end_node = -1;

    for (int u = 1; u < n; ++u) {
        if (dp[final_mask][u] != INF_COST && cost[u][0] != INF_COST) {
            if (dp[final_mask][u] + cost[u][0] < min_cost_cycle) {
                min_cost_cycle = dp[final_mask][u] + cost[u][0];
                end_node = u;
            }
        }
    }

    if (min_cost_cycle == INF_COST) {
        cout << "\nGraful NU este hamiltonian (nu s-a gasit un ciclu complet de cost finit)." << endl;
    } else {
        cout << "\nGraful este hamiltonian." << endl;
        cout << "Costul minim al ciclului hamiltonian: " << min_cost_cycle << endl;

        vector<int> cycle_path;
        int current_mask = final_mask;
        int current_node = end_node;

        // inapoi de la end_node la 0
        while (current_node != -1) {
            cycle_path.push_back(current_node);
            int prev_node = parent[current_mask][current_node];

            // actualizam masca pentru a reflecta ca am scos nodul curent
            if (prev_node != -1) {
                // masca anterioara: (Masca curenta) XOR (bitul nodului curent)
                current_mask = current_mask ^ (1 << current_node);
            } else {
                break;
            }
            current_node = prev_node;
        }

        reverse(cycle_path.begin(), cycle_path.end());

        cout << "Ciclul: ";
        cout << 0;
        for (int node : cycle_path) {
            cout << " " << node;
        }
        cout << " " << 0 << endl;
    }
}


int main() {
    problema6();
    return 0;
}