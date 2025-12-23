#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>

#define NTHRS 5

pthread_mutex_t mtx;
pthread_cond_t cond;
int reached_count=0;

void barrier_point(int id){
    pthread_mutex_lock(&mtx);
    reached_count++;

    if(reached_count==NTHRS){
        //utimul therad
        pthread_mutex_unlock(&mtx);

        pthread_cond_broadcast(&cond);
    }
    else{
        //daca nu e ultimul thread, asteapta
        while(reached_count<NTHRS && reached_count!=0){
            pthread_cond_wait(&cond, &mtx);
        }
    }

    pthread_mutex_unlock(&mtx);
}

void *tfun(void *v)
{
    int *tid = (int *)v;
    printf("%d reached the barrier\n", *tid);
    barrier_point(tid);
    printf("%d passed the barrier\n", *tid);
    free(tid);
    return NULL;
}

int main(){
    pthread_t threads[NTHRS];

    pthread_mutex_init(&mtx, NULL);
    pthread_cond_init(&cond, NULL);

    for(int i=0;i<NTHRS;i++){
        int *tid=malloc(sizeof(int));
        *tid=i;
        if(pthread_create(&threads[i], NULL, tfun, tid) !=0 ){
            perror("Error at thread creation");
            return 1;
        }
    }

    for (int i = 0; i < NTHRS; i++) {
        pthread_join(threads[i], NULL);
    }

    pthread_mutex_destroy(&mtx);
    pthread_cond_destroy(&mtx);

    return 0;
}