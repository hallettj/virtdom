var gulp = require('gulp')
  , browserify = require('browserify')
  , jsx = require('gulp-react')
  , transform = require('vinyl-transform')
;

gulp.task('build', ['browserify']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['build']);
})

gulp.task('jsx', function() {
    return gulp.src('src/**/*.js')
        .pipe(jsx({
            harmony: true,
            stripTypes: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('browserify', ['jsx'], function() {
    var browserified = transform(function(filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(['build/*.js'])
        .pipe(browserified)
        .pipe(gulp.dest('./dist'));
});
