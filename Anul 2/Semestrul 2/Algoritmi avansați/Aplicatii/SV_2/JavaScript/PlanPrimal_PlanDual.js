var n;		
var aux;		// folosit la sortare
var stiva = [];  // stiva pt algoritm
var v_sup = [];  
var front_sup = [];	  // frontiera superioara a acoperirii convexe
var front_inf = [];	 // frontiera inferioara a acoperirii convexe


function drawGrid()  // Desenarea patratelelor de matematica si a axelor
{	
    var cnv1 = document.getElementById("myCanvas");
    var cnv2 = document.getElementById("myCanvas2");
			 
    gridOptions = { separation: 25, color: '#80bfff' };
    drawGridLines(cnv1, gridOptions);
    drawGridLines(cnv2, gridOptions);
	  
// Desenarea axelor:
	
  //myCanvas
	cnvs1 = document.getElementById("myCanvas");
	contx1 = cnvs1.getContext('2d'); 
	transX = cnvs1.width * 0.5;
	transY = cnvs1.height * 0.5;
	contx1.translate(transX, transY);
 // se aduce originea in centrul canvas-ului printr-o translatie
   
 // se deseneaza cele doua axe
	contx1.fillRect(0, -transY, 4, cnvs1.height);
	contx1.fillRect(-transX, 0, cnvs1.width, 4);
	  
  //myCanvas2 
	cnvs2 = document.getElementById("myCanvas2");
	contx2 = cnvs2.getContext('2d'); 
	transX = cnvs2.width * 0.5;
	transY = cnvs2.height * 0.5;
	contx2.translate(transX, transY);
 // se aduce originea in centrul canvas-ului printr-o translatie
   
 // se deseneaza cele doua axe
    contx2.fillRect(0, -transY, 4, cnvs2.height);
	contx2.fillRect(-transX, 0, cnvs2.width, 4);
	  
	return;
}

function drawGridLines(cnv, lineOptions) 
{
	var iWidth = cnv.width;  // latimea canvas-ului
    var iHeight = cnv.height; // inaltimea canvas-ului

    var ctx = cnv.getContext('2d');

    ctx.strokeStyle = lineOptions.color;  // culoarea cu care desenam patratelele
    ctx.strokeWidth = 1;  // grosimea liniei cu care desenam
            
    ctx.beginPath();
    var iCount = null;
    var i = null;
    var x = null;
    var y = null;

 // impartim lungimea canvas-ului la lungimea unui patratel, pentru a vedea cate intra
    iCount = Math.floor(iWidth / lineOptions.separation);  

    for (i = 1; i <= iCount; i++) // pentru i de la 1 la numarul de patratele care se pot desena 
	{
       x = (i * lineOptions.separation);
	   
	// ne deplasam pe axa x, inaintand cu cate o lungime de patratica si desenam o linie pe toata latimea canvas-ului
       ctx.moveTo(x, 0);
       ctx.lineTo(x, iHeight);
       ctx.stroke();
    } 

 // impartim latimea canvas-ului la latimea unui patratel, pentru a vedea cate intra
    iCount = Math.floor(iHeight / lineOptions.separation);

    for (i = 1; i <= iCount; i++) // pentru i de la 1 la numarul de patratele care se pot desena
	{
        y = (i * lineOptions.separation);
		
	 // ne deplasam pe axa y, inaintand cu cate o latime de patratica si desenam o linie pe toata lungimea canvas-ului
        ctx.moveTo(0, y);
        ctx.lineTo(iWidth, y);
        ctx.stroke();
    }  
     ctx.closePath();

	 return;
}

var vector_puncte = [];	
var vector_puncte_linie = [];	// vectorul in care punem coordonatele punctelor 
	
function comuta_pe_puncte_plan()
{
     var canvas = document.getElementById("myCanvas");  
	 document.getElementById("stare_canvas1").style.visibility = "visible";
     document.getElementById("stare_canvas1").innerHTML = "Puncte plan";
	 // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	 x_coord = document.getElementById("Xcoord").value; 
     y_coord = document.getElementById("Ycoord").value; 
	  
	 var arata_x_coord = doua_zecimale(x_coord, 2);
	 var arata_y_coord = doua_zecimale(y_coord, 2);  
	   
	 vector_puncte.push( { x : x_coord * gridOptions.separation, y : y_coord * gridOptions.separation } ); 
	 
    // baga coordonatele intr-un vector de puncte pentru drepte
    // am intors axele la foma normala (y in sus si x la drepata) si facem calculele,
    // netinand seama de patratelele de mate, dar cu axele in forma lor naturala  
	
     deseneaza_punct(x_coord * gridOptions.separation, y_coord * gridOptions.separation * (-1), arata_x_coord, arata_y_coord);
	
    //pentru ca vreau ca punctul sa fie exact in pozitia in care am dat click, nu mai modific cu nimic coordonatele 
   //(le las asa, sunt doar translatate, fara axe in forma naturala si fara impartirea pentru patratele )   
	 
}

function doua_zecimale(unRouned, nrOfDecimals) 
 {  
     var unRounedString = unRouned.toString();
     var parts = unRounedString.split(".");
     
    if (parts.length != 2) 
    { 
       return unRounedString;
    }

     var newDecimals = parts[1].slice(0, nrOfDecimals),
         newString = parts[0].concat('.');
         newString =  newString.concat(newDecimals);
	   
   return newString;
}

function deseneaza_punct(x, y, arata_x_coord, arata_y_coord) 
{   
     console.log("deseneaza_punct");
	 var c = document.getElementById("myCanvas");
	 var ctx = c.getContext("2d");
	 
	 ctx.beginPath();	
     ctx.fillStyle = "red";	
	 ctx.arc(x, y, 5, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	 ctx.fill();
	
	 ctx.font = "15px Arial";
     ctx.fillText("("+ arata_x_coord + ",", x - 40, y - 10);
	 ctx.fillText(arata_y_coord + ")",x + 10,y - 10);
}

//////////////////////////////////////////////////////////////////////////////////////////////

function comuta_pe_puncte_linie()
{ 
     var canvas = document.getElementById("myCanvas");  
	 document.getElementById("stare_canvas1").style.visibility = "visible";
     document.getElementById("stare_canvas1").innerHTML = "Puncte linie";
	 // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	 x_coord = document.getElementById("Xcoord").value; 
     y_coord = document.getElementById("Ycoord").value; 
	  
	 var arata_x_coord = doua_zecimale(x_coord, 2);
	 var arata_y_coord = doua_zecimale(y_coord, 2);  
	   
	 vector_puncte_linie.push( { x : x_coord * gridOptions.separation, y : y_coord * gridOptions.separation } ); 
	 
    // baga coordonatele intr-un vector de puncte pentru drepte
    // am intors axele la foma normala (y in sus si x la drepata) si facem calculele,
    // netinand seama de patratelele de mate, dar cu axele in forma lor naturala  
	
     deseneaza_puncte_linie(x_coord * gridOptions.separation, y_coord * gridOptions.separation * (-1), arata_x_coord, arata_y_coord);
	
    //pentru ca vreau ca punctul sa fie exact in pozitia in care am dat click, nu mai modific cu nimic coordonatele 
   //(le las asa, sunt doar translatate, fara axe in forma naturala si fara impartirea pentru patratele )  
}


function deseneaza_puncte_linie(x, y, arata_x_coord, arata_y_coord) 
{   
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
    ctx.beginPath();
    ctx.fillStyle = "red";		
	ctx.arc(x, y, 2, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
	
	ctx.font = "15px Arial";
    ctx.fillText("("+ arata_x_coord + ",", x - 40, y - 10);
	ctx.fillText(arata_y_coord + ")",x + 10,y - 10);
}

///////////////////////////////////////////////////////////////////////////////////////

function extLine(x1, y1, x2, y2, pixels) 
{
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext('2d');

    var xd = x2 - x1, yd = y2 - y1, len = Math.sqrt(xd * xd + yd * yd), delta = pixels / len;

    var ox1 = x1 + (x2 - x1) * -delta, ox2 = x1 + (x2 - x1) * (1 + delta), oy1 = y1 + (y2 - y1) * -delta, oy2 = y1 + (y2 - y1) * (1 + delta);
  
    ctx.beginPath();
    ctx.moveTo(ox1, oy1);
    ctx.lineTo(ox2, oy2);
    ctx.stroke();
}

function deseneaza_linii()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
    var	k;
	
	for(k = 0; k < vector_puncte_linie.length; k = k+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#00b300";
		
		if(typeof(vector_puncte_linie[k+1]) != "undefined") // ca sa evitam situatia cand celalalt capat al liniei e undefined
	  {	
	     
	  // acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
	     extLine(vector_puncte_linie[k].x, vector_puncte_linie[k].y * (-1), vector_puncte_linie[k+1].x, vector_puncte_linie[k+1].y * (-1), 1000);
	  }   
	}	
} 

//--------------------------------------------------------Cel de-al doilea canvas-----------------------------------------------

var vector_puncte2 = [];	
var vector_puncte_linie2 = [];	// vectorul in care punem coordonatele punctelor 

function comuta_pe_puncte_plan2()
{
     var canvas = document.getElementById("myCanvas"); 
     document.getElementById("stare_canvas2").style.visibility = "visible";
     document.getElementById("stare_canvas2").innerHTML = "Puncte plan";	 
	 // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	 x_coord = document.getElementById("Xcoord").value; 
     y_coord = document.getElementById("Ycoord").value; 
	  
	 var arata_x_coord2 = doua_zecimale(x_coord, 2);
	 var arata_y_coord2 = doua_zecimale(y_coord, 2);  
	   
	 vector_puncte2.push( { x : x_coord * gridOptions.separation, y : y_coord * gridOptions.separation } ); 
	 
    // baga coordonatele intr-un vector de puncte pentru drepte
    // am intors axele la foma normala (y in sus si x la drepata) si facem calculele,
    // netinand seama de patratelele de mate, dar cu axele in forma lor naturala  
	
     deseneaza_punct2(x_coord * gridOptions.separation, y_coord * gridOptions.separation * (-1), arata_x_coord2, arata_y_coord2);
	
    //pentru ca vreau ca punctul sa fie exact in pozitia in care am dat click, nu mai modific cu nimic coordonatele 
   //(le las asa, sunt doar translatate, fara axe in forma naturala si fara impartirea pentru patratele )
}


function deseneaza_punct2(x, y, arata_x_coord, arata_y_coord)
{   
    console.log("deseneaza_punct2");
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");
	
	ctx.beginPath();	
    ctx.fillStyle = "red";	
    ctx.arc(x, y, 5, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
    ctx.fill();
	
	ctx.font = "15px Arial";
    ctx.fillText("("+ arata_x_coord + ",", x - 40, y - 10);
	ctx.fillText(arata_y_coord + ")",x + 10,y - 10);
}
	
//////////////////////////////////////////////////////////////////////////////////////////////

function comuta_pe_puncte_linie2()
{ 
     var canvas = document.getElementById("myCanvas");  
	 document.getElementById("stare_canvas2").style.visibility = "visible";
     document.getElementById("stare_canvas2").innerHTML = "Puncte linie";
	 // preluam coordonatele x si y ale punctului in care am dat click, in functie de pozitia canvas-ului in pagina
	 x_coord = document.getElementById("Xcoord").value; 
     y_coord = document.getElementById("Ycoord").value; 
	  
	 var arata_x_coord2 = doua_zecimale(x_coord, 2);
	 var arata_y_coord2 = doua_zecimale(y_coord, 2);  
	   
	 vector_puncte_linie2.push( { x : x_coord * gridOptions.separation, y : y_coord * gridOptions.separation } ); 
	 
    // baga coordonatele intr-un vector de puncte pentru drepte
    // am intors axele la foma normala (y in sus si x la drepata) si facem calculele,
    // netinand seama de patratelele de mate, dar cu axele in forma lor naturala  
	
     deseneaza_puncte_linie2(x_coord * gridOptions.separation, y_coord * gridOptions.separation * (-1), arata_x_coord2, arata_y_coord2);
	
    //pentru ca vreau ca punctul sa fie exact in pozitia in care am dat click, nu mai modific cu nimic coordonatele 
   //(le las asa, sunt doar translatate, fara axe in forma naturala si fara impartirea pentru patratele )  
}


function deseneaza_puncte_linie2(x, y, arata_x_coord, arata_y_coord) 
{   
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");	
    ctx.beginPath();	
	ctx.fillStyle = "red";	
	ctx.arc(x, y, 2, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin 
	ctx.fill();
	
	ctx.font = "15px Arial";
    ctx.fillText("("+ arata_x_coord + ",", x - 40, y - 10);
	ctx.fillText(arata_y_coord + ")",x + 10,y - 10);
}

///////////////////////////////////////////////////////////////////////////////////////

function extLine2(x1, y1, x2, y2, pixels) 
{
    var canvas = document.getElementById("myCanvas2");
    var ctx = canvas.getContext('2d');

    var xd = x2 - x1, yd = y2 - y1, len = Math.sqrt(xd * xd + yd * yd), delta = pixels / len;

    var ox1 = x1 + (x2 - x1) * -delta, ox2 = x1 + (x2 - x1) * (1 + delta), oy1 = y1 + (y2 - y1) * -delta, oy2 = y1 + (y2 - y1) * (1 + delta);
  
    ctx.beginPath();
    ctx.moveTo(ox1, oy1);
    ctx.lineTo(ox2, oy2);
    
    ctx.stroke();
}

function deseneaza_linii2()
{
	var c = document.getElementById("myCanvas2");
	var ctx = c.getContext("2d");	
	
	for(k = 0; k < vector_puncte_linie2.length; k = k+2)
	{
	  ctx.beginPath();  
	  ctx.lineWidth = 3;
      ctx.strokeStyle="#00b300";
      ctx.moveTo(vector_puncte_linie2[k].x, vector_puncte_linie2[k].y);
		
	  if(typeof(vector_puncte_linie2[k+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
	  {	
	 // acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
        extLine2(vector_puncte_linie2[k].x, vector_puncte_linie2[k].y * (-1), vector_puncte_linie2[k+1].x, vector_puncte_linie2[k+1].y * (-1), 1000);
	  }
	}	
}

var vector_puncte_linii_transformare1 = [];	// vectorul in care punem coordonatele punctelor pentru transformare
var vector_puncte_linii_transformare2 = [];

function deseneaza_linii_transformare1()
{ 
	  var c = document.getElementById("myCanvas2");
	  var ctx = c.getContext("2d");	
	
	for(k = 0; k < vector_puncte_linii_transformare1.length; k = k+2)
	{
	  ctx.beginPath();  
	  ctx.lineWidth = 3;
      ctx.strokeStyle="#00b300";
		
	  ctx.moveTo(vector_puncte_linii_transformare1[k].x, vector_puncte_linii_transformare1[k].y);
		
	  if(typeof(vector_puncte_linii_transformare1[k+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
	  {	
      // acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
 		 extLine2(vector_puncte_linii_transformare1[k].x, vector_puncte_linii_transformare1[k].y * (-1), vector_puncte_linii_transformare1[k+1].x, vector_puncte_linii_transformare1[k+1].y * (-1), 1000);
      }
	}	
}

function deseneaza_linii_transformare2()
{ 
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
	for(k = 0; k < vector_puncte_linii_transformare2.length; k = k+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#00b300";
		
		ctx.moveTo(vector_puncte_linii_transformare2[k].x, vector_puncte_linii_transformare2[k].y);
		
		if(typeof(vector_puncte_linii_transformare2[k+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		// acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
		   extLine(vector_puncte_linii_transformare2[k].x, vector_puncte_linii_transformare2[k].y * (-1), vector_puncte_linii_transformare2[k+1].x, vector_puncte_linii_transformare2[k+1].y * (-1), 1000);
		}
	}	
}

var vector_puncte_acoperire = [];
var vector_puncte_acoperire_inf = [];
var vector_puncte2_acoperire = [];
var vector_puncte2_acoperire_inf = [];

var vector_recuperare_drepte = [];

function Transfomare_in_plan_dual()
{
	for( k=0; k < vector_puncte_linie.length; k=k+2 )
	{
	    var a, b, c;
		
		//if( (Math.abs(vector_puncte_linie[k].x/gridOptions.separation) < 0.5 && Math.abs(vector_puncte_linie[k+1].x/gridOptions.separation) < 0.5) || (vector_puncte_linie[k].x == vector_puncte_linie[k+1].x) )
         
	   if( vector_puncte_linie[k].x == vector_puncte_linie[k+1].x )		
	       alert("Nu sunt permise drepte verticale sau aproape vreticale");
	 
		 var panta = Math.floor((vector_puncte_linie[k+1].y - vector_puncte_linie[k].y) / (vector_puncte_linie[k+1].x - vector_puncte_linie[k].x));
		 var b = vector_puncte_linie[k].y -(panta * vector_puncte_linie[k].x);
		
		 var arata_x_coord = doua_zecimale((panta * gridOptions.separation)/gridOptions.separation, 2);
	     var arata_y_coord = doua_zecimale(((-b)*(-1))/gridOptions.separation * (-1), 2);
		 
		 deseneaza_punct2( (panta * gridOptions.separation) , ((-b)*(-1)), arata_x_coord, arata_y_coord);
		 
		 // pentru a face acoperirea convexa in myCanvas2 :
		 
	     var punct = {x : (panta * gridOptions.separation), y : ((-b)*(-1)) };
		 vector_puncte2_acoperire.push(punct);
		 vector_puncte2_acoperire_inf.push(punct);
		
		 vector_recuperare_drepte.push({ punct, punct1_dreapta:{x: vector_puncte_linie[k].x, y: vector_puncte_linie[k].y}, punct2_dreapta:{x: vector_puncte_linie[k+1].x, y: vector_puncte_linie[k+1].y} });
	}
	    
	for( k=0; k < vector_puncte.length; k=k+1)
	{    
		var punct1 = { x : 0 , y : -vector_puncte[k].y};
		var punct2 = { x : gridOptions.separation , y : (punct1.y + vector_puncte[k].x)};
	   
        vector_puncte_linii_transformare1.push(punct1);
		vector_puncte_linii_transformare1.push(punct2);
	}
	
	deseneaza_linii_transformare1();
}

 var vector_recuperare_drepte2 = [];

function Transfomare_in_plan_primal()
{   
 
	for( k=0; k < vector_puncte_linie2.length; k=k+2 )
	{
		var a, b, c;
		
	//	if( (Math.abs(vector_puncte_linie2[k].x/gridOptions.separation) < 0.5 && Math.abs(vector_puncte_linie2[k+1].x/gridOptions.separation) < 0.5) || (vector_puncte_linie2[k].x == vector_puncte_linie2[k+1].x) )
		
       if( vector_puncte_linie2[k].x == vector_puncte_linie2[k+1].x )	
		alert("Nu sunt permise drepte verticale sau aproape vreticale");
		
		// modifica si in documenatie poza, fara math.floor
	 //var panta = Math.floor((vector_puncte_linie2[k+1].y - vector_puncte_linie2[k].y) / (vector_puncte_linie2[k+1].x - vector_puncte_linie2[k].x));
		
		var panta = (vector_puncte_linie2[k+1].y - vector_puncte_linie2[k].y) / (vector_puncte_linie2[k+1].x - vector_puncte_linie2[k].x);
		var b = vector_puncte_linie2[k].y -(panta * vector_puncte_linie2[k].x);
		
		var arata_x_coord = doua_zecimale((panta * gridOptions.separation)/gridOptions.separation, 2);
	    var arata_y_coord = doua_zecimale(((-b)*(-1))/gridOptions.separation * (-1), 2);
	
		deseneaza_punct( (panta * gridOptions.separation) , ((-b)*(-1)), arata_x_coord, arata_y_coord);
		
		 // pentru a face acoperirea convexa in myCanvas2 :
		 
	        var punct = {x : (panta * gridOptions.separation), y : ((-b)*(-1)) };
		    vector_puncte_acoperire.push(punct);
		    vector_puncte_acoperire_inf.push(punct);
		    vector_recuperare_drepte2.push({ punct, punct1_dreapta:{x: vector_puncte_linie2[k].x, y: vector_puncte_linie2[k].y}, punct2_dreapta:{x: vector_puncte_linie2[k+1].x, y: vector_puncte_linie2[k+1].y} });
	}
	    
	for( k=0; k < vector_puncte2.length; k=k+1)
	{    
		var punct1 = { x : 0 , y : -vector_puncte2[k].y};
		var punct2 = { x : gridOptions.separation , y : (punct1.y + vector_puncte2[k].x)};
	   
        vector_puncte_linii_transformare2.push(punct1);
		vector_puncte_linii_transformare2.push(punct2);
	}
	
	deseneaza_linii_transformare2();
}



function viraj_stanga(a, b, c)		// functia de viraj 
{ 
   return ((c.x - b.x) * (a.y - b.y)) - ((c.y - b.y) * (a.x - b.x));  
} 


//------------------------Frontiera superioara si inferioara a acoperirii convexe, pe myCanvas2---------------------------------

var vector_frontiera_inf = [];
var vector_frontiera_sup = [];


function frontiera_convexa()		// detectarea frontierei superioare a acoperirii convexe
{
   n = vector_puncte2_acoperire.length;		// dimensiunea vectorului de puncte
 

 for(i=0; i < n-1; i++)		
	for (j = i + 1; j < n; j++)
	{
			if (vector_puncte2_acoperire[i].y < vector_puncte2_acoperire[j].y)
			{
				aux = vector_puncte2_acoperire[i];
		     	vector_puncte2_acoperire[i] = vector_puncte2_acoperire[j];
				vector_puncte2_acoperire[j] = aux;
			}
		
    }
  
    for(i=0;i<Math.floor(n/2);i++)
	 vector_frontiera_inf.push(vector_puncte2_acoperire[i]);
 
 
   for(i=0; i < vector_frontiera_inf.length -1; i++)		// sortarea cresactoare a vectorului de puncte 
	for (j = i + 1; j < vector_frontiera_inf.length; j++)
	{
	    if (vector_frontiera_inf[i].x != vector_frontiera_inf[j].x)
		{
			if (vector_frontiera_inf[i].x > vector_frontiera_inf[j].x)
			{
				aux = vector_frontiera_inf[i];
		     	vector_frontiera_inf[i] = vector_frontiera_inf[j];
				vector_frontiera_inf[j] = aux;
			}
		}
		
		else
			
		if (vector_frontiera_inf[i].x == vector_frontiera_inf[j].x)
		{
		    if (vector_frontiera_inf[i].y > vector_frontiera_inf[j].y)
			{
				aux = vector_frontiera_inf[i];
				vector_frontiera_inf[i] = vector_frontiera_inf[j];
				vector_frontiera_inf[j] = aux;
			}
		}
	}
			
    var t;
    var ok = 0;
  
 // initializam stiva cu primele doua pucte din vectorul de puncte 
    stiva[0] = vector_frontiera_inf[0];
    stiva[1] = vector_frontiera_inf[1];
								
    var k = 2;

for (i = 2; i < vector_frontiera_inf.length; i++)
{
	stiva[k] = vector_frontiera_inf[i];		// adaugam in stiva urmatorul punct din vector 
		
	if(k >= 2)
	{    
		// cat timp ultimele trei puncte nu formeaza un viraj la stanga 
		while (viraj_stanga(stiva[k - 2], stiva[k-1], stiva[k]) <= 0 && k >= 2) 
		{  
			stiva[k - 1] = stiva[k]; // stergem penultimul punct din stiva
			k--;
			ok = 1;	  
			
			if(k == 1)		// daca suntem in situatia in care mai avem doar doua elem in stiva, pentru a nu se intoarce in while si a se apela functia viraj_stanga cu un parametru undefined, iesim din while cu break  
			{ break; }
		}
	 }
	 
	 k++;  // crestem capatul stivei pentru a adauga un nou element (fie ca am sters sau ca doar vrem sa adaugam mai departe)
}

// a fost creata forntiera superioara, o avem pe stiva, mai ramane sa afisam elementele stivei doua cate doua
// (adica sa trasam linii intre fiecare doua elemente din stiva )

	var lin_sup = document.getElementById("myCanvas2");
	var ctx = lin_sup.getContext("2d");
	
	for (i = 0; i <= k-2; i++)
	{   
       ctx.beginPath();  
	   ctx.lineWidth = 1;
       ctx.strokeStyle="#751aff";
	   ctx.moveTo(stiva[i].x, stiva[i].y);
		
		if(typeof(stiva[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		  ctx.lineTo(stiva[i+1].x, stiva[i+1].y);
		  ctx.lineWidth = 1;
		  ctx.stroke(); 
		}
	}
	
	var frontiera_sup_semipl = [];

	for( i=0; i < k; i=i+1)
	{     
          for( j=0; j < vector_recuperare_drepte.length; j=j+1)
	    {   
            if(vector_recuperare_drepte[j].punct.x == stiva[i].x && vector_recuperare_drepte[j].punct.y == stiva[i].y)
			{  frontiera_sup_semipl.push( {x:vector_recuperare_drepte[j].punct1_dreapta.x, y:vector_recuperare_drepte[j].punct1_dreapta.y});
		       frontiera_sup_semipl.push( {x:vector_recuperare_drepte[j].punct2_dreapta.x, y:vector_recuperare_drepte[j].punct2_dreapta.y} );
		      
			}
		}
	}
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
	for(i = 0; i < frontiera_sup_semipl.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#b800e6";
		
		ctx.moveTo(frontiera_sup_semipl[i].x, frontiera_sup_semipl[i].y);
		
		if(typeof(frontiera_sup_semipl[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		// acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
		   extLine(frontiera_sup_semipl[i].x, frontiera_sup_semipl[i].y * (-1), frontiera_sup_semipl[i+1].x, frontiera_sup_semipl[i+1].y * (-1), 1000);
		}
	}	
	
// golim stiva 	
	while (k > -1)
	{
		for (i = 0; i < k-1; i++)
		{
			stiva[i] = stiva[i + 1];
		}
		k--;
	}
		
   for(i=Math.floor(n/2);i<n;i++)
	 vector_frontiera_sup.push(vector_puncte2_acoperire[i]);	
  	
   for(i=0; i < vector_frontiera_sup.length -1; i++)		// sortarea cresactoare a vectorului de puncte 
	for (j = i + 1; j < vector_frontiera_sup.length; j++)
	{
	    if (vector_frontiera_sup[i].x != vector_frontiera_sup[j].x)
		{
			if (vector_frontiera_sup[i].x > vector_frontiera_sup[j].x)
			{
				aux = vector_frontiera_sup[i];
		     	vector_frontiera_sup[i] = vector_frontiera_sup[j];
				vector_frontiera_sup[j] = aux;
			}
		}
		
		else
			
		if (vector_frontiera_sup[i].x == vector_frontiera_sup[j].x)
		{
		    if (vector_frontiera_sup[i].y > vector_frontiera_sup[j].y)
			{
				aux = vector_frontiera_sup[i];
				vector_frontiera_sup[i] = vector_frontiera_sup[j];
				vector_frontiera_sup[j] = aux;
			}
		}
	}
	
	var t = 0;
	n = vector_frontiera_sup.length;
		
	for (i = n-1; i >= 0; i--)
	{
		v_sup[t] = vector_frontiera_sup[i];
		t++;
	} 
		
	var ok = 0;	
	
 // initializam stiva cu primele doua pucte din vectorul de puncte 	
	stiva[0] = v_sup[0];
	stiva[1] = v_sup[1];
	
    var k = 2;

	for (i = 2; i < n; i++)
	{   
		stiva[k] = v_sup[i];		// adaugam in stiva urmatorul punct din vector 

        if(k >= 2)
	    {    
		// cat timp daca ultimele trei puncte nu formeaza un viraj la stanga 
		   while (viraj_stanga(stiva[k - 2], stiva[k - 1], stiva[k]) <= 0 && k >= 2)
			{  
				stiva[k - 1] = stiva[k];  // stergem penultimul punct din stiva	
				k--;
				ok = 1;
				
                if(k == 1)	// daca suntem in situatia in care mai avem doar doua elem in stiva, pentru a nu se intoarce in while si a se apela functia viraj_stanga cu un parametru undefined, iesim din while cu break  
			    { break; }
			 }	
		 }
			
		k++;  // crestem capatul stivei pentru a adauga un nou element (fie ca am sters sau ca doar vrem sa adaugam mai departe)
	}
	
	
// a fost creata forntiera superioara, o avem pe stiva, mai ramane sa afisam elementele stivei doua cate doua
// (adica sa trasam linii intre fiecare doua elemente din stiva )
	
	var lin_inf = document.getElementById("myCanvas2");
	var ctx = lin_inf.getContext("2d");
	
	for (i = 0; i <= k-2; i++)
	{   
        ctx.beginPath();  
		ctx.lineWidth = 1;
        ctx.strokeStyle="#000099";
		ctx.moveTo(stiva[i].x, stiva[i].y);
		
		if( (typeof(stiva[i+1]) != "undefined") )		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{
		 ctx.lineTo(stiva[i+1].x, stiva[i+1].y);
		 ctx.lineWidth = 1;
		 ctx.stroke(); 
		}
	}
	
   	var frontiera_inf_semipl = [];
	
	for( i=0; i < k; i=i+1)
	{    
          for( j=0; j < vector_recuperare_drepte.length; j=j+1)
	    {
            if(vector_recuperare_drepte[j].punct.x == stiva[i].x && vector_recuperare_drepte[j].punct.y == stiva[i].y)
			{  frontiera_inf_semipl.push({x:vector_recuperare_drepte[j].punct1_dreapta.x, y:vector_recuperare_drepte[j].punct1_dreapta.y});
		       frontiera_inf_semipl.push({x:vector_recuperare_drepte[j].punct2_dreapta.x, y:vector_recuperare_drepte[j].punct2_dreapta.y});
			}
		}
	}
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");	
	
	for(i = 0; i < frontiera_inf_semipl.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#0000ff";
		
		ctx.moveTo(frontiera_inf_semipl[i].x, frontiera_inf_semipl[i].y);
		
		if(typeof(frontiera_inf_semipl[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		// acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
		   extLine(frontiera_inf_semipl[i].x, frontiera_inf_semipl[i].y *(-1), frontiera_inf_semipl[i+1].x, frontiera_inf_semipl[i+1].y*(-1) , 1000);
		}
	}	
	
	
// golim stiva 	
	while (k > -1)
	{
		for (i = 0; i < k-1; i++)
		{
			stiva[i] = stiva[i + 1];
		}
		k--;
	}
}	



//------------------------Frontiera superioara si inferioara a acoperirii convexe, pe myCanvas---------------------------------

var vector_frontiera_inf2 = [];
var vector_frontiera_sup2 = [];

function frontiera_convexa2()		// detectarea frontierei superioare a acoperirii convexe
{
   n = vector_puncte_acoperire.length;		// dimensiunea vectorului de puncte
 

 for(i=0; i < n-1; i++)		
	for (j = i + 1; j < n; j++)
	{
			if (vector_puncte_acoperire[i].y < vector_puncte_acoperire[j].y)
			{
				aux = vector_puncte_acoperire[i];
		     	vector_puncte_acoperire[i] = vector_puncte_acoperire[j];
				vector_puncte_acoperire[j] = aux;
			}
		
    }
  
    for(i=0;i<Math.floor(n/2);i++)
	 vector_frontiera_inf2.push(vector_puncte_acoperire[i]);
 
 
   for(i=0; i < vector_frontiera_inf2.length -1; i++)		// sortarea cresactoare a vectorului de puncte 
	for (j = i + 1; j < vector_frontiera_inf2.length; j++)
	{
	    if (vector_frontiera_inf2[i].x != vector_frontiera_inf2[j].x)
		{
			if (vector_frontiera_inf2[i].x > vector_frontiera_inf2[j].x)
			{
				aux = vector_frontiera_inf2[i];
		     	vector_frontiera_inf2[i] = vector_frontiera_inf2[j];
				vector_frontiera_inf2[j] = aux;
			}
		}
		
		else
			
		if (vector_frontiera_inf2[i].x == vector_frontiera_inf2[j].x)
		{
		    if (vector_frontiera_inf2[i].y > vector_frontiera_inf2[j].y)
			{
				aux = vector_frontiera_inf2[i];
				vector_frontiera_inf2[i] = vector_frontiera_inf2[j];
				vector_frontiera_inf2[j] = aux;
			}
		}
	}
			
    var t;
    var ok = 0;
  
 // initializam stiva cu primele doua pucte din vectorul de puncte 
    stiva[0] = vector_frontiera_inf2[0];
    stiva[1] = vector_frontiera_inf2[1];
								
    var k = 2;

for (i = 2; i < vector_frontiera_inf2.length; i++)
{
	stiva[k] = vector_frontiera_inf2[i];		// adaugam in stiva urmatorul punct din vector 
		
	if(k >= 2)
	{    
		// cat timp ultimele trei puncte nu formeaza un viraj la stanga 
		while (viraj_stanga(stiva[k - 2], stiva[k-1], stiva[k]) <= 0 && k >= 2) 
		{  
			stiva[k - 1] = stiva[k]; // stergem penultimul punct din stiva
			k--;
			ok = 1;	  
			
			if(k == 1)		// daca suntem in situatia in care mai avem doar doua elem in stiva, pentru a nu se intoarce in while si a se apela functia viraj_stanga cu un parametru undefined, iesim din while cu break  
			{ break; }
		}
	 }
	 
	 k++;  // crestem capatul stivei pentru a adauga un nou element (fie ca am sters sau ca doar vrem sa adaugam mai departe)
}

// a fost creata forntiera superioara, o avem pe stiva, mai ramane sa afisam elementele stivei doua cate doua
// (adica sa trasam linii intre fiecare doua elemente din stiva )

	var lin_sup = document.getElementById("myCanvas");
	var ctx = lin_sup.getContext("2d");
	
	for (i = 0; i <= k-2; i++)
	{   
       ctx.beginPath();  
	   ctx.lineWidth = 1;
       ctx.strokeStyle="#751aff";
	   ctx.moveTo(stiva[i].x, stiva[i].y);
		
		if(typeof(stiva[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		  ctx.lineTo(stiva[i+1].x, stiva[i+1].y);
		  ctx.lineWidth = 1;
		  ctx.stroke(); 
		}
	}
	
     var frontiera_sup_semipl2 = [];
	for( i=0; i < k; i=i+1)
	{     
          for( j=0; j < vector_recuperare_drepte2.length; j=j+1)
	    {   
            if(vector_recuperare_drepte2[j].punct.x == stiva[i].x && vector_recuperare_drepte2[j].punct.y == stiva[i].y)
			{  frontiera_sup_semipl2.push( {x:vector_recuperare_drepte2[j].punct1_dreapta.x, y:vector_recuperare_drepte2[j].punct1_dreapta.y});
		       frontiera_sup_semipl2.push( {x:vector_recuperare_drepte2[j].punct2_dreapta.x, y:vector_recuperare_drepte2[j].punct2_dreapta.y} );
		      
			}
		}
	}
	
	var cnv = document.getElementById("myCanvas2");
	var ctx = cnv.getContext("2d");	
	
	for(i = 0; i < frontiera_sup_semipl2.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#b800e6";
		
		ctx.moveTo(frontiera_sup_semipl2[i].x, frontiera_sup_semipl2[i].y);
		
		if(typeof(frontiera_sup_semipl2[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		// acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
		   extLine2(frontiera_sup_semipl2[i].x, frontiera_sup_semipl2[i].y * (-1), frontiera_sup_semipl2[i+1].x, frontiera_sup_semipl2[i+1].y * (-1), 1000);
		}
	}	
	
// golim stiva 	
	while (k > -1)
	{
		for (i = 0; i < k-1; i++)
		{
			stiva[i] = stiva[i + 1];
		}
		k--;
	}
	
   for(i=Math.floor(n/2);i<n;i++)
	 vector_frontiera_sup2.push(vector_puncte_acoperire[i]);	
	
   for(i=0; i < vector_frontiera_sup2.length -1; i++)		// sortarea cresactoare a vectorului de puncte 
	for (j = i + 1; j < vector_frontiera_sup2.length; j++)
	{
	    if (vector_frontiera_sup2[i].x != vector_frontiera_sup2[j].x)
		{
			if (vector_frontiera_sup2[i].x > vector_frontiera_sup2[j].x)
			{
				aux = vector_frontiera_sup2[i];
		     	vector_frontiera_sup2[i] = vector_frontiera_sup2[j];
				vector_frontiera_sup2[j] = aux;
			}
		}
		
		else
			
		if (vector_frontiera_sup2[i].x == vector_frontiera_sup2[j].x)
		{
		    if (vector_frontiera_sup2[i].y > vector_frontiera_sup2[j].y)
			{
				aux = vector_frontiera_sup2[i];
				vector_frontiera_sup2[i] = vector_frontiera_sup2[j];
				vector_frontiera_sup2[j] = aux;
			}
		}
	}
	
	var t = 0;
	n = vector_frontiera_sup2.length;
		
	for (i = n-1; i >= 0; i--)
	{
		v_sup[t] = vector_frontiera_sup2[i];
		t++;
	} 
		
	var ok = 0;	
	
 // initializam stiva cu primele doua pucte din vectorul de puncte 	
	stiva[0] = v_sup[0];
	stiva[1] = v_sup[1];
	
    var k = 2;

	for (i = 2; i < n; i++)
	{   
		stiva[k] = v_sup[i];		// adaugam in stiva urmatorul punct din vector 

        if(k >= 2)
	    {    
		// cat timp daca ultimele trei puncte nu formeaza un viraj la stanga 
		   while (viraj_stanga(stiva[k - 2], stiva[k - 1], stiva[k]) <= 0 && k >= 2)
			{  
				stiva[k - 1] = stiva[k];  // stergem penultimul punct din stiva	
				k--;
				ok = 1;
				
                if(k == 1)	// daca suntem in situatia in care mai avem doar doua elem in stiva, pentru a nu se intoarce in while si a se apela functia viraj_stanga cu un parametru undefined, iesim din while cu break  
			    { break; }
			 }	
		 }
			
		k++;  // crestem capatul stivei pentru a adauga un nou element (fie ca am sters sau ca doar vrem sa adaugam mai departe)
	}
	
	
// a fost creata forntiera inferioara, o avem pe stiva, mai ramane sa afisam elementele stivei doua cate doua
// (adica sa trasam linii intre fiecare doua elemente din stiva )
	
	var lin_inf = document.getElementById("myCanvas");
	var ctx = lin_inf.getContext("2d");
	
	for (i = 0; i <= k-2; i++)
	{   
        ctx.beginPath();  
		ctx.lineWidth = 1;
        ctx.strokeStyle="#000099";
		ctx.moveTo(stiva[i].x, stiva[i].y);
		
		if( (typeof(stiva[i+1]) != "undefined") )		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{
		 ctx.lineTo(stiva[i+1].x, stiva[i+1].y);
		 ctx.lineWidth = 1;
		 ctx.stroke(); 
		}
	}
	
	
	 var frontiera_inf_semipl2 = [];
	for( i=0; i < k; i=i+1)
	{     
          for( j=0; j < vector_recuperare_drepte2.length; j=j+1)
	    {   
            if(vector_recuperare_drepte2[j].punct.x == stiva[i].x && vector_recuperare_drepte2[j].punct.y == stiva[i].y)
			{  frontiera_inf_semipl2.push( {x:vector_recuperare_drepte2[j].punct1_dreapta.x, y:vector_recuperare_drepte2[j].punct1_dreapta.y});
		       frontiera_inf_semipl2.push( {x:vector_recuperare_drepte2[j].punct2_dreapta.x, y:vector_recuperare_drepte2[j].punct2_dreapta.y} );
		      
			}
		}
	}
	
	var cnv = document.getElementById("myCanvas2");
	var ctx = cnv.getContext("2d");	
	
	for(i = 0; i < frontiera_inf_semipl2.length; i = i+2)
	{
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#0000ff";
		
		ctx.moveTo(frontiera_inf_semipl2[i].x, frontiera_inf_semipl2[i].y);
		
		if(typeof(frontiera_inf_semipl2[i+1]) != "undefined")		// ca sa evitam situatia cand celalalt capat al liniei e undefined
		{	
		// acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
		   extLine2(frontiera_inf_semipl2[i].x, frontiera_inf_semipl2[i].y * (-1), frontiera_inf_semipl2[i+1].x, frontiera_inf_semipl2[i+1].y * (-1), 1000);
		}
	}	
	
// golim stiva 	
	while (k > -1)
	{
		for (i = 0; i < k-1; i++)
		{
			stiva[i] = stiva[i + 1];
		}
		k--;
	}
}	










// Pentru testare 

 /* vector_puncte_linie.push( { x : -4* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : 4* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : 5* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 5* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : 8* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 3* gridOptions.separation, y : 8* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : 4.8* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 1* gridOptions.separation, y : 5* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : -2* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : -6* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : -7* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 3* gridOptions.separation, y : -7* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : -4* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 3* gridOptions.separation, y : -4* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 5* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : -5* gridOptions.separation } );
   vector_puncte_linie.push( { x : 0* gridOptions.separation, y : -8* gridOptions.separation } ); 
   vector_puncte_linie.push( { x : -8* gridOptions.separation, y : 0* gridOptions.separation } );    
   
   
   deseneaza_puncte_linie( -4* gridOptions.separation,  0* gridOptions.separation * (-1), -4, 0);
   deseneaza_puncte_linie( 0* gridOptions.separation,  5* gridOptions.separation * (-1), 0, 5);
   deseneaza_puncte_linie( 5* gridOptions.separation,  0* gridOptions.separation * (-1), 5, 0);
   deseneaza_puncte_linie( 0* gridOptions.separation,  8* gridOptions.separation * (-1), 0, 8);
   deseneaza_puncte_linie( 3* gridOptions.separation,  8* gridOptions.separation * (-1), 3, 8);
   deseneaza_puncte_linie( 0* gridOptions.separation,  4.8* gridOptions.separation * (-1), 0, 4.8);
   deseneaza_puncte_linie( 1* gridOptions.separation,  5* gridOptions.separation * (-1), 1, 5);
   deseneaza_puncte_linie( -2* gridOptions.separation, 0* gridOptions.separation * (-1), -2, 0);
   deseneaza_puncte_linie( 0* gridOptions.separation,  -6* gridOptions.separation * (-1), 0, -6);
   deseneaza_puncte_linie( 0* gridOptions.separation,  -7* gridOptions.separation * (-1), 0, -7);
   deseneaza_puncte_linie( 3* gridOptions.separation,  -7* gridOptions.separation * (-1), 3, -7);
   deseneaza_puncte_linie( 5* gridOptions.separation,  0* gridOptions.separation * (-1), 5, 0);
   deseneaza_puncte_linie( 0* gridOptions.separation,  -5* gridOptions.separation * (-1), 0, -5);
   deseneaza_puncte_linie( 0* gridOptions.separation,  -8* gridOptions.separation * (-1), 0, -8);
   deseneaza_puncte_linie( -8* gridOptions.separation,  0* gridOptions.separation * (-1), -8, 0);   
   
   vector_puncte_linie2.push( { x : -4* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : 4* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : 5* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 5* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : 8* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 3* gridOptions.separation, y : 8* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : 4.8* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 1* gridOptions.separation, y : 5* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : -2* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : -6* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : -7* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 3* gridOptions.separation, y : -7* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : -4* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 3* gridOptions.separation, y : -4* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 5* gridOptions.separation, y : 0* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : -5* gridOptions.separation } );
   vector_puncte_linie2.push( { x : 0* gridOptions.separation, y : -8* gridOptions.separation } ); 
   vector_puncte_linie2.push( { x : -8* gridOptions.separation, y : 0* gridOptions.separation } );    
   
   
   deseneaza_puncte_linie2( -4* gridOptions.separation,  0* gridOptions.separation * (-1), -4, 0);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  5* gridOptions.separation * (-1), 0, 5);
   deseneaza_puncte_linie2( 5* gridOptions.separation,  0* gridOptions.separation * (-1), 5, 0);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  8* gridOptions.separation * (-1), 0, 8);
   deseneaza_puncte_linie2( 3* gridOptions.separation,  8* gridOptions.separation * (-1), 3, 8);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  4.8* gridOptions.separation * (-1), 0, 4.8);
   deseneaza_puncte_linie2( 1* gridOptions.separation,  5* gridOptions.separation * (-1), 1, 5);
   deseneaza_puncte_linie2( -2* gridOptions.separation, 0* gridOptions.separation * (-1), -2, 0);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  -6* gridOptions.separation * (-1), 0, -6);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  -7* gridOptions.separation * (-1), 0, -7);
   deseneaza_puncte_linie2( 3* gridOptions.separation,  -7* gridOptions.separation * (-1), 3, -7);
   deseneaza_puncte_linie2( 5* gridOptions.separation,  0* gridOptions.separation * (-1), 5, 0);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  -5* gridOptions.separation * (-1), 0, -5);
   deseneaza_puncte_linie2( 0* gridOptions.separation,  -8* gridOptions.separation * (-1), 0, -8);
   deseneaza_puncte_linie2( -8* gridOptions.separation,  0* gridOptions.separation * (-1), -8, 0);   */