window.onload = guess;
function guess(){
  let nume = prompt("Introduceti numele jucatorului");
  let mesaj = document.querySelector(".message");
  mesaj.innerHTML +=` ${nume}`;
  let nrSecret = Math.floor(Math.random()*20) + 1;
  //console.log(nrSecret);
  let input = document.getElementById('guess');
  let buton = document.getElementById('check');
  let s = 20;
  let i = 0;
  buton.onclick = check;
  function check(){
    i++;
    if(i < 20){
      let v = parseInt(input.value);
      if(nrSecret == v){
        document.body.style.backgroundColor = "red";
        mesaj.innerHTML = "Ai ghicit numarul!";
        document.querySelector(".number").innerHTML = nrSecret;
        buton.disabled = true;
        let p = document.createElement("p");
        p.innerHTML = `Jucatorul ${nume} a castigat jocul cu scorul ${s}`;
        document.getElementById('jucatori').appendChild(p);
        p.className = "stil"; // sau p.classList.add("stil");
      }
      else{
        s--;
        if(nrSecret < v){
          mesaj.innerHTML = "Numarul e prea mare!";
        }
        else{
          mesaj.innerHTML = "Numarul e prea mic!";
        }
      }
      document.querySelector(".score").innerHTML = s;
      document.querySelector(".hightscore").innerHTML = i;
    }
    else {
      mesaj.innerHTML = "Ai pierdut jocul";
      buton.disabled = true;
    }
  }
}
