//1
// #include <iostream>
// #include <cmath>
// #include <cstdio>
// using namespace std;
//
// int main() {
//     double a, b;
//     cin >> a >> b;
//
//     int p;
//     cin >> p;
//
//     int q;
//     cin >> q;
//
//     int l = (int)ceil(log2((b - a) * pow(10, p)));
//     int nr = (int)pow(2, l);
//     double step = (b - a) / nr;
//
//     while (q--) {
//         string tip;
//         cin >> tip;
//
//         if (tip == "TO") {
//             double x;
//             cin >> x;
//
//             int idx = (int)floor((x - a) / step);
//
//             if (idx < 0) {
//                 idx = 0;
//             }
//             if (idx >= nr) {
//                 idx = nr - 1;
//             }
//
//             string s = "";
//             int copie = idx;
//
//             while (copie > 0) {
//                 s = char(copie % 2 + '0') + s;
//                 copie = copie / 2;
//             }
//
//             while ((int)s.size() < l) {
//                 s = '0' + s;
//             }
//
//             cout << s << '\n';
//         }
//         else if (tip == "FROM") {
//             string s;
//             cin >> s;
//
//             int idx = 0;
//             for (int i = 0; i < (int)s.size(); i++) {
//                 idx = idx * 2 + (s[i] - '0');
//             }
//
//             double x = a + idx * step;
//             printf("%.10f\n", x);
//         }
//     }
//
//     return 0;
// }



//2
// #include <iostream>
// #include <vector>
// #include <cstdio>
// using namespace std;
//
// int main() {
//     int a, b, c;
//     cin >> a >> b >> c;
//
//     int n;
//     cin >> n;
//
//     vector<double> x(n), fitness(n);
//
//     for (int i = 0; i < n; i++) {
//         cin >> x[i];
//     }
//
//     double suma = 0;
//
//     for (int i = 0; i < n; i++) {
//         fitness[i] = a * x[i] * x[i] + b * x[i] + c;
//         suma += fitness[i];
//     }
//
//     printf("%.6f\n", 0.0);
//
//     double curent = 0;
//
//     for (int i = 0; i < n; i++) {
//         curent = curent + fitness[i] / suma;
//
//         if (i == n - 1) {
//             printf("%.6f\n", 1.0);
//         } else {
//             printf("%.6f\n", curent);
//         }
//     }
//
//     return 0;
// }




//3
// #include <iostream>
// using namespace std;
//
// int main() {
//     int n;
//     cin >> n;
//
//     string a, b;
//     cin >> a >> b;
//
//     int k;
//     cin >> k;
//
//     string s1 = a.substr(0, k) + b.substr(k);
//     string s2 = b.substr(0, k) + a.substr(k);
//
//     cout << s1 << '\n';
//     cout << s2 << '\n';
//
//     return 0;
// }




//4
#include <iostream>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;

    string s;
    cin >> s;

    for (int i = 0; i < k; i++) {
        int poz;
        cin >> poz;

        if (s[poz] == '0') {
            s[poz] = '1';
        } else {
            s[poz] = '0';
        }
    }

    cout << s << '\n';

    return 0;
}