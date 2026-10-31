- ex1

1.1

![alt text](image.png)


1.2

![alt text](image-1.png)


1.3

- reduce direct stocul clientul

![alt text](image-2.png)

- adminul reduce stocul

![alt text](image-3.png)


1.4 - cumpararea produselor si aplicarea unei promotii

![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)
![alt text](image-8.png)

1.5

![alt text](image-9.png)
![alt text](image-10.png)

Clientul primește eroarea generată de Catalog (ProductNotFound), deoarece getPrice() caută produsul, nu îl găsește și execută revert. Eroarea se propagă automat prin apelul extern către FidelityPoints, deoarece acesta nu folosește try/catch pentru a o intercepta.


1.6

![alt text](image-11.png)

try catch a restaurat punctele


- ex2 - adaugare de evenimente

2.1

![alt text](image-12.png)
![alt text](image-13.png)


2.2

![alt text](image-14.png)


2.3

![alt text](image-15.png)

![alt text](image-17.png)

![alt text](image-16.png)


2.4 - events vs storage -> consum gas

![alt text](image-18.png)

![alt text](image-19.png)

Storage: structura are 4 sloturi, iar array-ul mai are un slot pentru lungime. La prima înregistrare, scrierea în aceste sloturi costă aproximativ 100.000 gas, înainte de alte costuri.

Event: avem 3 topics și 64 bytes de date.
Gas=375+3*375+64*8=2012

Așadar, evenimentul este mult mai ieftin.


- ex 3

3.1 - suspendarea programului de fidelitate

![alt text](image-20.png)


3.2

![alt text](image-21.png)


3.3 - conteaza ordinea modifier lor

![alt text](image-22.png)

![alt text](image-23.png)


3.4

![alt text](image-24.png)

3.5

inainte
![alt text](image-25.png)

dupa
![alt text](image-26.png)


- ex 4 - teste automate

4.1

![alt text](image-27.png)


4.2

![alt text](image-28.png)


4.3

![alt text](image-29.png)


4.4

![alt text](image-30.png)

4.5

![alt text](image-31.png)


4.6

![alt text](image-32.png)


- ex 5 - cum putem reduce consumul de gas folosid mai putine sloturi

5.1

![alt text](image-33.png)

![alt text](image-34.png)


5.2

inainte

![alt text](image-35.png)

dupa

![alt text](image-37.png)


5.3

![alt text](image-38.png)

![alt text](image-39.png)


5.4

![alt text](image-40.png)


5.5 = uint40 este suficient pentru stocarea unui Unix timestamp deoarece poate reprezenta aproximativ 34.842 de ani în secunde de la 1970, mult peste durata de viață estimată a unui smart contract. În plus, ocupă doar 5 bytes, permițând optimizarea storage-ului prin packing


5.6

![alt text](image-41.png)


- ex 6

6.1 - costul cautarii in array

![alt text](image-42.png)


6.2 - product index

![alt text](image-43.png)


6.3 - removeProduct() cu swap and pop

![alt text](image-44.png)

6.4 - Pagination și getProducts

![alt text](image-45.png)


- ex 7

![alt text](image-46.png)

![alt text](image-47.png)

![alt text](image-48.png)

![alt text](image-49.png)

- ex 8
![alt text](image-50.png)
