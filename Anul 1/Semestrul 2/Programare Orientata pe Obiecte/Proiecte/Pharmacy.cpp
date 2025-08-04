//Farmacie veterinara
#include<iostream>
#include<string>
#include<vector>
#include <algorithm>

class Medicne;
class Pill;
class Liquid;
class CombinedTratement;
class Animal;
class Person;
class Client;
class Employee;
class Pharmacy;


class Medicine {
private:
    std::string name;
    std::string animaltype;
    int price{}; //{}=seteaza varialbilele la valoarea implicita
    int dose{};
public:
    //constructors
    //mai multi constructori cu acelasi nume =>overload(supraincarcati)
    Medicine()=default;
    Medicine(const std::string &namem, const std::string &animaltypem,int pricem,int dosem);
    //copy constructor
    //cu & pentru a evita apelarea recursiva a constructorului de copiere - la apelarea Medicine m2 = m1; obiectul m1 ar trebui copiat în m
    Medicine(const Medicine &m);
    //destructor
    virtual ~Medicine()=default; //daca exista un destructor in clasa derivata il apeleaza pe acela
    //methods
    //getters
    std::string getName() const;
    std::string getAnimalType() const;
    int getPrice() const;
    int getDose() const;
    //setters
    void setPrice(int pricem);
    //operator
    Medicine& operator= (const Medicine &m);
    bool operator== (const Medicine &m) const;
    //Operatorul trebuie definit ca funcție prieten pentru a avea acces la membrii privați ai clasei
    friend std::istream &operator>>(std::istream &in, Medicine &med);
    friend std::ostream& operator<<(std::ostream &out, const Medicine &med);
    //function
    virtual void printDetails()const;
};

class Pill: virtual public Medicine {
public:
    //constructors
    Pill()=default;
    Pill(const std::string& name,const std::string& animaltype, int price, int dose);
    //destructor
    ~Pill() override =default;
    //function
    void printDetails() const override;
};

class Liquid: virtual public Medicine {
private:
    int volume_ml{};
public:
    //constructors
    Liquid()=default;
    Liquid(const std::string& name, const std::string& animaltype, int price, int volumem_ml);
    //destructor
    ~Liquid() override =default;
    //function
    int getVolume()const;
    void printDetails() const override;
};

class CombinedTratement: public Pill, public Liquid {
public:
    //constructors
    CombinedTratement()=default;
    CombinedTratement(const std::string& name, const std::string& animaltype, int price,int dose, int volume_ml);
    //destructor
    ~CombinedTratement() override =default;
    //function
    void printDetails() const override;
};

class Animal {
private:
    std::string animal_type;
public:
    //constructors
    Animal()=default;
    explicit Animal(const std::string &animal_type);
    //copy constructor
    Animal(const Animal &a);
    //getter
    std::string getAnimalType();
    //destructor
    ~Animal()=default;
    //operator
    Animal& operator= (const Animal &a);
    friend std::ostream& operator<<(std::ostream& out, const Animal& animal);
};

class Person {
protected:
    std::string name;
    int age{};

public:
    //constructors
    Person()=default;
    Person(const std::string &name, int age);
    //copy constructor
    Person(const Person& person);
    //getter
    std::string getName();
    int getAge() const;
    //settrer
    void setName(const std::string &name);
    void setAge(int age);
    //destructor
    ~Person()=default;
    //operator
    Person& operator= (const Person& person);
};

class Client: public Person {
private:
    Animal animaltype;
    int budget{};

    static int totalClients;

public:
    //constructors
    Client()=default;
    Client(const std::string &name, int age, const Animal &animaltypem,int buget);
    //copy cosntructor
    Client(const Client &c);

    int getBudget() const;

    //getter
    //function
    bool buyMedicine(const Medicine &medicine);
    //destructor
    ~Client()=default;
    //operator
    Client& operator= (const Client& c);
    friend std::ostream& operator<<(std::ostream &out, const Client& c);
};

class Employee: public Person {
private:
    std::string role;
public:
    //constructors
    Employee()=default;
    Employee(const std::string &name, int age, const std::string &role);
    //copy constructor
    Employee(const Employee &e);
    //getter
    std::string getRole();
    //setter
    void setRole(const std::string &role);
    //functions
    static void addMedicineToStock(Pharmacy &pharamacy, Medicine *medicine);
    static void removeMedicineFromStock(Pharmacy &pharmacy, const Medicine &medicine);
    //destructor
    ~Employee()=default;
    //operator
    Employee& operator= (const Employee &e);
};

class Pharmacy {
private:
    std::vector<Medicine*> stock;
public:
    //constructors
    Pharmacy()=default;
    explicit Pharmacy(const std::vector<Medicine*> &stock); //previne conversiile implicite
    //copy constructor
    Pharmacy(const Pharmacy &p);
    //getter
    std::vector<Medicine*>& getStock();

    //function
    void addMedicine(Medicine *med);
    void viewStock() const;
    void removeMedicine(const Medicine& med);
    static void identifyMedicineType(Medicine& med) ;
    //destructor
    ~Pharmacy();
};

int Client::totalClients = 0;

//Medicine
//constructors
Medicine::Medicine(const std::string &namem, const std::string &animaltypem,int pricem,int dosem) {
    this->name=namem;
    this->animaltype=animaltypem;
    this->price=pricem;
    this->dose=dosem;
}
//copy constructor
Medicine::Medicine(const Medicine &m) {
    this->name=m.name;
    this->animaltype=m.animaltype;
    this->price=m.price;
    this->dose=m.dose;
}
//methods
//getters
std::string Medicine::getName() const{return this->name;}
std::string Medicine::getAnimalType() const{return this->animaltype;}
int Medicine::getPrice() const {return this->price;}
int Medicine::getDose() const {return this->dose;}
//setters
void Medicine::setPrice(int pricem) {this->price=pricem;}
//operator
Medicine& Medicine:: operator= (const Medicine &m){
    if(this!=&m) {//verfica daca e acelasi obiect (self-assignement)
        //this - pointer la obiectul curent(cel din partea stanaga a op =)
        this->name=m.name;
        this->animaltype=m.animaltype;
        this->price=m.price;
        this->dose=m.dose;
    }
    return *this;
}
bool Medicine::operator== (const Medicine &m) const {
    return this->price==m.price;
}

std::istream& operator>>(std::istream& in, Medicine& med) {
    std::cout << "Enter medicine name: ";
    in >> med.name;

    std::cout << "Enter animal type: ";
    in >> med.animaltype;

    std::cout << "Enter price: ";
    in >> med.price;

    std::cout << "Enter dose: ";
    in >> med.dose;

    return in;  // Returnăm `in` pentru a permite chain calls (ex: `std::cin >> med1 >> med2;`)
}

std::ostream& operator<<(std::ostream& out, const Medicine& med) {
    out << "Medicine Name: " << med.name << "\n"
       << "Animal Type: " << med.animaltype << "\n"
       << "Price: " << med.price << "\n"
       << "Dose: " << med.dose << " mg"<<"\n";
    return out;
}
//function
void Medicine::printDetails()const {
    std::cout << "Medicine: " << this->name << " for " << this->animaltype << ", Price: " << this->price << ", Dose: " << this->dose << "mg\n";
}

//Pill
//constructors
Pill::Pill(const std::string& name, const std::string& animaltype, int price, int dose):Medicine(name, animaltype, price, dose){}
//function
void Pill::printDetails() const{
    std::cout << "[Pill] " << getName() << " for " << getAnimalType()
                 << " - Dose: " << getDose() << "mg, Price: " << getPrice() << "\n";
}

//Liquid
//constructors
Liquid::Liquid(const std::string& name, const std::string& animaltype, int price, int volumem_ml):Medicine(name, animaltype, price,0),volume_ml{volumem_ml}{}
int Liquid::getVolume() const{return this->volume_ml;}
void Liquid::printDetails() const {
    std::cout << "[Liquid] " << getName() << " for " << getAnimalType()
                << " - Volume: " << getVolume() << "ml, Price: " << getPrice() << "\n";
}

//CombinedTratement
//constructors
CombinedTratement::CombinedTratement(const std::string& name, const std::string& animaltype,
                      int price, int dose, int volume_ml):Medicine(name,animaltype,price,dose),Pill(name,animaltype,price,dose),Liquid(name,animaltype,price,volume_ml){}
//function
void CombinedTratement:: printDetails() const {
    std::cout << "[Combined Treatment] " << getName() << " for " << getAnimalType()
              << " - Dose: " << getDose() << "mg, Volume: " << getVolume()
              << "ml, Price: " << getPrice() << "\n";
}


//Animal
//constructors
Animal::Animal(const std::string& animal_type) {
    this->animal_type = animal_type;
}
Animal::Animal(const Animal& a){this->animal_type=a.animal_type;}
//getter
std::string Animal::getAnimalType(){return this->animal_type;}
//operator
Animal& Animal :: operator= (const Animal& a) {
    if(this!=&a) {
        this->animal_type=a.animal_type;
    }
    return *this;
}
std::ostream& operator<<(std::ostream& out, const Animal& a) {
    out<<a.animal_type;
    return out;
}

//Person
//constructors
Person::Person(const std::string &name, const int age) {
    this->name=name;
    this->age=age;
}
//copy constructor
Person::Person(const Person& person) {
    this->name=person.name;
    this->age=person.age;
}
//getter
std::string Person::getName(){return this->name;}
int Person :: getAge() const{return this->age;} //const-nu modifica starea obiectului asupra caruia este apleata
//settrer
void Person::setName(const std::string &name){this->name=name;}
void Person::setAge(const int age){this->age=age;}
//operator
Person& Person :: operator= (const Person& person) {
    if(this!=&person) {
        this->name=person.name;
        this->age=person.age;
    }
    return *this;
}


//Client
//constructors
//membrii de tip obiect dintr-o clasă trebuie să fie inițializați explicit în lista de inițializare a constructorului
Client::Client(const std::string &name, const int age, const Animal &animaltypem,int buget):Person(name,age),animaltype(animaltypem) {
    this->budget=buget;
    totalClients++;
}
//copy constructor
Client::Client(const Client& c)  : Person(c) { //apleaza constructorul de copiere din clasa Person
    this->name=c.name;
    this->age=c.age;
    this->animaltype=c.animaltype;
    this->budget=c.budget;
    totalClients++;
}
//getter
int Client::getBudget() const {return this->budget;}
//function
bool Client::buyMedicine(const Medicine &medicine) {
    if (this->budget > medicine.getPrice()) {
        this->budget-=medicine.getPrice();
        // std::cout << this->name << " bought " << medicine.getName() << " for " << medicine.getPrice() << " units.\n";
        return true;
    }
    else {
        std::cout << "Insufficient budget to buy " << medicine.getName() << "\n";
        return false;
    }
}
//operator
Client& Client::operator= (const Client& c) {
    if(this!=&c) {
        Person::operator=(c); //copiez din clasa de baza
        this->budget=c.budget;
    }
    return *this;
}
std::ostream& operator<<(std::ostream& out, const Client& client) {
    out << "Client Name: " << client.name << "\n";
    out << "Age: " << client.age << "\n";
    out << "Animal Type:" << client.animaltype<<"\n";
    out << "Budget " << client.budget << "\n";
    return out;
}

//Employee
//constructors
Employee::Employee(const std::string &name, const int age, const std::string &role):Person(name,age) {
    this->role=role;
}
//copy constructor
Employee::Employee(const Employee &e)  : Person(e) {
    this->name=e.name;
}

//getter
std::string Employee::getRole(){return this->role;}
//setter
void Employee::setRole(const std::string &role) {
    this->role=role;
}
//functions
void Employee::addMedicineToStock(Pharmacy &pharamacy, Medicine *medicine) {
    pharamacy.addMedicine(medicine);
    std::cout << "Medicine added to stock: " << medicine->getName() << std::endl;
}
void Employee::removeMedicineFromStock(Pharmacy &pharmacy, const Medicine &medicine) {
    pharmacy.removeMedicine(medicine);
}
//operator
Employee& Employee::operator= (const Employee &e) {
    if(this!=&e) {
        Person::operator=(e);
        this->role=e.role;
    }
    return *this;
}

//Pharmacy
//constructors
Pharmacy::Pharmacy(const std::vector<Medicine*> &stock) {
    this->stock=stock;
}
//copy constructor
Pharmacy::Pharmacy(const Pharmacy &p) {
    this->stock=p.stock;
}
//getter
std::vector<Medicine*>& Pharmacy::getStock(){return this->stock;}
//function
void Pharmacy::addMedicine(Medicine* med) {
    this->stock.push_back(med);
}
void Pharmacy::viewStock() const {
    if (stock.empty()) {
        std::cout << "The pharmacy is out of stock.\n";
        return;
    }
    std::cout << "==Available Medicines in Pharmacy==\n";
    for (const auto& med : this->stock) {
        std::cout << med << "\n";  // Operatorul << pentru a afișa medicamentele
    }
}

void Pharmacy::removeMedicine(const Medicine& med) {
    for(auto i=0; i < this->stock.size(); i++) {
        if (this->stock[i]->getName()==med.getName()) {
            this->stock.erase(stock.begin()+i);
            std::cout << "Medicine " << med.getName() << " removed from stock.\n";
            return;
        }
    }
    std::cout << "Medicine not found!\n";
}

void Pharmacy::identifyMedicineType(Medicine &med) {
    //downcast-daca obj din clasa de baza poate fi tarnsformat  intr-un pointer catre un tip derivat
    if (Pill* pill = dynamic_cast<Pill*>(&med)) {
        std::cout << "The medicine is of type Pill.\n";
    } else if (Liquid* liquid = dynamic_cast<Liquid*>(&med)) {
        std::cout << "The medicine is of type Liquid.\n";
    } else if (CombinedTratement* combined = dynamic_cast<CombinedTratement*>(&med)) {
        std::cout << "The medicine is of type Combined Treatment.\n";
    } else {
        std::cout << "Unknown type of medicine.\n";
    }
}
//destructor
Pharmacy::~Pharmacy() {
    for (Medicine* med : stock) {
        delete med;
    }
}

//functie non-membra
CombinedTratement operator+(const Pill& p, const Liquid& l) {
    std::string combinedName = p.getName() + "_" + l.getName();
    std::string animalType = p.getAnimalType(); // presupunem că ambele sunt pt același animal
    int totalPrice = p.getPrice() + l.getPrice();
    int dose = p.getDose();
    int volume = l.getVolume();

    return CombinedTratement(combinedName, animalType, totalPrice, dose, volume);
}

int main(){
    int mainChoice;
    Pharmacy pharmacy;
    Medicine medicine;
    Animal clientAnimal("cat");
    Client client("Ion Popescu", 30, clientAnimal, 200);

    Employee employee("Maria Ionescu", 35, "Pharmacist");
    pharmacy.addMedicine(new Pill("Vitamins", "cat", 100, 5));
    pharmacy.addMedicine(new Liquid("Antibiotics", "dog", 150, 10));
    pharmacy.addMedicine(new Pill("Painkillers", "dog", 120, 5));
    pharmacy.addMedicine(new Pill("Flea Treatment", "cat", 80, 2));
    pharmacy.addMedicine(new Liquid("Cough Syrup", "cat", 60, 3));

    do {
        std::cout<<"\n== Main Menu ==\n";
        std::cout<<"1. Employee Menu\n";
        std::cout<<"2. Client Menu\n";
        std::cout<<"3. Exit\n";
        std::cin>>mainChoice;

        switch(mainChoice) {
            case 1: {//Employee
                int empChoice;
                do {
                    std::cout << "\n== Employee Menu ==\n";
                    std::cout << "1. Add Medicine\n";
                    std::cout << "2. View Stock\n";
                    std::cout<<"3. Remove medicine\n";
                    std::cout<<"4. Check if two medicines have the same price\n";
                    std::cout<<"5.  Create a new medicine\n";
                    std::cout<<"6.  Update Price\n";
                    std::cout<<"7. Sort medicines by price\n";
                    std::cout << "8. Back to Main Menu\n";
                    std::cout << "Enter your choice: ";
                    std::cin >> empChoice;

                    switch(empChoice) {
                        case 1: {
                            //add
                            Medicine newMed;
                            std::cin >> newMed;  // Folosim supraincarcarea operatorului >>
                            Employee::addMedicineToStock(pharmacy, &newMed);//metoda din clasa Employee
                            break;
                        }

                        case 2: {
                            //view
                            // Upcasting- tratarea obiectelor de tip Pill și Liquid ca Medicine

                            const std::vector<Medicine*>& stock = pharmacy.getStock();

                            for (const auto& med : stock) {
                                med->printDetails();
                            }

                            system("pause");
                            break;
                        }

                        case 3: {
                            //remove
                            Medicine name_med;
                            //overload operator
                            std::cin >> name_med;
                            Employee::removeMedicineFromStock(pharmacy, name_med);
                            break;
                        }

                        case 4: {
                            //same price
                            std::string name1, name2;
                            std::cout << "Enter the name of the first medicine: ";
                            std::cin >> name1;
                            std::cout << "Enter the name of the second medicine: ";
                            std::cin >> name2;

                            //const Medicine- poninteaza la un obj Medicine constat, care nu poate fi modificat
                            Medicine *const*m1 = nullptr;
                            Medicine *const*m2 = nullptr;
                            //&-doar un alis catre vectorul real, nu se face copie
                            const std::vector<Medicine*>& meds = pharmacy.getStock();

                            for (auto& medicine: meds) {
                                if (medicine->getName() == name1) {
                                    m1 = &medicine;
                                }
                                if (medicine->getName() == name2) {
                                    m2 = &medicine;
                                }
                            }

                            if (m1!=nullptr && m2!=nullptr) {
                                //m1,m2 -adresele de memorie
                                if (*m1==*m2) std::cout << "The two medicines have the same price.\n";
                                else  std::cout << "The two medicines have different prices.\n";
                            }
                            else   std::cout << "One or both medicines not found.\n";

                            break;
                        }

                        case 5: {
                            //new medicine
                            std::string name1, name2, animal;
                            int price1, price2, dose, volume;

                            std::cout << "Enter Pill:\n";
                            std::cout << "Name: ";
                            std::cin >> name1;
                            std::cout << "Animal: ";
                            std::cin >> animal;
                            std::cout << "Price: ";
                            std::cin >> price1;
                            std::cout << "Dose: ";
                            std::cin >> dose;

                            std::cout << "Enter Liquid:\n";
                            std::cout << "Name: ";
                            std::cin >> name2;
                            std::cout << "Price: ";
                            std::cin >> price2;
                            std::cout << "Volume: ";
                            std::cin >> volume;

                            Pill p(name1, animal, price1, dose);
                            Liquid l(name2, animal, price2, volume);

                            CombinedTratement combo = p + l;

                            std::cout << "\nYou received the following prescription:\n";
                            combo.printDetails();

                            break;
                        }

                        case 6: {
                            //modif price
                            std::string name;
                            int newPrice;

                            std::cout << "Enter the name of the medicine: ";
                            std::cin >> name;

                            std::cout << "Enter the new price: ";
                            std::cin >> newPrice;

                            bool found = false;
                            for (auto& med : pharmacy.getStock()) {
                                if (med->getName() == name) {
                                    med->setPrice(newPrice);
                                    std::cout << "Price updated successfully!\n";
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                std::cout << "Medicine not found.\n";
                                break;
                            }
                        }

                        case 7: {
                            std::vector<Medicine*> sortedStock = pharmacy.getStock();

                            //[] (const Medicine& a, const Medicine& b) { return a.getPrice() < b.getPrice(); } - lamba function
                            //[]-introducerea lambda-ului (fara capturi de variabile din exterior)
                            std::sort(sortedStock.begin(), sortedStock.end(), [](const Medicine* a, const Medicine* b) {
                                return a->getPrice() < b->getPrice();
                            });

                            std::cout << "Medicines sorted by price:\n";
                            for (const auto& med : sortedStock) {
                                med->printDetails();
                            }
                            break;
                        }

                        case 8: {
                            break;
                        }

                        default: {
                            std::cout << "Invalid Choice\n";
                            break;
                        }
                    }
                }while (empChoice!=8);
                break;//sa nu faca case 2 direct

                case 2 : {//client
                    int clientChoice;

                    do {
                        std::cout << "\n== Client Menu ==\n";
                        std::cout << "1. Buy Medicine\n";
                        std::cout << "2. View Stock\n";
                        std::cout<<"3. Get Combined Treatment\n";
                        std::cout<<"4. View Client Info\n";
                        std::cout<<"5. Identify medicine type\n";
                        std::cout << "6. Back to Main Menu\n";
                        std::cout << "Enter your choice: ";
                        std::cin >> clientChoice;

                        switch(clientChoice) {
                            case 1: {
                                int poz;
                                std::string medicineName;
                                std::cout<< "Enter medicine name to buy: "; std::cin>>medicineName;

                                bool found= false;
                                std::vector<Medicine*> stock=pharmacy.getStock();
                                for (auto i=0; i<stock.size(); i++) {
                                    if (stock[i]->getName()==medicineName) {
                                        found=true;
                                        poz=i;
                                        break;
                                    }
                                }

                                if (found==false)  std::cout << "Medicine not found!\n";
                                else {
                                    if (client.buyMedicine(*stock[poz]))std::cout << "Purchase successful!\n";
                                    else std::cout << "Purchase failed!\n";
                                }

                                break;
                            }

                            case 2: {
                                pharmacy.viewStock();
                                system("pause");
                                break;
                            }

                            case 3: {
                                std::string name, animaltype;
                                int price, dose, volume;

                                std::cout << "Enter name for combined treatment: ";
                                std::cin >> name;
                                std::cout << "Enter animal type: ";
                                std::cin >> animaltype;
                                std::cout << "Enter price: ";
                                std::cin >> price;
                                std::cout << "Enter dose (mg): ";
                                std::cin >> dose;
                                std::cout << "Enter volume (ml): ";
                                std::cin >> volume;

                                CombinedTratement trat(name, animaltype, price, dose, volume);
                                std::cout << "\nYou received the following prescription:\n";
                                trat.printDetails();

                                if (client.buyMedicine(trat)) {
                                    std::cout << "Treatment purchased successfully!\n";
                                } else {
                                    std::cout << "Not enough budget to buy this treatment.\n";
                                }

                                break;
                            }

                            case 4: {
                                std::cout << client << "\n";
                                break;
                            }

                            case 5: {
                                std::string nameToSearch;
                                std::cout << "\nEnter medicine name to identify type: ";
                                std::cin>>nameToSearch;

                                bool found = false;
                                for (Medicine* med : pharmacy.getStock()) {
                                    if (med->getName() == nameToSearch) {
                                        Pharmacy::identifyMedicineType(*med);
                                        found = true;
                                        break;
                                    }
                                }

                                if (!found) {
                                    std::cout << "Medicine not found in stock.\n";
                                }
                                break;

                            }
                            case 6: {
                                break;
                            }

                            default:
                                std::cout << "Invalid choice! Try again.\n";
                        }
                    }while (clientChoice!=6);
                }

                default: {
                    std::cout << "Invalid Choice. Please try again.\n";
                    break;
                }
            }
        }
    }while (mainChoice!=3);

return 0;
}
