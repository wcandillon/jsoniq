'use strict';

var gulp = require('gulp');

var typescript = require('gulp-tsc');

var paths = {
    json: ['*.json', 'lib/**/*.json'],
    js: ['gulpfile.js'],
    ts: ['lib/**/*.ts'],
    tests: ['__tests__/**/*.ts']
};

gulp.task('clean', function () {
    var rimraf = require('gulp-rimraf');
    return gulp.src('dist', {read: false})
        .pipe(rimraf());
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
    return gulp.src(paths.ts)
        .pipe(typescript())
        .pipe(gulp.dest('dist/'));
});

gulp.task('compile-tests', ['clean'], function(){
    return gulp.src(paths.tests)
        .pipe(typescript())
        .pipe(gulp.dest('dist/'));
});

gulp.task('jest', ['compile-tests'], function () {
    var jest = require('gulp-jest');
    return gulp.src('dist/__TESTS__/').pipe(jest({ rootDir: __dirname + '/dist' }));
});

gulp.task('default', ['compile', 'jest']);