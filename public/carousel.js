let currentIndex = 0; 


function updateCarousel() {
    const items = document.querySelectorAll(".carousel-item");
    const carouselContainer = document.querySelector(".carousel-container");

   
    carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

    items.forEach((item, index) => {
        item.style.display = (index === currentIndex) ? "block" : "none";
    });
}


function nextSlide() {
    const items = document.querySelectorAll(".carousel-item");
    if (currentIndex < items.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}


function prevSlide() {
    const items = document.querySelectorAll(".carousel-item");
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = items.length - 1;
    }
    updateCarousel();
}


updateCarousel();
