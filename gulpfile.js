var dir = 'client_build';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    bower = require('gulp-bower'),
    gulpif = require('gulp-if'),
    csso = require('gulp-csso'),
    argv = require('yargs').argv,
    debug = require('gulp-debug'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    csscomb = require('gulp-csscomb'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlhint = require("gulp-htmlhint"),
    gulpSequence = require('gulp-sequence'),
    browserSync = require('browser-sync').create();

gulp.task('default', ['libs','build']);

gulp.task('libs', function () {
    return gulp.src('client_src/libs/**/*.{min.js,amd.min.js}')
        .pipe(gulp.dest('client_build/libs'));
});

gulp.task('build', ['copy-static', 'css', 'js']);

gulp.task('copy-static', function () {
    return gulp.src(['client_src/**/*.{png,jpg,svg,html}', '!*/libs'])
        .pipe(gulp.dest(dir))
});

gulp.task('css', function () {
    return gulp.src('client_src/styles/**/*.sass')
        .pipe(concat('styles.sass'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(dir))
});

gulp.task('js', function () {
    return gulp.src('client_src/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(gulpif(argv.prod, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dir))
});

gulp.task('bower', function () {
    return bower('client_src/libs');
});

gulp.task('clean', function () {
    return gulp.src(dir, {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('client_src/**/*.{png,jpg,svg,html,js}', [ 'copy-static' ]);
    gulp.watch('client_src/styles/**/*.*', [ 'css' ]);
});

gulp.task('style:css', function () {
    gulp.src('client_build/**/*.css')
        .pipe(csscomb())
        .pipe(gulp.dest(function (file) {
            return file.base
        }))
});

gulp.task('style:js', function(){
   gulp.src('client_src/js/**/*.js')
       .pipe(jscs({fix: true}))
       .pipe(jscs.reporter())
       .pipe(gulp.dest(function (file) {
            return file.base
    }))
});

gulp.task('style:html', function () {
    gulp.src('client_build/*.html')
        .pipe(htmlhint('.htmlhintrc'))
        .pipe(htmlhint.reporter("htmlhint-stylish"))
        .pipe(htmlhint.failReporter({ suppress: true }))
});

gulp.task('style', ['style:html', 'style:js', 'style:css']);

gulp.task('dev', gulpSequence('build', ['watch', 'serve']));

gulp.task('serve', function () {
    browserSync.init({
        server: 'client_build'
    });

    browserSync.watch('client_build/**/*.*').on('change', browserSync.reload)
});