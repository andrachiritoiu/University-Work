#include<iostream>

using namespace std;

/// stack
struct node
{
    int val;
    node *next;

};

node *head=NULL; //// pointer head of the stack

void insert(int val)
{
    if(head=NULL) //first case
    {
        /// create new node
        /// set value
        ///set next to null
        /// set head to new node
        node *ins=new node();
        ins->next=NULL;
        ins->val=val;
        head=ins;

    }
    else
    {
        /// create new node
        /// set value
        /// set next to head
        /// set head to new node
        node *ins=new node();
        ins->next=head;
        ins->val=val;//that's how to acces the value of the node from the struct
        head=ins;
    }
}

int pop()
{ 
    //if the stack is empty 
    if ((head==NULL) )
        return -1;
    else
   { //make copies of the value and next of the head'
    //delete the head
    //set the head to the next of the head
    int cop_val=head->val;
    node* cop_next=head->next;
    delete head;
    head=cop_next;
    return cop_val;
   }
}


/// queue

struct nodeD
{
    int val;
    nodeD *prev, *next;
};

nodeD *headD=NULL, *tailD=NULL; /// pointers to the head and tail of the queue
void insertD(int val)
{
    if(headD=NULL)
    {
        nodeD *ins=new nodeD;
        ins -> next=NULL;
        ins -> prev=NULL;
        ins-> val=val;
        headD=ins; /// set head to the new node
        tailD=ins; /// set tail to the new node
    }
    else
    {
        nodeD *ins=new nodeD();
        ins -> next=headD;
        headD->prev=ins;
        ins->val=val;
        ins->prev=NULL;
        headD=ins;

    }
}

    int popD()
    {
        int cop_val=tailD->val;
        nodeD  *cop_tail=tailD->prev;
        delete cop_tail;
        if(tailD!=NULL)
            tailD->next=NULL;
        return cop_val;

    }

int main()
    {

        insert(1);
        insert(2);
        insert(3);
        insert(4);
        cout<<pop()<<endl;
 
        insertD(4);
        insertD(1);
        insertD(2);
        insertD(3);
        cout<<popD()<<endl;
        cout<<popD()<<endl;
        cout<<popD()<<endl;
        cout<<popD()<<endl;
        return 0;
    }
