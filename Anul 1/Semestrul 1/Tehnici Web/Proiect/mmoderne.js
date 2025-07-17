window.onload=function(){
  tag();  
  quiz();
}

function tag(){
    const paragraf = document.getElementsByTagName('p');
    for (let i = 0; i < paragraf.length; i++) {
        paragraf[i].style.color = ' #333333'; 
    }
};

function quiz(){
  document.getElementById("submit-btn").addEventListener('click',function(){
    const questions=document.querySelectorAll('fieldset');
    let score=0;

    for(var i=0;i<questions.length;i++){
    const question=questions[i];
    //verif daca butonul este selectat sau nu
    const selected=question.querySelector('input[type="radio"]:checked')
    if(selected && selected.value == '1'){
      score++;
     }
    }
    const resultDiv=document.getElementById('result');
    resultDiv.textContent='Ai obtinut '+score+' din '+ questions.length +' puncte!';
  });
};

function svg(){
  //înlocuire pentru toate h2 cu SVG-uri animate
  document.addEventListener("DOMContentLoaded", function() {
     var h2Elements = document.querySelectorAll("h2");
     for (var i = 0; i < h2Elements.length; i++) {
       var h2 = h2Elements[i];
       var text = h2.textContent;
       var svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="500" height="50" viewBox="0 0 500 50">
          <text x="0" y="30" font-family="Tahoma" font-size="24" fill="#333">
            <animate attributeName="x" from="0" to="500" dur="10s" repeatCount="indefinite" keyTimes="0;1" keySplines="0.42 0 0.58 1" />
            ${text}
          </text>
        </svg>`;
       var div = document.createElement("div");
       div.innerHTML = svg;
       h2.replaceWith(div);
     }
   });
};
svg();