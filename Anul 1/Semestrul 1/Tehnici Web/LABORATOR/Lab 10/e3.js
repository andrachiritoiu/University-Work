window.onload = function(){

  let select = document.getElementById('categorie');
  let sectiune = document.getElementById('carti');

  select.onchange = function(){

    let url = `http://localhost:8000/${select.value}.json`;

    fetch(url).then(function(response){
      if(response.status == 200){
        return response.json();
      }
      else {
        throw new Error("status " + response.status);
      }
    }).then(function(date){
       sectiune.innerHTML = "";
       for(let d of date){
         let figura = document.createElement("figure");
         sectiune.appendChild(figura);

         let imagine = document.createElement("img");
         imagine.src = `poze/${d.sursa}`;
         figura.appendChild(imagine);

         let text = document.createElement("figcaption");
         text.innerHTML = d.caption;
         figura.appendChild(text);
       }
    }).catch(function(err){
      console.log("Eroarea este: " + err);
    })
  }

}
