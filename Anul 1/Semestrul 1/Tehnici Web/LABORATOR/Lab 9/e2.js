window.onload = function(){

 let reteteSalvate;
 let form = document.getElementById('form');
 let ul = document.getElementById("retete");

 if(localStorage.getItem("retete")) {
   reteteSalvate = JSON.parse(localStorage.getItem("retete"));
   for(let r of reteteSalvate){ // r = {nume:val,durata:val,categorie:val}
   
      adaugaReteta(r);
     }
   }
   else 
   reteteSalvate =[];
   
   
   function adaugaReteta(reteta){
     let li = document.createElement("li");
     li.innerHTML = `${reteta.nume} - ${reteta.durata} minute (${reteta.categorie})`;
     ul.appendChild(li);
     let buton = document.createElement("button");
     buton.innerHTML = "Sterge";
     li.appendChild(buton);

       buton.onclick = function(){
        let index;
        for (let i = 0; i < ul.children.length; ++i) {
          if (buton.parentElement == ul.children[i]) {
            index = i;
            break;
          }
        }
        buton.parentElement.remove();
        reteteSalvate.splice(index, 1);
        localStorage.setItem('retete', JSON.stringify(reteteSalvate));
      }
       
       
     }
   

 form.onreset = function(event){
//   event.preventDefault();
    reteteSalvate = [];
   localStorage.removeItem('retete');
   document.getElementById('retete').innerHTML = "";
}

 form.onsubmit = function(event){
   event.preventDefault();
   let n = document.getElementById('nume');
   let d = document.getElementById('durata');
   let c = document.getElementById('categorie');

   let ob = {nume: n.value, durata: d.value, categorie: c.value};
   reteteSalvate.push(ob);
   localStorage.setItem("retete",JSON.stringify(reteteSalvate));
    adaugaReteta(ob);
 }

}
