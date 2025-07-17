.data 
v: .space 1024
i: .long 0
j: .long 0
nrop: .space 4
op: .space 4
nrfis: .space 4
descr: .space 4
dim: .space 4
p: .long 0
k: .long 0
aux: .long 0
st: .long 0
so: .long 0
a: .long 0
d: .long 0
ok: .long 0
pc: .long 0
formatstring: .asciz "%ld"
formatafis: .asciz "%d: (%d, %d)\n"
formatafisget: .asciz "(%d, %d)\n"

.text
add:
    pushl %ebp
    movl %esp, %ebp  

    pushl $descr
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx

    pushl $dim
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx

    movl $0, so
    movl $0, ok

    //eax=catul, edx=restul
    //calculam cate blocuri ocupa
    movl dim, %eax
    movl $0, %edx
    movl $8, %ebx
    divl %ebx
    movl %eax, a
    movl %edx, d
    //%eax=cat=a, %edx=restul=d

    cmp $0, %edx
    je et_nuincra
    incl a
    //daca restul este difert de 0, il crestem pe a

    et_nuincra:
    movl $0, st
    movl $0, pc

    while_mare:
    movl ok, %eax
    cmp $0, %eax
    jne while_oprire
    movl pc, %eax
    cmp $1023, %eax
    jge while_oprire

    movl so, %ebx
    movl %ebx, st
    movl %ebx, pc
    movl pc,%edx

    et_while1:
        xor %eax, %eax
        movb (%edi,%ebx,1), %al
        cmp $0, %al
        je et_whilestop1
        cmpl $1023, %ebx
        jge et_whilestop1
        incl %ebx
        incl %edx
        jmp et_while1

    et_whilestop1:
        movl %ebx, st
        movl %ebx, so
        movl %edx, pc
 
    et_while2:
        xor %eax, %eax
        movb (%edi,%ebx,1), %al
        cmp $0, %al
        jne et_whilestop2
        cmpl $1024, %ebx
        jge et_whilestop2
        incl %ebx
        incl %edx
        jmp et_while2
    
    et_whilestop2:
        movl %ebx, so
        movl %edx ,pc

    et_if:
        movl so, %eax 
        subl st, %eax
        cmp a, %eax
        jge et_ok
        jmp while_mare

    et_ok:
    movl $1,ok
    jmp while_mare

    et_nrblocuri:
    movl so, %eax 
    subl st, %eax
    cmp $1, %eax
    jg while_oprire
    movl $0, ok    
    //nu ocupa 2 blocuri

    while_oprire:
    movl ok, %edx
    cmpl $0,%edx
    //daca ok=0 => nu are loc in vector
    je et_nu_loc

    //else
    movl st, %ecx
    movl %ecx, %eax
    addl a, %eax
    
    et_loop_fork:
            cmp %eax, %ecx
            jge et_afis
            xor %edx, %edx
            movl descr,%edx
            movb %dl, (%edi,%ecx,1)
            incl %ecx
            jmp et_loop_fork
    

et_nu_loc:
    pushl $0
    pushl $0
    pushl descr  
    pushl $formatafis
    //pushl $formatafisget
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    jmp et_ex

et_afis:
    movl a, %ebx
    addl st, %ebx
    subl $1, %ebx

    pushl %ebx
    pushl st
    pushl descr 
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    jmp et_ex

et_ex: 
    movl pc, %eax
    cmp p, %eax
    jg et_incrementare
    popl %ebx
    ret

et_incrementare:
    movl p,%eax
    addl a, %eax
    movl %eax, p
    jmp et_ex

get:
    pushl %ebp
    movl %esp, %ebp  

    pushl $descr
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx 

    movl $-1, st
    movl $0, so

    movl $0, %ecx
    movl %ecx,j
    
    eticheta_loop_j:
    movl j, %ecx
    cmpl $1024, %ecx
    jge eticheta_exit
    xor %eax, %eax
    movb (%edi,%ecx,1), %al
    //if
    cmpl %eax, descr
    jne et_continuare
    movl st, %ebx
    cmp $-1, %ebx
    jne et_else
    movl %ecx, %ebx
    movl %ebx, st
    jmp et_continuare

    et_else:
    movl %ecx, so
    jmp et_continuare

    et_continuare:
    incl %ecx
    movl %ecx, j
    jmp eticheta_loop_j

    eticheta_exit:
    movl st, %eax
    cmp $-1, %eax
    jne eticheta_ex
    movl $0, st

    eticheta_ex:
    pushl so
    pushl st
    pushl $formatafisget
    call printf
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    popl %ebx
    ret


delete:
    pushl %ebp
    movl %esp, %ebp  

    pushl $descr
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx 

    movl $-1, st
    movl $0, so
    movl $0, ok

    movl $0, %ecx
    movl %ecx,j
    
    eticheta2_loop_j:
    movl j, %ecx
    cmpl $1024, %ecx
    jge et_ifok1
    xor %eax, %eax
    movb (%edi,%ecx,1), %al
    //if
    cmpl %eax, descr
    jne et2_continuare
    movl st, %ebx
    cmp $-1, %ebx
    jne et2_else
    movl %ecx, %ebx
    movl %ebx, st
    movl $1, ok
    jmp et2_continuare

    et2_else:
    movl %ecx, so
    jmp et2_continuare

    et2_continuare:
    incl %ecx
    movl %ecx, j
    jmp eticheta2_loop_j


    et_ifok1:
    movl ok, %eax
    cmp $1, %eax
    jne et_contfis

    et_2loop:
    movl st,%ecx
    movl %ecx, j

    loop_zero:
    movl j, %ecx
    movl so, %edx
    cmpl %edx, %ecx
    jg et_contfis
    movb $0, (%edi,%ecx,1)
    incl %ecx
    movl %ecx, j
    jmp loop_zero

    et_contfis:
    movl $0,p
    movl $0,%ecx
    movl %ecx,j 

    loop2_afisare:
    movl p, %edx
    cmp $1023, %edx
    jge eticheta2_exit
    xor %eax, %eax
    movb (%edi,%edx,1), %al
    movb %al, descr
    mov %edx, st
     
    et_whiledel:
    movl p, %edx 
    xor %eax, %eax
    movb (%edi,%edx,1),%al
    cmp descr, %al
    jne et_whiledelstop
    cmp $1024, %edx
    jge et_whiledelstop
    incl %edx
    mov %edx,p
    jmp et_whiledel

    et_whiledelstop:
    movl p,%edx
    movl %edx, so
    subl $1, so

    afisare_del:
    movl descr, %eax
    cmp $0, %eax
    jne afisare
    jmp loop2_afisare

    afisare:
    pushl so
    pushl st
    pushl descr  
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    jmp loop2_afisare

    eticheta2_exit:
    popl %ebx
    ret

defragmentation:
    pushl %ebp
    movl %esp, %ebp 
    movl $0, aux
    movl $0, st
    movl $0, so
    movl $0, %ecx
    movl %ecx, j

    et_loop_defr:
    movl j, %ecx
    cmp $1023, %ecx
    jge et_contdefr
    xor %eax, %eax
    movb (%edi,%ecx,1), %al
    cmp $0, %al
    jne cont_loop
    movl %ecx, k
    incl k
    et_whiledefr:
    xor %eax, %eax
    movl k, %ebx
    movb (%edi,%ebx,1), %al
    cmp $0, %al
    jne cont_while
    cmp $1023, %ebx
    jge cont_while
    incl %ebx
    movl %ebx,k
    jmp et_whiledefr

    cont_while:
    movl j, %ecx
    movl k, %ebx
    xor %eax, %eax
    movb (%edi, %ecx,1), %al
    //v[j]
    movb %al, aux
    // aux=v[j]
    xor %eax, %eax
    movb (%edi, %ebx,1), %al
    movb %al,(%edi, %ecx,1)
    // v[j]=v[k]
    movb aux, %al
    movb %al, (%edi, %ebx,1)
    //v[k]=aux

    cont_loop:
    movl j, %ecx
    incl %ecx
    movl %ecx, j
    jmp et_loop_defr

    et_contdefr:
    movl $0, p
    movl p, %ebx
    xor %eax, %eax
    movb (%edi, %ebx,1), %al
    //descr=v[p]
    movb %al, descr

    et_whileafis:
    movl descr, %edx
    cmp $0, %edx
    je etichetadef_exit
    cmp $1023,%ebx
    jge etichetadef_exit
    movl p, %ebx
    movl %ebx, st
    et_whileafis2:
    xor %eax, %eax
    movb (%edi, %ebx,1), %al
    cmp descr, %al
    jne et_elsedefrag
    cmp $1023, %ebx
    jg et_elsedefrag
    incl %ebx
    movl %ebx, p
    jmp et_whileafis2

    et_elsedefrag:
    movl %ebx, so
    subl $1, so

    afisare_defrag:
    pushl so
    pushl st
    pushl descr
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    xor %eax, %eax
    movl p, %ebx
    movb (%edi, %ebx,1), %al
    movb %al, descr
    jmp et_whileafis


 etichetadef_exit:
    popl %ebx
    ret


.global main
main:
    lea v, %edi
    movl $0, %ecx
    initializare:
        cmpl $1024, %ecx
        jge et_cont
        movb $0,(%edi,%ecx,1)
        incl %ecx
        jmp initializare
    
    et_cont:
    pushl $nrop
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx

    movl $0,%ecx
    movl %ecx,i
    movl nrop, %eax 

    et_loop: //pentru cele 4 functii
    movl nrop, %eax
    
    movl i, %ecx
    cmpl %eax, %ecx
    jge exit

    pushl $op
    pushl $formatstring
    call scanf
    popl %ebx
    popl %ebx
    
    cmpl $1, op
    je if_add

    cmpl $2, op
    je fct_get

    cmpl $3, op
    je fct_del

    cmpl $4, op
    jmp fct_def

    fct_get:
    call get
    jmp et_continuarefor

    fct_del:
    call delete
    jmp et_continuarefor

    fct_def:
    call defragmentation
    jmp et_continuarefor

    if_add:
        pushl $nrfis
        pushl $formatstring
        call scanf
        popl %ebx
        popl %ebx

        movl $0, %edx
        movl %edx,j
        loop_j:
            cmpl nrfis, %edx
            jge et_continuarefor
            call add
            movl j, %edx 
            //recuperare edx
            incl %edx
            movl %edx, j
            jmp loop_j

    et_continuarefor:
        movl i, %ecx 
        incl %ecx
        movl %ecx, i
        jmp et_loop
    
exit:
    pushl $0
    call fflush
    popl %eax

    movl $1, %eax
    xor %ebx, %ebx
    int $0x80