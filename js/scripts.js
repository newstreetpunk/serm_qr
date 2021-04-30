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
			"mexico" : "https://g.page/Kiavsamare-mehzavod/review?rc"
		},
		yandex : {
			"samara" : "https://yandex.ru/profile/216059659516?intent=reviews",
			"moscow" : "https://yandex.ru/profile/1179041515?intent=reviews",
			"mexico" : "https://yandex.ru/profile/91221589795?intent=reviews"
		},
		gis : {
			"samara" : "https://2gis.ru/samara/firm/2533803071703640/tab/reviews",
			"moscow" : "https://2gis.ru/samara/firm/70000001019939556/tab/reviews",
			"mexico" : "https://2gis.ru/samara/firm/70000001043828289/tab/reviews"
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

	let winW = window.screen.availWidth;
	let zoom = 11;

	if (winW < 481)
		zoom = 10;


	function init () {
		var myMap = new ymaps.Map('map', {
			center: [53.2357, 50.2155],
			zoom: zoom,
			controls: ['zoomControl']
		});

		myMap.behaviors.disable('scrollZoom');

		placemarks.forEach((obj) => {
			myPlacemark = new ymaps.Placemark(obj.position, {
				hintContent: obj.hintContent,
			}, {
				iconLayout: 'default#image',
				iconImageHref: 'img/icons/kia-locator.svg',
				iconImageSize: [42.8, 62],
				iconImageOffset: [-21.4, -31],
			});

			myMap.geoObjects.add(myPlacemark);

			myPlacemark.events.add('click', function (e) {
				window.open(setSourceLink(attr, obj.id));
				// console.log(obj.id);
			});

		});
	}

});