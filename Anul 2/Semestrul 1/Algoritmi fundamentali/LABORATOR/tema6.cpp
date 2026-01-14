/*//1.Domino
#include <bits/stdc++.h>
using namespace std;

struct Muchie {
    int to, id;
};

int main() {
    ifstream fin("domino.in");
    ofstream fout("domino.out");

    int N;
    fin >> N;

    vector<int> a(N + 1), b(N + 1);
    vector<vector<Muchie>> g(10);
    vector<int> grad(10, 0);

    for (int i = 1; i <= N; i++) {
        fin >> a[i] >> b[i];
        g[a[i]].push_back({b[i], i});
        g[b[i]].push_back({a[i], i});
        grad[a[i]]++;
        grad[b[i]]++;
    }

    // noduri cu grad impar
    vector<int> impare;
    for (int v = 0; v < 10; v++)
        if (grad[v] % 2 == 1) impare.push_back(v);

    if (!(impare.size() == 0 || impare.size() == 2)) {
        fout << 0 << "\n";
        return 0;
    }

    // nod start
    int start = -1;
    if (impare.size() == 2) start = impare[0];
    else {
        for (int v = 0; v < 10; v++)
            if (grad[v] > 0) { start = v; break; }
    }

    if (start == -1) { // nu exista muchii
        fout << 1 << "\n";
        return 0;
    }

    // verificare conexitate pe nodurile cu grad>0
    vector<int> viz(10, 0);
    queue<int> q;
    q.push(start);
    viz[start] = 1;

    while (!q.empty()) {
        int x = q.front(); q.pop();
        for (auto e : g[x]) {
            if (!viz[e.to]) {
                viz[e.to] = 1;
                q.push(e.to);
            }
        }
    }

    for (int v = 0; v < 10; v++) {
        if (grad[v] > 0 && !viz[v]) {
            fout << 0 << "\n";
            return 0;
        }
    }

    // facem ordinea determinista: sortam crescator si folosim pop_back() => luam id-ul cel mai mare
    for (int v = 0; v < 10; v++) {
        sort(g[v].begin(), g[v].end(), [](const Muchie& x, const Muchie& y) {
            return x.id < y.id;
        });
    }

    // Hierholzer
    vector<char> folosit(N + 1, 0);

    vector<int> stV;
    vector<pair<int,int>> stE;   // (id, rot)
    vector<pair<int,int>> sol;   // invers

    stV.push_back(start);

    while (!stV.empty()) {
        int v = stV.back();

        // aruncam muchiile deja folosite din coada v
        while (!g[v].empty() && folosit[g[v].back().id])
            g[v].pop_back();

        if (g[v].empty()) {
            stV.pop_back();
            if (!stE.empty()) {
                sol.push_back(stE.back());
                stE.pop_back();
            }
        } else {
            Muchie e = g[v].back();
            g[v].pop_back();

            if (folosit[e.id]) continue;
            folosit[e.id] = 1;

            int rot = 0;
            if (!(a[e.id] == v && b[e.id] == e.to)) rot = 1;

            stV.push_back(e.to);
            stE.push_back({e.id, rot});
        }
    }

    if ((int)sol.size() != N) {
        fout << 0 << "\n";
        return 0;
    }

    reverse(sol.begin(), sol.end());

    fout << 1 << "\n";
    for (auto &p : sol)
        fout << p.first << " " << p.second << "\n";

    return 0;
}
*/




/*//2.Johnie
#include <bits/stdc++.h>
using namespace std;

struct EdgeRef {
    int to, id;
};

int main() {
    freopen("johnie.in", "r", stdin);
    freopen("johnie.out", "w", stdout);

    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;

    vector<int> U(M + 1), V(M + 1);
    vector<vector<EdgeRef>> g(N + 1);
    vector<int> deg(N + 1, 0);

    for (int i = 1; i <= M; i++) {
        cin >> U[i] >> V[i];
        g[U[i]].push_back({V[i], i});
        g[V[i]].push_back({U[i], i});
        deg[U[i]]++;
        deg[V[i]]++;
    }

    // componente conexe (doar pe noduri cu grad > 0)
    vector<int> comp(N + 1, -1);
    vector<vector<int>> comps;
    int cid = 0;

    for (int s = 1; s <= N; s++) {
        if (deg[s] == 0 || comp[s] != -1) continue;
        queue<int> q;
        q.push(s);
        comp[s] = cid;
        comps.push_back({s});

        while (!q.empty()) {
            int x = q.front(); q.pop();
            for (auto e : g[x]) {
                int y = e.to;
                if (deg[y] == 0) continue;
                if (comp[y] == -1) {
                    comp[y] = cid;
                    q.push(y);
                    comps.back().push_back(y);
                }
            }
        }
        cid++;
    }

    int E = M;
    vector<char> fictiv(M + 1, 0);
    vector<int> UU = U, VV = V;
    vector<int> startNode(cid, -1);

    long long totalStages = 0;

    for (int c = 0; c < cid; c++) {
        vector<int> odd;
        for (int v : comps[c]) {
            if (deg[v] % 2 == 1) odd.push_back(v);
            if (startNode[c] == -1) startNode[c] = v;
        }

        totalStages += max(1, (int)odd.size() / 2);

        for (int i = 0; i < (int)odd.size(); i += 2) {
            int x = odd[i], y = odd[i + 1];
            ++E;

            if ((int)fictiv.size() <= E) fictiv.resize(E + 1, 0);
            fictiv[E] = 1;

            if ((int)UU.size() <= E) {
                UU.resize(E + 1);
                VV.resize(E + 1);
            }
            UU[E] = x;
            VV[E] = y;

            g[x].push_back({y, E});
            g[y].push_back({x, E});
        }
    }

    vector<char> used(E + 1, 0);
    vector<int> it(N + 1, 0);
    vector<vector<int>> allTrails;

    for (int c = 0; c < cid; c++) {
        int start = startNode[c];
        if (start == -1) continue;

        vector<int> stV, stE;
        vector<pair<int,int>> tour;

        stV.push_back(start);
        stE.push_back(-1);

        while (!stV.empty()) {
            int v = stV.back();

            while (it[v] < (int)g[v].size() && used[g[v][it[v]].id])
                it[v]++;

            if (it[v] == (int)g[v].size()) {
                tour.push_back({v, stE.back()});
                stV.pop_back();
                stE.pop_back();
            } else {
                auto e = g[v][it[v]];
                it[v]++;
                if (used[e.id]) continue;
                used[e.id] = 1;

                stV.push_back(e.to);
                stE.push_back(e.id);
            }
        }

        reverse(tour.begin(), tour.end());

        vector<int> current;
        current.push_back(tour[0].first);

        for (int i = 1; i < (int)tour.size(); i++) {
            int vNow = tour[i].first;
            int eid = tour[i].second;

            if (eid != -1 && eid < (int)fictiv.size() && fictiv[eid]) {
                if ((int)current.size() >= 2)
                    allTrails.push_back(current);
                current.clear();
                current.push_back(vNow);
            } else {
                current.push_back(vNow);
            }
        }

        if ((int)current.size() >= 2)
            allTrails.push_back(current);
    }

    cout << allTrails.size() << "\n";
    for (auto &tr : allTrails) {
        cout << tr.size();
        for (int x : tr) cout << " " << x;
        cout << "\n";
    }

    return 0;
}
*/



/*//3.ADN
#include <bits/stdc++.h>
using namespace std;

static vector<int> prefix_function(const string &s) {
    vector<int> pi((int)s.size(), 0);
    for (int i = 1; i < (int)s.size(); i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}

static bool kmp_contains(const string &text, const string &pat) {
    if (pat.empty()) return true;
    // KMP
    string s = pat;
    s.push_back('#');
    s += text;
    auto pi = prefix_function(s);
    int m = (int)pat.size();
    for (int x : pi) if (x == m) return true;
    return false;
}

// overlap i->j: max k astfel incat suffix(s[i], k) == prefix(s[j], k)
static int overlap_ij(const string &si, const string &sj) {
    int L = min((int)si.size(), (int)sj.size());
    string tail = si.substr((int)si.size() - L, L);
    string comb = sj + "#" + tail;
    auto pi = prefix_function(comb);
    return min(pi.back(), (int)sj.size());
}

int main() {
    freopen("adn.in", "r", stdin);
    freopen("adn.out", "w", stdout);

    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;
    vector<string> s(N);
    for (int i = 0; i < N; i++) cin >> s[i];

    // eliminam duplicate si subsiruri
    // (duplicatele sunt subsir unele in altele, dar le tratam explicit)
    {
        sort(s.begin(), s.end());
        s.erase(unique(s.begin(), s.end()), s.end());
    }

    int n0 = (int)s.size();
    vector<char> removed(n0, 0);

    for (int i = 0; i < n0; i++) {
        if (removed[i]) continue;
        for (int j = 0; j < n0; j++) {
            if (i == j || removed[i]) continue;
            if (s[i].size() <= s[j].size()) {
                if (kmp_contains(s[j], s[i])) {
                    removed[i] = 1;
                }
            }
        }
    }

    vector<string> a;
    for (int i = 0; i < n0; i++)
        if (!removed[i]) a.push_back(s[i]);

    int n = (int)a.size();

    // caz mic
    if (n == 0) { cout << "\n"; return 0; }
    if (n == 1) { cout << a[0] << "\n"; return 0; }

    // overlap
    vector<vector<int>> ov(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) if (i != j) {
            ov[i][j] = overlap_ij(a[i], a[j]);
        }
    }

    // DP bitmask
    const int INF = 1e9;
    int FULL = (1 << n);

    vector<vector<int>> dp(FULL, vector<int>(n, INF));
    vector<vector<int>> parent(FULL, vector<int>(n, -1));

    for (int i = 0; i < n; i++) dp[1 << i][i] = (int)a[i].size();

    for (int mask = 1; mask < FULL; mask++) {
        for (int last = 0; last < n; last++) {
            if (dp[mask][last] == INF) continue;
            if (!(mask & (1 << last))) continue;

            for (int nxt = 0; nxt < n; nxt++) {
                if (mask & (1 << nxt)) continue;
                int nmask = mask | (1 << nxt);
                int cand = dp[mask][last] + (int)a[nxt].size() - ov[last][nxt];
                if (cand < dp[nmask][nxt]) {
                    dp[nmask][nxt] = cand;
                    parent[nmask][nxt] = last;
                }
            }
        }
    }

    // alegem finalul cu lungime minima
    int bestLast = 0;
    int bestLen = INF;
    for (int i = 0; i < n; i++) {
        if (dp[FULL - 1][i] < bestLen) {
            bestLen = dp[FULL - 1][i];
            bestLast = i;
        }
    }

    // reconstructie ordine
    vector<int> order;
    int mask = FULL - 1;
    int cur = bestLast;
    while (cur != -1) {
        order.push_back(cur);
        int p = parent[mask][cur];
        mask ^= (1 << cur);
        cur = p;
    }
    reverse(order.begin(), order.end());

    // construim raspunsul
    string ans = a[order[0]];
    for (int k = 1; k < (int)order.size(); k++) {
        int i = order[k - 1];
        int j = order[k];
        ans += a[j].substr(ov[i][j]);
    }

    cout << ans << "\n";
    return 0;
}
*/




//4.Bibel
#include <bits/stdc++.h>
using namespace std;

struct Point {
    int x, y;
};

static inline long long dist2(const Point &a, const Point &b) {
    long long dx = (long long)a.x - b.x;
    long long dy = (long long)a.y - b.y;
    return dx * dx + dy * dy;
}

// DP TSP (drum Hamiltonian):
// start = punct de start (pozitia carligului la inceputul nivelului)
// balls = bilele nivelului (m <= 17)
// return: bestEnd[j] = cost minim sa ia toate bilele si sa se termine in bila j
static vector<long long> solve_level_from_start(const Point &start, const vector<Point> &balls) {
    int m = (int)balls.size();
    int FULL = 1 << m;
    const long long INF = (1LL << 62);

    // precompute distante intre bile
    static long long d[17][17];
    for (int i = 0; i < m; i++)
        for (int j = 0; j < m; j++)
            d[i][j] = dist2(balls[i], balls[j]);

    // dp[mask][last]
    vector<long long> dp((size_t)FULL * m, INF);

    auto IDX = [m](int mask, int last) { return (size_t)mask * m + last; };

    for (int i = 0; i < m; i++) {
        dp[IDX(1 << i, i)] = dist2(start, balls[i]);
    }

    for (int mask = 1; mask < FULL; mask++) {
        for (int last = 0; last < m; last++) {
            long long cur = dp[IDX(mask, last)];
            if (cur >= INF) continue;
            if (!(mask & (1 << last))) continue;

            int rem = ((FULL - 1) ^ mask);
            while (rem) {
                int nxt = __builtin_ctz(rem);
                rem &= rem - 1;
                int nmask = mask | (1 << nxt);
                long long cand = cur + d[last][nxt];
                long long &ref = dp[IDX(nmask, nxt)];
                if (cand < ref) ref = cand;
            }
        }
    }

    vector<long long> bestEnd(m, INF);
    int ALL = FULL - 1;
    for (int j = 0; j < m; j++) bestEnd[j] = dp[IDX(ALL, j)];
    return bestEnd;
}

int main() {
    freopen("bibel.in", "r", stdin);
    freopen("bibel.out", "w", stdout);

    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<vector<Point>> levels;
    vector<Point> currentLevel;

    // 0 x y  -> bila
    // 1      -> sfarsit nivel
    // 2      -> sfarsit joc
    while (true) {
        int t;
        if (!(cin >> t)) break;
        if (t == 0) {
            int x, y;
            cin >> x >> y;
            currentLevel.push_back({x, y});
        } else if (t == 1) {
            levels.push_back(currentLevel);
            currentLevel.clear();
        } else if (t == 2) {
            break;
        }
    }

    // dpPrev[i] = cost minim total pana la nivelul anterior, terminand in bila i din nivelul anterior
    vector<long long> dpPrev;
    vector<Point> prevBalls;

    Point origin{0, 0};

    for (int lv = 0; lv < (int)levels.size(); lv++) {
        auto &balls = levels[lv];
        int m = (int)balls.size();

        // daca nivel gol (nu prea apare), costul nu se schimba
        if (m == 0) {
            long long ans = 0;
            if (!dpPrev.empty()) ans = *min_element(dpPrev.begin(), dpPrev.end());
            cout << ans << "\n";
            continue;
        }

        vector<long long> dpNew(m, (1LL << 62));

        if (lv == 0) {
            // primul nivel: start din origine
            vector<long long> bestEnd = solve_level_from_start(origin, balls);
            dpNew = bestEnd;
        } else {
            // nivelul curent: start = ultima bila din nivelul anterior
            int pm = (int)prevBalls.size();

            for (int p = 0; p < pm; p++) {
                vector<long long> bestEnd = solve_level_from_start(prevBalls[p], balls);
                for (int j = 0; j < m; j++) {
                    long long cand = dpPrev[p] + bestEnd[j];
                    if (cand < dpNew[j]) dpNew[j] = cand;
                }
            }
        }

        long long ans = *min_element(dpNew.begin(), dpNew.end());
        cout << ans << "\n";

        dpPrev = dpNew;
        prevBalls = balls;
    }

    return 0;
}




