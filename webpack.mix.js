let mix = require('laravel-mix');

require('laravel-mix-serve');

// require('mix-tailwindcss');

mix
	.js([
		'node_modules/dropzone/dist/dropzone.js',
		'node_modules/alpinejs/dist/cdn.js',
		'node_modules/sweetalert2/dist/sweetalert2.all.js',
		'js/alpine.js', // Custom scripts. Always at the end
		'js/getClientID.js', // Custom scripts. Always at the end
		'js/dropzone.js', // Custom scripts. Always at the end
		'js/kia-select.js', // Custom scripts. Always at the end
		'js/main.js' // Custom scripts. Always at the end
	], 'js/scripts.min.js')
	.sass('sass/main.sass', 'css/styles.min.css')
	// .tailwind()
	.setPublicPath('/')
	.serve('php -S 127.0.0.1:8080 -t ./', {
		verbose: true,
		watch: true,
		dev: true,
	});

if (mix.inProduction()) {
	mix.version();
} else {
	mix.sourceMaps().webpackConfig({ devtool: 'inline-source-map' });
	mix.browserSync({
		proxy: '127.0.0.1:8080',
		files: ['**.html', '**/*.php', 'css/*.css', 'js/scripts.js'],
		// server: { baseDir: "./", },
		notify: false
	});
}

mix.disableSuccessNotifications();