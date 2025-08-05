#include<iostream>
#include<queue>
#include<algorithm>

using namespace std;

int main(){
    int n,k,val;
    priority_queue<int,vector<int>,greater<int>> comoara;
    cout<<"n=";
    cin>>n;
    cout<<"k=";
    cin>>k;

    for(int i=0;i<n;i++){
        cout<<"Valoare: ";
        cin>>val;
        if (comoara.size()<k) {
            comoara.push(val);
        }
        else {
            comoara.pop();
            comoara.push(val);
        }

    }

    vector<int>valori;
    for(int i=0;i<k;i++) {
        valori.push_back(comoara.top());
        comoara.pop();
    }

    sort(valori.begin(),valori.end(),[](int a,int b) {
        return a>b;
    });

    for (auto val:valori) {
        cout<<val<<" ";
    }

    return 0;
}