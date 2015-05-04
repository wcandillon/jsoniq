'use strict';

var config = {
    json: ['*.json', 'lib/**/*.json', '!./dist/**/*'],
    js: ['gulpfile.js', '!./dist/**/*'],
    ts: ['**/*.ts', '!./node_modules/**/*.ts', '!typings/**/*.ts', '!dist/**/*.ts'],
    dist: 'dist'
};

module.exports = config;