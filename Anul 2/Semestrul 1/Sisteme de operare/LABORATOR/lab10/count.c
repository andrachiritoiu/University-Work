#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <errno.h>

#define MAX_RESOURCES 5
int available_resources = MAX_RESOURCES;
pthread_mutex_t mtx;

int decrease_count(int count)
{
    pthread_mutex_lock(&mtx);

    if (available_resources < count){
        pthread_mutex_unlock(&mtx);
        return -1;
    }
    else{
        available_resources -= count;
        printf("Got %d resources, %d remaining\n", count, available_resources);
    }

    pthread_mutex_unlock(&mtx);
    return 0;
}


int increase_count(int count)
{
    pthread_mutex_lock(&mtx);

    available_resources += count;
    printf("Released %d resources, %d remaining\n", count, available_resources);
    
    pthread_mutex_unlock(&mtx);
    return 0;
}

void *f(void *arg){
    int count=*(int*)arg;

    if(decrease_count(count) == 0){
        sleep(1);
        increase_count(count);
    }
    else{
        printf("Failed to get %d resources (not enough)\n", count);
    }

    free(arg);
    return NULL;
}


int main(){
    if(pthread_mutex_init(&mtx, NULL) != 0){
        perror("Mutex init failed");
        return 1;
    }

    pthread_t threads[5];
    int resources[]={2,2,1,3,2};

    printf("MAX_RESOURCES = %d\n", MAX_RESOURCES);

    for(int i=0; i<5; i++){
        int *p=malloc(sizeof(int));
        *p = resources[i];

        if (pthread_create(&threads[i], NULL, f, p) != 0) {
            perror("Error thread creation");
        }

        usleep(500000);
    }

    for (int i = 0; i < 5; i++) {
        pthread_join(threads[i], NULL);
    }

    pthread_mutex_destroy(&mtx);

    return 0;

}