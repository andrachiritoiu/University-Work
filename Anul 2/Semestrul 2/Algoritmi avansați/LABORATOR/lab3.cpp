//1

#include <fstream>
#include <vector>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    ifstream fin("elmaj.in");
    ofstream fout("elmaj.out");

    int n;
    fin >> n;

    vector<int> v(n);
    for (int i = 0; i < n; i++) {
        fin >> v[i];
    }

    srand(time(0));

    for (int t = 0; t < 20; t++) {
        int cand = v[rand() % n];
        int cnt = 0;

        for (int i = 0; i < n; i++) {
            if (v[i] == cand) {
                cnt++;
            }
        }

        if (cnt > n / 2) {
            fout << cand << " " << cnt;
            return 0;
        }
    }

    fout << -1;
    return 0;
}





//2

// #include <bits/stdc++.h>
// using namespace std;
//
// const long long MOD = 1000000007LL;
//
// vector<long long> multiply_matrix_vector(const vector<vector<long long>>& M, const vector<long long>& v) {
//     int n = M.size();
//     vector<long long> res(n, 0);
//
//     for (int i = 0; i < n; i++) {
//         long long sum = 0;
//         for (int j = 0; j < n; j++) {
//             sum = (sum + M[i][j] * v[j]) % MOD;
//         }
//         res[i] = sum;
//     }
//
//     return res;
// }
//
// bool freivalds(const vector<vector<long long>>& A,
//                const vector<vector<long long>>& B,
//                const vector<vector<long long>>& C,
//                int tests = 20) {
//     int n = A.size();
//
//     for (int t = 0; t < tests; t++) {
//         vector<long long> r(n);
//
//         for (int i = 0; i < n; i++) {
//             r[i] = rand() % 2;
//         }
//
//         vector<long long> Br = multiply_matrix_vector(B, r);
//         vector<long long> ABr = multiply_matrix_vector(A, Br);
//         vector<long long> Cr = multiply_matrix_vector(C, r);
//
//         if (ABr != Cr) {
//             return false;
//         }
//     }
//
//     return true;
// }
//
// int main() {
//     ios_base::sync_with_stdio(false);
//     cin.tie(nullptr);
//
//     srand(time(nullptr));
//
//     int n;
//     cin >> n;
//
//     vector<vector<long long>> A(n, vector<long long>(n));
//     vector<vector<long long>> B(n, vector<long long>(n));
//     vector<vector<long long>> C(n, vector<long long>(n));
//
//     for (int i = 0; i < n; i++) {
//         for (int j = 0; j < n; j++) {
//             cin >> A[i][j];
//             A[i][j] %= MOD;
//         }
//     }
//
//     for (int i = 0; i < n; i++) {
//         for (int j = 0; j < n; j++) {
//             cin >> B[i][j];
//             B[i][j] %= MOD;
//         }
//     }
//
//     for (int i = 0; i < n; i++) {
//         for (int j = 0; j < n; j++) {
//             cin >> C[i][j];
//             C[i][j] %= MOD;
//         }
//     }
//
//     if (freivalds(A, B, C)) {
//         cout << "YES\n";
//     } else {
//         cout << "NO\n";
//     }
//
//     return 0;
// }
