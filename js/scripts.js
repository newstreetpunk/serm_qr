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

			if ( el.classList.contains('active') ) {

				el.classList.remove('active');

				mapBlock.addEventListener('transitionend', function () {
					map.style.height = 0;
				}, {
					once: true
				});

			} else {

				reviews.forEach( (elem) => {
					elem.classList.remove('active');
				});
				el.classList.add('active');

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

});