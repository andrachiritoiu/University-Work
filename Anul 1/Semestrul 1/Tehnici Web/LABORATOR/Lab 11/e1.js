window.onload = function(){

  let buton = document.getElementById('btn');
  let div = document.getElementById('msg');

  buton.onclick = function(){
    let url = "http://localhost:4000/mesaje.json";

    fetch(url).then(function(response){
      if(response.status == 200){
        return response.json();
      }
      else {
        throw new Error("status " + response.status);
      }
    }).then(function(date){
      //date va fi continutul fis mesaje.json parsat
       let indiceRandom = Math.floor(Math.random()*date.length);
       console.log(indiceRandom);
       div.innerHTML = date[indiceRandom].mesaj;
    }).catch(function(err){
      console.log("Eroarea este: " + err);
    })
  }

}
