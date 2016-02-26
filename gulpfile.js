var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    bower = require('gulp-bower'),
    gulpif = require('gulp-if'),
    csso = require('gulp-csso'),
    argv = require('yargs').argv,
    debug = require('gulp-debug');

gulp.task('default', ['libs','build']);

gulp.task('libs', function () {
    return gulp.src('client_src/libs/**/*.min.js')
        .pipe(gulp.dest('client_build/libs'));
});

gulp.task('build', ['copy-static', 'css']);

gulp.task('copy-static', function () {
    return gulp.src(['!client_src/libs', 'client_src/*.{png,jpg,svg,html}'])
        .pipe( gulp.dest('client_build') );
});

gulp.task('css', function () {
    return gulp.src('client_src/styles/**/*.sass')
        .pipe(concat('styles.sass'))
        .pipe(sass())
        .pipe(gulpif(argv.prod, csso()))
        .pipe(debug())
        .pipe(gulp.dest('client_build/static'));
});

gulp.task('bower', function () {
    return bower('client_src/libs');
});

gulp.task('clean', function () {
    return gulp.src('client_build', {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('client_src//**/*.{png,jpg,svg,html,js}', ['copy-static']);
    gulp.watch('client_src/styles/**/*.*', ['css']);
});



