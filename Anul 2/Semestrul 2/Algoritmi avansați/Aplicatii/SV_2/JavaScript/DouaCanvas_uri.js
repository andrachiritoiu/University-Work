var vector_puncte = [];	
var vector_puncte_linie = [];	// vectorul in care punem coordonatele punctelor 

//document.getElementById("myCanvas").style.cursor = "crosshair";  // scchimba cursorul in cruce pentru o precizie mai mare 

function comuta_pe_puncte_plan()
{
  document.getElementById("myCanvas").removeEventListener("click", puncte_linie); // daca era setat listener-ul pentru linie, il sterge pentru a-l putea pune pe cel pentru punct
  document.getElementById("stare_canvas1").style.visibility = "visible";
  document.getElementById("stare_canvas1").innerHTML = "Puncte plan";
  
  var canvas = document.getElementById("myCanvas");		
  canvas.addEventListener("click", punct_in_plan);		// de fiecare data cand dam click in canvas, este apelata functia coordonate
}

function punct_in_plan(event)		
{ 
      var canvas = document.getElementById("myCanvas");   
      x_coord = event.clientX - canvas.offsetLeft;   
      y_coord = event.clientY - canvas.offsetTop;
	  
	  // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina 
	
      vector_puncte.push( { x : x_coord, y : y_coord } );		// baga coordonatele intr-un vector de puncte 
	
      deseneaza_punct(x_coord, y_coord);		//apoi trimite coordonatele catre functia care deseneaza efectiv punctul
}

function deseneaza_punct(x, y) 
{   
    console.log("deseneaza_punct");
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.beginPath();		
	ctx.arc(x, y, 5, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
}

//////////////////////////////////////////////////////////////////////////////////////////////

function comuta_pe_puncte_linie()
{ 
   document.getElementById("myCanvas").removeEventListener("click", punct_in_plan);
   // daca era setat listener-ul pentru punct, il sterge pentru a-l putea pune pe cel pentru linie
   document.getElementById("stare_canvas1").style.visibility = "visible";  
   document.getElementById("stare_canvas1").innerHTML = "Puncte linie";
   
   var canvas = document.getElementById("myCanvas");		
   canvas.addEventListener("click", puncte_linie);
}

function puncte_linie(event)		
{ 
      var canvas = document.getElementById("myCanvas");
      x_coord = event.clientX - canvas.offsetLeft;
      y_coord = event.clientY - canvas.offsetTop;
	  // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	
      vector_puncte_linie.push( { x : x_coord, y : y_coord } );		// baga coordonatele in vectorul de puncte 
      deseneaza_puncte_linie(x_coord, y_coord);
}

function deseneaza_puncte_linie(x, y) 
{   
    console.log("deseneaza_puncte_linie");
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
    ctx.beginPath();	
	ctx.arc(x, y, 2, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
}

///////////////////////////////////////////////////////////////////////////////////////

function deseneaza_linii()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
	for(i = 0; i < vector_puncte_linie.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#000000";
		
		ctx.moveTo(vector_puncte_linie[i].x, vector_puncte_linie[i].y);
		
		if(typeof(vector_puncte_linie[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
			ctx.lineTo(vector_puncte_linie[i+1].x, vector_puncte_linie[i+1].y);
			ctx.stroke(); 
		}
	}
		
}
  

//------Cel de-al doilea canvas--------------------------------------------------------------------------------------------------------------


var vector_puncte2 = [];	
var vector_puncte_linie2 = [];	// vectorul in care punem coordonatele punctelor 

//document.getElementById("myCanvas2").style.cursor = "crosshair";  // scchimba cursorul in cruce pentru o precizie mai mare 

function comuta_pe_puncte_plan2()
{
  document.getElementById("myCanvas2").removeEventListener("click", puncte_linie2); // daca era setat listener-ul pentru linie, il sterge pentru a-l putea pune pe cel pentru punct
  document.getElementById("stare_canvas2").style.visibility = "visible";
  document.getElementById("stare_canvas2").innerHTML = "Puncte plan";
  
  var canvas = document.getElementById("myCanvas2");		
  canvas.addEventListener("click", punct_in_plan2);		// de fiecare data cand dam click in canvas, este apelata functia coordonate
}

function punct_in_plan2(event)		
{ 
      var canvas = document.getElementById("myCanvas2");   
      x_coord = event.clientX - canvas.offsetLeft;   
      y_coord = event.clientY - canvas.offsetTop;
	  
	  // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina 
	
      vector_puncte2.push( { x : x_coord, y : y_coord } );		// baga coordonatele intr-un vector de puncte 
	
      deseneaza_punct2(x_coord, y_coord);		//apoi trimite coordonatele catre functia care deseneaza efectiv punctul
}

function deseneaza_punct2(x, y) 
{   
    console.log("deseneaza_punct2");
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");
	ctx.beginPath();		
	ctx.arc(x, y, 5, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
}

//////////////////////////////////////////////////////////////////////////////////////////////

function comuta_pe_puncte_linie2()
{ 
   document.getElementById("myCanvas2").removeEventListener("click", punct_in_plan2);
   // daca era setat listener-ul pentru punct, il sterge pentru a-l putea pune pe cel pentru linie
   document.getElementById("stare_canvas2").style.visibility = "visible";
   document.getElementById("stare_canvas2").innerHTML = "Puncte linie";
   
   var canvas = document.getElementById("myCanvas2");		
   canvas.addEventListener("click", puncte_linie2);
}

function puncte_linie2(event)		
{ 
      var canvas = document.getElementById("myCanvas2");
      x_coord = event.clientX - canvas.offsetLeft;
      y_coord = event.clientY - canvas.offsetTop;
	  // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	
      vector_puncte_linie2.push( { x : x_coord, y : y_coord } );		// baga coordonatele in vectorul de puncte 
      deseneaza_puncte_linie2(x_coord, y_coord);
}

function deseneaza_puncte_linie2(x, y) 
{   
    console.log("deseneaza_puncte_linie2");
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");	
    ctx.beginPath();	
	ctx.arc(x, y, 2, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
}

///////////////////////////////////////////////////////////////////////////////////////

function deseneaza_linii2()
{
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");	
	
	for(i = 0; i < vector_puncte_linie2.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#000000";
		ctx.moveTo(vector_puncte_linie2[i].x, vector_puncte_linie2[i].y);
		
		if(typeof(vector_puncte_linie2[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
			ctx.lineTo(vector_puncte_linie2[i+1].x, vector_puncte_linie2[i+1].y);
			ctx.stroke(); 
		}
	}
		
}


