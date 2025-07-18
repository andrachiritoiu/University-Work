window.onload = function(){

  let input = document.getElementById('mesaj');
  let buton = document.getElementById('salveaza');
  let paragraf = document.querySelector(".afiseaza");

  let mesajSalvat = localStorage.getItem("mesaj");
  if(mesajSalvat){
    paragraf.textContent = mesajSalvat;
   }

  buton.onclick = function(event){
    event.stopPropagation();
    if(input.value){
    localStorage.setItem("mesaj",input.value);
    alert("Mesajul a fost salvat!");
    paragraf.textContent = input.value;
  }
    else {
      alert("Nu ai introdus un mesaj!");
    }
    }
   document.body.onclick = function(){
     localStorage.removeItem("mesaj");
     paragraf.textContent = "Niciun mesaj salvat încă";
   }





}
