#include<stdlib.h>
#include<stdio.h>
#include<pthread.h>

#define N 3
int A[N][N] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
int B[N][N] = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
int C[N][N];

struct pozitie{
    int i;
    int j;
};

void *calculeaza_element(void *arg){
    struct pozitie *p = (struct pozitie *)arg;
    int suma=0;

    for(int k=0; k<N; k++){
        suma+=A[p->i][k] * B[k][p->j];
    }

    C[p->i][p->j]=suma;
    free(p);
    return NULL;

}

int main(){
    pthread_t fire[N][N];

    for(int i=0; i<N; i++){
        for(int j=0; j<N; j++){
            //alocam memorie pentru acest thread
            struct pozitie *p=malloc(sizeof(struct pozitie));
            p->i=i;
            p->j=j;

            pthread_create(&fire[i][j], NULL, calculeaza_element, p);
        }
    }

     for(int i=0; i<N; i++){
        for(int j=0; j<N; j++){
            pthread_join(fire[i][j], NULL);
        }
    }

    printf("Matricea Rezultat:\n");
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%d ", C[i][j]);
        }
        printf("\n");
    }

    return 0;
}