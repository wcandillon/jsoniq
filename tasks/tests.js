'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('tests:node', function () {
    var jasmine = require('gulp-jasmine');
    return gulp.src('dist/tests/node/runtime/*.js').pipe(jasmine());
});