window.addEventListener("load",function(){ //window.onload = function(){}

document.body.addEventListener("click",function(event){

   //  console.log(event.clientX + " " + event.clientY);
     let notificare  = document.createElement("div");
     notificare.innerHTML = `<p>Aceasta este o notificare!</p>`;
     document.body.appendChild(notificare);
     notificare.classList.add("popup");

     notificare.style.position = "absolute";
     notificare.style.left = `${event.clientX}px`;
     notificare.style.top = `${event.clientY}px`;

     let b  = document.createElement("button");
     b.innerHTML = `Sterge`;
     notificare.appendChild(b);
     b.classList.add("buton");
     
     b.addEventListener("click",function(event){
       event.stopPropagation();
       notificare.remove();
     });
     
     setTimeout(function(){
       notificare.style.animation = "disparitie 3s";
       setTimeout(function(){notificare.remove();},3000);
     },5000);

   });

});
