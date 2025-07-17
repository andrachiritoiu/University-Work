window.onload = function(){
 bunvenit();
 tabel();
 schimbare();
 adaugare();
 background();
 stergere();
 tag();
 canvas();
}

//bun venit
function bunvenit() {
    const popup = document.getElementById('welcome-popup');
    const popupMessage = popup.textContent;

    // verifică dacă textul popup conține cuvântul "welcome"
    if (popupMessage.includes('venit')) {
        console.log('Popup-ul conține cuvântul "venit"');
    }

    if (!sessionStorage.getItem('popupShown')) {
    popup.style.display = 'flex';

    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none'; 
        sessionStorage.setItem('popupShown', 'true');
    });
 }
};

//tabelul-mouse
function tabel () {
    var colors = ['rgb(243, 225, 213)', ' #C70039', 'rgba(241, 193, 184, 0.85)', 'rgba(173, 34, 161, 0.34)'];
    var tableRows = document.querySelectorAll('table tr');
    //fiecare rand
    for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        row.addEventListener('mouseover', function () {
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            var cells = this.querySelectorAll('td, th');
            //fiecare celula
            for (var j = 0; j < cells.length; j++) {
                cells[j].style.color = randomColor; 
            }
        });
        row.addEventListener('mouseout', function () {
            var cells = this.querySelectorAll('td, th');
            for (var j = 0; j < cells.length; j++) {
                cells[j].style.color = ''; // resetare la valoarea implicita
            }
        });
    }
};

//tastura
function schimbare(){
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // toate elementele cu clasa "modif"
        let titluri = document.querySelectorAll("#modif");
        for (let i = 0; i < titluri.length; i++) {
            titluri[i].style.color = "#FF9966"; 
        }
    }
});
};


//fundalul
function background(){
setTimeout(function() {
    document.body.style.backgroundColor = "#FFFFCC"; 
}, 4000); 
};

//bara progres-computedStyle
window.onscroll = function() {
    var scrollTop = window.scrollY; // poziția de derulare pe verticală
    var docHeight = document.body.scrollHeight - window.innerHeight; // înălțimea documentului-înălțimea vizibilă(w3)
    var scrollPercentage = (scrollTop / docHeight) * 100; // procentul de derulare
    var progressBar = document.getElementById("progress-bar");

    //stilurile calculate ale progress-bar-ului
    var computedStyle = window.getComputedStyle(progressBar);
    
    // actualizăm lățimea progress-bar-ului
    progressBar.style.width = scrollPercentage + "%";
};



//creare, adaugare
function adaugare() {
    const button1 = document.getElementById('add-text1');
    button1.addEventListener('click', function() {
        const textNode1 = document.createTextNode("Marea Piramidă din Giza (Egipt), Grădinile Suspendate ale Babilonului (Irak), Statua lui Zeus din Olympia (Grecia), Templul zeiței Artemis din Efes (Turcia), Mausoleul din Halicarnas (Turcia), Colosul din Rodos (Grecia), Farul din Alexandria (Egipt)");
        const container1 = document.getElementById('container1');
        container1.appendChild(textNode1);
    });
    
    const button2 = document.getElementById('add-text2');
    button2.addEventListener('click', function() {
        const textNode2 = document.createTextNode("Marea Zidul din China (China), Machu Picchu (Peru), Chichen Itza (Mexic), Colosseum (Italia), Taj Mahal (India), Petra (Iordania),  Statuiea lui Iisus Hristos(Brazilia)");  
        const container2 = document.getElementById('container2');
        container2.appendChild(textNode2);
    });
};

//stergere
function stergere(){
const button = document.getElementById('delete-button');
button.addEventListener('click', function() {
    const article = document.getElementById('travel-article');
    article.remove(); 
    button.style.display = 'none'; 
});
};

function tag(){
const paragraf = document.getElementsByTagName('p');
for (let i = 0; i < paragraf.length; i++) {
    paragraf[i].style.color = ' #333333'; 
}
};

//canvas
function canvas() {
    const images = [
        { id: "image1", canvasId: "myCanvas1" },
        { id: "image2", canvasId: "myCanvas2" }
    ];

    for (let i = 0; i < images.length; i++) {
        const img = document.getElementById(images[i].id); 
        const canvas = document.getElementById(images[i].canvasId); 
        const ctx = canvas.getContext("2d");

        // verificăm dacă imaginea este deja încărcată
        if (img.complete) {
            // redimensionăm imaginea pentru a se potrivi în canvas
            const scaleWidth = canvas.width;
            const scaleHeight = (img.height / img.width) * canvas.width; // păstrăm proporțiile imaginii
            ctx.drawImage(img, 0, 0, scaleWidth, scaleHeight); // desenează imaginea 
        } else {
            img.onload = function() {
                const scaleWidth = canvas.width;
                const scaleHeight = (img.height / img.width) * canvas.width; 
                ctx.drawImage(img, 0, 0, scaleWidth, scaleHeight); 
            };
        }
    }
};

//stopPropgation
//classList=adaugare,target=ev declansator,currentTarget=ev pe care este atasat listener
function modifyTextProperties(event) {
    // Oprim propagarea evenimentului
    event.stopPropagation();

    //div-ul părinte
    const parentDiv = event.currentTarget;
    // butonul pe care s-a făcut clic
    const clickedButton = event.target;
    console.log("Butonul apăsat:", clickedButton.textContent);

    // adaugă o clasă
    parentDiv.classList.add('modified-text');
    alert("Ai apăsat butonul: " + clickedButton.textContent);
}
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('#container');

    container.addEventListener('click', function(event) {
        // verif dacă elementul este un buton
        if (event.target && event.target.tagName === 'BUTTON') {
            modifyTextProperties(event);
        }
    });
});


// folosim fetch pentru a prelua fișierul JSON
fetch('minuni.json')
    .then(function(response) {
        if (!response.ok) {
            alert('A apărut o problemă la preluarea datelor. Te rugăm să încerci din nou mai târziu.');
            return;
        }
        return response.json(); // parsează răspunsul JSON
    })
    .then(function(data) {
        var container = document.getElementById('wonders-container');
        container.innerHTML = ''; 

        var ancientTitle = document.createElement('h2');
        ancientTitle.textContent = 'Minunile lumii antice';
        container.appendChild(ancientTitle);

        var ancientList = document.createElement('div');
        ancientList.classList.add('ancient-wonders');
        for (var i = 0; i < data.ancient.length; i++){
            var minune = data.ancient[i];
            var divMinune = document.createElement('div');
            divMinune.classList.add('wonder');

            var h3 = document.createElement('h3');
            h3.textContent = minune.name;

            var p = document.createElement('p');
            p.textContent = minune.description;

            divMinune.appendChild(h3);
            divMinune.appendChild(p);
            ancientList.appendChild(divMinune);
        };
        container.appendChild(ancientList);

        var modernTitle = document.createElement('h2');
        modernTitle.textContent = 'Minunile lumii moderne';
        container.appendChild(modernTitle);

        var modernList = document.createElement('div');
        modernList.classList.add('modern-wonders');
        for (var i = 0; i < data.modern.length; i++) {
            var minune = data.modern[i];
            var divMinune = document.createElement('div');
            divMinune.classList.add('wonder');

            var h3 = document.createElement('h3');
            h3.textContent = minune.name;

            var p = document.createElement('p');
            p.textContent = minune.description;

            divMinune.appendChild(h3);
            divMinune.appendChild(p);
            modernList.appendChild(divMinune);
        };
        container.appendChild(modernList);
    })
    .catch(function(error) {
        console.error('A apărut o eroare:', error);
    });

