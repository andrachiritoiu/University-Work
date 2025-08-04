#include <iostream>
#include <vector>

using namespace std;

const int MAX_SIZE = 10;

struct nod {
    int key, value;
    nod* next;
    nod(int key, int value) {
        this->key = key;
        this->value = value;
        this->next = NULL;
    }
};

vector<nod*> table(MAX_SIZE, NULL);

int hasKey(int key) {
    return key % MAX_SIZE;
}

void inserare(int key, int value) {
    nod* ins = new nod(key, value);
    int hashedKey = hasKey(key);
    nod* &head = table[hashedKey];

    // dacă e golă lista
    if (head == NULL || key < head->key) {
        ins->next = head;
        head = ins;
        return;
    }

    nod* current = head;
    while (current->next != NULL && current->next->key < key) {
        current = current->next;
    }

    // Dacă există deja un nod cu aceeași cheie, putem decide dacă îl înlocuim sau nu
    // Pentru acum presupunem că doar adăugăm
    ins->next = current->next;
    current->next = ins;
}

void afisare() {
    for (int i = 0; i < MAX_SIZE; i++) {
        cout << i << ": ";
        for (nod* head = table[i]; head != NULL; head = head->next) {
            cout << "(" << head->key << " " << head->value << ") ";
        }
        cout << endl;
    }
}

nod *accesare(int  key)
{
    int hashedKey = hasKey(key);
    for(nod* head = table[hashedKey]; head != NULL; head = head->next) {
        if (head->key == key) {
            return head; // Cheia a fost găsită
        }
    }
    return NULL; // Cheia nu a fost găsită    
}

void stergere(int key)
{
    if (accesare(key) == NULL)
        return;

    int hashedKey = hasKey(key);

    // Dacă trebuie șters primul element din listă
    if (table[hashedKey]->key == key)
    {
        nod *cop_next = table[hashedKey]->next;
        delete table[hashedKey];
        table[hashedKey] = cop_next;
        return;
    }

    // Căutăm nodul anterior celui de șters
    for (nod *head = table[hashedKey]; head != NULL; head = head->next)
    {
        if (head->next != NULL && head->next->key == key)
        {
            nod *cop_next = head->next;
            head->next = head->next->next;
            delete cop_next;
            return;
        }
    }
}
int main() 
{
    inserare(2, 7);
    inserare(22, 5);
    inserare(12, 3);
    inserare(32, 9);
    inserare(15676353,11);
    afisare();
    cout<<endl;
    cout<<"Dupa stergere: "<<endl;
    stergere(15676353);
    afisare();
    return 0;
}