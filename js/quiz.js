import Swiper from "swiper";
import 'swiper/css';

const quizSlider = new Swiper(".quiz__form--slider", {
    autoHeight: true,
    slidesPerView: 1,
    spaceBetween: 30,
    allowTouchMove: false,
});

const slideNextBtns = document.querySelectorAll('[data-js-slide-next-btn]');
const slidePrevBtns = document.querySelectorAll('[data-js-slide-prev-btn]');

slideNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        quizSlider.slideNext();
    });
});

slidePrevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        quizSlider.slidePrev();
    });
});

// Рейтинг система
const ratingContainers = document.querySelectorAll('.quiz__rating');
const ratings = {};

ratingContainers.forEach(container => {
    const questionId = container.dataset.question;
    const stars = container.querySelectorAll('.star');
    const ratingNumber = container.querySelector('.rating-number');
    
    ratings[questionId] = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            const value = parseInt(star.dataset.value);
            ratings[questionId] = value;
            updateStarDisplay(stars, value, ratingNumber);
        });

        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.dataset.value);
            highlightStars(stars, value);
        });
    });

    container.addEventListener('mouseleave', () => {
        if (ratings[questionId] === 0) {
            clearStarHighlight(stars);
        } else {
            updateStarDisplay(stars, ratings[questionId], ratingNumber);
        }
    });
});

function highlightStars(stars, value) {
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('hovered');
        } else {
            star.classList.remove('hovered');
        }
    });
}

function clearStarHighlight(stars) {
    stars.forEach(star => {
        star.classList.remove('hovered');
        star.classList.remove('active');
    });
}

function updateStarDisplay(stars, value, ratingNumber) {
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('active');
            star.classList.remove('hovered');
        } else {
            star.classList.remove('active');
            star.classList.remove('hovered');
        }
    });
    ratingNumber.textContent = value;
}

// Экспортируем рейтинги для отправки формы
window.getQuizRatings = () => ratings;