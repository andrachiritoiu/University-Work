window.onload = function(){

  let titlu =  document.getElementById('titlu');
  let text  =  document.getElementById('post');
  let adauga = document.querySelector("button");

  adauga.onclick = function(){

    let postare = document.createElement("article");
    document.getElementById("postari").appendChild(postare);
    postare.classList.add("post");
    postare.style.backgroundColor = "lightblue";

    postare.ondblclick = function(){
      postare.remove();
    }

    let t = document.createElement("h3");
    let d = new Date();
    t.innerHTML = `${titlu.value}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

    let c = document.createElement("p");
    c.innerHTML = text.value;

    postare.appendChild(t);
    postare.appendChild(c);

  }

}
