window.onload=function(){
    logare();
    contact();
};

function logare(){
// selectăm elementele din DOM
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const logoutButton = document.getElementById('logout-btn');
const errorMessage = document.getElementById('error-message');
const welcomeSection = document.getElementById('welcome-section');
const userNameDisplay = document.getElementById('user-name');

//pentru a afișa un mesaj de eroare sau informație
function displayMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = message ? 'block' : 'none';
}

// verificăm dacă există un utilizator logat
function checkLoggedInUser() {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser) {
        loginForm.style.display = 'none';
        welcomeSection.style.display = 'block';
        userNameDisplay.textContent = loggedUser;
    } else {
        loginForm.style.display = 'block';
        welcomeSection.style.display = 'none';
    }
}

// logarea unui utilizator
loginButton.addEventListener('click', function() {
    //trim=elimina spatiile albe
    const username = usernameInput.value.trim();

    if (!username) {
        displayMessage('Introduceți un nume de utilizator.');
        return;
    }

    const loggedUser = localStorage.getItem('loggedUser');

    if (loggedUser) {
        displayMessage(`${loggedUser} este deja logat.`);
    } else {
        localStorage.setItem('loggedUser', username);
        displayMessage(`${username} a fost logat cu succes.`);
        checkLoggedInUser();
    }
});

// logout-ul utilizatorului
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('loggedUser');
    usernameInput.value = '';
    passwordInput.value = '';
    displayMessage('Utilizatorul a fost delogat.');
    checkLoggedInUser();
});
// inițializare
checkLoggedInUser();
};

function validare() {
    const name = document.getElementById("name").value;
    const nameRegex = /^[A-Za-z\s]+$/;
    //test()=metoda care verifica daca un sir de caractere se potriveste cu o expresie regulata
    if (!nameRegex.test(name)) {
        alert("Numele trebuie să conțină doar litere și spații.");
        return false; 
    }

    const email = document.getElementById("email").value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Te rog introdu o adresă de email validă.");
        return false; 
    }

    const subject = document.getElementById("subject").value;
    if (subject.trim() === "") {
        alert("Te rog introdu un subiect.");
        return false; 
    }

    const comment = document.getElementById("comment").value;
    if (comment.trim() === "") {
        alert("Te rog scrie un comentariu.");
        return false; 
    }

    return true; 
}

function contact(){
 if (localStorage.getItem("contactData")) {
      const contactData = JSON.parse(localStorage.getItem("contactData"));
      document.getElementById("name").value = contactData.name;
      document.getElementById("email").value = contactData.email;
      document.getElementById("subject").value = contactData.subject;
      document.getElementById("comment").value = contactData.comment;
    }
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function(event) {
      event.preventDefault();//previne submit-ul
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const comment = document.getElementById("comment").value;

      // creăm un obiect cu datele din formular
      if (validare()){
      const contactData = {
        name: name,
        email: email,
        subject: subject,
        comment: comment
      };
      localStorage.setItem("contactData", JSON.stringify(contactData));
      alert("Datele au fost trimise!");
      form.reset();
     }
    });
};




