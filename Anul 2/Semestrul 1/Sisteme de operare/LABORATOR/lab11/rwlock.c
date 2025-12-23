#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define NUM_READERS 5
#define NUM_WRITERS 5

int a=0;
pthread_rwlock_t rwlock;

void *reader(void *arg){
    int id=*(int*)arg;

    usleep(rand() %100000);

    //permisiunea sa citesca-poat citi mai multi, daca nu este un scriitor sau daca nu astepta un scriitor
    pthread_rwlock_rdlock(&rwlock);
    printf("[Reader %d] Read value: %d\n", id, a);
    usleep(100000);
    pthread_rwlock_unlock(&rwlock);

    free(arg);
    return NULL;
}

void *writer(void *arg){
    int id=*(int*)arg;

    usleep(rand()%100000);

    //acces exculsiv
    pthread_rwlock_wrlock(&rwlock);
    a=id;
    printf("[Writer %d] Write value: %d\n", id, a);
    usleep(200000);
    pthread_rwlock_unlock(&rwlock);

    free(arg);
    return NULL;
}

int main(){
    pthread_rwlock_init(&rwlock, NULL);
    pthread_t r[NUM_READERS], w[NUM_WRITERS];
    srand(time(NULL));

    //scriitorii
    for (int i = 0; i < NUM_WRITERS; i++) {
        int *id = malloc(sizeof(int)); *id = i;
        pthread_create(&w[i], NULL, writer, id);
    }

   //cititorii
    for (int i = 0; i < NUM_READERS; i++) {
        int *id = malloc(sizeof(int)); *id = i;
        pthread_create(&r[i], NULL, reader, id);
    }
    
    for (int i = 0; i < NUM_WRITERS; i++) pthread_join(w[i], NULL);
    for (int i = 0; i < NUM_READERS; i++) pthread_join(r[i], NULL);

    pthread_rwlock_destroy(&rwlock);
    return 0;
}