window.getClientID = class {

	clientID = {ym:[],ga:[],count:0};

	constructor() {

		if(!('clientID' in localStorage)) {
			localStorage.clientID = JSON.stringify(this.clientID);
		}

		this.clientID = JSON.parse(localStorage.clientID);

		this.clientID.count++;

		if('ym' in document) {
			let metrika = ym.a.map((m)=>{ return m[0]});

			metrika.forEach((m)=>{
				ym(m, 'getClientID', (cID) => {
					this.push(this.clientID.ym, cID);
				});
			});
		}

		if('ga' in document) {
			ga((tracker) => {
				let cID = tracker.get('clientId');
				this.push(this.clientID.ga, cID);
			});
		}

		this.push(this.clientID.ga, this.getCookie('_ga'));
		this.push(this.clientID.ym, this.getCookie('_ym_uid'));

		localStorage.clientID = JSON.stringify(this.clientID);

		return this.clientID;

	}

	getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		))
		return matches ? decodeURIComponent(matches[1]) : undefined
	}

	push(arr, cID) {
		if(!arr.includes(cID)) arr.push(cID);
	}

}