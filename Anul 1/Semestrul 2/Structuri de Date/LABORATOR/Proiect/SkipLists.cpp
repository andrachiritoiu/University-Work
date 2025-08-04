#include<iostream>
#include<vector>

using namespace std;

class Node {
private:
  int value;
  vector<Node*>next;

public:
  Node()=default;
  Node(int level,int value);
  ~Node()=default;

  int getValue() const {
    return value;
  }
  vector<Node*>& getNext() {
    return next;
  }
};

Node::Node(int level, int value):value(value),next(level+1,nullptr){}


class SkipLists {
private:
  static const int maxLevel=4;
  float probability=0.5; //probabilitatea de a creste nivelul unui nod
  Node* head;
  int level;

public:
  SkipLists();

  int randomLevel();
  void Insert(int value);
  bool Search(int value);
  void Delete(int value);
  void Display();

  ~SkipLists()=default;
};
SkipLists::SkipLists() {
  //val de pornire pt numerele random
  srand(time(nullptr));

  this->head=new Node(maxLevel,-1);
  this->level=0;
}
int SkipLists::randomLevel() {
  int level=0;
  while (((double)rand()/RAND_MAX)<probability && level<maxLevel)
    level++;
  return level;
}

void SkipLists::Insert(int value) {
  vector<Node*> last(maxLevel+1,nullptr);
  Node* current=head;

  for (int i=level;i>=0;i--) {
    while (current->getNext()[i] && current->getNext()[i]->getValue()<value) {
      current=current->getNext()[i];
    }
    last[i]=current;
  }

  current=current->getNext()[0];
  if (current==nullptr || current->getValue()!=value) {
    int levelRandom=randomLevel();

    cout<<"Inserare "<<value<<" la levelul "<<levelRandom<<"\n";
    if (levelRandom>level) {
      for(int i =level+1; i<=levelRandom; i++)
        last[i]=head;
      level=levelRandom;
    }

    Node* newNode=new Node(levelRandom, value);
    for (int i=0;i<=levelRandom;i++) {
      newNode->getNext()[i]=last[i]->getNext()[i];
      last[i]->getNext()[i]=newNode;
    }
  }
}

bool  SkipLists::Search(int value) {
  Node* current=head;
  for (int i=level;i>=0;i--) {
    while (current->getNext()[i] && current->getNext()[i]->getValue()<value) {
      current=current->getNext()[i];
    }
  }
  current=current->getNext()[0];

  if (current && current->getValue()==value) {
    cout<<"Am gasit "<<value<<" in skip list"<<"\n";
    return true;
  }
  else {
    cout<<"Valoarea "<<value<<" nu a fost gasita ";
    return false;
  }
}

void SkipLists::Delete(int value) {
  vector<Node*> last(maxLevel+1,nullptr);
  Node* current=head;

  for (int i=level;i>=0;i--) {
    while (current->getNext()[i] && current->getNext()[i]->getValue()<value) {
      current=current->getNext()[i];
    }
    last[i]=current;
  }

  current=current->getNext()[0];

  if (current && current->getValue()==value) {
    cout<<"Stergere "<<value<<"\n";

    for (int i=0;i<=level;i++) {
      if (last[i]->getNext()[i]==current) {
        last[i]->getNext()[i]=current->getNext()[i];
      }
    }

    delete current;
  }
  else {
    cout<<"Valoarea "<<value<<" nu a fost gasita si nu poate fi stearsa";
  }
}

void SkipLists::Display() {
  cout << "\nSkip lists:\n";

  //level 0
  vector<int>allValues;
  Node* current=head->getNext()[0];
  while (current) {
    allValues.push_back(current->getValue());
    current=current->getNext()[0];

  }
  for (int i = level; i >= 0; i--) {
    cout << "Nivelul " << i << " ";

    Node* node = head->getNext()[i];

    for (int value:allValues){
      if (node && node->getValue()==value) {
        cout << node->getValue() << "----->";
        node = node->getNext()[i];
      }
      else {
        cout<<"------>";
      }
    }
    cout << "\n";
  }
  cout << "\n";
}


int main() {
  int op;
  SkipLists lists;

  do {
    cout<<"\n==SKIP LISTS==\n";
    cout<<"1.Insereaza valoare\n";
    cout<<"2.Sterge Valoare\n";
    cout<<"3.Cauta o valoare\n";
    cout<<"4.Vezi Skip list-ul\n";
    cout<<"0.Iesire\n";
    cout<<"Alege: ";

    cin>>op;

    switch (op) {
      case 1: {
        cout<<"Valoare: ";
        int value;
        cin>>value;
        lists.Insert(value);
        break;
      }
      case 2: {
        cout<<"Valoare: ";
        int value;
        cin>>value;
        lists.Delete(value);
        break;
      }
      case 3: {
        cout<<"Valoare: ";
        int value;
        cin>>value;
        lists.Search(value);
        break;
      }
      case 4: {
        lists.Display();
        break;
      }
    }
  }while (op!=0);

  //demo
  // lists.Insert(5);
  // lists.Insert(10);
  // lists.Insert(7);
  // lists.Insert(15);
  // lists.Insert(21);
  // lists.Insert(4);
  // lists.Insert(8);
  // lists.Insert(14);
  // cout<<"\n";
  //
  // lists.Search(8);
  // lists.Search(1);
  // cout<<"\n";
  //
  // lists.Display();
  // cout<<"\n";
  //
  // lists.Delete(10);
  // lists.Delete(22);
  // cout<<"\n";
  //
  // lists.Display();

  return 0;
}
