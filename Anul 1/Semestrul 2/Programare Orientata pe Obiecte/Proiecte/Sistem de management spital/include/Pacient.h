#ifndef PACIENT_H
#define PACIENT_H
#include<string>
#include<vector>
#include<variant>
#include "Persoana.h"
#include "Reteta.h"

using RetetaVariant=std::variant<Reteta<int>,Reteta<std::string>>;

class Pacient: public Persoana{
private:
    int id_pacient{};
    static int next_id;
    static int total_pacienti;
    std::string diagnostic;
    int severitate_boala{};
    std::string data_internare;
    std::string data_externare;
    bool asigurat{};
    std::vector<std::string> istoric_medical;
    std::vector<RetetaVariant> retete;

public:
    //constructors
    Pacient();
    Pacient(const std::string &nume, const std::string &prenume, const std::string &CNP, const std::string &diagnostic,
        int severitate_boala, const std::string &data_internare, const std::string &data_externare, bool asigurat,const std::vector<std::string> &istoric_medical);
    //copy constructor
    explicit Pacient(const Pacient &p);

    //getters
    [[nodiscard]] int getId() const;
    [[nodiscard]] int getSeveritateBoala() const;
    [[nodiscard]] const std::vector<std::string>& getIstoricMedical() const;
    [[nodiscard]] const std::vector<RetetaVariant>& getRetete() const;

    //setters
    void setDiagnostic(const std::string &diagnostic_n);
    void setSeveritate(int severitate_n);
    void setData_internare(const std::string &data_internare_n);
    void setData_externare(const std::string &data_externare_n);

    //operators
    Pacient& operator=(const Pacient &p);
    friend std::istream& operator>>(std::istream &in, Pacient &p);
    friend std::ostream& operator<<(std::ostream &out, const Pacient &p);

    //methods
    void adaugaIstoric(const std::string &noua_interventie);
    void adaugaReteta(const RetetaVariant& reteta);
    static void afiseazaTotalPacienti();

    //destructor
    ~Pacient() override;
};


#endif //PACIENT_H
