/*
	Лёгкий модальный helper без зависимостей.
	Заменяет SweetAlert2 в нашем проекте, сохраняя совместимость по API там,
	где это нужно (fire, close, showValidationMessage) и классы, которые уже используются в коде.

	Почему так:
	- Отказались от зависимости sweetalert2, но текущий код опирается на вызовы Swal.fire/close и
	  выборку по классам вроде .swal2-html-container. Мы сохраняем эти контракты.
	- Реализация простая, модульная и с понятными комментариями.

	Поддерживаемые опции (минимально необходимые для нашего кода):
	- title (string)
	- text (string)
	- html (string) — приоритетнее text
	- icon (string) и iconColor (string) — отображаются как простой маркер (иконка-эмодзи) и цвет
	- backdrop (string) — фон подложки
	- width (number|string) — ширина попапа
	- padding (string|number)
	- showCloseButton (bool), closeButtonHtml (string)
	- showConfirmButton (bool), confirmButtonColor (string)
	- allowOutsideClick (bool, default true)
	- allowEscapeKey (bool, default true)
	- showClass/hideClass: { popup: 'className' } — если переданы, просто добавляем/заменяем класс

	Несовместимые/неиспользуемые опции игнорируются (без ошибок).
*/

let currentModal = null;
let currentValidationEl = null;
let currentOptions = {};

function createElement(tag, className, styles = {}){
	const el = document.createElement(tag);
	if(className){ el.className = className; }
	Object.assign(el.style, styles);
	return el;
}

function applyPopupAnimations(popup, container, showClass){
	if(showClass && showClass.popup){
		popup.classList.add(...showClass.popup.split(/\s+/).filter(Boolean));
	}
}

function removeWithHide(popup, container, hideClass){
	if(hideClass && hideClass.popup){
		popup.classList.add(...hideClass.popup.split(/\s+/).filter(Boolean));
		// Простая задержка под анимацию (если есть). 250мс — безопасно и быстро.
		setTimeout(() => {
			container.remove();
		}, 250);
	}else{
		container.remove();
	}
}

function normalizeWidth(width){
	if(width === undefined || width === null) return '';
	if(typeof width === 'number') return width + 'px';
	return String(width);
}

function fire(options = {}){
	// Закрываем предыдущий модал, если он открыт
	if(currentModal){ close(); }
	currentOptions = options || {};

	const {
		title,
		text,
		html,
		icon,
		iconColor,
		backdrop = 'rgba(0,0,0,0.7)',
		width,
		padding = '20px',
		showCloseButton = false,
		closeButtonHtml = '&times;',
		showConfirmButton = false,
		confirmButtonColor = '#05141f',
		allowOutsideClick = true,
		allowEscapeKey = true,
		showClass,
		hideClass
	} = options;

	// Контейнер-подложка
	const container = createElement('div', 'swal2-container', {
		position: 'fixed',
		inset: '0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: backdrop,
		zIndex: '10000',
		padding: '10px'
	});

	// Попап
	const popup = createElement('div', 'swal2-popup', {
		position: 'relative',
		background: '#fff',
		color: '#05141f',
		borderRadius: '10px',
		width: normalizeWidth(width) || 'auto',
		maxWidth: '90vw',
		boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
		padding: typeof padding === 'number' ? padding + 'px' : String(padding)
	});

	// Иконка (минимальная поддержка)
	if(icon){
		const iconEl = createElement('div', 'swal2-icon', {
			fontSize: '28px',
			lineHeight: '1',
			marginBottom: '10px',
			color: iconColor || '#f3c300'
		});
		// Простая замена типов иконок на эмодзи, чтобы было видно статус
		const icons = {
			success: '✔️',
			error: '❌',
			warning: '⚠️',
			info: 'ℹ️',
			question: '❓'
		};
		iconEl.textContent = icons[icon] || 'ℹ️';
		popup.appendChild(iconEl);
	}

	// Кнопка закрытия
	if(showCloseButton){
		const closeBtn = createElement('button', 'swal2-close', {
			position: 'absolute',
			top: '8px',
			right: '10px',
			border: 'none',
			background: 'transparent',
			fontSize: '28px',
			cursor: 'pointer',
			lineHeight: '1'
		});
		closeBtn.innerHTML = closeButtonHtml || '&times;';
		closeBtn.addEventListener('click', () => close());
		popup.appendChild(closeBtn);
	}

	// Заголовок
	if(title){
		const titleEl = createElement('h2', 'swal2-title', {
			margin: '0 0 10px',
			fontSize: '20px',
			fontWeight: '700'
		});
		titleEl.innerHTML = String(title);
		popup.appendChild(titleEl);
	}

	// Контент: предпочтение html, затем text
	const htmlContainer = createElement('div', 'swal2-html-container', {
		marginTop: title ? '5px' : '0'
	});
	if(html){
		htmlContainer.innerHTML = String(html);
	}else if(text){
		htmlContainer.textContent = String(text);
	}
	popup.appendChild(htmlContainer);

	// Блок для сообщений валидации (нужен для showValidationMessage)
	const validationEl = createElement('div', 'swal2-validation-message', {
		display: 'none',
		color: '#eA0029',
		marginTop: '12px'
	});
	popup.appendChild(validationEl);
	currentValidationEl = validationEl;

	// Кнопка подтверждения (минимально)
	if(showConfirmButton){
		const confirmBtn = createElement('button', 'swal2-confirm btn', {
			marginTop: '16px',
			background: confirmButtonColor,
			border: 'none',
			color: '#fff',
			cursor: 'pointer',
			borderRadius: '4px',
			padding: '10px 16px'
		});
		confirmBtn.textContent = 'OK';
		confirmBtn.addEventListener('click', () => close());
		popup.appendChild(confirmBtn);
	}

	container.appendChild(popup);
	applyPopupAnimations(popup, container, showClass);
	
	// Обработка клика по подложке
	container.addEventListener('click', (e) => {
		if(!allowOutsideClick) return;
		if(e.target === container){
			close();
		}
	});

	// Обработка Escape
	const onKeyDown = (e) => {
		if(!allowEscapeKey) return;
		if(e.key === 'Escape'){
			close();
		}
	};
	document.addEventListener('keydown', onKeyDown, { once: true });

	document.body.appendChild(container);
	currentModal = { container, popup, hideClass, onKeyDown };
}

function close(){
	if(!currentModal) return;
	const { container, popup, hideClass, onKeyDown } = currentModal;
	document.removeEventListener('keydown', onKeyDown, { once: true });
	removeWithHide(popup, container, hideClass);
	currentModal = null;
	currentValidationEl = null;
	currentOptions = {};
}

function showValidationMessage(message){
	if(!currentValidationEl) return;
	currentValidationEl.textContent = String(message || '');
	currentValidationEl.style.display = message ? 'block' : 'none';
}

const Swal = { fire, close, showValidationMessage };
export default Swal;
