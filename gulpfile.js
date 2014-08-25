'use strict';

var gulp = require('gulp');
var ts = require('gulp-type');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var karma = require('karma').server;

var paths = {
    json: ['*.json', 'lib/**/*.json'],
    js: ['gulpfile.js'],
    ts: ['**/*.ts', '!./node_modules/**/*.ts']
};

var tsProject = ts.createProject({
    target: 'ES5',
    module: 'commonjs',
    noExternalResolve: true
});

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

    gulp.src(paths.ts.concat('!definitions/**/*.ts'))
        .pipe(tslint(require('./tslint.json')))
        .pipe(tslint.report('verbose'));
});

gulp.task('compile', function(){
    return gulp.src(paths.ts)
        .pipe(ts(tsProject)).js
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-build', ['compile'], function(){
    return browserify().require('./dist/lib/stores/IndexedDBStore.js', { expose: 'IndexedDBStore' }).bundle()
        .pipe(source('jsoniq.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('jest', function () {
    var jest = require('gulp-jest');
    return gulp.src('dist/__tests__/').pipe(jest({ rootDir: __dirname + '/dist' }));
});

gulp.task('karma', function(done){
    karma.start({
        configFile: __dirname + '/tests/conf/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', ['test-build'], function() {
    gulp.watch(paths.ts, ['test-build']);
});

gulp.task('default', ['clean', 'lint'], function(){
    var runSequence = require('run-sequence');
    return runSequence('test-build', 'jest', 'karma');
});
