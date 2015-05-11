'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;
var $ = require('gulp-load-plugins')();

var Config = require('./tasks/config');

require('./tasks/lint');
require('./tasks/compile');
require('./tasks/rex');

gulp.task('browserify', function(){
    return browserify().require('./dist/lib/stores/indexeddb/IndexedDBStore.js', { expose: 'IndexedDBStore' }).bundle()
        .pipe(source('jsoniq.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('test-build', $.sequence('compile', 'browserify'));

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
    gulp.watch(Config.ts, ['compile']);
});

gulp.task('default', ['lint'], $.sequence('test-build', 'jasmine', 'karma'));
