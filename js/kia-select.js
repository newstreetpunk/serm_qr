const selects = document.querySelectorAll('.kia-select')
document.addEventListener('click', event => {
	if(
		!event.target.classList.contains('kia-select-label') && 
		!event.target.classList.contains('kia-select-head') &&
		!event.target.classList.contains('kia-select-arrow-icon')
		){
		selects.forEach(el => {
			closeSelect(el)
		})
	}
})
selects.forEach(select => {
	document.addEventListener('keydown', event => {
		if(event.key == 'Escape'){
			closeSelect(select)
		}
	});
	const head = select.querySelector('.kia-select-head');
	const label = select.querySelector('.kia-select-label');
	let value = '';
	head.addEventListener('click', event => {
		toggleSelect(select)
	})
	const options = select.querySelectorAll('.kia-select-option input')
	options.forEach(option => {
		if(option.checked){
			value = option.value
			checkOptionsOnChecked(select, label, value)
		}
		option.addEventListener('change', event => {
			if(event.target.checked){
				select.nextSibling.nextElementSibling.innerText = ''
				select.nextSibling.nextElementSibling.style.display = 'none'
				value = option.value
				checkOptionsOnChecked(select, label, value)
				closeSelect(select)
			}
		})
	})
})

function toggleSelect(select){
	if(!select.classList.contains('active')){
		selects.forEach(el => {
			closeSelect(el)
		})
		select.classList.add('active')
	}else{
		closeSelect(select)
	}
}

function closeSelect(select){
	select.classList.remove('active')
}

function checkOptionsOnChecked(select, label, value){
	select.setAttribute('data-value', value)
	select.classList.add('selected')
	label.innerText = value
}