#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<pthread.h>

void *inversare(void *arg){
    char *sir_original=(char *)arg;
    int len=strlen(sir_original);

    //alocam memorie pentru rezultatul inversat
    char *sir_inversat=malloc(len+1);

    for(int i=0; i<len; i++){
        sir_inversat[i]=sir_original[len-1-i];
    }

     sir_inversat[len]='\0';

    //returnam adresa sirului inversat 
    return (void*)sir_inversat;

}

int main(int argc, char *argv[]){
    if (argc!=2){
        return 1;
    }

    pthread_t thr;
    void *rezultat;

    if(pthread_create(&thr, NULL, inversare, argv[1]) != 0){
        perror("Eroare la creare thread");
        return 1;
    }

    if(pthread_join(thr, &rezultat) != 0){
        perror("Eroare la join");
        return 1;
    }

    printf("Inversat: %s\n", (char*)rezultat);

    free(rezultat);

    return 0;
}
