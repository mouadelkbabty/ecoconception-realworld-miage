const carousel = document.querySelector('.carousel-slides');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentIndex = 0;

// Function to update the slide position
function updateCarousel() {
  const offset = -currentIndex * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

// Show next slide
nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

// Show previous slide
prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});
