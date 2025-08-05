//lab4
#include <iostream>
#include <memory>
#include <vector>
using namespace std;
// class Fractie {
//    public:
//    Fractie inversa();
// };
//
// class A {
//
// };
//
// class B {
// private:
//    A a;//compozitie
//    A *a1;//agregare
// public:
//    void set_a(A *a1) {
//       this->a = *a1;
//    }
// };
// int main() {
//    //vector<vector<int>> v;
//
//    //Fractie fractie(1,20);
//    //sau
//    //Fractie *pfractie
//    A a1;
//    B b;
//    b.set_a(&a1);
//
//    auto d=new A();
//    auto c=std::make_shared<A>();//apleaza automat delete-ul si sterge poinertul cand nu mai e folosit, este un smart pointer
// }

//Tema
//matrice
//polinom
//banca(carduri,conturi,persoane,palta())


#include <iostream>
using namespace std;

class Matrice {
public:
    Matrice(int nrLinii, int nrColoane, int element = 0) {
        for (auto x = 0; x < nrLinii; x++) {
            vector<int> aux;
            for (int i = 0; i < nrColoane; i++) {
                aux.push_back(element);
            }
            matrice.push_back(aux);
        }
    }

    // Matrice(const Matrice &aux): matrice(aux.matrice) {
    // }

    friend ostream& operator<<(ostream& out, const Matrice &aux) {
        for (auto i = 0; i < aux.matrice.size(); i++) {
            for (auto j = 0; j < aux.matrice[i].size(); j++) {
                out << aux.matrice[i][j] << " ";
            }
            out << std::endl;
        }
        return out;
    }

    friend istream& operator>>(istream& in, Matrice &aux) {
        int nrLinii, nrColoane;
        std::cout << "Introduceti nrLinii =";
        in >> nrLinii;
        std::cout << "Introduceti nrColoane =";
        in >> nrColoane;
        vector<vector<int>> matrice;
        int n;
        for (auto i = 0; i < nrLinii; i++) {
            vector<int> auxVector;
            for (auto j = 0; j < nrColoane; j++) {
                in >> n;
                auxVector.push_back(n);
            }
            matrice.push_back(auxVector);
        }
        aux.matrice = matrice;
        return in;
    }

    size_t nrLinii() const {
        return matrice.size();
    }

    size_t nrColoane() const {
        if (nrLinii() == 0) {
            return 0;
        }
        return matrice[0].size();
    }

    Matrice operator+(const Matrice &aux) const {
        if (this->nrLinii() != aux.nrLinii() ||
            this->nrColoane() != aux.nrColoane()) {
            return Matrice(0, 0);
        }
        auto sd = this->nrColoane();
        Matrice auxx(this->nrLinii(), this->nrColoane());
        for (auto i = 0; i < this->nrLinii(); i++) {
            for(auto j = 0; j < this->nrColoane(); j++) {
                auxx.matrice[i][j] = this->matrice[i][j] + aux.matrice[i][j];
            }
        }
        return auxx;
    }

    Matrice operator*(int scalar) const {
        Matrice aux(this->nrLinii(), this->nrColoane());
        for (auto i = 0; i < this->nrLinii(); i++) {
            for(auto j = 0; j < this->nrColoane(); j++) {
                aux.matrice[i][j] = this->matrice[i][j] * scalar;
            }
        }
        return aux;
    }

    Matrice operator-(const Matrice &aux) const {
        return *this + (aux * -1);
    }

    //constructor matrice patratica
    Matrice(int nrLinii) {
        for (auto x = 0; x < nrLinii; x++) {
            vector<int> aux;
            for (int i = 0; i < nrLinii; i++) {
                aux.push_back(0);
            }
            matrice.push_back(aux);
        }
    }

    //transpusa
    Matrice transpusa() const {
        Matrice rezultat(this->nrColoane(), this->nrLinii()); // Inversăm dimensiunile

        for (size_t i = 0; i < this->nrLinii(); i++) {
            for (size_t j = 0; j < this->nrColoane(); j++) {
                rezultat.matrice[j][i] = this->matrice[i][j]; // Inversăm elementele
            }
        }
        return rezultat;
    }

    //inmultire intre 2 matrici
    Matrice operator*(const Matrice& m1) const {
        Matrice rezultat(this->nrLinii(), m1.nrColoane());

        for (auto i = 0; i < this->nrLinii(); i++) {
            for (auto j = 0; j < m1.nrColoane(); j++) {
                for (auto k = 0; k < this->nrColoane(); k++) {
                    rezultat.matrice[i][j] += this->matrice[i][k] * m1.matrice[k][j];
                }
            }
        }
        return rezultat;
    }

private:
    vector<vector<int>> matrice;
};

Matrice operator*(int scalar, const Matrice &aux) {
    return aux * scalar;
}

int main() {
    Matrice x(2, 2, 1);
    Matrice y(2, 2, 1);
    //std::cout << x-y;

    // Matrice z(2);
    // cout<<z;

    //cout<<x^y;

    cout<<x.transpusa()<<endl;

    Matrice produs = x * y;
    cout << "Produsul:\n" << produs;
}