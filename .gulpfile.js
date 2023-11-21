// VARIABLES & PATHS
let preprocessor = 'sass', // Preprocessor (sass, scss, less, styl)
    fileswatch   = 'html,htm,txt,json,md,woff2,php', // List of files extensions for watching & hard reload (comma separated)
    pageversion  = 'html,htm,php', // List of files extensions for watching change version files (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    online       = true, // If «false» - Browsersync will work offline without internet connection
    basename     = require('path').basename(__dirname),
    forProd      = [
					'/**',
					' * @author Alexsab.ru',
					' */',
					''].join('\n');

const { src, dest, parallel, series, watch, task } = require('gulp'),
	sass           = require('gulp-sass')(require('sass')),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	terser         = require("gulp-terser"),
	babel          = require('gulp-babel'),
	autoprefixer   = require('gulp-autoprefixer'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	rename         = require('gulp-rename'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.kia_qr = {

	port: ++port,

	base: basename,
	dest: basename,

	styles: {
		src:	basename + '/' + preprocessor + '/main.'+preprocessor,
		watch:    basename + '/' + preprocessor + '/**/*.'+preprocessor,
		dest:   basename + '/css',
		output: 'styles.min.css',
	},

	scripts: {
		src: [
			'node_modules/dropzone/dist/dropzone.js',
			'node_modules/alpinejs/dist/cdn.js',
			'node_modules/sweetalert2/dist/sweetalert2.all.js',
			basename + '/js/alpine.js', // Custom scripts. Always at the end
			basename + '/js/getClientID.js', // Custom scripts. Always at the end
			basename + '/js/dropzone.js', // Custom scripts. Always at the end
			basename + '/js/kia-select.js', // Custom scripts. Always at the end
			basename + '/js/main.js', // Custom scripts. Always at the end
		],
		dest:       basename + '/js',
		output:     'scripts.min.js',
	},

	code: {
		src: [
			basename  + '/**/*.{' + fileswatch + '}',
		],
	},

	forProd: [
		'/**',
		' * @author https://github.com/newstreetpunk',
		' * @editor https://github.com/alexsab',
		' */',
		''].join('\n'),
}



/* kia_qr BEGIN */

// Local Server
function kia_qr_browsersync() {
	connect.server({
		port: projects.kia_qr.port,
		base: projects.kia_qr.base,
	}, function (){
		browserSync.init({
			//server: { baseDir: projects.kia_qr.base + '/' },
			proxy: '127.0.0.1:' + projects.kia_qr.port,
			notify: false,
			online: online
		});
	});
};

// Custom Styles
function kia_qr_styles() {
	return src(projects.kia_qr.styles.src)
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.kia_qr.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.kia_qr.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts & JS Libraries
function kia_qr_scripts() {
	return src(projects.kia_qr.scripts.src)
	.pipe(concat(projects.kia_qr.scripts.output))
	// .pipe(babel({
	// 	presets: ['es2015']
	// }))
	.pipe(terser()) // Minify js (opt.)
	//.pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.kia_qr.forProd))
	.pipe(dest(projects.kia_qr.scripts.dest))
	.pipe(browserSync.stream())
};

function kia_qr_watch() {
	watch(projects.kia_qr.styles.watch, kia_qr_styles);
	watch(projects.kia_qr.scripts.src, kia_qr_scripts);

	watch(projects.kia_qr.code.src).on('change', browserSync.reload);
};

exports.kia_qr = parallel(kia_qr_styles, kia_qr_scripts, kia_qr_browsersync, kia_qr_watch);


/* kia_qr END */
