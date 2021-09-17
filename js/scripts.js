document.addEventListener('DOMContentLoaded', () => {

	const delears = document.querySelectorAll('.dealer-link');
	const reviews = document.querySelectorAll('.add-review__link');
	const map = document.querySelector('.map');
	const mapBlock = document.querySelector('.map-block');
	const yandexMap = document.querySelector('#map');

	let clicked = false;
	let attr = '';

	const source = {
		google : {
			"samara" : "https://g.page/Kiavsamare/review?rc",
			"moscow" : "https://g.page/kiasmr/review?rc",
			"mexico" : "https://g.page/Kiavsamare-mehzavod/review?rc",
			"engels" : "https://g.page/Kiaengels/review?rc",
			"szr" : "https://g.page/KiaSyzran/review?rc"
		},
		yandex : {
			"samara" : "https://yandex.ru/profile/216059659516?intent=reviews",
			"moscow" : "https://yandex.ru/profile/1179041515?intent=reviews",
			"mexico" : "https://yandex.ru/profile/91221589795?intent=reviews",
			"engels" : "https://yandex.ru/profile/1671033598?intent=reviews",
			"szr" : "https://yandex.ru/profile/87743443177?intent=reviews"
		},
		gis : {
			"samara" : "https://2gis.ru/samara/firm/2533803071703640/tab/reviews",
			"moscow" : "https://2gis.ru/samara/firm/70000001019939556/tab/reviews",
			"mexico" : "https://2gis.ru/samara/firm/70000001043828289/tab/reviews",
			"engels" : "https://2gis.ru/samara/firm/70000001018721119/tab/reviews",
			"szr" : "https://2gis.ru/samara/firm/70000001051678906/tab/reviews"
		}
	};

	function setSourceLink(val, id){
		return source[val][id];
	}


	function scrollSmooth(selector){
		setTimeout( ()=>{
			document.querySelector(selector).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 300 );
	}


	reviews.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			attr = el.getAttribute('data-source');

			mapBlock.style.height = '0px';
			document.querySelector('.add-screenshot').style.height = '0px';

			if ( el.classList.contains('active') ) {

				el.classList.remove('active');
				document.querySelector('.add-screenshot').classList.remove('active');

				mapBlock.addEventListener('transitionend', function () {
					map.style.height = 0;
				}, {
					once: true
				});

			} else {

				reviews.forEach( (elem) => {
					elem.classList.remove('active');
					document.querySelector('.add-screenshot').classList.remove('active');
				});
				el.classList.add('active');
				setTimeout(()=>{
					document.querySelector('.add-screenshot').classList.add('active');
				}, 300)

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
				setTimeout(()=>{
					document.querySelector('.add-screenshot').style.height = 'auto';
				}, 300)
			}

		});
	});

	let zoom = (window.screen.availWidth < 360) ? 10 : 11;

	function init () {
		const add = (a1, a2) => a1.map((e, i) => e + a2[i]);
		const avr = (array, length) => array.map((e, i) => e/length);
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
			center = add(center,obj.position);
			myPlacemark = new ymaps.Placemark(obj.position, {
				name: obj.hintContent
			}, {
				hintLayout: HintLayout,
				iconLayout: 'default#image',
				iconImageHref: 'img/icons/kia-locator.svg?re',
				iconImageSize: [42, 62],
				iconImageOffset: [-21, -58],
			});

			myMap.geoObjects.add(myPlacemark);

			myPlacemark.events.add('click', function (e) {
				window.open(setSourceLink(attr, obj.id));
				// console.log(obj.id);
			});

		});

		myMap.setCenter(avr(center,placemarks.length));
	}

	let dropzoneError = document.querySelector('.error-message');
	let dropzoneSuccess = document.querySelector('.success-message');

	let uploadField = document.querySelector('#file-upload');

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

	const form = document.querySelector('form');
	let btn = document.querySelector('form button');

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
					title: 'ОШИБКА!',
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
					title: 'Успех!',
					text: 'Ваше сообщение успешно отправлено!',
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
				title: 'ОШИБКА!',
				text: 'Перезагрузите страницу и попробуйте снова',
				icon: 'error',
				iconColor: '#eA0029',
				backdrop: 'rgba(0,0,0,0.7)',
				showCloseButton: true,
				closeButtonHtml: '&times;',
				showConfirmButton: false
			})
		}
	};

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

});