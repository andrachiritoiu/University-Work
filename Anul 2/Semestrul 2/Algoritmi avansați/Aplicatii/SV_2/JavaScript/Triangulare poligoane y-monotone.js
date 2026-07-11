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

var vector_puncte_linie = [];	// vectorul in care punem coordonatele punctelor 

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

//////////////////////////////////////////////////////////////////////////////////////////////

function adauga()
{
     var canvas = document.getElementById("myCanvas");  
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
     ctx.fillText("("+ arata_x_coord + ",", x - 20, y - 10);
	 ctx.fillText(arata_y_coord + ")",x + 10,y - 10);
}

     var poz_max, poz_min;

function verificare_poligon()
{
	 var c = document.getElementById("myCanvas");
	 var ctx = c.getContext("2d");	
	
	 vector_verificare = [];
	 copie_vector_puncte_linie = [];
	
     var	i;
	 var ok1 = 1, ok2 = 1;
	 var valid = 1;
	
	 var maxim = vector_puncte_linie[0].y; var minim = vector_puncte_linie[0].y ;
	
    for(i=0; i < vector_puncte_linie.length;i++)
   {
	 if(vector_puncte_linie[i].y > maxim)
	 maxim = vector_puncte_linie[i].y; 
   }
	
	
    for(i=0; i < vector_puncte_linie.length;i++)
   {
	 if(vector_puncte_linie[i].y < minim)
	 minim = vector_puncte_linie[i].y;
   }
	

    for(i=0;i<vector_puncte_linie.length; i++)
   {
   	 vector_verificare.push(vector_puncte_linie[i]);
   }
	
    for(i=0;i<vector_puncte_linie.length; i++)
   {
	 copie_vector_puncte_linie.push(vector_puncte_linie[i]);
   }
	
	
    for(i=0;i<vector_verificare.length;i++)
	 console.log(vector_verificare[i]);
 
    if(vector_verificare[0].y != maxim)
   {
	 while(vector_verificare[0].y != maxim)
	 {
		var aux = vector_verificare[0];
			
		for(i=0;i<vector_verificare.length-1;i++)
		{ 
		     vector_verificare[i] = vector_verificare[i+1];
     	}
			
	    vector_verificare[vector_verificare.length-1]=aux;
	 }
   }
	

	for(i=0;i<vector_verificare.length;i++)
   {
	    if(vector_verificare[i].y == maxim)
		    poz_max = i;
	    else
			 
	    if(vector_verificare[i].y == minim)
		    poz_min = i;
   }
	
	for(i=0;i<poz_min-1;i++)
	    if(vector_verificare[i].y <= vector_verificare[i+1].y)
		    ok1 = 0;
    	
	
	for(i=poz_min;i<vector_verificare.length-1;i++)
	    if(vector_verificare[i].y >= vector_verificare[i+1].y)
		    ok2 = 0;
	
	 
    if(ok1 == 0 || ok2 == 0)
        valid =0; 

	return valid;
} 

///////////////////////////////////////////////////////////////////////////////////////

function deseneaza_linii()
{    
    if(verificare_poligon() == 1)
   {
	 var c = document.getElementById("myCanvas");
	 var ctx = c.getContext("2d");	
	
     var	k;
	
	 for(k = 0; k < vector_puncte_linie.length; k = k+1)
	 {
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#00b300";
		  
		if(typeof(vector_puncte_linie[k+1]) != "undefined") // ca sa evitam situatia cand celalalt capat al liniei e undefined
	    {	
	      // acum punctele (y-urile) trebuie inmultite iarasi cu -1, pentru a desena dreptele corect
	      ctx.beginPath();
		 
          ctx.moveTo(vector_puncte_linie[k].x, vector_puncte_linie[k].y * (-1));
          ctx.lineTo(vector_puncte_linie[k+1].x, vector_puncte_linie[k+1].y * (-1));
          ctx.stroke();
	    }   
	 }
	 
	 ctx.moveTo(vector_puncte_linie[vector_puncte_linie.length-1].x, vector_puncte_linie[vector_puncte_linie.length-1].y * (-1));
     ctx.lineTo(vector_puncte_linie[0].x, vector_puncte_linie[0].y * (-1));
     ctx.stroke();
   }	
   else
   { alert ("poligonul nu este y-monoton");
     location.reload();
   }
} 

	function viraj(a, b, c)  // functia de viraj 
  { 
    return ((c.x - b.x) * (a.y - b.y)) - ((c.y - b.y) * (a.x - b.x));  
  } 

function arata_triangulare()
{
		
  for(i=0; i < vector_puncte_linie.length -1; i++)	// sortarea descresactoare a vectorului de puncte dupa y, daca ordonata este egala, se foloseste abscisa
	for (j = i + 1; j < vector_puncte_linie.length; j++)
	{
	    if (vector_puncte_linie[i].y != vector_puncte_linie[j].y)
		{
			if (vector_puncte_linie[i].y < vector_puncte_linie[j].y)
			{
				aux = vector_puncte_linie[i];
		     	vector_puncte_linie[i] = vector_puncte_linie[j];
				vector_puncte_linie[j] = aux;
			}
		}
		
		else
			
		if (vector_puncte_linie[i].y == vector_puncte_linie[j].y)
		{
		    if (vector_puncte_linie[i].x < vector_puncte_linie[j].x)
			{
				aux = vector_puncte_linie[i];
				vector_puncte_linie[i] = vector_puncte_linie[j];
				vector_puncte_linie[j] = aux;
			}
		}
	}
	
	var stiva = [];
	
	var lant_stang = [];
	var lant_drept = [];
	
	for(i=1;i<poz_min;i++)
	   lant_drept.push(vector_verificare[i]);

   
    for(i=0;i<lant_drept.length;i++)
	 console.log(lant_drept[i]);
	
	for(i=poz_min+1;i<vector_verificare.length;i++)
	   lant_stang.push(vector_verificare[i]);

   
	var k = 0;
	stiva[0] = vector_puncte_linie[0];
	stiva[1] = vector_puncte_linie[1];
	k = k+2;
	
	var ok = 0;
	
	var diagonale = [];

	
    for(j = 2; j<vector_puncte_linie.length -1; j++)
   {   
      var ok1 = 0, ok2 = 0, ok3 = 0, ok4=0;
   
      for(i=0;i<lant_stang.length;i++)
		  if(vector_puncte_linie[j] == lant_stang[i])
			  ok1 = 1;
		  
	  for(i=0;i<lant_stang.length;i++)
		  if(stiva[k-1] == lant_stang[i])
               ok2 = 1;
		   
	  for(i=0;i<lant_drept.length;i++)
		  if(vector_puncte_linie[j] == lant_drept[i])
			  ok3 = 1;
		  
	  for(i=0;i<lant_drept.length;i++)
		  if(stiva[k-1] == lant_drept[i])
               ok4 = 1;
		   
      if( (ok1 == 1 && ok2 == 1) || (ok3 == 1 && ok4 == 1) ) 
	         ok = 1;
	       
	if(ok == 0)  // daca vj si varful din top al lui sunt in lanturi diferite
	{
		for(i=1; i < k; i++)  // insereaza diagonale de la vj la varfurile din stiva mai putin utlimul
		{
		  diagonale.push({punct1: vector_puncte_linie[j], punct2: stiva[i]});

		}
		
		while (k > -1)  // extrage toate varfurile din stiva
	  {
		for (i = 0; i < k-1; i++)
		{
			stiva[i] = stiva[i + 1];
		}
		k--;
	  }
	  
	  k++;// Acum k este iar 0
	  
	  stiva[0] = vector_puncte_linie[j-1];  // insereaza Vj-1 si Vj in stiva
	  stiva[1] = vector_puncte_linie[j];
	  k=k+2;
	}
	else
	{
	   var poz, ultimul_scos;
	   var diag_int = 0;
	   varf_verif = stiva[k-1];
	   console.log(varf_verif);
	   stiva.pop();
	   k--;
		
	  while( k>0 && (viraj(vector_puncte_linie[j], varf_verif, stiva[k-1])  > 0)  )  // daca diagonalele formate cu Vj si varfurile din stiva sunt in interiorul lui P, atunci le adaugam in vectorul de diagonale
     {
       diagonale.push({punct1: vector_puncte_linie[j], punct2: varf_verif});
	   diagonale.push({punct1: vector_puncte_linie[j], punct2: stiva[k-1]});
	   ultimul_scos = stiva[k-1];
	   stiva.pop();
	   k--;
	   diag_int = 1;
     }
   
      if(diag_int == 1)
     { 
	  stiva.push(ultimul_scos);  // inseram inapoi ultimul varf extras
	  stiva.push(vector_puncte_linie[j]); 
	  k=k+2;
     } //inseram Vj in S }
     else
    { stiva.push(varf_verif);
      stiva.push(vector_puncte_linie[j]);  //inseram Vj in S  
	  k=k+2; 
    }	
   }
}
		for(i=1;i<stiva.length-1;i++)
		 diagonale.push({punct1: vector_puncte_linie.length-1 , punct2: stiva[i]});
 
     // Vom parcurge apoi vectorul diagonale si vom desena pe celalalt canvas poligonul initial completat cu diagonelele colorate diferit.
		
        var c = document.getElementById("myCanvas2");
	    var ctx = c.getContext("2d");
		
	for(i=0; i<diagonale.length;i++)
	{    
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle = "#DC143C";
			 
        ctx.moveTo(diagonale[i].punct1.x, diagonale[i].punct1.y * (-1));
        ctx.lineTo(diagonale[i].punct2.x, diagonale[i].punct2.y * (-1));
        ctx.stroke();
		
	}
	
		for(i = 0; i < copie_vector_puncte_linie.length; i = i+1)
	{   
        
		ctx.beginPath();  
		ctx.lineWidth = 3;
        ctx.strokeStyle="#00b300";
		  
		if(typeof(copie_vector_puncte_linie[i+1]) != "undefined") // ca sa evitam situatia cand celalalt capat al liniei e undefined
	  {	
	     ctx.beginPath();
		 
         ctx.moveTo(copie_vector_puncte_linie[i].x, copie_vector_puncte_linie[i].y * (-1));
         ctx.lineTo(copie_vector_puncte_linie[i+1].x, copie_vector_puncte_linie[i+1].y * (-1));
         ctx.stroke();
	  }   
	}
	     ctx.moveTo(copie_vector_puncte_linie[copie_vector_puncte_linie.length-1].x, copie_vector_puncte_linie[copie_vector_puncte_linie.length-1].y * (-1));
         ctx.lineTo(copie_vector_puncte_linie[0].x, copie_vector_puncte_linie[0].y * (-1));
         ctx.stroke();
}




 
