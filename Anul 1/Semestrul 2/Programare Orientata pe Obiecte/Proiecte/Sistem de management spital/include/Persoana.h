#ifndef PERSOANA_H
#define PERSOANA_H
#include<string>

class Persoana {
protected:
    std::string nume;
    std::string prenume;
    std::string CNP;

public:
    //constructors
    Persoana()=default;
    Persoana(const std::string &nume, const std::string &prenume, const std::string &CNP);
    //copy constructor
    explicit Persoana(const Persoana &p);

    //getters
    [[nodiscard]] std::string getNume() const;
    [[nodiscard]] std::string getPrenume() const;
    [[nodiscard]] std::string getCNP() const;

    //setters
    void setCNP(const std::string &CNP_n);

    //operators
    Persoana& operator= (const Persoana &p);
    //supraincarcarea op == ca functie membra(cel putin un operand este membru al clasei => acces la membrii clasei)
    bool operator==(const Persoana &p) const;
    //&in - fluxul de intrare din care citim datele si i le atribuim persoanei
    friend std::istream& operator>>(std::istream &in, Persoana &p);
    friend std::ostream& operator<<(std::ostream &out, const Persoana &p);

    //methods
    static bool isCNPvalid(const std::string &cnp);

    //destructor
    virtual ~Persoana()=default;

};

#endif //PERSOANA_H
