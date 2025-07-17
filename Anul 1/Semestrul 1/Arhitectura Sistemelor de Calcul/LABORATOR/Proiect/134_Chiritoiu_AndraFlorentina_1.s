.data 
m: .space 1048576
mem: .space 1048576
i: .long 0
j: .long 0
nrop: .space 4
op: .space 4
nrfis: .space 4
descr: .space 4
dim: .space 4
p: .long 0
aux: .long 0
cst: .long 0
cso: .long 0
lp: .long 0
lc: .long 0
a: .long 0
d: .long 0
ok: .long 0
pc: .long 0
k: .long 0
l: .long 0
nr: .long 0
b: .long 0
lineindex: .long 0
columnindex: .long 0
formatstring: .asciz "%ld"
formatafis: .asciz "%d: ((%d, %d), (%d, %d))\n"
formatafisget: .asciz "((%d, %d), (%d, %d))\n"

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

    movl $0, ok
    movl $0, cso

    //eax=catul, edx=restul
    //calculam cate blocuri ocupa
    movl dim, %eax
    xor %edx, %edx
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
    movl $0, lc
    //linie curenta
    movl $0, cst
    movl $0, cso
    movl $0, pc

    while_mare:
    movl ok, %eax
    cmp $0, %eax
    jne while_oprire
    movl pc, %eax
    cmp $1048576, %eax
    jge while_oprire

    movl cso, %eax
    cmp $1024, %eax
    jge if
    //else
    movl %eax, cst
    jmp et_while1

    if:
    incl lc
    movl $0, cst

    et_while1:
        xor %ecx, %ecx
        xor %edx, %edx
        movl cst, %ebx
        movl lc, %eax
        movl $1024, %esi
        mul %esi
        addl %ebx, %eax
        movb (%edi,%eax,1), %cl
        cmp $0, %cl
        je et_whilestop1
        cmpl $1024, %ebx
        jge et_whilestop1
        incl %ebx
        movl %ebx, cst
        movl pc, %edx
        incl %edx
        movl %edx, pc
        jmp et_while1

    et_whilestop1:
        movl %ebx, cso
 
    et_while2:
        xor %ecx, %ecx
        xor %edx, %edx
        movl lc, %eax
        movl $1024, %esi
        mul %esi
        addl cso, %eax
        movb (%edi,%eax,1), %cl
        cmp $0, %cl
        jne et_if
        movl cso, %ebx
        cmpl $1024, %ebx
        jge et_if
        incl %ebx
        movl %ebx, cso
        movl pc, %edx
        incl %edx
        movl %edx, pc
        jmp et_while2

    et_if:
        movl cso, %eax 
        subl cst, %eax
        cmp a, %eax
        jge et_ok
        jmp while_mare

    et_ok:
    movl $1,ok
    jmp while_mare

    while_oprire:
    movl ok, %edx
    cmpl $0,%edx
    //daca ok=0 => nu are loc in vector
    je et_nu_loc

    //else
    movl cst, %ecx
    movl %ecx,k
    movl cst, %eax
    addl a, %eax
    
    et_loop_fork:
            movl k, %ecx
            movl cst, %eax
            addl a, %eax
            cmp %eax, %ecx
            jge et_afis
            xor %edx, %edx
            movl lc, %eax
            movl $1024, %esi
            mul %esi
            addl k, %eax

            xor %ebx, %ebx
            mov descr,%bl
            movb %bl, (%edi,%eax,1)
            movl k, %ecx
            incl %ecx
            movl %ecx,k
            jmp et_loop_fork
    

et_nu_loc:
    pushl $0
    pushl $0
    pushl $0
    pushl $0
    pushl descr  
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx 

    jmp et_ex

et_afis:
    movl cst, %ebx
    addl a, %ebx
    subl $1, %ebx

    pushl %ebx
    pushl lc
    pushl cst
    pushl lc
    pushl descr 
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
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

    movl $-1, cst
    movl $0, cso
    movl $0,lc
    
    movl $0, %ecx
    movl %ecx, k
    loopi_get:
    movl k,%ecx
    cmp $1024,%ecx
    jge et_contget
    movl $0,%ebx
    movl %ebx, j
        loopj_get:
        movl j, %ebx
        cmp $1024, %ebx
        jge loopi_cont
        //if
        xor %edx, %edx
        movl %ecx, %eax
        movl $1024, %esi
        mul %esi
        addl j, %eax
        movb (%edi,%eax,1), %dl
        cmp descr,%dl
        jne loopj_cont
        movl cst, %edx
        cmp $-1, %edx
        jne et_else
        movl %ebx,cst
        movl %ebx, cso
        movl k, %ecx
        movl %ecx, lc
        jmp loopj_cont
        
    loopi_cont:
    mov k, %ecx
    incl %ecx
    movl %ecx,k
    jmp loopi_get

    loopj_cont:
    movl j, %ebx
    incl %ebx
    movl %ebx,j
    jmp loopj_get

    et_else:
    movl j, %ebx
    movl %ebx, cso
    jmp loopj_cont

    et_contget:
    movl cst, %eax
    cmp $-1, %eax
    jne et_exit
    incl %eax
    movl %eax, cst

    et_exit:
    pushl cso
    pushl lc
    pushl cst
    pushl lc
    pushl $formatafisget
    call printf
    popl %ebx
    popl %ebx
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

    movl $-1, cst
    movl $-1, cso
    //movl $0,ok
    movl $0,lc
    
    movl $0, k
    movl k, %ecx
    loopi_del:
    movl k,%ecx
    cmp $1024,%ecx
    jge et_contdel
    movl $0, j
        loopj_del:
        movl j, %ebx
        cmp $1024, %ebx
        jge loopi_contdel
        //if
        xor %edx, %edx
        movl k, %eax
        movl $1024, %esi
        mul %esi
        addl j, %eax
        movb (%edi,%eax,1), %dl
        cmp descr,%dl
        jne loopj_contdel
        movl cst, %edx
        cmp $-1, %edx
        jne et_elsedel
        movl %ebx,cst
        movl %ebx, cso
        //movl $1, ok
        movl k, %edx
        movl %edx, lc
        jmp loopj_contdel
        
    loopi_contdel:
    mov k, %ecx
    incl %ecx
    movl %ecx,k
    jmp loopi_del

    loopj_contdel:
    movl j, %ebx
    incl %ebx
    movl %ebx,j
    jmp loopj_del

    et_elsedel:
    movl j, %ebx
    movl %ebx, cso
    jmp loopj_contdel

    et_contdel:
   // movl ok, %eax
   // cmp $0, %eax
   // je loopafisare_del
    movl cst, %ecx
    movl %ecx, j

    loop_dzero:
    movl j, %ecx
    cmp cso, %ecx
    jg loopafisare_del2
    movl lc, %eax
    movl $1024, %esi
    mul %esi
    addl j, %eax
    movb $0, (%edi,%eax,1)
    incl %ecx
    movl %ecx, j
    jmp loop_dzero

    loopafisare_del2:
    movl $0, l
    loopafisare_del:
    movl l, %ecx
    cmp $1024, %ecx
    jge exit_del
    movl $0,j
    movl j, %ebx
    et_whileafis:
    movl j, %ebx
    cmp $1024, %ebx
    jge cont_loopafis
    movl l, %eax
    movl $1024, %esi
    mul %esi
    addl %ebx, %eax
    xor %edx, %edx
    movb (%edi,%eax,1), %dl
    movb %dl, descr
    movl j, %ebx
    movl %ebx, cst
        while_final:
        xor %edx,%edx
        movl l, %eax
        movl $1024, %esi
        mul %esi
        addl %ebx, %eax
        movb (%edi,%eax,1), %dl
        cmp descr, %dl
        jne continuare
        cmp $1024, %ebx
        jge continuare
        incl %ebx
        movl %ebx, j
        jmp while_final

    cont_loopafis:
    movl l, %ecx
    incl %ecx
    movl %ecx,l
    jmp loopafisare_del

    continuare:
    movl %ebx, %edx
    decl %edx
    movl %edx, cso
    movl descr, %edx
    cmp $0, %edx
    je  et_whileafis
    pushl cso
    pushl l
    pushl cst
    pushl l
    pushl descr 
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx 
    
    jmp et_whileafis

    exit_del:
    popl %ebx
    ret

defragmentation:
    pushl %ebp
    movl %esp, %ebp  
    lea mem, %esi
    lea m, %edi
    movl $0, k
    movl $0, l
    movl $0, %ecx
    initializare:
        cmpl $1048576,%ecx
        jge loop_defr
        movb $0,(%esi,%ecx,1)
        incl %ecx
        jmp initializare

    loop_defr:
    movl $0,k
    movl $0, l
    loop_vectorl:
        movl l, %ecx
        cmp $1024, %ecx
        jge matr_0
        movl $0, j
        loop_vectorj:
            movl j, %ebx
            cmp $1024,%ebx
            jge cont_loopvectorl
            movl l, %eax
            xor %edx, %edx
            movl $1024, %ecx
            mull %ecx
            addl j, %eax
            xor %ecx, %ecx
            movb (%edi, %eax,1),%cl
            cmp $0, %cl
            je cont_loopvectorj
            movl k, %eax
            movb %cl, (%esi,%eax,1)
            incl %eax
            movl %eax,k
            jmp cont_loopvectorj

    cont_loopvectorl:
    movl l, %ecx
    incl %ecx
    movl %ecx, l
    jmp loop_vectorl

    cont_loopvectorj:
    movl j, %ebx
    incl %ebx
    movl %ebx,j
    jmp loop_vectorj

    matr_0:
    movl k, %ecx
    movl %ecx, nr

    movl $0, lineindex
for_lines:
    movl lineindex, %ecx
    cmpl $1024, %ecx
    jge et_contdefr
    movl $0, columnindex

    for_columns:
    movl columnindex, %ecx
    cmp $1024, %ecx
    jge cont_forlines
    movl lineindex,%eax
    movl $1024, %ebx
    mull %ebx
    addl %ecx, %eax
    movb $0,(%edi,%eax,1)
    incl %ecx
    movl %ecx, columnindex
    jmp for_columns

    cont_forlines:
    incl lineindex
    jmp for_lines

    et_contdefr:
    movl $0, pc
    movl $0, lc
    movl $0, a
    while_construire:
        movl pc, %ecx
        cmp nr, %ecx
        jge exit_defr
        xor %eax, %eax
        movb (%esi,%ecx,1), %al
        movb %al, descr
        movl %ecx, cst
        incl %ecx
        while_egale:
            movl pc, %ecx
            xor %eax, %eax
            movb (%esi,%ecx,1), %al
            cmp descr, %al
            jne cont
            cmp nr, %ecx
            jge cont
            incl %ecx
            movl %ecx, pc
            jmp while_egale

        cont:
        movl pc, %ecx
        movl %ecx, cso
        subl cst, %ecx
        movl %ecx, b
        movl $1024, %eax
        subl a, %eax
        cmp b, %eax
        jge reconstruire
        incl lc
        movl $0,a

    reconstruire:
    movl a, %ecx
    movl %ecx, l
    loop_rec:
        movl l, %ecx
        movl a, %ebx
        addl b, %ebx
        cmp %ebx, %ecx
        jge afis
        movl lc, %eax
        xor %edx, %edx
        movl $1024, %ecx
        mull %ecx
        addl l, %eax
        movb descr, %dl
        movb %dl, (%edi,%eax,1)
        incl l
        jmp loop_rec

afis:
    movl a, %eax
    addl b, %eax
    subl $1, %eax
    pushl %eax
    pushl lc
    pushl a
    pushl lc
    pushl descr 
    pushl $formatafis
    call printf
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx
    popl %ebx

    pushl $0
    call fflush
    popl %ebx

    movl a,%eax
    addl b, %eax
    movl %eax, a
    jmp while_construire

exit_defr:
    popl %ebx
    ret

.global main
main:
    lea m, %edi
    movl $0, lineindex

    for_linesm:
    movl lineindex, %ecx
    cmpl $1024, %ecx
    jge et_cont
    movl $0, columnindex

    for_columnsm:
    movl columnindex, %ecx
    cmp $1024, %ecx
    jge cont_forlinesm
    movl lineindex,%eax
    movl $1024, %ebx
    mull %ebx
    addl %ecx, %eax
    movb $0,(%edi,%eax,1)
    incl %ecx
    movl %ecx, columnindex
    jmp for_columnsm

    cont_forlinesm:
    incl lineindex
    jmp for_linesm

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
    popl %ebx

    movl $1, %eax
    xor %ebx, %ebx
    int $0x80