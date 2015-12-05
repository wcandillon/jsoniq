'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge2');

var Config = require('./config');

var ts = $.typescript.createProject({
    declarationFiles: false,
    target: 'ES6',
    module: 'commonjs',
    typescript: require('typescript')
});

gulp.task('compile:clean', function () {
    return gulp.src(Config.dist, { read: false }).pipe($.clean({ force: true }));
});

gulp.task('compile:typescript', ['compile:clean'], function() {
    var tsResult = gulp.src(Config.ts.concat(['typings/**/*.ts']))
        .pipe($.sourcemaps.init())
        .pipe($.typescript(ts));
    return merge([
        tsResult.dts.pipe(gulp.dest(Config.dist)),
        tsResult.js.pipe($.sourcemaps.write()).pipe(gulp.dest(Config.dist))
    ]);
});

gulp.task('compile', ['compile:typescript']);
