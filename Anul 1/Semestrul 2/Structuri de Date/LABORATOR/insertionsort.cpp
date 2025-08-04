#include <iostream>
using namespace std;

struct node
{
    int val;
    node *next;
};

class SinglyLinkedList {
private:
    node *head;

public:
    SinglyLinkedList() : head(nullptr) {}

    void insert(int value) {
        node *newNode = new node();
        newNode->val = value;
        newNode->next = nullptr;

        if (head == nullptr) {
            head = newNode;
        } else {
            node *temp = head;
            while (temp->next != nullptr) {
                temp = temp->next;
            }
            temp->next = newNode;
        }
    }

    void display() {
        node *temp = head;
        while (temp != nullptr) {
            cout << temp->val << " ";
            temp = temp->next;
        }
        cout << endl;
    }

    ~SinglyLinkedList() {
        node *temp;
        while (head != nullptr) {
            temp = head;
            head = head->next;
            delete temp;
        }
    }
};

int main()
{
    SinglyLinkedList list;
    list.insert(1);
    list.insert(2);
    list.insert(3);
    list.insert(4);
    list.display();

    return 0;
}