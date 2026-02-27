//Knapsack

//1.fractionar - greedy
//rap val/g

//2.discreta - programare dinamica
//dp[i][j] = max(dp[i-1][j], dp[i-1][j-gi] + vi)



//rezolvare - 1.fractionara

// #include<iostream>
// #include<vector>
// #include<algorithm>
// #include<utility>
// using namespace std;
//
// int main(){
//     int n,C;
//     double sum=0;
//
//     cin>>n>>C;
//
//     vector<int> v(n+1),g(n+1);
//     vector<pair<double,int>> profit(n+1);
//
//     for (int i=0;i<n;i++)
//         cin>>v[i];
//
//     for (int i=0;i<n;i++) {
//         cin>>g[i];
//         profit[i].first=(double)v[i]/g[i];
//         profit[i].second=i;
//     }
//
//     sort(profit.begin(), profit.end(),greater<pair<double,int>>());
//
//     for (int i=0;i<n;i++) {
//         if (C-g[profit[i].second]>=0) {
//             sum+=v[profit[i].second];
//             C-=g[profit[i].second];
//         }
//         else {
//             sum+=(double)v[profit[i].second]/g[profit[i].second] * C;
//             break;
//         }
//     }
//
//     cout<<sum;
//
// }


//2.discreta
#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;

int main(){
    int n,C;

    cin>>n>>C;

    vector<int> v(n+1),g(n+1);
    vector<vector<int>> dp(n+1, vector<int>(C+1,0));

    for (int i=0;i<n;i++)
        cin>>v[i];

    for (int i=0;i<n;i++) {
        cin>>g[i];
    }


    for (int i=1; i<=n; i++) {
        for (int j=0; j<=C; j++) {

            dp[i][j]=dp[i-1][j];

            if (j >= g[i-1]) {
                dp[i][j] = max(dp[i][j],dp[i-1][j - g[i-1]] + v[i-1]);
            }
        }
    }

    cout<<dp[n][C];

}