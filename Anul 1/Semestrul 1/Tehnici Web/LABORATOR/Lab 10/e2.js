window.onload = function(){
//  localStorage.clear();
  let inputNume = document.getElementById(`nume`);
  let inputEmail = document.getElementById(`email`);
  let inputVarsta = document.getElementById(`varsta`);

  let buton = document.getElementById('salveaza');
  let div = document.querySelector("#informatii");
  let array;

  array = JSON.parse(localStorage.getItem("date"));
  if(array){
    document.getElementById('primul').style.display ="none";
    for(let a of array){
    div.innerHTML += `<p>Nume: ${a.nume}, Email: ${a.email}, Varsta: ${a.varsta}</p>`;
  }
  }
  else {
    array = [];
  }

  buton.onclick = function(event){
    event.stopPropagation();
    div.innerHTML = "";
    let ob = {nume:inputNume.value, email:inputEmail.value, varsta:inputVarsta.value};
    array.push(ob);
    localStorage.setItem("date",JSON.stringify(array));
    alert("Datele au fost salvate!");
    for(let a of array){
    div.innerHTML += `<p>Nume: ${a.nume}, Email: ${a.email}, Varsta: ${a.varsta}</p>`;
  }
}



}
