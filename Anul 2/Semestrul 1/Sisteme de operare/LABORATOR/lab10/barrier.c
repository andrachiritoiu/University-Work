#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>

#define NTHRS 5

pthread_mutex_t mtx;
sem_t sem;
int reached_count=0;

void barrier_point(){
    pthread_mutex_lock(&mtx);
    reached_count++;

    if(reached_count==NTHRS){
        //utimul therad
        pthread_mutex_unlock(&mtx);

        for(int i=0;i<NTHRS-1;i++){
            sem_post(&sem);
        }
    }
    else{
        //daca nu e ultimul thread, asteapta
        pthread_mutex_unlock(&mtx);
        sem_wait(&sem);
    }
}

void *tfun(void *v)
{
    int *tid = (int *)v;
    printf("%d reached the barrier\n", *tid);
    barrier_point();
    printf("%d passed the barrier\n", *tid);
    free(tid);
    return NULL;
}

int main(){
    pthread_t threads[NTHRS];

    pthread_mutex_init(&mtx, NULL);
    sem_init(&sem,0,0);

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
    sem_destroy(&sem);

    return 0;
}