#include "ExceptieSpital.h"

ExceptieSpital::ExceptieSpital(const std::string &mesaj){
  this->mesaj=mesaj;
 }
const char* ExceptieSpital::what() const noexcept {
    return this->mesaj.c_str();
}