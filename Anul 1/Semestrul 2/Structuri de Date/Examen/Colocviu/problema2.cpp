#include<iostream>
#include<set>

using namespace std;

int main(){
    int n;
    set<int>padure;
    cout<<"Numar de instructiuni: ";
    cin>>n;
    string op;
    for(int i=0;i<n;i++) {
      cout<<"Ce face: ";
      cin>>op;
      if(op=="Adauga"){
        int val;
        cin>>val;
        padure.insert(val);
      }
      else if(op=="Arata"){
        for(auto val:padure)
          cout<<val<<" ";
        cout<<"\n";
      }
      else if(op=="Cauta"){
        int val;
        cin>>val;
        int ok=0;
        for(auto p:padure)
          if (p==val)
            ok=1;
        if (ok==0)cout<<"NU\n";
        else cout<<"DA\n";
      }
    }

    return 0;
}