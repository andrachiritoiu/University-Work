#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h> 
#include <sys/socket.h>

#define PORT  5000
#define SERVER_IP "127.0.0.1"
#define BUF_SIZE 1024

int main(){
    int sock;
    struct sockaddr_in addr;
    char buffer[BUF_SIZE];

    //socket
    if((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0){
        perror("Eroare la creare socket");
        return -1;
    }

    //detalii server
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT); 

   
    if(inet_pton(AF_INET, SERVER_IP, &addr.sin_addr) <=0 ){
        perror("Adresa invalida");
        return -1;
    }

    //conectare la server
    if(connect(sock, (struct sockaddr *)&addr, sizeof(addr)) < 0){
        perror("Conexiune esuata");
        return -1;
    }

    printf("Conectat la server! Scrie un mesaj:\n");

    while(1){
        printf("Tu: ");

        //citire de la tastaura
        memset(buffer, 0, BUF_SIZE);
        fgets(buffer, BUF_SIZE, stdin);

        send(sock, buffer, strlen(buffer), 0);

        memset(buffer, 0, BUF_SIZE);
        int valread = read (sock, buffer, BUF_SIZE);

        if (valread > 0){
            printf("Server: %s", buffer);
        }
        else{
            printf("Serverul a inchis conexiunea.\n");
            break;
        }

    }

    close(sock);
    return 0;
}