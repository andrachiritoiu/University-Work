window.onload = function(){

 let select = document.getElementById("numar");
 let finalizeaza = document.getElementById("finalizeaza");
 let input = document.getElementById('rezervari');
 let span = document.getElementById('count');
 let container = document.querySelector(".container");


finalizeaza.disabled = true;

select.onchange = function(){
  container.innerHTML = "";
  let array = [];
  let n = parseInt(select.value);
  for(let i = 0;i<n;i++){
    let b = document.createElement("button");
    b.innerHTML = `${i+1}`;
    container.appendChild(b);
    b.style.backgroundColor = "green";

    b.onclick = function(){
      if(b.style.backgroundColor == "green"){
        b.style.backgroundColor  = "red";
        span.innerHTML = parseInt(span.innerHTML) + 1;
        array.push(parseInt(b.innerHTML));
        input.value = array.sort(function(a,b){return a-b;}).join(",");
      }
      else {
        b.style.backgroundColor = "green";
        span.innerHTML = parseInt(span.innerHTML) - 1;
        array = [];
        let butoane = document.querySelectorAll(".container button");
        for(let buton of butoane){
          if(buton.style.backgroundColor == "red") array.push(buton.innerHTML);
        }
        input.value = array.join(",");
        }
      if (input.value){
        finalizeaza.disabled = false;
      }
      else {
        finalizeaza.disabled = true;
      }
    }

   finalizeaza.onclick = function(){

     alert("Butoanele rezevate:" + input.value);
     container.style.display = "none";
     localStorage.setItem("butoane",input.value);

   }

  }
}

}
