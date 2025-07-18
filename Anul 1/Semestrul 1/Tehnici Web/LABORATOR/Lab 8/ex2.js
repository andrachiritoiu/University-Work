/* se vor crea 5 butoane la fiecare secunda*/
window.addEventListener("load",function(){
   let i = 1;
   let t = setInterval(function(){
     let x = Math.floor(Math.random()* (window.innerWidth-50));
     let y = Math.floor(Math.random()* (window.innerHeight-50));
     let buton = document.createElement("button");
     buton.style.width = "50px";
     buton.style.height = "50px";
     buton.style.borderRadius = "5px";
     buton.style.backgroundColor = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
     document.body.appendChild(buton);
     buton.style.position = "absolute";
     buton.style.left = x + "px";
     buton.style.top = y + "px";
     buton.indice = i;
     i++;
     if(i == 6) {clearInterval(t);}
   },1000);

   window.addEventListener("keyup",function(event){
     let butoane  = document.querySelectorAll("button");
      if ((event.key == 's') && (butoane.length == 5)) {
        let nr = 1;
        for(let b of butoane){
          b.addEventListener("click",function(){
            if (b.indice == nr){
              b.innerHTML = b.indice;
              b.style.backgroundColor = "red";
              b.color = "black";
              b.disabled = true;
              nr++;
              if(nr == 6) setTimeout(function(){alert("Ai castigat!");},1000);
            }
            else{
              alert("Ai pierdut jocul!");
              for(let b of butoane){b.remove();}
            }
          });
        }
      }
   });

});
