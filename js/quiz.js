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
const form = document.querySelector('.quiz__form');

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

ratingContainers.forEach(container => {
    const questionId = container.dataset.question;
    const stars = container.querySelectorAll('.star');
    const ratingNumber = container.querySelector('.rating-number');
    const ratingInput = form.querySelector(`input[data-question="${questionId}"]`);
    const slide = container.closest('.swiper-slide');
    const nextBtn = slide.querySelector('[data-js-slide-next-btn]');

    stars.forEach((star) => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            const value = parseInt(star.dataset.value);
            ratingInput.value = value;
            updateStarDisplay(stars, value, ratingNumber);
            
            // Проверяем required поля и обновляем кнопку
            checkAndUpdateButton(nextBtn, ratingInput);
        });

        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.dataset.value);
            highlightStars(stars, value);
        });
    });

    container.addEventListener('mouseleave', () => {
        if (!ratingInput.value) {
            clearStarHighlight(stars);
        } else {
            updateStarDisplay(stars, parseInt(ratingInput.value), ratingNumber);
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

// Отслеживание всех required полей
function checkAndUpdateButton(button, input) {
    if (button && input) {
        if (input.value && input.value.trim() !== '') {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', '');
        }
    }
}

// Инициализация - добавляем слушатели на все required поля
const requiredInputs = form.querySelectorAll('[required]');
requiredInputs.forEach(input => {
    input.addEventListener('change', () => {
        // Проверяем все слайды и обновляем их кнопки
        document.querySelectorAll('.swiper-slide').forEach(slide => {
            const button = slide.querySelector('[data-js-slide-next-btn], button[type="submit"]');
            if (button) {
                const requiredInSlide = slide.querySelectorAll('[required]');
                let allFilled = true;
                
                requiredInSlide.forEach(req => {
                    if (req.type === 'hidden') {
                        if (!req.value || req.value.trim() === '') {
                            allFilled = false;
                        }
                    } else if (req.type === 'checkbox') {
                        if (!req.checked) {
                            allFilled = false;
                        }
                    } else {
                        if (!req.value || req.value.trim() === '') {
                            allFilled = false;
                        }
                    }
                });
                
                if (allFilled) {
                    button.removeAttribute('disabled');
                } else {
                    button.setAttribute('disabled', '');
                }
            }
        });
    });
});

// Инициальная проверка кнопок при загрузке
document.querySelectorAll('.quiz__form--card').forEach(slide => {
    const button = slide.querySelector('[data-js-slide-next-btn], button[type="submit"]');
    if (button) {
        const requiredInSlide = slide.querySelectorAll('[required]');
        let allFilled = true;
        
        requiredInSlide.forEach(req => {
            if (req.type === 'hidden') {
                if (!req.value || req.value.trim() === '') {
                    allFilled = false;
                }
            } else if (req.type === 'checkbox') {
                if (!req.checked) {
                    allFilled = false;
                }
            } else {
                if (!req.value || req.value.trim() === '') {
                    allFilled = false;
                }
            }
        });
        
        if (!allFilled) {
            button.setAttribute('disabled', '');
        }
    }
});