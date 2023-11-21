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
				if(typeof placemarks[obj][attr] != "undefined" && placemarks[obj][attr] != "") show = true;
			}
			return show;
		}

	}))
	Alpine.data('actions', () => ({
		open: false,
		title: '',
		formSubject: '',
		formName: '',
		action(title = '', formSubject = '', formName = ''){
			this.title = title;
			this.formSubject = formSubject;
			this.formName = formName;
			this.open = true;
		}
	}))
})

document.addEventListener('alpine:initialized', () => {
	// console.log('alpine initialized');
})

// Alpine.start();