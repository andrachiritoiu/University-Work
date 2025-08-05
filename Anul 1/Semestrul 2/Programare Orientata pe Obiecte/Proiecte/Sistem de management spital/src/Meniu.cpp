#include "Meniu.h"
#include "Pacient.h"
#include "Medicament.h"
#include "MedicamentFactory.h"
#include "Reteta.h"
#include "Consultatie.h"
#include "Operatie.h"
#include "Analize.h"
#include "ConsultatieInitiala.h"
#include "ConsultatieUrmarire.h"
#include "ExceptieCNPInvalid.h"
#include "ExceptiePacientNegasit.h"
#include "ExceptieReteta.h"
#include "ExceptieMedic.h"
#include "ExceptieAsistent.h"
#include "ExceptieZi.h"
#include "ExceptieIndex.h"
#include "ExceptieProgramare.h"
#include "ExceptieIntervalinvalid.h"
#include<iostream>
#include<vector>
#include<memory>
#include<algorithm>

Meniu* Meniu::instanta=nullptr;

Meniu* Meniu :: getInstanta(){
    if(!instanta)
        instanta= new Meniu();
    return instanta;
}

bool Meniu::inputValid(const std::string &input) {
    if (input.empty())return false;
    for (char c:input) {
        if (!isdigit(c))return false;
    }
    return true;
}


void Meniu::ruleaza(){
    int op;
    std::string input;

    do{
        std::cout<<"\n---- Sistem Management Spital ----\n";
        std::cout<<"1. Acces Pacient\n";
        std::cout<<"2. Acces Personal Medical\n";
        std::cout<<"3. Iesire\n";
        std::cout<<"Alege optiune: ";
        std::cin>>input;

        if (inputValid(input)) {
            op=std::stoi(input);
        }
        else {
            op=-1;
        }

        switch (op) {
            case 1:
                ruleazaMeniuPacient();
                break;

            case 2:
                ruleazaMeniuPersonalMedical();
                break;

            case 3:
                std::cout<<"La revedere!";
                break;

            default:
                std::cout<<"Optiune invalida\n";
                break;
        }
    }while(op!=3);
}

void Meniu::ruleazaMeniuPacient() {
    int optiune;
    int idPacientCurent=-1;
    bool autentificat=false;
    std::string input;

    do {
        if (!autentificat) {
            std::cout<<"\n---- Meniu Pacient ----\n";
            std::cout<<"1. Inregistrare pacient nou\n";
            std::cout<<"2. Autentificare pacient existent\n";
            std::cout<<"3. Inapoi\n";
            std::cout<<"Alege: ";
            std::cin>>input;

            if (inputValid(input)) {
                optiune=std::stoi(input);
            }
            else {
                optiune=-1;
            }

            switch (optiune) {
                case 1: {
                    //pacient nou
                    //verif daca exista
                    std::string cnp;
                    while (true) {
                        std::cout<<"CNP: ";
                        std::cin>>cnp;

                        try{
                            if (!Persoana::isCNPvalid(cnp)) {
                                throw ExceptieCNPInvalid();
                            }
                        }
                        catch (const ExceptieCNPInvalid& e) {
                            std::cout<<e.what()<<"Incearca din nou.\n";
                            continue;
                        }

                        bool gasit=false;
                        for (const auto &p:this->pacienti) {
                            if (p->getCNP()==cnp) {
                                gasit=true;
                                std::cout<<"Pacientul cu acest CNP exista deja.\n";
                                idPacientCurent=p->getId();
                                autentificat=true;
                                break;
                            }
                        }
                        //nu exista
                        if (!gasit) {
                            auto pacient=std::make_shared<Pacient>();
                            //*pacient-referinta la obiectul real
                            pacient->setCNP(cnp);
                            std::cin>>*pacient;
                            idPacientCurent=pacient->getId();
                            this->pacienti.push_back(pacient);
                            autentificat=true;
                            std::cout<<"Pacient inregistrat cu ID: "<<idPacientCurent<<"\n";
                        }
                        break;
                    }
                break;
                }

                case 2:{
                    //pacient existent
                    try {
                        int id;
                        std::cout<<"Introdu ID pacient: ";
                        std::cin>>id;

                        bool gasit=false;
                        for (const auto &p:this->pacienti) {
                            if (p->getId()==id) {
                                gasit=true;
                                idPacientCurent=id;
                                autentificat=true;
                                std::cout<<"Autentificare reusita. Bine ai venit!\n";
                                break;
                            }
                        }

                        if (!gasit) {
                            throw ExceptiePacientNegasit();
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what();
                    }
                    break;
                }

                case 3:
                    break;

                default: {
                    std::cout<<"Optiune invalida\n";
                    break;
                }
            }
        }

        else {
            //pacient autentificat
            std::cout << "\n---- Meniu Pacient (ID: " << idPacientCurent << ") ----\n";
            std::cout << "1. Vizualizare istoric medical\n";
            std::cout << "2. Programare noua\n";
            std::cout << "3. Solicitare externare\n";
            std::cout << "4. Vizualizare retete\n";
            std::cout << "5. Deconectare\n";
            std::cout << "Alege: ";
            std::cin >> input;

            if (inputValid(input)) {
                optiune=std::stoi(input);
            }
            else {
                optiune=-1;
            }

            switch (optiune) {
                case 1:{
                    //vizualizare istoric medical
                    bool gasit=false;

                    for (const auto &p:this->pacienti) {
                        if (p->getId()==idPacientCurent) {
                            gasit=true;
                            if (p->getIstoricMedical().empty()){
                                std::cout<<"Nu exista proceduri in istoric.\n";
                            }
                            else {
                                std::cout<<"Istoric medical: ";
                                for (const auto &proced:p->getIstoricMedical())
                                    std::cout<<"-"<<proced<<"\n";
                            }
                            break;
                        }

                    }
                    if (!gasit) {
                        std::cout<<"ID pacient invalid.\n";
                        autentificat=false;
                    }
                    break;
                }

                case 2: {
                    //programare noua
                    try {
                        int tip_serviciu;
                        std::cout<<"Alege tipul serviciului: \n";
                        std::cout<<"1. Consultatie initiala\n";
                        std::cout<<"2. Consultatie de urmarire\n";
                        std::cout<<"Introdu optiunea: ";
                        std::cin>>tip_serviciu;

                        std::shared_ptr<Pacient>pacient_curent=nullptr;
                        for (const auto &p:pacienti) {
                            if (p->getId()==idPacientCurent)
                                pacient_curent=p;
                        }

                        if (pacient_curent==nullptr) {
                            throw ExceptiePacientNegasit();
                        }

                        //upcasting
                        std::shared_ptr<Consultatie>serviciu=nullptr;

                        switch (tip_serviciu) {
                            case 1: {
                                serviciu=std::make_shared<ConsultatieInitiala>(pacient_curent);
                                break;
                            }
                            case 2: {
                                serviciu=std::make_shared<ConsultatieUrmarire>(pacient_curent);
                                break;
                            }
                            default: {
                                std::cout<<"Optiune invalida\n";
                                break;
                            }

                        }

                        std::string specializare;
                        std::cout<<"Introduceti specializarea dorita: ";
                        std::cin>>specializare;
                        std::vector<std::shared_ptr<Medic>>medici_specializare;

                        for (const auto &medic:this->medici) {
                            if (medic->getSpecializare() == specializare)
                                medici_specializare.push_back(medic);
                        }

                        if (medici_specializare.empty()) {
                            std::cout<<"Nu exista medici la aceasta specializare.\n";
                            break;
                        }

                        std::cout<<"Medici disponibili: \n";
                        for (size_t i=0;i<medici_specializare.size();i++) {
                            std::cout<<i+1<<"."<<medici_specializare[i]->getNume()<<" "<<medici_specializare[i]->getPrenume()<<"\n";
                        }

                        int index;
                        std::cout<<"Alege un medic(index): ";
                        std::cin>>index;

                        if(index<1 || index>static_cast<int>(medici_specializare.size())){
                            throw ExceptieIndex();
                        }

                        std::shared_ptr<Medic> medic_selectat=medici_specializare[index-1];

                        std::cout<<"Zile disponibile: \n";
                        for (const auto &zi:medic_selectat->getProgram()) {
                            std::cout<<zi.first<<"\n";
                        }

                        std::string zi_aleasa;
                        std::cout<<"Alege o zi din cele disponibile: ";
                        std::cin>>zi_aleasa;

                        bool gasit=false;
                        for (const auto &zi:medic_selectat->getProgram()) {
                            if (zi.first==zi_aleasa)gasit=true;
                        }
                        if (gasit==false) {
                            throw ExceptieZi();
                        }

                        std::cout<<"Intervale disponibile "<<zi_aleasa<<": ";
                        const auto program=medic_selectat->getProgram();
                        //.at - val de la cheia respectiva
                        for (auto interval : program.at(zi_aleasa))
                            std::cout<<interval.first<<":00 - "<<interval.second<<":00 \n";

                        int ora_start, ora_sfarsit;
                        std::cout<<"Introdu ora de inceput: ";
                        std::cin>>ora_start;
                        std::cout<<"Introdu ora de sfarsit: ";
                        std::cin>>ora_sfarsit;

                        bool interval_valid=false;
                        for (auto interval:program.at(zi_aleasa)) {
                            if (ora_start>=interval.first && ora_sfarsit<=interval.second)
                                interval_valid=true;
                        }
                        if (!interval_valid) {
                            throw ExceptieIntervalinvalid();
                        }

                        Programare prog(zi_aleasa, ora_start, ora_sfarsit,pacient_curent, medic_selectat,serviciu);

                        if(gestiuneProgramari.adaugaProgramare(prog)==true) {
                            std::cout<<"Programare adaugata cu succes!\n";
                            medic_selectat->adaugaPacient(pacient_curent);
                        }
                        else{
                            throw ExceptieProgramare();
                        }
                        break;
                    }
                    catch (const ExceptieSpital &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
            }

                case 3:{
                    //solicitare externare
                    try {
                        bool gasit=false;
                        for (const auto &p:this->pacienti) {
                            if (p->getId()==idPacientCurent) {
                                gasit=true;
                                std::string data;
                                std::cout<<"Introdu data externarii: ";
                                std::cin>>data;
                                p->setData_externare(data);
                                std::cout<<"Cerere externare inregistrata.\n";
                                break;
                            }
                        }

                        if (!gasit) {
                            throw ExceptiePacientNegasit();
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 4: {
                    //retete
                    try {
                        bool gasit=false;
                        bool gasit_reteta=false;
                        for (const auto &p:this->pacienti) {
                            if (p->getId()==idPacientCurent) {
                                gasit=true;
                                std::cout<<"Reteta: "<<"\n";
                                for (const auto &reteta_var:p->getRetete()) {
                                    gasit_reteta=true;
                                    //std::visit - este din std::variant si apeleaza functia corecta pentru tipul actual tinut de variant
                                    std::visit([](const auto &reteta) {
                                        std::cout<<reteta<<"\n";
                                    },reteta_var);
                                }
                                if (!gasit_reteta) {
                                   throw ExceptieReteta();
                                }
                                break;
                            }
                        }

                        if (!gasit) {
                            throw ExceptiePacientNegasit();
                        }
                    }
                    catch (const ExceptieSpital &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 5: {
                    //deconectare
                    autentificat=false;
                    idPacientCurent=-1;

                    std::cout<<"Deconectare reusita.\n";
                    break;
                }

                default: {
                    std::cout<<"Optiune invalida\n";
                    break;
                }
            }
        }
    }while (autentificat || optiune!=3);
}

void Meniu::ruleazaMeniuPersonalMedical() {
    int optiune_tip;
    std::string input;

    do {
        std::cout<<"\n---- Meniu Personal Medical ----\n";
        std::cout<<"1. Acces Medic\n";
        std::cout<<"2. Acces Asistent\n";
        std::cout<<"3. Inapoi\n";
        std::cout<<"Alege: ";
        std::cin>>input;

        if (inputValid(input)) {
            optiune_tip=std::stoi(input);
        }
        else {
            optiune_tip=-1;
        }


        switch (optiune_tip) {
            case 1:
                //medic
                ruleazaMeniuMedic();
                break;

            case 2:
                //asistent
                ruleazaMeniuAsistent();
                break;

            case 3:
                break;

            default:
                std::cout<<"Optiune invalida\n";
                break;
        }
    }while (optiune_tip!=3);
}

void Meniu::ruleazaMeniuMedic() {
    int op=0;
    int idMedicCurent=-1;
    bool autentificat=false;
    std::string input;

    do {
        if (!autentificat) {
            std::cout<<"\n---- Meniu Medic ----\n";
            std::cout<<"1. Inregistrare Medic nou\n";
            std::cout<<"2. Autentificare Medic existent\n";
            std::cout<<"3. Inapoi\n";
            std::cout<<"Alege: ";
            std::cin>>input;

            if (inputValid(input)) {
                op=std::stoi(input);
            }
            else {
                op=-1;
            }

            switch (op) {
                case 1: {
                    //medic nou
                    std::string cnp;
                    while (true) {
                        std::cout<<"CNP: ";
                        std::cin>>cnp;

                        try {
                            if (!Persoana::isCNPvalid(cnp)) {
                                throw ExceptieCNPInvalid();
                            }
                        }
                        catch (const ExceptieCNPInvalid &e) {
                            std::cout<<e.what()<<"Incearca din nou.\n";
                            continue;
                        }

                        bool gasit=false;
                        for (const auto &m:this->medici) {
                            if (m->getCNP()==cnp) {
                                gasit=true;
                                std::cout<<"Medicul cu acest CNP exista deja.\n";
                                idMedicCurent=m->getId();
                                autentificat=true;
                                break;
                            }
                        }

                        //nu exista
                        if (!gasit) {
                            auto medic=std::make_shared<Medic>();
                            std::cin>>*medic;
                            medic->setCNP(cnp);

                            idMedicCurent=medic->getId();
                            this->medici.push_back(medic);
                            autentificat=true;
                            std::cout<<"Medic inregistrat cu ID: "<<idMedicCurent<<"\n";
                        }
                        break;
                    }
                    break;
                }

                case 2: {
                    //medic existent
                    try {
                        int id;
                        std::cout<<"Introdu ID medic: ";
                        std::cin>>id;

                        bool gasit=false;
                        for (const auto &m:this->medici) {
                            if (m->getId()==id) {
                                gasit=true;
                                idMedicCurent=id;
                                autentificat=true;
                                std::cout<<"Autentificare reusita. Bine ai venit!\n";
                                break;
                            }
                        }

                        if (!gasit) {
                            throw ExceptieMedic();
                        }
                    }
                    catch (const ExceptieMedic &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;

                }

                case 3:
                    break;

                default:
                    std::cout<<"Optiune invalida\n";
                    break;
            }
        }

        else {
            //este conectat
            int opt;
            std::cout<<"\n---- Meniu Actiuni Medic (ID: "<<idMedicCurent<<") ----\n";
            std::cout<<"1. Vizualizare pacienti activi din spital\n";
            std::cout<<"2. Vizualizare programari\n";
            std::cout<<"3. Evaluare pacient\n";
            std::cout<<"4. Prescriere tratament\n";
            std::cout<<"5. Programare operatie\n";
            std::cout<<"6. Externare pacient\n";
            std::cout<<"7. Calculeaza bonus salarial\n";
            std::cout<<"8. Deconectare\n";
            std::cout<<"Alege: ";
            std::cin>>input;

            if (inputValid(input)) {
                opt=std::stoi(input);
            }
            else {
                opt=-1;
            }

            switch (opt) {
                case 1: {
                    //pacienti activi
                    if (pacienti.empty())
                        std::cout<<"Nu exista pacienti inregistrati.\n";
                    else {
                        for (const auto &p:pacienti) {
                            std::cout<<*p<<"\n";
                        }
                    }
                    break;
                }

                case 2: {
                    //vizualizare pacienti programati la acest medic
                    std::shared_ptr<Medic> medicCurent=nullptr;
                    for (const auto &m: this->medici) {
                        if (m->getId()==idMedicCurent) {
                            medicCurent=m;
                        }
                    }
                    gestiuneProgramari.afiseazaProgramariFacute(medicCurent);
                    break;
                }

                case 3: {
                    //evaluare pacient
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int id;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>id;

                            bool gasit=false;
                            bool gasit_consultatie=false;
                            for (const auto &p:pacienti) {
                                if (p->getId()==id) {
                                    gasit=true;

                                    for (const auto &prog: this->gestiuneProgramari.getProgramari()) {
                                        if (prog.getPacient()->getId()==id && prog.getMedic()->getId()==idMedicCurent) {
                                            gasit_consultatie=true;
                                            const auto& consultatie=prog.getConsultatie();

                                            //downcast
                                            if (auto initiala=std::dynamic_pointer_cast<ConsultatieInitiala>(consultatie)) {
                                                std::cout<<"Consultatie initiala\n";
                                                initiala->executa();
                                            }
                                            else if (auto urmarire=std::dynamic_pointer_cast<ConsultatieUrmarire>(consultatie)) {
                                                std::cout<<"Consultatie urmarire\n";
                                                urmarire->executa();
                                            }
                                            else {
                                                std::cout<<"Consultatie generica\n";
                                                consultatie->executa();
                                            }
                                        }
                                    }
                                    break;
                                }
                            }

                            if (!gasit_consultatie) {
                                std::cout<<"Pacientul nu are nicio programare la acest medic.\n";
                            }

                            if (!gasit) {
                                throw ExceptiePacientNegasit();
                            }
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 4: {
                    //prescriere tratament
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int idPacient;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>idPacient;

                            bool gasit=false;
                            for (const auto &p:pacienti) {
                                if (p->getId()==idPacient) {
                                    gasit=true;

                                    std::cout<<"Numar de medicamente recomandate: ";
                                    int numar_med;
                                    std::cin>>numar_med;

                                    Reteta<int> reteta_int;
                                    Reteta<std::string> reteta_string;
                                    for (int i=0;i<numar_med;i++) {
                                        std::string categorie, forma;
                                        std::cout<<"Introduceti categoria medicamentului(antibiotic / analgezic / antiinflamator): ";
                                        std::cin>>categorie;
                                        std::cout<<"Introduceti forma medicamentului(pastila / sirop / injectabil / crema): ";
                                        std::cin>>forma;

                                        std::shared_ptr<Medicament> med;
                                        if (categorie=="antibiotic" && forma=="pastila") {
                                            med=MedicamentFactory::antibiotic_pastila();
                                        }
                                        else if (categorie=="antibiotic" && forma=="injectabil") {
                                            med=MedicamentFactory::antibiotic_injectabil();
                                        }
                                        else if (categorie=="analgezic" && forma=="pastila") {
                                            med=MedicamentFactory::analgezic_pastila();
                                        }
                                        else if (categorie=="analgezic" && forma=="sirop") {
                                            med=MedicamentFactory::analgezic_sirop();
                                        }
                                        else if (categorie=="analgezic" && forma=="injectabil") {
                                            med=MedicamentFactory::analgezic_injectabil();
                                        }
                                        else if (categorie=="antiinflamator" && forma=="pastila") {
                                            med=MedicamentFactory::antiinflamator_pastila();
                                        }
                                        else if (categorie=="antiinflamator" && forma=="crema") {
                                            med=MedicamentFactory::antiinflamator_crema();
                                        }
                                        else {
                                            std::cout<<"Nu exista in stoc acest medicament.";
                                        }
                                        std::cout<<"Doza recoamndata: \n";
                                        std::cout<<"1. Numar de pastile/zi\n";
                                        std::cout<<"2. Alta doza/zi\n";

                                        int var;
                                        std::cout<<"Alege tipul de doza: \n";
                                        std::cin>>var;

                                        switch (var) {
                                            case 1: {
                                                int info;
                                                std::cout<<"Doza: ";
                                                std::cin>>info;
                                                reteta_int.adaugaMedicament(med,info);
                                                break;
                                            }
                                            case 2: {
                                                std::string info;
                                                std::cout<<"Doza: ";
                                                std::cin>>info;
                                                reteta_string.adaugaMedicament(med,info);
                                                break;
                                            }
                                            default:
                                                std::cout<<"Optiune invalida\n";
                                            break;
                                        }
                                    }

                                    p->adaugaReteta(reteta_int);
                                    p->adaugaReteta(reteta_string);
                                }
                            }
                            if (!gasit) {
                                throw ExceptiePacientNegasit();
                            }
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 5: {
                    //programare operatie
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int idPacient;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>idPacient;

                            bool gasit=false;
                            for (const auto &p:pacienti) {
                                if (p->getId()==idPacient && p->getSeveritateBoala()!=0) {
                                    gasit=true;
                                    std::shared_ptr<Operatie>operatie=std::make_shared<Operatie>(p);
                                    operatie->executa();
                                }
                            }
                            if (!gasit) {
                                throw ExceptiePacientNegasit();
                            }
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 6: {
                    //externare pacient
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int idPacient;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>idPacient;

                            bool gasit=false;
                            for (const auto &p:pacienti) {
                                if (p->getId()==idPacient) {
                                    gasit=true;
                                    std::string externare;
                                    std::cout<<"Introduceti data externarii: ";
                                    std::string temp;
                                    std::getline(std::cin,temp);
                                    std::getline(std::cin, externare);
                                    p->setData_externare(externare);
                                    p->adaugaIstoric("Externare programata: "+externare);
                                    std::cout << "Externare programata cu succes.\n";
                                    break;
                                }
                            }
                            if (!gasit) {
                                throw ExceptiePacientNegasit();
                            }
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 7: {
                    //bonus salariu
                    std::shared_ptr<Medic> medicCurent=nullptr;
                    for (const auto &m: this->medici) {
                        if (m->getId()==idMedicCurent) {
                            medicCurent=m;
                        }
                    }
                    medicCurent->calculeazaBonus();
                    break;
                }

                case 8: {
                    //deconectare
                    idMedicCurent=-1;
                    autentificat=false;
                    break;
                }

                default: {
                    std::cout<<"Optiune invalida\n";
                    break;
                }
            }
        }
    }while (autentificat || op!=3);
}

void Meniu::ruleazaMeniuAsistent() {
    int op;
    int idAsistentCurent=-1;
    bool autentificat=false;
    std::string input;

    do {
        if (!autentificat) {
            std::cout<<"\n---- Meniu Asistent ----\n";
            std::cout<<"1. Inregistrare Asistent nou\n";
            std::cout<<"2. Autentificare Asistent existent\n";
            std::cout<<"3. Inapoi\n";
            std::cout<<"Alege: ";
            std::cin>>input;

            if (inputValid(input)) {
                op=std::stoi(input);
            }
            else {
                op=-1;
            }

            switch (op) {
                case 1: {
                    //asistent nou
                    std::string cnp;
                    while (true) {
                        std::cout<<"CNP: ";
                        std::cin>>cnp;

                        try {
                            if (!Persoana::isCNPvalid(cnp)) {
                                throw ExceptieCNPInvalid();
                            }
                        }
                        catch (const ExceptieCNPInvalid &e) {
                            std::cout<<e.what()<<"Incearca din nou.\n";
                            continue;
                        }


                        bool gasit=false;
                        for (const auto &a:this->asistenti) {
                            if (a->getCNP()==cnp) {
                                gasit=true;
                                std::cout<<"Asistentul cu acest CNP exista deja.\n";
                                idAsistentCurent=a->getId();
                                break;
                            }
                        }

                        if (!gasit) {
                            auto asistent=std::make_shared<Asistent>();
                            std::cin>>*asistent;
                            asistent->setCNP(cnp);

                            idAsistentCurent=asistent->getId();
                            this->asistenti.push_back(asistent);
                            autentificat=true;
                            std::cout<<"Asistent inregistrat cu ID: "<<idAsistentCurent<<"\n";
                        }
                        autentificat=true;
                        break;
                    }
                    break;
                }

                case 2: {
                    //asistent existent
                    try {
                        int id;
                        std::cout<<"Introdu ID asistent: ";
                        std::cin>>id;

                        bool gasit=false;
                        for (const auto &m:this->asistenti) {
                            if (m->getId()==id) {
                                gasit=true;
                                idAsistentCurent=id;
                                autentificat=true;
                                std::cout<<"Autentificare reusita. Bine ai venit!\n";
                                break;
                            }
                        }

                        if (!gasit) {
                            throw ExceptieAsistent();
                        }
                    }
                    catch (const ExceptieAsistent &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 3:
                    break;

                default:
                    std::cout<<"Optiune invalida\n";
                break;
            }
        }

        else {
            std::cout<<"\n---- Meniu Asistent (ID: " << idAsistentCurent<< ") ----\n";
            std::cout<<"1. Vizualizare pacienti activi sortati alfabetic\n";
            std::cout<<"2. Administrare tratament\n";
            std::cout<<"3. Realizare analiza\n";
            std::cout<<"4. Calculeaza bonus salarial.\n";
            std::cout<<"5. Deconectare\n";
            std::cout<<"Alege: ";
            std::cin >> input;

            if (inputValid(input)) {
                op=std::stoi(input);
            }
            else {
                op=-1;
            }

            switch (op) {
                case 1: {
                    //vizualizare pacienti
                    if (pacienti.empty())
                        std::cout<<"Nu exista pacienti inregistrati.\n";
                    else {
                        Pacient::afiseazaTotalPacienti();

                        std::ranges::sort(pacienti,[](const std::shared_ptr<Pacient> &a ,const std::shared_ptr<Pacient> &b) {
                            return a->getNume()<b->getNume();
                        });

                        for (const auto &p:pacienti) {
                            std::cout<<*p<<"\n";
                        }
                    }
                    break;
                }

                case 2: {
                    //administrare tratament
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int idPacient;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>idPacient;

                            bool gasit=false;
                            for (const auto &a:asistenti) {
                                if (a->getId()==idAsistentCurent) {
                                    gasit=true;
                                    Asistent::administrareTratament(gestiuneProgramari.getProgramari(),idPacient);
                                    break;
                                }
                            }
                            if (!gasit) {
                                throw ExceptieAsistent();
                            }
                        }
                    }
                    catch (const ExceptieAsistent &e) {
                           std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 3: {
                    //analiza
                    try {
                        if (pacienti.empty()) {
                            std::cout << "Nu exista pacienti inregistrati.\n";
                        }
                        else {
                            int idPacient;
                            std::cout<<"Introduceti ID-ul pacientului: ";
                            std::cin>>idPacient;

                            bool gasit=false;
                            for (const auto &p:pacienti) {
                                if (p->getId()==idPacient) {
                                    gasit=true;

                                    std::string tip, rezultat;
                                    std::cout<<"Introduceti tipul analizei: ";
                                    std::cin>>tip;
                                    std::cout<<"Introduceti rezultat: ";
                                    std::cin>>rezultat;

                                    Analize analiza(tip,rezultat);
                                    analiza.executa();
                                    p->adaugaIstoric("Analize: Tipul analizei:" + tip + ", Rezultat:" + rezultat);
                                    break;
                                }
                            }
                            if (!gasit) {
                                throw ExceptiePacientNegasit();
                            }
                        }
                    }
                    catch (const ExceptiePacientNegasit &e) {
                        std::cout<<e.what()<<"\n";
                    }
                    break;
                }

                case 4: {
                    //bonus salariu
                    std::shared_ptr<Asistent> asistentCurent=nullptr;
                    for (const auto &a: this->asistenti) {
                        if (a->getId()==idAsistentCurent) {
                            asistentCurent=a;
                        }
                    }
                    asistentCurent->calculeazaBonus();
                    break;
                }

                case 5: {
                    //deconectare
                    idAsistentCurent=-1;
                    autentificat=false;
                    break;
                }

                default: {
                    std::cout<<"Optiune invalida\n";
                    break;
                }
            }
        }
    }while (autentificat || op!=3);
}
