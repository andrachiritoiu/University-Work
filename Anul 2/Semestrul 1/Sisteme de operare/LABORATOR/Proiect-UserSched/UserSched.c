#include <stdio.h>
#include <stdlib.h>

typedef struct proc {
    int pid;
    int uid;
    int remaining_ticks;
    struct proc *next;   //coada de procese RR(FIFO)
} proc_t;

typedef struct user {
    int uid;
    int weight;
    proc_t *head;  //pt coada de procese         
    proc_t *tail;
} user_t;

typedef struct sched {
    user_t *users;   //lista d utilizatori            
    int user_count;  //face RR de la 0 la user_count-1
    int rr_index;    //de la ce user continui data viitoare        
    int quantum_base;
} sched_t;




//initializare
void sched_init(sched_t *s, int quantum_base) {
    s->users = NULL;
    s->user_count = 0;
    s->rr_index = 0;
    s->quantum_base = quantum_base;
}



//adaugare user
static int gaseste_index_user(const sched_t *s, int uid) {
    for (int i = 0; i < s->user_count; i++)
        if (s->users[i].uid == uid) return i;
    return -1;
}

void sched_add_user(sched_t *s, int uid, int weight) {
    int idx = gaseste_index_user(s, uid);
    if (idx != -1) {
        s->users[idx].weight = weight;
        return;
    }

    user_t *nou = (user_t*)realloc(s->users, (s->user_count + 1) * sizeof(user_t));
    if (!nou) exit(1);
    s->users = nou;

    user_t *u = &s->users[s->user_count++];
    u->uid = uid;
    u->weight = weight;
    u->head = NULL;
    u->tail = NULL;
}



//procese
proc_t* proc_create(int pid, int uid, int ticks) {
    proc_t *p = (proc_t*)malloc(sizeof(proc_t));
    if (!p) exit(1);
    p->pid = pid;
    p->uid = uid;
    p->remaining_ticks = ticks;
    p->next = NULL;
    return p;
}

void proc_run(proc_t *p, int ticks) {
    if (p->remaining_ticks > ticks)
        p->remaining_ticks -= ticks;
    else
        p->remaining_ticks = 0;
}


//ready queue
void sched_enqueue_ready(sched_t *s, proc_t *p) {
    int idx = gaseste_index_user(s, p->uid);

    //daca userul nu exista
    if (idx == -1) {
        //ii pune weight 1
        sched_add_user(s, p->uid, 1);
        idx = gaseste_index_user(s, p->uid);
    }

    //adauga procesul in coada userului
    user_t *u = &s->users[idx];
    p->next = NULL;

    //daca coada e goala
    if (!u->tail) {
        u->head = u->tail = p;
    } else {
        u->tail->next = p;
        u->tail = p;
    }
}







//scheduler
//round-robin pe USERI care au procese 
//aleg un PROCES al userului (RR pe procesele userului)
//ruleza timp finit = quantum_base * weight


static int minim(int a, int b) {
return (a < b) ? a : b;
}

//param sa actualziez procesul,timpul de rulare si userul
int sched_step(sched_t *s, proc_t **chosen_proc, int *slice, int *uid){
    //RR pe useri
    int ales = -1;

    for(int k = 0; k < s->user_count; k++){
        int idx = (s->rr_index + k) % s->user_count;

        //verif daca are procese
        if(s->users[idx].head != NULL){
            ales=idx;
            break;
        }
    }

    if(ales == -1) return 0;

    user_t *u = &s->users[ales];

    //RR pe procese(FIFO)
    proc_t *p = u->head;
    u->head = p->next;    //mutam capatul cozii la urmatorul proces

    //daca coada a devenit goala
    if(!u->head) u->tail = NULL;

    p->next = NULL;

    //cat timp ruleaza
    int quantum = s->quantum_base * u->weight;
    *slice = minim(quantum, p->remaining_ticks);

    *chosen_proc = p;
    *uid = u->uid;

    s->rr_index = (ales + 1) % s->user_count;

    return 1;
}



int main(int argc, char **argv) {
    const char *nume_fisier = "input.txt";
    if (argc > 1) nume_fisier = argv[1];

    FILE *f = fopen(nume_fisier, "r");

    int quantum_baza;
    fscanf(f, "%d", &quantum_baza);

    sched_t sched;
    sched_init(&sched, quantum_baza);

    int nr_useri;
    fscanf(f, "%d", &nr_useri);

    for (int i = 0; i < nr_useri; i++) {
        int uid, weight;
        fscanf(f, "%d %d", &uid, &weight);
        sched_add_user(&sched, uid, weight);
    }

    int nr_procese;
    fscanf(f, "%d", &nr_procese);

    for (int i = 0; i < nr_procese; i++) {
        int pid, uid, ticks;
        fscanf(f, "%d %d %d", &pid, &uid, &ticks);
        sched_enqueue_ready(&sched, proc_create(pid, uid, ticks));
    }

    fclose(f);

    printf("Simulare Weighted RoundRobin\n");

    int pas = 0;
    int timp_total = 0;

    proc_t *p;
    int slice, uid;

    //simularea
    while (sched_step(&sched, &p, &slice, &uid)) {
        int inainte = p->remaining_ticks;

        proc_run(p, slice);

        int dupa = p->remaining_ticks;

        printf("Pas %d | user %d | pid %d | ruleaza %d | inainte %d | dupa %d\n",
           pas, uid, p->pid, slice, inainte, dupa);

        timp_total += slice;
        pas++;

        //daca nu s-a terminar, e adaugat din nou in coada
        if (p->remaining_ticks > 0) {
            sched_enqueue_ready(&sched, p);
        } else {
            free(p);
        }
    }

    printf("Timp total = %d ticks\n", timp_total);

    free(sched.users);
    return 0;
}








    
