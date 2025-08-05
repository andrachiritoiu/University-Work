#include<iostream>
#include<vector>
#include<memory>
#include<stdexcept>
#include<string>
#include<algorithm>
#include<map>
using namespace std;

class Stream{
  public:
    virtual ~Stream()=default;
    friend std::istream& operator>>(std::istream &in, Stream &obj);
    friend std::ostream& operator<<(std::ostream &out,const Stream &obj);

    virtual void citire(std::istream &in)=0;
    virtual void afisare(std::ostream &out)const=0;
};

std::istream& operator>>(std::istream &in, Stream &obj) {
    obj.citire(in);
    return in;
}
std::ostream& operator<<(std::ostream &out,const Stream &obj) {
    obj.afisare(out);
    return out;
}

class Masca:public Stream {
protected:
    string tip_protectie;
    bool model;
public:
    Masca()=default;
    Masca(string tip_protectie, bool model);

    string getProtectie()const;
    bool getModel()const;

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    virtual float getPret()=0;

    ~Masca()override=default;
};

Masca::Masca(string tip_protectie, bool model) {
    this->tip_protectie=tip_protectie;
    this->model=model;
}
string Masca::getProtectie()const {
    return this->tip_protectie;
}
bool Masca::getModel()const {
    return this->model;
}
void Masca::citire(std::istream &in){
    if (tip_protectie.empty()) {
        cout<<"Tip protectie: ";
        in>>tip_protectie;
    }
    cout<<"Are model(0-nu/1-da): ";
    in>>model;
}
void Masca::afisare(std::ostream &out)const{
    out<<"Tip protectie: "<<tip_protectie<<"\n"
       <<"Are model(0-nu/1-da): "<<model<<"\n";
}


class MascaChirurgicala:public Masca {
private:
    string culoare;
    int nr_pliuri;
public:
    MascaChirurgicala()=default;
    MascaChirurgicala(string tip_protectie, bool model, string culoare, int nr_pliuri);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float getPret()override;

    ~MascaChirurgicala()override=default;
};

MascaChirurgicala::MascaChirurgicala(string tip_protectie, bool model, string culoare, int nr_pliuri):Masca(tip_protectie,model) {
    this->culoare=culoare;
    this->nr_pliuri=nr_pliuri;
}
void MascaChirurgicala::citire(std::istream &in){
    Masca::citire(in);
    cout<<"Culoare: ";
    in>>culoare;
    cout<<"Nr pliuri: ";
    in>>nr_pliuri;
}
void MascaChirurgicala::afisare(std::ostream &out)const {
    Masca::afisare(out);
    out<<"Culoare: "<<culoare<<"\n"
       <<"Nr pliuri: "<<nr_pliuri<<"\n";
}
float MascaChirurgicala::getPret() {
    float mul=1;
    if (model==1) {
        mul=1.5;
    }
    if (tip_protectie=="ffp1")return 5*mul;
    else if (tip_protectie=="ffp2")return 10*mul;
    else if (tip_protectie=="ffp3")return 15*mul;
}


class MascaPolicarbonat:public Masca {
private:
    string tip_prindere;
public:
    MascaPolicarbonat(string tip_protectie="ffp0", bool model=0, string tip_prindere="");

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float getPret() override;

    ~MascaPolicarbonat()override=default;
};

MascaPolicarbonat::MascaPolicarbonat(string tip_protectie, bool model, string tip_prindere):Masca(tip_protectie,model) {
    this->tip_prindere=tip_prindere;
}
void MascaPolicarbonat::citire(std::istream &in){
    Masca::citire(in);
    cout<<"Tip prindere: ";
    in>>tip_prindere;
}
void MascaPolicarbonat::afisare(std::ostream &out)const {
    Masca::afisare(out);
    out<<"Tip prindere"<<tip_prindere<<"\n";
}
float MascaPolicarbonat::getPret() {
    return 20;
}

class Dezinfectant:public Stream {
protected:
    int nr_specii;
    std::vector<string>ingrediente;
    std::vector<string>suprafete;
public:
    Dezinfectant()=default;
    Dezinfectant(int nr_specii, std::vector<string>ingredeinte, std::vector<string>suprafete);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    virtual float eficienta()=0;
    void setIngrediente(std::vector<string> ingrediente);
    void setNrSpecii(int nr);
    void setSuprafete(std::vector<string> suprafete);

    ~Dezinfectant()override=default;

};

Dezinfectant::Dezinfectant(int nr_specii, std::vector<string>ingrediente, std::vector<string>suprafete) {
    this->nr_specii=nr_specii;
    this->ingrediente=ingrediente;
    this->suprafete=suprafete;
}
void Dezinfectant::citire(std::istream &in) {
    cout<<"Nr specii: ";
    in>>nr_specii;

    cout<<"Numar ingrediente: ";
    int nr;
    in>>nr;
    string ingredient;
    cout<<"Ingrediente: ";
    for (int i=0;i<nr;i++) {
        in>>ingredient;
        ingrediente.push_back(ingredient);
    }

    cout<<"Numar suprafete: ";
    int nrs;
    in>>nrs;
    string suprafata;
    cout<<"Suprafete: ";
    for (int i=0;i<nrs;i++) {
        in>>suprafata;
        suprafete.push_back(suprafata);
    }
}
void Dezinfectant::afisare(std::ostream &out)const {
    out<<"Nr specii: "<<nr_specii<<"\n";

    out<<"Ingrediente: ";
    for (int i=0;i<ingrediente.size();i++) {
        out<<ingrediente[i]<<"\n";
    }

    out<<"Suprafete: ";
    for (int i=0;i<suprafete.size();i++) {
        out<<suprafete[i]<<"\n";
    }
}
void Dezinfectant::setIngrediente(std::vector<string> ingrediente) {
    this->ingrediente=ingrediente;
}
void Dezinfectant::setNrSpecii(int nr) {
    this->nr_specii=nr;
}
void Dezinfectant::setSuprafete(std::vector<string> suprafete) {
    this->suprafete=suprafete;
}

class DezinfectantBacterii:virtual public Dezinfectant {
public:
    DezinfectantBacterii()=default;
    DezinfectantBacterii(int nr_specii, std::vector<string>ingredeinte, std::vector<string>suprafete);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float eficienta()override;

    ~DezinfectantBacterii()override=default;
};

DezinfectantBacterii::DezinfectantBacterii(int nr_specii, std::vector<string>ingrediente, std::vector<string>suprafete):Dezinfectant(nr_specii,ingrediente,suprafete){}
void DezinfectantBacterii::citire(std::istream &in) {
    Dezinfectant::citire(in);
}
void DezinfectantBacterii::afisare(std::ostream &out)const {
    Dezinfectant::afisare(out);
}
float DezinfectantBacterii::eficienta() {
    return this->nr_specii/1000000000;
}


class DezinfectantFungi:virtual public Dezinfectant {
public:
    DezinfectantFungi()=default;
    DezinfectantFungi(int nr_specii, std::vector<string>ingredeinte, std::vector<string>suprafete);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float eficienta()override;

    ~DezinfectantFungi()override=default;
};

DezinfectantFungi::DezinfectantFungi(int nr_specii, std::vector<string>ingrediente, std::vector<string>suprafete):Dezinfectant(nr_specii,ingrediente,suprafete){}
void DezinfectantFungi::citire(std::istream &in) {
    Dezinfectant::citire(in);
}
void DezinfectantFungi::afisare(std::ostream &out)const {
    Dezinfectant::afisare(out);
}
float DezinfectantFungi::eficienta() {
    return this->nr_specii*1.5/1000000;
}

class DezinfectantVirusuri:virtual public Dezinfectant {
public:
    DezinfectantVirusuri()=default;
    DezinfectantVirusuri(int nr_specii, std::vector<string>ingredeinte, std::vector<string>suprafete);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float eficienta()override;

    ~DezinfectantVirusuri()override=default;
};

DezinfectantVirusuri::DezinfectantVirusuri(int nr_specii, std::vector<string>ingrediente, std::vector<string>suprafete):Dezinfectant(nr_specii,ingrediente,suprafete){}
void DezinfectantVirusuri::citire(std::istream &in) {
    Dezinfectant::citire(in);
}
void DezinfectantVirusuri::afisare(std::ostream &out)const {
    Dezinfectant::afisare(out);
}
float DezinfectantVirusuri::eficienta() {
    return this->nr_specii/100000000;
}

class DezinfectantTot:public DezinfectantFungi, public DezinfectantBacterii, public DezinfectantVirusuri{
public:
    DezinfectantTot()=default;
    DezinfectantTot(int nr_specii, std::vector<string>ingredeinte, std::vector<string>suprafete);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    float eficienta()override;

    ~DezinfectantTot()override=default;
};

DezinfectantTot::DezinfectantTot(int nr_specii, std::vector<string>ingrediente, std::vector<string>suprafete):
     Dezinfectant(nr_specii,ingrediente,suprafete),
     DezinfectantBacterii(nr_specii,ingrediente,suprafete),
     DezinfectantFungi(nr_specii,ingrediente,suprafete),
     DezinfectantVirusuri(nr_specii,ingrediente,suprafete){}
void DezinfectantTot::citire(std::istream &in) {
    Dezinfectant::citire(in);
}
void DezinfectantTot::afisare(std::ostream &out)const{
    Dezinfectant::afisare(out);
}
float DezinfectantTot::eficienta() {
    return this->nr_specii/(100000000+1.5*1000000*100000000);
}

class Achizitie:public Stream{
private:
    int zi,luna,an;
    string nume_client;
    std::vector<std::shared_ptr<Dezinfectant>>dezinfectanti;
    std::vector<std::shared_ptr<Masca>>masti;
    int total;
public:
    Achizitie()=default;
    Achizitie(int zi,int luna,int an,string nume_client, std::vector<std::shared_ptr<Dezinfectant>>dezinfectanti, std::vector<std::shared_ptr<Masca>>masti);

    void citire(std::istream &in)override;
    void afisare(std::ostream &out)const override;
    int getTotal();
    int getVenitMastiCModel()const;
    int getZi()const;
    string getNume()const;
    int getLuna()const;
    int getAn()const;

    ~Achizitie()=default;
};

Achizitie::Achizitie(int zi,int luna,int an,string nume_client, std::vector<std::shared_ptr<Dezinfectant>>dezinfectanti, std::vector<std::shared_ptr<Masca>>masti) {
    this->zi=zi;
    this->luna=luna;
    this->an=an;
    this->nume_client=nume_client;
    this->dezinfectanti=dezinfectanti;
    this->masti=masti;
    this->total=total;
}
void Achizitie::citire(std::istream &in) {
    cout<<"Zi: ";
    in>>zi;
    cout<<"Luna: ";
    in>>luna;
    cout<<"An: ";
    in>>an;
    cout<<"Nume: ";
    in>>nume_client;
    cout<<"Nr dezinfectanti: ";
    int nr;
    in>>nr;

    for (int i=0;i<nr;i++) {
        cout<<"Tipul dezinfectantului: ";
        string tip;
        in>>tip;

        std::shared_ptr<Dezinfectant> dezinfectant;
        if (tip=="bacterii")dezinfectant=std::make_shared<DezinfectantBacterii>();
        else if (tip=="fungi")dezinfectant=std::make_shared<DezinfectantFungi>();
        else if (tip=="virusuri")dezinfectant=std::make_shared<DezinfectantVirusuri>();
        else if (tip=="general")dezinfectant=std::make_shared<DezinfectantTot>();
        else {
            cout<<"Tip invalid";
            i--;
        }

        dezinfectant->citire(in);
        this->dezinfectanti.push_back(dezinfectant);
    }

    cout<<"Nr masti: ";
    in>>nr;
    for (int i=0;i<nr;i++) {
        cout<<"Tip masca: ";
        string tip;
        in>>tip;

        std::shared_ptr<Masca>masca;
        if (tip=="chirurgicala")masca=std::make_shared<MascaChirurgicala>();
        else if (tip=="policarbonat")masca=std::make_shared<MascaPolicarbonat>();
        else {
            cout<<"Tip invalid";
            i--;
        }

        masca->citire(in);
        this->masti.push_back(masca);
    }

}
void Achizitie::afisare(std::ostream &out)const {
    //de completat
}
int Achizitie::getLuna()const {
    return this->luna;
}
int Achizitie::getTotal() {
    this->total=0;
    for (auto dezi:dezinfectanti) {
        if (dezi->eficienta()<0.9)total+=10;
        else if (dezi->eficienta()<0.95)total+=20;
        else if (dezi->eficienta()<0.975)total+=30;
        else if (dezi->eficienta()<0.99)total+=40;
        else if (dezi->eficienta()<0.9999)total+=50;
    }
    for (auto masca:masti) {
        total+=masca->getPret();
    }
    return total;
}
int Achizitie::getVenitMastiCModel() const{
    int total_c=0;
    for (auto masca:masti) {
        if (masca->getProtectie()=="chirurgicala" && masca->getModel()==1) {
            total_c+=masca->getPret();
        }
    }
    return total_c;
}
int Achizitie::getZi() const{
    return this->zi;
}
string Achizitie::getNume() const{
    return this->nume_client;
}
int Achizitie::getAn() const{
    return this->an;
}

class Meniu {
private:
    Meniu() = default;
    Meniu(const Meniu &meniu) = delete;
    Meniu &operator=(const Meniu &meniu) = delete;
    static Meniu *meniu;
    //stoc
    std::vector<std::shared_ptr<Dezinfectant>>dezinfectanti;
    std::vector<std::shared_ptr<Masca>>masti;
    std::vector<std::shared_ptr<Achizitie>>achizitii;

public:
    static Meniu *getInstance();
    void ruleaza();
    void adaugaDezifectant();
    void adaugaMasca();
    void adaugaAchizitie();
    void dezinfectantEficient()const;
    void calculeazaVenit(int luna);
    void calculeazaMasti();
    void modficaReteta();
    void clientFidel();
    void ziVenituriSlabe();
    void TVA(int an);

};

Meniu* Meniu::getInstance(){
    if (meniu == nullptr)
        meniu = new Meniu();
    return meniu;
}
void Meniu::adaugaDezifectant() {
    cout<<"Tipul dezinfectantului: ";
    string tip;
    cin>>tip;

    std::shared_ptr<Dezinfectant> dezinfectant;
    if (tip=="bacterii")dezinfectant=std::make_shared<DezinfectantBacterii>();
    else if (tip=="fungi")dezinfectant=std::make_shared<DezinfectantFungi>();
    else if (tip=="virusuri")dezinfectant=std::make_shared<DezinfectantVirusuri>();
    else if (tip=="general")dezinfectant=std::make_shared<DezinfectantTot>();
    else {
        throw std::runtime_error("Tip invalid");
    }

    cin>>*dezinfectant;
    this->dezinfectanti.push_back(dezinfectant);
    cout<<"Dezinfectant adaugat";
}

void Meniu::adaugaMasca() {
    cout<<"Tip masca: ";
    string tip;
    cin>>tip;

    std::shared_ptr<Masca>masca;
    if (tip=="chirurgicala")masca=std::make_shared<MascaChirurgicala>();
    else if (tip=="policarbonat")masca=std::make_shared<MascaPolicarbonat>();
    else {
        cout<<"Tip invalid";
        return;
    }

    cin>>*masca;
    this->masti.push_back(masca);
    cout<<"Masca adaugata";
}

void Meniu::adaugaAchizitie() {
    auto achizitie=std::make_shared<Achizitie>();
    cin>>*achizitie;
    this->achizitii.push_back(achizitie);
    cout<<"Achzitie adaugata";
}

void Meniu::dezinfectantEficient() const {
    if (dezinfectanti.empty()) {
        throw std::runtime_error("Nu exista dezinfectanti.\n");
    }

    int maxim=-1;
    std::shared_ptr<Dezinfectant>dezinfectant;
    for (auto dezi:dezinfectanti) {
        if (dezi->eficienta()>maxim) {
            maxim=dezi->eficienta();
            dezinfectant=dezi;
        }
    }
    cout<<*dezinfectant;

    //sau
    // auto max = std::max_element(dezinfectanti.begin(), dezinfectanti.end(),
    //             [](const std::unique_ptr<Dezinfectant>& a, const std::unique_ptr<Dezinfectant>& b) {
    //                 return a->eficienta() < b->eficienta();
    //             });
    //
}

void Meniu::calculeazaVenit(int luna) {
    float total=0;
    for (auto achizitie:achizitii) {
        if (achizitie->getLuna()==luna) {
            total+=achizitie->getTotal();
        }
    }
    if (total!=0) {
        cout<<"Total "<<total;
    }
    else {
        throw runtime_error("Nu exista achizitii");
    }
}
void Meniu::calculeazaMasti() {
    int total=0;
    for (auto achizitie:achizitii) {
        total+=achizitie->getVenitMastiCModel();
    }
}
void Meniu::modficaReteta() {\
    cout<<"Alege dezinfectant(0-"<<dezinfectanti.size()<<"): ";
    int op,nr;
    cin>>op;
    cout<<"Cate ingrediente noi:";
    cin>>nr;
    std::vector<string>ingr_noi;
    for (int i=0;i<nr;i++) {
        string ingr;
        cin>>ingr;
        ingr_noi.push_back(ingr);
    }
    dezinfectanti[op]->setIngrediente(ingr_noi);

    cout<<"Numar nou de specii: ";
    cin>>nr;
    dezinfectanti[op]->setNrSpecii(nr);

    cout<<"Cate suprafete noi:";
    cin>>nr;
    std::vector<string>suprafete_noi;
    for (int i=0;i<nr;i++) {
        string suprafata;
        cin>>suprafata;
        suprafete_noi.push_back(suprafata);
    }
    dezinfectanti[op]->setSuprafete(suprafete_noi);
}
void Meniu::clientFidel() {
    if (achizitii.empty()) {
        throw std::runtime_error ("Nu exista achizitii!\n");
    }

    map<string, int> numarAchizitii;
    map<string, double> valoareTotala;

    for (auto a :achizitii) {
        string nume=a->getNume();
        numarAchizitii[nume]++;
        valoareTotala[nume]+=a->getTotal();
    }

    string celMaiFidelClient = "";
    int maxAchizitii = 0;
    double valoareMaxClient = 0;

    for (auto &pair : numarAchizitii) {
        if (pair.second > maxAchizitii ||
            (pair.second == maxAchizitii && valoareTotala[pair.first] > valoareMaxClient)) {
            maxAchizitii=pair.second;
            celMaiFidelClient=pair.first;
            valoareMaxClient=valoareTotala[pair.first];
            }
    }

    cout << "Cel mai fidel client: " << celMaiFidelClient << "\n";
    cout << "Numar achizitii: " << maxAchizitii << "\n";
    cout << "Valoare totala achizitii: " << valoareMaxClient << " lei\n";

    cout << "\nDetalii achizitii:\n";
    for (auto a : achizitii) {
        if (a->getNume() == celMaiFidelClient) {
            cout << "- Data: " << a->getZi() << "/" << a->getLuna() << "/" << a->getAn()
                 << ", Valoare: " << a->getTotal() << " lei\n";
        }
    }
}
void Meniu::ziVenituriSlabe() {
    int min=99999999;
    if (achizitii.empty()) {
        throw "Nu exista achizitii";
    }
    string zi="";
    for (auto achizitie:achizitii) {
        if (achizitie->getTotal()<min) {
            min=achizitie->getTotal();
            zi=achizitie->getZi();
        }
    }
    if (zi=="") {
        throw runtime_error("Nu exista achizitii");
    }
    else cout<<zi;
}
void Meniu::TVA(int an) {
    int total_v=0;
    for (auto achizitie:achizitii) {
        if (achizitie->getAn()==an) {
            total_v+=achizitie->getTotal();
        }
    }
    if (total_v==0) {
        throw runtime_error("Nu exista acizitii");
    }
    else {
        cout<<0.19*total_v;
    }
}


void Meniu::ruleaza() {
    int op=-1;
    do {
        try {
            cout<<"\n1.Adauga dezinfectant\n";
            cout<<"2.Adauga masca\n";
            cout<<"3.Adauga achizitie\n";
            cout<<"4.Afiseaza dezifectantul cel mai eficient\n";
            cout<<"5.Venit lunar\n";
            cout<<"6.Venit masti chirurgicale model\n";
            cout<<"7.Modifica reteta\n";
            cout<<"8.Afisare cel mai fidel client\n";
            cout<<"9.Ziua cu cel mai slabe venituri\n";
            cout<<"10.Calculeaza TVA\n";
            cout<<"0. Iesire\n";
            cout<<"Alege: ";
            cin>>op;

            switch (op) {
                case 1: {
                    adaugaDezifectant();
                    break;
                }
                case 2: {
                    adaugaMasca();
                    break;
                }
                case 3: {
                    adaugaAchizitie();
                    break;
                }
                case 4: {
                    dezinfectantEficient();
                    break;
                }case 5: {
                    cout<<"Luna: ";
                    int luna;
                    cin>>luna;
                    calculeazaVenit(luna);
                    break;
                }
                case 6: {
                    calculeazaMasti();
                    break;
                }
                case 7: {
                    modficaReteta();
                    break;
                }
                case 8: {
                    clientFidel();
                    break;
                }
                case 9: {
                    ziVenituriSlabe();
                    break;
                }
                case 10: {
                    cout<<"Anul: ";
                    int an;
                    cin>>an;
                    TVA(an);
                    break;
                }
                case 0: {
                    break;
                }
            }
        }
        catch (const exception &e){
            cout<<"Exceptie: "<<e.what();
            op=-1;
        }
    }while (op!=0);
}


Meniu* Meniu::meniu=nullptr;

int main(){
    Meniu::getInstance()->ruleaza();
return 0;
}
