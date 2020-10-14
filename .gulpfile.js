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
	sass           = require('gulp-sass'),
	cleancss       = require('gulp-clean-css'),
	concat         = require('gulp-concat'),
	browserSync    = require('browser-sync').create(),
	uglify         = require('gulp-uglify-es').default,
	autoprefixer   = require('gulp-autoprefixer'),
	imagemin       = require('gulp-imagemin'),
	newer          = require('gulp-newer'),
	rsync          = require('gulp-rsync'),
	del            = require('del'),
	connect        = require('gulp-connect-php'),
	header         = require('gulp-header'),
	notify         = require('gulp-notify'),
	rename         = require('gulp-rename'),
	responsive     = require('gulp-responsive'),
	pngquant       = require('imagemin-pngquant'),
	merge          = require('merge-stream'),
	// version        = require('gulp-version-number'),
	// revAll         = require('gulp-rev-all'),
	replace        = require('gulp-replace');

if(typeof projects == 'undefined') 
	global.projects = {};
if(typeof port == 'undefined') 
	global.port = 8100;


projects.newstreetpunk_kia_qr = {

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
			basename + '/js/scripts.js', // Custom scripts. Always at the end
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



/* newstreetpunk_kia_qr BEGIN */

// Local Server
function newstreetpunk_kia_qr_browsersync() {
	connect.server({
		port: projects.newstreetpunk_kia_qr.port,
		base: projects.newstreetpunk_kia_qr.base,
	}, function (){
		browserSync.init({
			// server: { baseDir: projects.newstreetpunk_kia_qr.base + '/' },
			proxy: '127.0.0.1:' + projects.newstreetpunk_kia_qr.port,
			notify: false,
			online: online
		});
	});
};

// Custom Styles
function newstreetpunk_kia_qr_styles() {
	return src(projects.newstreetpunk_kia_qr.styles.src)
	.pipe(eval(preprocessor)({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(concat(projects.newstreetpunk_kia_qr.styles.output))
	.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'] }))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(dest(projects.newstreetpunk_kia_qr.styles.dest))
	.pipe(browserSync.stream())

};

// Scripts & JS Libraries
function newstreetpunk_kia_qr_scripts() {
	return src(projects.newstreetpunk_kia_qr.scripts.src)
	.pipe(concat(projects.newstreetpunk_kia_qr.scripts.output))
	// .pipe(uglify()) // Minify js (opt.)
	.pipe(header(projects.newstreetpunk_kia_qr.forProd))
	.pipe(dest(projects.newstreetpunk_kia_qr.scripts.dest))
	.pipe(browserSync.stream())
};

function newstreetpunk_kia_qr_watch() {
	watch(projects.newstreetpunk_kia_qr.styles.watch, newstreetpunk_kia_qr_styles);
	// watch(projects.newstreetpunk_kia_qr.scripts.src, newstreetpunk_kia_qr_scripts);

	watch(projects.newstreetpunk_kia_qr.code.src).on('change', browserSync.reload);
};

// newstreetpunk_kia_qr_scripts, 
module.exports = parallel(newstreetpunk_kia_qr_styles, newstreetpunk_kia_qr_browsersync, newstreetpunk_kia_qr_watch);


/* newstreetpunk_kia_qr END */
