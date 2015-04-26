'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('merge2');

var Config = require('./config');

gulp.task('compile:typescript', function() {
    var tsResult = gulp.src(Config.ts)
        //.pipe($.sourcemaps.init())
        .pipe($.typescript({
            declarationFiles: true,
            noExternalResolve: true,
            target: 'ES5',
            module: 'commonjs'
        }))
        //.pipe($.sourcemaps.write());
        ;
    return merge([
        tsResult.dts.pipe(gulp.dest(Config.dist)),
        tsResult.js.pipe(gulp.dest(Config.dist))
    ]);
});

gulp.task('compile', ['compile:typescript']);