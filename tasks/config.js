'use strict';

var config = {
    json: ['*.json', 'lib/**/*.json'],
    js: ['gulpfile.js'],
    ts: ['**/*.ts', '!./node_modules/**/*.ts', '!typings/**/*.ts']
};

module.exports = config;