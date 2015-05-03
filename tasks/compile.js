'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge2');

var Config = require('./config');

var tsProject = $.typescript.createProject({
    declarationFiles: true,
    target: 'ES5',
    module: 'commonjs'
});

gulp.task('compile:typescript', function() {
    var tsResult = gulp.src(Config.ts.concat(['typings/**/*.ts']))
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject));
    return merge([
        tsResult.dts.pipe(gulp.dest(Config.dist)),
        tsResult.js.pipe($.sourcemaps.write()).pipe(gulp.dest(Config.dist))
    ]);
});

gulp.task('compile', ['compile:typescript']);