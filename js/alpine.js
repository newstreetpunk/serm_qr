// import Alpine from 'alpinejs'

window.Alpine = Alpine;

document.addEventListener('alpine:init', (data) => {
	Alpine.data('places', () => ({

		classified:  {
			avito: '/img/icons/classified/avito-logo.svg',
			avtoru: '/img/icons/classified/avtoRu-logo.svg',
			drom: '/img/icons/classified/drom-logo.svg',
		},

		activeShop: '',

		existShop(attr) {
			var show = false;
			for (obj in placemarks) {
				if(placemarks[obj][attr] != "") show = true;
			}
			return show;
		}

	}))
	// console.log('alpine:init');
})

document.addEventListener('alpine:initialized', () => {
	// console.log('alpine initialized');
})

// Alpine.start();