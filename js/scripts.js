// import Alpine from 'alpinejs'

window.Alpine = Alpine;

document.addEventListener('alpine:init', (data) => {
	Alpine.data('places', () => ({

		classified:  {
			avito: '/img/icons/avito-logo.svg',
			avtoru: '/img/icons/avtoRu-logo.svg',
			drom: '/img/icons/drom-logo.svg',
		},

		activeShop: '',

		existShop(attr) {
			var show = false;
			placemarks.forEach((obj) => {
				console.log(attr,obj[attr]);
				if(obj[attr] != "") show = true;
			})
			return show;
		}

	}))
	// console.log('alpine:init');
})

document.addEventListener('alpine:initialized', () => {
	// console.log('alpine initialized');
})

// Alpine.start();

document.addEventListener('DOMContentLoaded', () => {

	const delears = document.querySelectorAll('.dealer-link');
	const reviews = document.querySelectorAll('.add-review__link');
	const map = document.querySelector('.map');
	const mapBlock = document.querySelector('.map-block');
	const yandexMap = document.querySelector('#map');

	const links = document.querySelectorAll('.classified__link');
	const sublist = document.querySelector('.classified__sublist');
	const sublinks = document.querySelectorAll('.classified__sublink');

	let clicked = false;
	let attr = '';


	function slideUp(container){

		container.style.height = '0px';
		container.addEventListener('transitionend', function () {
			container.classList.remove('active');
		}, {
			once: true
		});
	}

	function slideDown(container, withMap = true){

		container.addEventListener('transitionend', function () {
			container.classList.add('active');
		});
		if(withMap){
			setTimeout( () => {
				container.style.height = container.scrollHeight + 'px';
				container.closest('#map').style.height = container.scrollHeight + 'px';
			}, 300);
		}
	}

	function scrollSmooth(selector){
		setTimeout( ()=>{
			document.querySelector(selector).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 300 );
	}

	function setClassifiedAttrValue() {
		if(document.querySelector('.classified__link.active'))
			if(document.querySelector('.classified__sublink.active'))
				return document.querySelector('.classified__link.active').getAttribute('data-source') + document.querySelector('.classified__sublink.active').getAttribute('data-source')
		return "";
	}

	if(reviews) reviews.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			attr = el.getAttribute('data-source');
			// add_screenshot = document.querySelector('.add-screenshot');

			mapBlock.style.height = '0px';
			// if(add_screenshot) add_screenshot.style.height = '0px';

			if ( el.classList.contains('active') ) {

				el.classList.remove('active');
				// if(add_screenshot) add_screenshot.classList.remove('active');

				mapBlock.addEventListener('transitionend', function () {
					map.style.height = 0;
				}, {
					once: true
				});

			} else {

				reviews.forEach( (elem) => {
					elem.classList.remove('active');
					// if(add_screenshot) add_screenshot.classList.remove('active');
				});
				el.classList.add('active');
				// setTimeout(()=>{
				// 	if(add_screenshot) add_screenshot.classList.add('active');
				// }, 300)

				setTimeout(() => {
					if (!clicked) {
						ymaps.ready(init);
					}
					map.style.height = (mapBlock.clientWidth + 30) + 'px';
					yandexMap.style.height = (mapBlock.clientWidth + 30) + 'px';
					mapBlock.style.height = (mapBlock.clientWidth + 30) + 'px';
					scrollSmooth('.add-review');
					clicked = true;
				}, 300)
				// setTimeout(()=>{
				// 	if(add_screenshot) add_screenshot.style.height = 'auto';
				// }, 300)
			}

		});
	});

	if(links) links.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			if ( el.classList.contains('active') ) return;

			mapBlock.style.height = '0px';

			map.style.height = 0;

			// slideUp(mapBlock);
			// slideUp(sublist);
			links.forEach( (elem) => {
				elem.classList.remove('active');
			});
			el.classList.add('active');

			sublist.classList.add('active');

			sublinks.forEach( (elem) => {
				elem.classList.remove('active');
			});

			attr = setClassifiedAttrValue();
		});
	});

	if(sublinks) sublinks.forEach( (elem) => {
		elem.addEventListener('click', (e) => {
			e.preventDefault();

			if ( elem.classList.contains('active') ) return;

			slideUp(mapBlock);
			sublinks.forEach( (el) => {
				el.classList.remove('active');
			});
			elem.classList.add('active');
			// slideDown(mapBlock);

			attr = setClassifiedAttrValue();

			setTimeout(() => {
				if (!clicked) {
					ymaps.ready(init);
				}
				map.style.height = (mapBlock.clientWidth + 30) + 'px';
				yandexMap.style.height = (mapBlock.clientWidth + 30) + 'px';
				mapBlock.style.height = (mapBlock.clientWidth + 30) + 'px';
				scrollSmooth('.classified__list');
				clicked = true;
			}, 300)

		});
	});

	let zoom = (window.screen.availWidth < 360) ? 10 : 11;

	function init () {
		const add = (a1, a2) => a1.map((e, i) => e + a2[i]);
		const avr = (array, length) => array.map((e, i) => e/length);
		var count = 0;
		var center = [0,0];

		var myMap = new ymaps.Map('map', {
			center: center,
			zoom: zoom,
			controls: ['zoomControl']
		});



		myMap.behaviors.disable('scrollZoom');

		HintLayout = ymaps.templateLayoutFactory.createClass( "<div class='kia-hint'>" +
			"{{ properties.name }}" +
			"</div>", {
				// Определяем метод getShape, который
				// будет возвращать размеры макета хинта.
				// Это необходимо для того, чтобы хинт автоматически
				// сдвигал позицию при выходе за пределы карты.
				getShape: function () {
					var el = this.getElement(),
						result = null;
					if (el) {
						var firstChild = el.firstChild;
						result = new ymaps.shape.Rectangle(
							new ymaps.geometry.pixel.Rectangle([
								[0, 0],
								[firstChild.offsetWidth, firstChild.offsetHeight]
							])
						);
					}
					return result;
				}
			}
		);

		placemarks.sort(function(a, b) {
			return b.position[1] - a.position[1];
		});
		placemarks.forEach((obj) => {
			if(obj[attr] == "") return;
			center = add(center,obj.position);
			count++;
			myPlacemark = new ymaps.Placemark(obj.position, {
				name: obj.hintContent
			}, {
				hintLayout: HintLayout,
				iconLayout: 'default#image',
				iconImageHref: '/img/icons/kia-locator.svg?re',
				iconImageSize: [42, 62],
				iconImageOffset: [-21, -58],
			});

			myMap.geoObjects.add(myPlacemark);

			myPlacemark.events.add('click', function (e) {
				window.open(obj[attr]);
				// console.log(obj.id);
			});

		});

		myMap.setCenter(avr(center,count));
	}

	let uploadField = document.querySelector('#file-upload');

	if(uploadField) {

	let dropzoneError = document.querySelector('.error-message');
	let dropzoneSuccess = document.querySelector('.success-message');

	let dropzone = new Dropzone(uploadField, {
		url: 'upload.php',
		addRemoveLinks: true,
		parallelUploads: 1,
		acceptedFiles: '.jpg,.jpeg,.png',
		maxFiles: 1,
		maxFilesize: 10,
		dictDefaultMessage: '<div class="dz-message needsclick">Загрузить скриншот</div>',
		dictFallbackMessage: "Ваш браузер не поддерживает загрузку перетаскиванием",
		dictFallbackText: "Пожалуйста, используйте резервную форму ниже, чтобы загрузить свои файлы, как в старые добрые времена)",
		dictFileTooBig: "Слишком большой файл ({{filesize}}Мб). Максимальный размер: {{maxFilesize}}Мб.",
		dictInvalidFileType: "Вы не можете загрузить файлы этого типа.",
		dictResponseError: "Сервер вернул ответ {{statusCode}}.",
		dictCancelUpload: "Отменить загрузку",
		dictUploadCanceled: "Загрузка завершена.",
		dictCancelUploadConfirmation: "Вы уверены, что хотите отменить?",
		dictRemoveFile: "Удалить файл",
		dictRemoveFileConfirmation: "Хотите удалить файл?",
		dictMaxFilesExceeded: 'Привышен лимит изображений',
		dictFileSizeUnits: {
			tb: "Тб",
			gb: "Гб",
			mb: "Мб",
			kb: "Кб",
			b: "байт"
		},
		init: function(){
			// console.log(this)
			this.element.innerHTML = this.options.dictDefaultMessage;
			this.on('addedfile', function(file) {
				if (this.files.length > 1) {
					this.removeFile(this.files[0]);
				}
			})
		},
		thumbnail: function(file, dataUrl) {
			if (file.previewElement) {
				file.previewElement.classList.remove("dz-file-preview");
				let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
				for (let i = 0; i < images.length; i++) {
					let thumbnailElement = images[i];
					thumbnailElement.alt = file.name;
					thumbnailElement.src = dataUrl;
					url = dataUrl;
				}
				setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
			}
		},
		success: function(file, response){
			response = JSON.parse(response);
			// console.log(file);
			if (response.answer == 'error') {
				dropzoneSuccess.style.display = 'none';
				dropzoneError.innerText = response.error;
				dropzoneError.style.display = 'block';
				dropzone.removeFile(file);
			}else{
				dropzoneError.style.display = 'none';
				dropzoneSuccess.innerText = response.answer;
				dropzoneSuccess.style.display = 'block';
				// this.defaultOptions.success(file);
			}
			// console.log(res);
		},
		removedfile: function (file) {
			file.previewElement.remove();
			dropzoneSuccess.style.display = 'none';
			dropzoneError.style.display = 'none';
			const request = new XMLHttpRequest();

			const url = "delete.php";
			request.open("POST", url, true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.addEventListener("readystatechange", () => {
				if(request.readyState === 4 && request.status === 200) {
					dropzoneSuccess.innerText = request.responseText;
					dropzoneSuccess.style.display = 'block';
					// console.log(request.responseText);
				}
			});
			request.send();
		}
	});

	var $$$ = function (name) { return document.querySelector(name) },
	$$ = function (name) { return document.querySelectorAll(name) };

	function maskphone(e) {
		var num = this.value.replace('+7', '').replace(/\D/g, '').split(/(?=.)/), i = num.length;
		if (0 <= i) num.unshift('+7');
		if (1 <= i) num.splice(1, 0, ' ');
		if (4 <= i) num.splice(5, 0, ' ');
		if (7 <= i) num.splice(9, 0, '-');
		if (9 <= i) num.splice(12, 0, '-');
		if (11 <= i) num.splice(15, num.length - 15);
		this.value = num.join('');
	};

	$$("input[name=phone]").forEach(function (element) {
		element.addEventListener('focus', maskphone);
		element.addEventListener('input', maskphone);
	});

	document.querySelector('input[name=phone]').addEventListener('change', function(){
		document.querySelector('.error-message#phone').style.display = 'none';
	})

	document.querySelector('input[name=agree]').addEventListener('change', function(){
		document.querySelector('.error-message#agree').style.display = 'none';
	})

	function checkingRequiredFields(form, errors) {
		let valid = true;
		for (key in errors) {
			let field = document.querySelector('.error-message#'+key);
			field.innerText = errors[key];
			field.style.display = 'block';
			valid = false;
		}
		return valid;
	}

	const forms = document.querySelectorAll('form');
	let btn = document.querySelector('form button');

	forms.forEach(form => {
			form.onsubmit = async (e) => {
			e.preventDefault();
			btn.innerHTML = 'Отправляем...';
			btn.setAttribute('disabled', true);

			let response = await fetch('mail.php', {
				method: 'POST',
				body: new FormData(form)
			});

			if (response.status === 200) {
				let res = await response.json();
				console.log(res);
				if (!res.validation && !checkingRequiredFields(this, res.massages)) {
					document.querySelector('.success-message').style.display = 'none';
					btn.innerHTML = 'Отправить';
					btn.removeAttribute('disabled');
					return false;
				}

				if (res.answer == 'error') {
					Swal.fire({
						title: 'Ошибка',
						text: res.error,
						icon: 'error',
						iconColor: '#eA0029',
						backdrop: 'rgba(0,0,0,0.7)',
						showCloseButton: true,
						closeButtonHtml: '&times;',
						showConfirmButton: false
					})
					btn.innerHTML = 'Отправить';
					btn.removeAttribute('disabled');
					return false;
				}

				if(res.answer == 'ok') {
					Swal.fire({
						title: 'Спасибо',
						text: 'Ваш скриншот был успешно отправлен!',
						icon: 'success',
						iconColor: '#f3c300',
						backdrop: 'rgba(0,0,0,0.7)',
						showCloseButton: true,
						closeButtonHtml: '&times;',
						confirmButtonColor: '#05141f'
					});
					form.reset();
					dropzone.removeAllFiles();
					btn.innerHTML = 'Отправить';
					btn.removeAttribute('disabled');
				}
			}else{
				Swal.fire({
					title: 'Ошибка',
					text: 'Перезагрузите страницу и попробуйте снова',
					icon: 'error',
					iconColor: '#eA0029',
					backdrop: 'rgba(0,0,0,0.7)',
					showCloseButton: true,
					closeButtonHtml: '&times;',
					showConfirmButton: false
				})
				btn.innerHTML = 'Отправить';
				btn.removeAttribute('disabled');
			}
		};
	})
	

	document.getElementById('popup_link').addEventListener('click', function(e){
		e.preventDefault();
		Swal.fire({
			html: policy,
			width: 900,
			backdrop: 'rgba(0,0,0,0.7)',
			showCloseButton: true,
			closeButtonHtml: '&times;',
			showConfirmButton: false,
			showClass: {
				popup: 'animate__animated animate__fadeIn'
			},
			hideClass: {
				popup: 'animate__animated animate__fadeOut'
			}
		})
	})

	} // end uploadField

	const qtyBlock = document.getElementById('service-quality');
	const reviewBlockGood = document.querySelector('#add-review-good');
	const reviewBlockBad = document.querySelector('#add-review-bad');
	const formComment = document.getElementById('form-comment');
	const reviewList = document.getElementById('add-review__list');
	if(qtyBlock) {
		qtyBlock.addEventListener('click', e => {
			let qty = e.target.dataset.quality;
			if(!qty) {
				return;
			}else{
				slideUp(qtyBlock);
				qtyBlock.classList.remove('icon-block');
				if(qty < 4){
					formComment.classList.remove('d-none');
					reviewBlockBad.classList.add('active');
				}else if(qty >= 4){
					reviewList.classList.remove('d-none');
					reviewBlockGood.classList.add('active');
				}else{
					return;
				}
			}
		})
	}

});