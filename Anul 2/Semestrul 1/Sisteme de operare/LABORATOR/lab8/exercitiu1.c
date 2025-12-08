#include<stdio.h>
#include<stdlib.h>
#include<unistd.h>
#include<sys/socket.h>
#include<sys/types.h>
#include<string.h>
#define BUF_SIZE 1024

void citeste_din_fisier(const char *nume_fisier, char *buffer) {
    FILE *fisier = fopen(nume_fisier, "r");
    if (fisier == NULL) {
        perror("Eroare la deschiderea fisierului");
        exit(1);
    }

    if (fgets(buffer, BUF_SIZE, fisier) == NULL) {
        strcpy(buffer, "Fisier gol");
    }

    fclose(fisier);
}

int main(){
    int sv[2]; //vectorul pentru cei 2 descriptori de socket
    char buffer[BUF_SIZE];
    pid_t pid;

    //socketpair(AF_UNIX, SOCK_STREAM)
    if(socketpair(AF_UNIX, SOCK_STREAM, 0, sv) < 0){
        perror("socketpair");
        exit(1);
    }

    
    pid=fork();
    if(pid<0){
        perror("fork");
        exit(1);
    }
    
    if(pid==0){
        //copil
        close(sv[0]);

        char msg_to_send[BUF_SIZE];
        citeste_din_fisier("mesaj_copil.txt", msg_to_send);

        //trimite parintelui
        printf("[Copil] Trimit: %s\n", msg_to_send);
        write(sv[1], msg_to_send, strlen(msg_to_send) + 1);

        read(sv[1], buffer, sizeof(buffer));
        printf("[Copil] Am primit inapoi: %s\n", buffer);

        close(sv[1]);
        exit(0);
    }

    else{
        //parinte
        close(sv[1]);

        //astepta mesaj de la copil
        read(sv[0], buffer, sizeof(buffer));
        printf("[Parinte] Copilul a zis: %s\n", buffer);

        //citeste propriul mesaj
        char msg_replay[BUF_SIZE];
        citeste_din_fisier("mesaj_parinte.txt", msg_replay);

        //trimite raspuns
        printf("[Parinte] Trimit raspuns: %s\n", msg_replay);
        write(sv[0], msg_replay, strlen(msg_replay) + 1);

        close(sv[0]);
    }

    return 0;
}