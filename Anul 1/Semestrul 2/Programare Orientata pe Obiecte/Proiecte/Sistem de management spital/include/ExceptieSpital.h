#ifndef EXCEPTIESPITAL_H
#define EXCEPTIESPITAL_H
#include<exception>
#include<string>

class ExceptieSpital: public std::exception {
  protected:
    std::string mesaj;
  public:
    //constructor
  explicit ExceptieSpital(const std::string &mesaj = "Eroare");
  const char* what() const noexcept override;
};



#endif //EXCEPTIESPITAL_H
