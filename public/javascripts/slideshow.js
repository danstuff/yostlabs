var slideIndex = 0;
showSlide(slideIndex);

// Next/previous controls
function plusSlide(n) {
    showSlide(slideIndex += n);
}

function showSlide(n) {
    var i;
    var slides = document.getElementsByClassName("slide");

    if (n > slides.length-1) { slideIndex = 0 }
    if (n < 0) { slideIndex = slides.length-1 }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
} 
