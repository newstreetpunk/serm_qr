import QRCodeStyling from 'qr-code-styling'

const options = {
	width: 320,
	height: 320,
	type: "canvas",
	image: "",
	dotsOptions: {
		type: "rounded"
	},
	backgroundOptions: {
		color: "#f8f8f8",
	},
	imageOptions: {
		crossOrigin: "anonymous",
		margin: 10
	}
}

function codeGeneration(link, color, options) {
	options.data = link;
	options.dotsOptions.color = color;
	return new QRCodeStyling(options)
}

const qrBlocks = document.querySelectorAll(".qr-code");

if (Array.from(qrBlocks).length) {
	Array.from(qrBlocks).map(block => {
		const color = block.dataset.color || "#333333";
		const url = block.dataset.url || window.location.href + "?utm_source=employee_page";
		codeGeneration(url, color, options).append(block)
	})
}