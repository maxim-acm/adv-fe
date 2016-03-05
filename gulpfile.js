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
    htmlhint = require("gulp-htmlhint");

gulp.task('default', ['libs','build']);

gulp.task('libs', function () {
    return gulp.src('client_src/libs/**/*.min.js')
        .pipe(gulp.dest('client_build/libs'));
});

gulp.task('build', ['copy-static', 'copy-html', 'css', 'js']);

gulp.task('copy-static', function () {
    return gulp.src(['client_src/*.{png,jpg,svg}', '!client_src/libs'])
        .pipe( gulp.dest('client_build/static'));
});

gulp.task('copy-html', function () {
    return gulp.src(['client_src/*.html', '!client_src/libs'])
        .pipe(gulpif(argv.prod, htmlmin({collapseWhitespace: true})))
        .pipe( gulp.dest('client_build'));
});

gulp.task('css', function () {
    return gulp.src('client_src/styles/**/*.sass')
        .pipe(concat('styles.sass'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulpif(argv.prod, csso()))
        .pipe(gulp.dest('client_build/static'))
        .pipe(livereload());
});

gulp.task('js', function () {
    gulp.src('client_src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(gulpif(argv.prod, uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('client_build/js'))
});

gulp.task('bower', function () {
    return bower('client_src/libs');
});

gulp.task('clean', function () {
    return gulp.src('client_build', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('client_src//**/*.{png,jpg,svg,html,js}', ['copy-static']);
    gulp.watch('client_src/styles/**/*.*', ['css']);
});

gulp.task('csscomb', function () {
    gulp.src('client_build/static/**/*.css')
        .pipe(csscomb())
        .pipe(gulp.dest(function (file) {
            return file.base
        }))
});

gulp.task('jscs', function(){
   gulp.src('client_src/js/**/*.js')
       .pipe(jscs({fix: true}))
       .pipe(jscs.reporter())
       .pipe(gulp.dest(function (file) {
            return file.base
    }))
});

gulp.task('htmlhint', function () {
    gulp.src('client_build/*.html')
        .pipe()
});

gulp.task('style', ['csscomb', 'jscs']);
