#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

#define NUM_READERS 5
#define NUM_WRITERS 5

int a=0;
pthread_mutex_t mtx;           
pthread_cond_t cond_readers;   
pthread_cond_t cond_writers;  

int active_readers = 0; 
int active_writer = 0;  
int waiting_writers = 0; 

void start_read(int id){
    pthread_mutex_lock(&mtx);

    //astept daca cineva scrie sau daca e un sciitor la coada
    while(active_writer==1  || waiting_writers>0){
        pthread_cond_wait(&cond_readers, &mtx);
    }

    active_readers++;
    pthread_mutex_unlock(&mtx);
}

void end_read(int id){
    pthread_mutex_lock(&mtx);

    active_readers--;

    //daca sunt ultimul cititor, anunt sriitorii
    if(active_readers==0){
        pthread_cond_signal(&cond_writers);
    }

    pthread_mutex_unlock(&mtx);
}

void start_write(int id){
    pthread_mutex_lock(&mtx);

    waiting_writers++;

    //nu sunt nici cititori, nici sciitori
    while(active_readers>0  || active_writer==1){
        pthread_cond_wait(&cond_writers, &mtx);
    }

    waiting_writers--; 
    active_writer = 1;

    pthread_mutex_unlock(&mtx);
}

void end_write(int id){
    pthread_mutex_lock(&mtx);

    active_writer = 0;

    //daca sunt si alti scriitori, anunt un sriitor
    if(waiting_writers>0){
        pthread_cond_signal(&cond_writers);
    }
    else{
        //daca nu mai sunt scriitori, las cititorii
        pthread_cond_broadcast(&cond_readers);
    }

    pthread_mutex_unlock(&mtx);
}


void *reader(void *arg){
    int id=*(int*)arg;

    usleep(rand() %100000);

    start_read(id);
    printf("[Reader %d] Read value: %d\n", id, a);
    usleep(100000);
    end_read(id);

    free(arg);
    return NULL;
}

void *writer(void *arg){
    int id=*(int*)arg;

    usleep(rand()%100000);

    start_write(id);
    a=id;
    printf("[Writer %d] Write value: %d\n", id, a);
    usleep(200000);
    end_write(id);

    free(arg);
    return NULL;
}

int main(){
    pthread_mutex_init(&mtx, NULL);
    pthread_cond_init(&cond_readers, NULL);
    pthread_cond_init(&cond_writers, NULL);
    
    pthread_t r[NUM_READERS], w[NUM_WRITERS];
    srand(time(NULL));

    // pornim thread-urile 
    for (int i = 0; i < NUM_WRITERS; i++) {
        int *id = malloc(sizeof(int)); *id = i;
        pthread_create(&w[i], NULL, writer, id);
    }
    for (int i = 0; i < NUM_READERS; i++) {
        int *id = malloc(sizeof(int)); *id = i;
        pthread_create(&r[i], NULL, reader, id);
    }

    for (int i = 0; i < NUM_WRITERS; i++) pthread_join(w[i], NULL);
    for (int i = 0; i < NUM_READERS; i++) pthread_join(r[i], NULL);

    pthread_mutex_destroy(&mtx);
    pthread_cond_destroy(&cond_readers);
    pthread_cond_destroy(&cond_writers);

    return 0;
}