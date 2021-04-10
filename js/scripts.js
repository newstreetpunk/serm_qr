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

	// function slideUp(container){

	// 	container.style.height = '0px';
	// 	container.addEventListener('transitionend', function () {
	// 		container.classList.remove('active');
	// 	}, {
	// 		once: true
	// 	});
	// }

	// function slideDown(container){

	// 	container.addEventListener('transitionend', function () {
	// 		container.classList.add('active');
	// 	});
	// 	setTimeout( () => {
	// 		container.style.height = container.scrollHeight + 'px';
	// 		container.closest('#map').style.height = container.scrollHeight + 'px';
	// 	}, 400);
	// }

	function slideDown(container) {
		container.classList.add('active')
		container.style.height = "auto"

		/** Get the computed height of the container. */
		var height = container.clientHeight + "px"

		/** Set the height of the content as 0px, */
		/** so we can trigger the slide down animation. */
		container.style.height = "0px"

		/** Do this after the 0px has applied. */
		/** It's like a delay or something. MAGIC! */
		setTimeout(() => {
			container.style.height = height
		}, 300)
	}
    function slideUp(container) {
    	/** Set the height as 0px to trigger the slide up animation. */
    	container.style.height = "0px"

    	/** Remove the `active` class when the animation ends. */
    	container.addEventListener('transitionend', () => {
    		container.classList.remove('active')
    	}, { once: true })
    }

	function scrollSmooth(selector){
		setTimeout( ()=>{
			document.querySelector(selector).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}, 400 );
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

				map.style.height = (mapImage.clientWidth + 30) + 'px';
				mapBlock.style.height = (mapImage.clientWidth + 30) + 'px';
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