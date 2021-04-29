document.addEventListener('DOMContentLoaded', () => {

	const delears = document.querySelectorAll('.dealer-link');
	const reviews = document.querySelectorAll('.add-review__link');
	const map = document.querySelector('.map');
	const mapBlock = document.querySelector('.map-block');
	const mapImage = document.querySelector('.map-img');

	var clicked = 0;

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

	function setSourceLink(val){

		for(k in source[val]) {

			delears.forEach( (el) => {
				if (el.classList.contains(k)) {
					el.setAttribute('href', source[val][k]);
				}
			});

		};
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

			clicked++;

			let attr = el.getAttribute('data-source');

			setSourceLink(attr);

			maps.forEach(function(map){
				ymap(map)
			});

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
					map.style.height = (mapImage.clientWidth + 30) + 'px';
					mapBlock.style.height = (mapImage.clientWidth + 30) + 'px';
					scrollSmooth('.add-review');
				}, 300)
			}


		});
	});

	window.addEventListener('resize', () => {
		if ( mapBlock.classList.contains('active') ) {
			map.style.height = (mapImage.clientWidth + 30) + 'px';
			mapBlock.style.height = (mapImage.clientWidth + 30) + 'px';
		}
	});

});