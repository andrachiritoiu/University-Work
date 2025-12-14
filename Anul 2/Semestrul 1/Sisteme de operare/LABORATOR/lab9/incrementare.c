#include<stdio.h>
#include<pthread.h>

int a=0;

void *incrementeaza(void *arg){
    for(int i=0;i<1000000;i++){
         a++;
    }
   
    return NULL;
}

int main(){
    pthread_t t1, t2;

    pthread_create(&t1, NULL, incrementeaza, NULL);
    pthread_create(&t2, NULL, incrementeaza, NULL);

    pthread_join(t1,NULL);
    pthread_join(t2,NULL);

    printf("Valoare finala a: %d\n",a);
}