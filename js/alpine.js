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