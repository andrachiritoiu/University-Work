
//// problema 2746 pbinfo


#include <iostream>
#include <fstream>
using namespace std;

int v[100];
int n;
ifstream in("heap_sort.in");
ofstream out("heap_sort.out");


void up(int poz)
{
    if (v[(poz - 1) / 2] > v[poz])
    {
        swap(v[(poz - 1) / 2], v[poz]);
        up((poz - 1) / 2);
    }
}
void inserare(int nr)
{
    v[n] = nr;
    n++;
    up(n - 1);
}

void down(int poz)
{
    if(2*poz+2<n)
    {
        int minim=min(v[2*poz+1], v[2*poz+2]);
        if(minim>=v[poz])
            return;
            else if (minim==v[poz*2+1])
            {
                swap(v[poz], v[2*poz+1]);
                down(2*poz+1);
            }
            else
            {
                swap(v[poz], v[2*poz+2]);
                down(2*poz+2);
            }
    }
    else if (2*poz+1<n && v[poz*2+1]<v[poz])
    {
        swap(v[poz], v[2*poz+1]);
        down(2*poz+1);
    }
}

int extragere(int poz)
{
    int r=v[0];
    swap(v[0], v[n-1]);
    n--;
    down(0);
    return r;
}

void heapify()
{
    for (int i = n - 1; i >= 0; i--)
    {
        if (i * 2 + 1 < n)
        {
            down(i);
        }

    }
}

int main()
{
    in >> n;
    for (int i = 0; i < n; i++)
    {
        in >> v[i];
    }

    heapify();
    while(n!=0)
    {
        out<<extragere(0)<<" ";
    }

    return 0;
}