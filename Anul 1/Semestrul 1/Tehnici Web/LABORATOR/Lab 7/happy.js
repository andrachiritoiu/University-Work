window.addEventListener("load",function(){ 
   let s = 0;
   let container = document.getElementById('container');
   let paragraf = document.querySelector("#game p");
   paragraf.style.visibility = "visible";

   for(let i=0;i<20;i++){
     let imagine = document.createElement("img");
     imagine.src = "sad.png";
     imagine.alt = "sad";
     container.appendChild(imagine);
    
     imagine.addEventListener("click",function(){
         if (imagine.src.slice(imagine.src.lastIndexOf("/")+1) == "sad.png"){ // sau !imagine.classList.contains("happy")
         s++;
         document.getElementById("scor").innerHTML = s;
         imagine.src = "happy.png";
         //imagine.classList.add("happy");
       }
     });
   }
   setTimeout(function(){
     document.querySelector("h1").innerHTML = "Jocul s-a terminat!";
     container.remove();
   },10000);

});
