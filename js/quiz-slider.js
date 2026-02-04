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
    const yesNoGroups = form.querySelectorAll('.quiz__yesno');

    slideNextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const slide = document.querySelector('.swiper-slide-active');
            const isSlideValidResult = isSlideValid(slide);
            if(!isSlideValidResult) {
                // Если слайд не валиден, не переключаемся
                return;
            }
            const nextSlide = getSubquestionSlide(slide);
            const yesNoValue = getYesNoValue(slide);
            if (nextSlide && yesNoValue && yesNoValue !== 'yes') {
                toggleSlideRequired(nextSlide, false);
                quizSlider.slideTo(quizSlider.activeIndex + 2);
                return;
            }
            if (nextSlide && yesNoValue === 'yes') {
                toggleSlideRequired(nextSlide, true);
            }
            quizSlider.slideNext();
        });
    });

    slidePrevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const slide = document.querySelector('.swiper-slide-active');
            const prevSlide = slide?.previousElementSibling;
            if (prevSlide && isSubquestionSlide(prevSlide)) {
                const parentSlide = getParentSlide(prevSlide);
                const parentAnswer = parentSlide ? getYesNoValue(parentSlide) : '';
                if (parentAnswer && parentAnswer !== 'yes') {
                    quizSlider.slideTo(quizSlider.activeIndex - 2);
                    return;
                }
            }
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

function getYesNoValue(slide) {
    const input = slide?.querySelector('.quiz__yesno-input');
    return input ? input.value : '';
}

function isSubquestionSlide(slide) {
    return !!slide?.dataset?.parentId;
}

function getSubquestionSlide(slide) {
    if (!slide?.dataset?.questionId) {
        return null;
    }
    const nextSlide = slide.nextElementSibling;
    if (!nextSlide || !nextSlide.classList.contains('swiper-slide')) {
        return null;
    }
    if (nextSlide.dataset.parentId === slide.dataset.questionId) {
        return nextSlide;
    }
    return null;
}

function getParentSlide(subSlide) {
    if (!subSlide?.dataset?.parentId) {
        return null;
    }
    return form.querySelector(`.swiper-slide[data-question-id="${subSlide.dataset.parentId}"]`);
}

function toggleSlideRequired(slide, enable) {
    const inputs = slide.querySelectorAll('[data-quiz-required]');
    inputs.forEach(input => {
        if (enable) {
            input.setAttribute('required', '');
        } else {
            input.removeAttribute('required');
        }
    });
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
        input.dataset.quizRequired = '1';
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

    yesNoGroups.forEach(group => {
        const input = group.querySelector('.quiz__yesno-input');
        const buttons = group.querySelectorAll('.quiz__yesno-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.yesnoValue || '';
                input.value = value;
                buttons.forEach(btn => btn.classList.toggle('is-active', btn === button));
                const slide = group.closest('.swiper-slide');
                if (slide) {
                    updateButtonState(slide);
                    const nextSlide = getSubquestionSlide(slide);
                    if (nextSlide) {
                        toggleSlideRequired(nextSlide, value === 'yes');
                    }
                }
                document.dispatchEvent(new CustomEvent('quizYesNoChange', {
                    detail: {
                        name: input.name || '',
                        value,
                    },
                }));
            });
        });
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
