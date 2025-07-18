window.onload = function(){
//  localStorage.clear();
  let input = document.getElementById(`cuvant`);
  let select = document.getElementById(`limba`);
  let div = document.getElementById(`rezultat`);
  let form = document.getElementById('form');

  form.onsubmit = function(event){
    event.preventDefault(); //sa nu trimita datele la server
    let cuvant = input.value;
    let limba = select.value;

    let url = "http://localhost:8000/dictionar.json";
    fetch(url)
       .then(function(response){
         if(response.status == 200){
           return response.json();
         }
         else{
           throw new Error(`Statusul este: ${response.status}`);
         }
       })
       .then(function(date){
         let traducere = "Nu exista cuvantul";
         for(let ob of date){
           if(cuvant == ob.cuvant)
           traducere = ob[limba];
         }
         div.innerHTML = traducere;
       })
        .catch(function(err){
         console.log(`Eroarea este: ${err.message}`);
       })


  }

}
