module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jsonlint: {
            all: ['package.json']
        },
        vows: {
            all: {
                options: {
                    verbose: true,
                    colors: true,
                    coverage: 'json'
                },
                src: ['tests/**/*.js']
            }
        }
    });

    // Load local tasks.
    //grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task.
    grunt.registerTask('default', ['jsonlint', 'jshint', 'vows']);
};
