module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'lib/**/*.js', 'tests/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jsonlint: {
            all: ['*.json', 'lib/**/*.json']
        },
        clean: {
            build: {
                src: ['dist/**/*']
            }
        },
        ts: {
            options: {
                target: 'es5',
                module: 'commonjs'
            },
            build: {
                src: ['lib/**/*.ts'],
                outDir: 'dist'
            }
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
        },
        typedoc: {
            build: {
                options: {
                    out: 'docs',
                    name: 'jsoniq',
                    target: 'es5'
                },
                src: [
                    'lib/**/*.ts'
                ]
            }
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON('tslint.json')
            },
            files: {
                src: ['lib/**/*.ts']
            }
        },
        'gh-pages': {
            docs: {
                src: '**/*',
                options: {
                    base: 'docs'
                }
            }
        }
    });

    grunt.registerTask('deploy', function() {
        if(process.env.TRAVIS_BRANCH === 'master' && process.env.TRAVIS_PULL_REQUEST === 'false') {
            grunt.task.run(['gh-pages']);
        }
    });

    // Load local tasks.
    //grunt.loadTasks('tasks');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task.
    grunt.registerTask('default', ['clean', 'jsonlint', 'jshint', 'tslint', 'ts', 'vows', 'typedoc']);
};
