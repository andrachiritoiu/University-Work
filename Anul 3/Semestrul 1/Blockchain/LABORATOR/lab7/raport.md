![alt text](image.png)

admin:  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

- ex 1 - valoarea punctelor

![alt text](image-1.png)

![alt text](image-3.png)

![alt text](image-2.png)

- ex 2 - istroicul punctelor primite

![alt text](image-4.png)

- mai adaugam 100 de puncte

![alt text](image-5.png)


- ex 3 - spend points

![alt text](image-6.png)

![alt text](image-7.png)



- ex 4 - eliminare contract.off()

![alt text](image-8.png)

Am comentat temporar `contract.off()` și am schimbat de mai multe ori conturile în MetaMask. Am urmărit cererile în Network, dar nu am putut observa direct acumularea cererilor `eth_getLogs`. Fără `contract.off()`, listener-ele vechi pot rămâne active, generând cereri inutile și procesări duplicate. De aceea, `contract.off()` este necesar pentru eliminarea listener-elor și gestionarea corectă a resurselor.