window.onload = function(){

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext("2d");
  let buton = document.getElementById('btn');

  function drawCircle(x,y,r,color){
    ctx.beginPath();
    ctx.arc(x,y,r, 0, 2* Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function drawLights(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let colors = ["red","yellow","green","blue","purple","orange","pink","lemon","lime"];
    for(let i = 0;i<50;i++){
      let y = canvas.height/2;
      let x = 45+i*65;
      let r = 20;
      //  let rx = Math.floor(Math.random()*canvas.width);
      // let ry = Math.floor(Math.random()*canvas.height);
      //let rr = Math.floor(Math.random()*26)+10;
      let color = colors[Math.floor(Math.random()*colors.length)];
      drawCircle(x,y,r,color);
    }
  }
  drawLights();
  let t;
  btn.onclick = function(){
    if(btn.innerHTML == "Pornire"){
      btn.innerHTML = "Oprire";
      t=setInterval(drawLights,300);
    }
    else {
      btn.innerHTML = "Pornire";
      clearInterval(t);
    }
  }
}
