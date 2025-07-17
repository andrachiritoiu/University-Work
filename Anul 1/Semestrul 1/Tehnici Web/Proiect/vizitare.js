window.onload = function() {
    clasa();
    rezervare();
}

function clasa(){
    const elemente = document.getElementsByClassName('hotel');
for (let i = 0; i < elemente.length; i++) {
    elemente[i].style.color = '#333333'; 
}
};

function rezervare() {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const bookingForm = document.getElementById('booking-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    bookingForm.style.display = 'none';
    thankYouMessage.style.display = 'none';

    // da
    yesBtn.addEventListener('click', function() {
        bookingForm.style.display = 'block';
        thankYouMessage.style.display = 'none';
    });

    // nu
    noBtn.addEventListener('click', function() {
        thankYouMessage.style.display = 'block';
        bookingForm.style.display = 'none';
    });

    //formularul
    const bookingFormElement = document.getElementById('booking-form');
    bookingFormElement.addEventListener('submit', function() {

        const selectedHotels = [];
        const checkboxes = document.querySelectorAll('input[name="hotel"]:checked');
        for (var i = 0; i < checkboxes.length; i++) {
            selectedHotels[i] = checkboxes[i].value;
        };

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (selectedHotels.length > 0 && startDate && endDate) {
            //verificam  daca date de inceput este inaiante de sfarsit =>obiecte Date
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Verificăm dacă data de început este înainte de data de sfârșit
            if (start > end) {
                alert('Data de început trebuie să fie înainte de data de sfârșit.');
            } else {
                alert(`Rezervare realizată! Ai ales hotelurile: ${selectedHotels.join(', ')} pentru perioada: ${startDate} - ${endDate}`);
                document.getElementById('booking-form').style.display = 'none';
            }
        } else {
            alert('Te rugăm să selectezi hotelurile și perioada.');
        }    
          
    });
};
