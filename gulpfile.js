var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('js', function () {
  var b = browserify({
    entries: './babel/main.js',
    debug: true,
    transform: [babelify.configure({
      presets: ['env']
    })]
  });

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      // Add other gulp transformations (eg. uglify) to the pipeline here.
      .on('error', util.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js/'))
    .pipe(browserSync.stream());;
});

gulp.task('sass',()=>{
	gulp.src('./scss/main.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css/'))
		.pipe(browserSync.stream());;
});

gulp.task('serve',['sass'], ()=>{
	browserSync.init({
		server: './'
	});

	gulp.watch('./babel/main.js',['js']);
	gulp.watch('./scss/main.scss',['sass']);
	gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default',['serve']);