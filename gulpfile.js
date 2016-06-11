// Grab node packages
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

 
gulp.task('default', function() {
    gulp.src(['js/multityped.js', 'js/typed.js'])
        .pipe(concat('multityped.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('multityped.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});