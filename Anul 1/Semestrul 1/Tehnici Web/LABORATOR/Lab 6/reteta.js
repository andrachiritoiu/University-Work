/*Tema 6.1*/
var cosCumparaturi = {
  faina:"15.5ron",
  oua: "3.4ron",
  unt: "11.3ron",
  cascaval: "20ron"
};
function valoareCos(listaCumparaturi)
{
  let total = 0;
  for(let p in listaCumparaturi){
    total += parseFloat(listaCumparaturi[p]);
  }
  return total;
}
function afisareValoare(){
  console.log(cosCumparaturi);
  alert(`Valoarea totala a cosului este ${valoareCos(cosCumparaturi)}ron`);
}

 afisareValoare();

function adaugaIngredient(ingredient,pret){
  cosCumparaturi[ingredient] = pret;
  console.log(`Am adaugat ingredientul ${ingredient} cu pretul ${pret}`);
}
  adaugaIngredient("sare","2.5ron");
  afisareValoare();


/*Tema 6.2*/
var retete = [
  { nume: "Pateuri cu cascaval", timpPreparare: 45, ingrediente: ["făină", "unt", "cașcaval", "ouă"] },
  { nume: "Salata de fructe", timpPreparare: 15, ingrediente: ["mere", "banane", "portocale", "struguri"] },
  { nume: "Supa de legume", timpPreparare: 30, ingrediente: ["ceapă", "morcovi", "cartofi", "pătrunjel"] },
  { nume: "Pizza", timpPreparare: 60, ingrediente: ["făină", "roșii", "brânză", "ciuperci"] },
  { nume: "Tort de ciocolata", timpPreparare: 90, ingrediente: ["făină", "ciocolată", "ouă", "zahăr"] }
];

 function cautaReteta(reteta){
   for(let r of retete){
     if(r.nume.toLowerCase() == reteta.toLowerCase())
     return r;
   }
   return null;
 }

 function afiseazaReteta(){
   let reteta = prompt("Introduceti o reteta");
   let r = cautaReteta(reteta);
   if(r){
     alert(`\"${r.nume}\" se prepara in ${r.timpPreparare} minute. Ingrediente: ${r.ingrediente.join("/")}`);
   }
   else {
     alert("Nu exista reteta");
   }
 }

 afiseazaReteta();

function cautaRetete(timp){
  var reteteMax = [];
  for(let r of retete){
    if(r.timpPreparare <= timp)
    reteteMax.push(r.nume);
  }
  return reteteMax;
}

function afiseazaRetete(){
  let timp = parseInt(prompt("Introduceti un timp maxim"));
  let retete = cautaRetete(timp);
  if(retete.length > 0){
    alert(`Retetele care se prepara in maxim ${timp} minute sunt: ${retete.join(",")}`);
  }
  else {
    alert("Nu exista retete");
  }
}

 afiseazaRetete();


/*Tema 6.3*/
var sfaturiDeGatit = [
  "Întotdeauna citește rețeta complet înainte de a începe.",
  "Măsoară ingredientele cu precizie pentru cele mai bune rezultate.",
  "Gătește la foc mic pentru a evita arderea mâncării.",
  "Folosește ingrediente proaspete pentru un gust mai bun.",
  "Nu te teme să experimentezi cu condimentele!"
];

function schimbaParagraf(){
 let paragraf = document.getElementById("primul");// sau document.querySelector("#primul");
  paragraf.innerHTML = sfaturiDeGatit[Math.floor(Math.random()*sfaturiDeGatit.length)];
}
schimbaParagraf();

/*Tema 6.4*/
function schimbaTitle(){
  let nume = prompt("Cum te numesti?");
  document.querySelector("title").innerHTML = `Salut, ${nume}!`;
}

 schimbaTitle();

/*Tema 6.5 */
function schimbaImagini(){
  let imagini = document.querySelectorAll("#galerie img");
  for(let imagine of imagini){  //for(let i=0;i<imagini.length;i++)
    imagine.src = "https://media.tenor.com/7qFULBHgzlYAAAAi/bubu-cooking-dudu-bubu.gif";
    imagine.alt = "bubu gateste";
  }
}
 
schimbaImagini();

/*Tema 6.6 */
function schimbaFigcaption(){
  let texteImagini = document.querySelectorAll("#galerie figcaption");
  for(let i=0;i<texteImagini.length;i++){
    texteImagini[i].innerHTML = `Figura ${i+1}`;
  }
}
schimbaFigcaption();

/*Tema 6.7*/
function schimbaMajuscule(){
  let lista = document.querySelectorAll("#preparare li");
  for(let element of lista){
    element.style.textTransform = "uppercase";  // sau element.innerHTML = element.innerHTML.toUpperCase();
    }
}
schimbaMajuscule();

