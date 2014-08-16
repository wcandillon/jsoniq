'use strict';

var gulp = require('gulp');

var paths = {
    json: ['*.json', 'lib/**/*.json'],
    js: ['gulpfile.js'],
    ts: ['lib/**/*.ts', '__tests__/**/*.ts']
};

gulp.task('clean', function () {
    var clean = require('gulp-clean');
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('lint', function(){
    var jsonlint = require('gulp-jsonlint');
    var jshint = require('gulp-jshint');
    var tslint = require('gulp-tslint');

    gulp.src(paths.json)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());

    gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter());

    gulp.src(paths.ts)
        .pipe(tslint(require('./tslint.json')))
        .pipe(tslint.report('verbose'));
});

gulp.task('compile', ['clean', 'lint'], function(){
    var typescript = require('gulp-tsc');
    return gulp.src(paths.ts)
        .pipe(typescript())
        .pipe(gulp.dest('dist/'));
});

gulp.task('jest', ['compile'], function () {
    var jest = require('gulp-jest');
    return gulp.src('dist/__TESTS__/').pipe(jest({ rootDir: __dirname }));
});

gulp.task('default', function() {
    gulp.start('jest');
});