var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// task
gulp.task('minify-js', function () {
    gulp.src(['./src/*.js']) // path to your files
        .pipe(uglify())
        .pipe(concat('front-end-validation.min.js'))
        .pipe(gulp.dest('.'));
});