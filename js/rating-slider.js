// Rating Slider Component
class RatingSlider {
    constructor(container) {
        this.container = container;
        this.hiddenInput = container.querySelector('.rating-slider__input');
        this.trackFill = container.querySelector('.rating-slider__track-fill');
        this.thumb = container.querySelector('.rating-slider__thumb');
        this.tooltip = container.querySelector('.rating-slider__tooltip');
        this.tooltipValue = container.querySelector('.rating-slider__tooltip-value');
        this.currentValue = container.querySelector('.rating-slider__current-value');
        this.wrapper = container.querySelector('.rating-slider__wrapper');
        this.currentRating = 0;
        this.isDragging = false;

        this.parent = container.closest('.quiz__form--card');
        this.nextButton = this.parent ? this.parent.querySelector('[data-js-slide-next-btn]') : null;
        this.labels = container.querySelectorAll('.rating-slider__label');
        
        // Bind методы для возможности удаления обработчиков
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.init();
    }
    
    // Получить цвет на основе оценки (0-10) - градиент красный->желтый->зеленый
    getColorForRating(value) {
        // Используем HSL где Hue меняется от 0° (красный) через 60° (желтый) к 120° (зеленый)
        // Saturation и Lightness подбираем для насыщенности цветов
        const hue = (value / 10) * 120; // 0-120 degrees
        const saturation = 100; // 100% для ярких цветов
        const lightness = Math.max(40, 50 - (value * 2)); // Красный по умолчанию при 0, темнее при выборе
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    
    init() {
        if (!this.wrapper) return;

        this.labels.forEach((label, index) => {
            label.style.left = `${(index / 10) * 100}%`;
        });
        
        // Обработка начала перетаскивания мышью
        this.wrapper.addEventListener('mousedown', (e) => {
            this.startDragging();
            this.handleClick(e);
            // Добавляем обработчики на document только во время drag
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        });
        
        // Touch события для мобильных
        this.wrapper.addEventListener('touchstart', (e) => {
            this.startDragging();
            this.handleTouch(e);
            // Добавляем обработчики на document только во время drag
            document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
            document.addEventListener('touchend', this.handleTouchEnd);
        });
        
        // Показ tooltip при наведении
        this.wrapper.addEventListener('mouseenter', () => {
            if (this.currentRating > 0) {
                this.wrapper.classList.add('is-active');
            }
        });
        
        this.wrapper.addEventListener('mouseleave', () => {
            if (!this.isDragging) {
                this.wrapper.classList.remove('is-active');
            }
        });
        
        // Инициализация начального состояния
        this.updateValue(0);
    }
    
    startDragging() {
        this.isDragging = true;
        this.wrapper.classList.add('is-active');
        this.thumb.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }
    
    stopDragging() {
        this.isDragging = false;
        this.wrapper.classList.remove('is-active');
        this.thumb.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            this.handleClick(e);
        }
    }
    
    handleMouseUp() {
        if (this.isDragging) {
            this.stopDragging();
            // Удаляем обработчики после окончания drag
            document.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('mouseup', this.handleMouseUp);
        }
    }
    
    handleTouchMove(e) {
        if (this.isDragging) {
            e.preventDefault(); // Предотвращаем скролл во время drag
            this.handleTouch(e);
        }
    }
    
    handleTouchEnd() {
        if (this.isDragging) {
            this.stopDragging();
            // Удаляем обработчики после окончания drag
            document.removeEventListener('touchmove', this.handleTouchMove);
            document.removeEventListener('touchend', this.handleTouchEnd);
        }
    }
    
    handleClick(e) {
        const trackRect = this.trackFill.parentElement.getBoundingClientRect();
        const trackOffsetX = e.clientX - trackRect.left;
        const percentage = Math.max(0, Math.min(100, (trackOffsetX / trackRect.width) * 100));
        const value = Math.round((percentage / 100) * 10);
        
        this.updateValue(value);
    }
    
    handleTouch(e) {
        const touch = e.touches[0];
        const trackRect = this.trackFill.parentElement.getBoundingClientRect();
        const trackOffsetX = touch.clientX - trackRect.left;
        const percentage = Math.max(0, Math.min(100, (trackOffsetX / trackRect.width) * 100));
        const value = Math.round((percentage / 100) * 10);
        
        this.updateValue(value);
    }
    
    updateValue(value) {
        this.currentRating = value;
        
        // Обновляем значение в hidden input
        this.hiddenInput.value = value;
        
        // Trigger change event для интеграции с формами (например, quiz.js)
        this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Получаем цвет на основе оценки
        const ratingColor = this.getColorForRating(value);
        
        // Обновляем отображаемое значение и его цвет
        this.tooltipValue.textContent = value;
        this.currentValue.textContent = value;
        this.currentValue.style.color = ratingColor;
        this.tooltipValue.style.color = ratingColor;
        this.thumb.style.borderColor = ratingColor;
        
        // Обновляем заполнение трека (0-100%) и его цвет
        const percentage = (value / 10) * 100;
        this.trackFill.style.width = `${percentage}%`;
        this.trackFill.style.backgroundColor = ratingColor;
        this.trackFill.setAttribute('data-color', percentage);
        
        // Позиционируем thumb (кружок)
        this.thumb.style.left = `${percentage}%`;
        
        // Обработка tooltip в зависимости от значения
        if (value === 0) {
            this.wrapper.classList.remove('is-active');

            this.tooltip.classList.remove('right');
            this.tooltip.classList.add('left');
            this.tooltip.style.left = `calc(${percentage}% + 30px)`;

            this.nextButton ? this.nextButton.setAttribute('disabled', '') : null;
        } else {
            this.nextButton ? this.nextButton.removeAttribute('disabled') : null;
            this.wrapper.classList.remove('is-active');
            
            // Позиционируем tooltip с правильным сдвигом
            if (value === 10) {
                // Для значения 10, сдвигаем влево чтобы не выходил за границы
                this.tooltip.classList.remove('left');
                this.tooltip.classList.add('right');
                this.tooltip.style.left = `calc(${percentage}% - 30px)`;
            } else {
                // Для остальных значений, центрируем относительно thumb
                this.tooltip.classList.remove('right');
                this.tooltip.classList.remove('left');
                this.tooltip.style.left = `${percentage}%`;
            }
        }
        
        // Dispatch custom event для интеграции с формами
        this.container.dispatchEvent(new CustomEvent('ratingChange', {
            detail: { name: this.hiddenInput.name, value: value },
            bubbles: true
        }));
    }
    
    // Метод для очистки (если нужно удалить компонент)
    destroy() {
        // Удаляем все обработчики событий с document (на случай если остались)
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        
        // Можно добавить удаление обработчиков с wrapper, если нужно
        // но обычно это не требуется, т.к. при удалении DOM элемента они очищаются автоматически
    }
}

// Экспорт для возможности использования в других модулях
export default RatingSlider;
