'use strict';

var gulp = require('gulp');
var ts = require('gulp-type');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();

var Config = require('./tasks/config');

require('./tasks/lint');

var tsProject = ts.createProject({
    target: 'ES5',
    module: 'commonjs',
    noExternalResolve: true
});

gulp.task('clean', function () {
    return gulp.src('dist').pipe($.clean());
});

gulp.task('compile', function(){
    return gulp.src(Config.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject)).js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-build', ['compile'], function(){
    return browserify().require('./dist/lib/stores/indexeddb/IndexedDBStore.js', { expose: 'IndexedDBStore' }).bundle()
        .pipe(source('jsoniq.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('jasmine', function () {
    var jasmine = require('gulp-jasmine');
    return gulp.src('dist/tests/node/**/*.js').pipe(jasmine());
});

gulp.task('karma', function(done){
    karma.start({
        configFile: __dirname + '/tests/browser/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', ['test-build'], function() {
    gulp.watch(Config.ts, ['test-build']);
});

gulp.task('default', ['clean', 'lint'], function(){
    var runSequence = require('run-sequence');
    return runSequence('test-build', 'jasmine', 'karma');
});
