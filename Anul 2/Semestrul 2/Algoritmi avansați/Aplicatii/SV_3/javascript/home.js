window.onload = function () {
    lessonTitles = document.getElementsByClassName("lessonTitle");
    lessonTitles[0].addEventListener("click", function () {
        window.location.href = 'acoperire-convexa.html';
    })
    lessonTitles[1].addEventListener("click", function () {
        window.location.href = 'dualitate.html';
    })
    lessonTitles[2].addEventListener("click", function () {
        window.location.href = 'triangulare-poligoane.html';
    })
    lessonTitles[3].addEventListener("click", function () {
        window.location.href = 'harta-trapezoidala.html';
    })

    for (let i = 0; i < 4; i++) {
        lessonTitles[i].addEventListener("mouseover", function () {
            for (let j = 0; j < 4; j++) {
                if (j != i) {
                    lessonTitles[j].style.color = "grey";
                }
            }
        });
        lessonTitles[i].addEventListener("mouseout", function () {
            for (let j = 0; j < 4; j++) {
                lessonTitles[j].style.color = "black";
            }
        });
    }
}
