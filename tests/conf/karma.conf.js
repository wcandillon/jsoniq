module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],//'Firefox',
        files: [
            'dist/jsoniq.js',
            'dist/tests/**.spec.js'
        ],
        captureTimeout: 60000,
        colors: true,
        exclude: [],
        logLevel: config.LOG_INFO,
        port: 9876,
        plugins: [
            //'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],
        runnerPort: 9100,
        singleRun: true,
        autoWatch: false,
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        reporters: ['progress', 'coverage']
    });
};