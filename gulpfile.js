const gulp = require('gulp');
const panini = require('panini');
const sass = require('gulp-sass');
const del = require('del');
const browserSync = require('browser-sync').create();

let convertHbsTask = (done) => {
	panini.refresh();
	gulp.src('./app/html/pages/*.html')
		.pipe(panini ({
			root: 'app/html/pages/',
			layouts: 'app/html/layouts/',
			partials: 'app/html/partials/',
			data: 'app/data/',
			helpers: 'helpers/',
		}))
		.pipe(gulp.dest('dist'));
	done();
}

let convertScssTask = (done) => {
	gulp.src('./app/scss/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'))
	gulp.src('./app/scss/pages/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css/pages'));
	done();
}

let moveJavascriptTask = (done) => {
	gulp.src('./app/js/*.js')
		.pipe(gulp.dest('./dist/js'));
	gulp.src('./app/js/pages/*.js')
		.pipe(gulp.dest('./dist/js/pages'));
	done();
}

let moveImagesTask = (done) => {
	gulp.src('./app/img/*.png')
		.pipe(gulp.dest('./dist/img'));
	done();
}

let moveFontsTask = (done) => {
	gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('./dist/fonts'));
	done();
}

let clearDist = (done) => {
	del.sync('./dist');
	done();
}

let browserSyncReloadTask = (done) => {
	browserSync.reload();
	done();
}

let browserSyncTask = (done) => {
	browserSync.init({
		server: {
			baseDir: './dist',
			index: 'index.html',
			notify: false
		}
	});
	done();
}
let watchTask = (done) => {
	gulp.watch('./app').on('change', gulp.series(clearDist,convertHbsTask,moveFontsTask,convertScssTask,moveJavascriptTask,moveImagesTask,browserSyncReloadTask));
	done();
}

exports.clean = clearDist;
exports.dev = gulp.series(clearDist,gulp.parallel(convertHbsTask,moveFontsTask,convertScssTask,moveJavascriptTask,moveImagesTask),browserSyncTask,watchTask);
exports.build = gulp.series(clearDist,gulp.parallel(convertHbsTask,moveFontsTask,convertScssTask,moveJavascriptTask,moveImagesTask));
