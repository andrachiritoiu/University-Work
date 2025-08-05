//suma a doua polinoame
#include <iostream>
#include <vector>


class Polinom {
private:
    std::vector<int> coef;

public:
    Polinom(int grad) : coef(grad + 1, 0) {}

    void setCoef(int grad, int value) {
        if (grad >= 0 && grad < coef.size())
            coef[grad] = value;
    }

    int getGrad() const {
        int g = coef.size() - 1;
        while (g > 0 && coef[g] == 0)
            g--;
        return g;
    }

    Polinom operator+(const Polinom& other) const {
        Polinom result(std::max(other.getGrad(),this->getGrad()));
        int m=this->getGrad();
        int n=other.getGrad();
        int i=std::max(other.getGrad(),this->getGrad());
        // 4 6 3 2
        // 2 0 4
        // Polinom a(max( whateveR))
        //
        while (m>=0 && n>=0) {
            if (m>n) {
                result.coef[i--]=coef[m];
                m--;
            }
            else if (m<n) {
                result.coef[i--]=other.coef[n];
                n--;
            }
            else {
                result.coef[i--] = coef[m] + other.coef[n];
                m--;
                n--;
            }
        }
        return result;
    }


    // afis
    void print() const {
        int g=getGrad();
        bool ok=true;
        for (int i = g; i >= 0; i--) {
            if (coef[i] != 0) {
                if (g==0) std::cout << coef[i];
                else std::cout << coef[i]<<"x"<<"^"<<g;
                if (ok==true)std::cout<<"+";
                g--;
                if (g==0)ok=false;
            }
        }

        std::cout << std::endl;
    }
};

int main() {
    Polinom p1(3);
    p1.setCoef(3, 3);
    p1.setCoef(2, 3);
    p1.setCoef(1, 2);
    p1.setCoef(0, 1);

    Polinom p2(2);
    p2.setCoef(2, 1);
    p2.setCoef(1, 4);
    p2.setCoef(0, 5);

    Polinom suma = p1 + p2;

    std::cout << "Polinom 1: "; p1.print();
    std::cout << "Polinom 2: "; p2.print();
    std::cout << "Suma: "; suma.print();

    return 0;
}
