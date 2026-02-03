import Swiper from "swiper";
import RatingSlider from './rating-slider';

const ratingSliders = document.querySelectorAll('.rating-slider__container');

if(ratingSliders.length > 0) {
    ratingSliders.forEach(slider => {
        new RatingSlider(slider);
    });
}

const quizSliderElement = document.querySelector(".quiz__form--slider");
const form = document.querySelector('.quiz__form');

if (quizSliderElement && form) {
    const quizSlider = new Swiper(quizSliderElement, {
        autoHeight: true,
        slidesPerView: 1,
        spaceBetween: 30,
        allowTouchMove: false,
    });

    const slideNextBtns = document.querySelectorAll('[data-js-slide-next-btn]');
    const slidePrevBtns = document.querySelectorAll('[data-js-slide-prev-btn]');

    slideNextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const slide = document.querySelector('.swiper-slide-active');
            const isSlideValidResult = isSlideValid(slide);
            if(!isSlideValidResult) {
                // Если слайд не валиден, не переключаемся
                return;
            }
            quizSlider.slideNext();
        });
    });

    slidePrevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            quizSlider.slidePrev();
        });
    });

// Функция для проверки заполненности required полей в слайде
function isSlideValid(slide) {
    const requiredInSlide = slide.querySelectorAll('[required]');
    let allFilled = true;
    
    requiredInSlide.forEach(req => {
        if (req.type === 'hidden') {
            // Для hidden полей проверяем что значение больше 0 (для рейтингов)
            if (!req.value || req.value === '0' || req.value.trim() === '') {
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
    
    return allFilled;
}

// Функция для обновления состояния кнопки конкретного слайда
function updateButtonState(slide) {
    const button = slide.querySelector('[data-js-slide-next-btn]');
    if (button) {
        if (isSlideValid(slide)) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', '');
        }
    }
}

// Добавляем слушатели на все required поля
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        // Используем 'input' для текстовых полей и 'change' для всех
        const eventType = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(eventType, () => {
            // Находим родительский слайд и обновляем только его кнопку
            const slide = input.closest('.swiper-slide');
            if (slide) {
                updateButtonState(slide);
            }
        });
        
        // Для чекбоксов добавляем дополнительный слушатель на клик для мгновенного отклика
        if (input.type === 'checkbox') {
            input.addEventListener('click', () => {
                const slide = input.closest('.swiper-slide');
                if (slide) {
                    updateButtonState(slide);
                }
            });
        }
    });

    // Обновляем состояние кнопок при смене слайда
    quizSlider.on('slideChange', () => {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            updateButtonState(activeSlide);
        }
    });

    // Инициальная проверка кнопок при загрузке
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        updateButtonState(slide);
    });
}
