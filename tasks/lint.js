'use strict';

var map = require('map-stream');

var $ = require('gulp-load-plugins')();
var gulp = require('gulp');

var Config = require('./config');

gulp.task('lint:json', function(){
    var jsonlint = require('gulp-jsonlint');

    return gulp.src(Config.json)
        .pipe(jsonlint())
        .pipe(jsonlint.reporter())
        .pipe(map(function(file, cb){
            if (!file.jsonlint.success) {
                process.exit(1);
            }
            cb(null, file);
        }));
});

gulp.task('lint:js', function(){
    return gulp.src(Config.js)
        .pipe($.jshint())
        .pipe($.jshint.reporter());
});

gulp.task('lint:ts', function(){
    return gulp.src(Config.ts.concat('!definitions/**/*.ts'))
        .pipe($.tslint(require('../tslint.json')))
        .pipe($.tslint.report('verbose'));
});

gulp.task('lint', ['lint:json', 'lint:js', 'lint:ts']);