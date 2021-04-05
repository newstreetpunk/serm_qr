document.addEventListener('DOMContentLoaded', () => {

	function setSourceLink(val, selector){

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

		delearLinks = document.querySelectorAll(selector);

		for(k in source[val]) {

			delearLinks.forEach( (el) => {
				if (el.classList.contains(k)) {
					el.setAttribute('href', source[val][k]);
				}
			});

		};
	}

	function slideUp(container){

		container.style.height = '0px';
		container.addEventListener('transitionend', function () {
			container.classList.remove('active');
		}, {
			once: true
		});
	}

	function slideDown(container){

		container.addEventListener('transitionend', function () {
			container.classList.add('active');
		});
		setTimeout( () => {
			container.style.height = container.scrollHeight + 'px';
			container.closest('#map').style.height = container.scrollHeight + 'px';
		}, 300);
	}

	function scrollSmooth(selector){
		setTimeout( ()=>{
			document.querySelector(selector).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 600 );
	}

	const links = document.querySelectorAll('.add-review__link');
	const map = document.querySelector('.map');
	const mapImage = document.querySelector('.map-img');
	const mapBlock = document.querySelector('.map-block');

	links.forEach( (el) => {
		el.addEventListener('click', (e) => {
			e.preventDefault();

			let attr = el.getAttribute('data-source');

			setSourceLink(attr, '.dealer-link');

			if ( el.classList.contains('active') ) {

				el.classList.remove('active');
				slideUp(mapBlock);
				mapBlock.addEventListener('transitionend', function () {
					map.style.height = 0;
				}, {
					once: true
				});

			}else{

				slideUp(mapBlock);
				links.forEach( (elem) => {
					elem.classList.remove('active');
				});
				el.classList.add('active');
				slideDown(mapBlock);

				scrollSmooth('.add-review');
			}

			window.addEventListener('resize', () => {
				if ( mapBlock.classList.contains('active') ) {
					map.style.height = (mapImage.clientWidth + 30) + 'px';
					mapBlock.style.height = (mapImage.clientWidth + 30) + 'px';
				}
			});

		});
	});

});