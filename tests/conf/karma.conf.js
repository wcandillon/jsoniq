module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],//'Firefox',
        files: [
            'tests/*.spec.js'
        ],
        captureTimeout: 60000,
        colors: true,
        exclude: ['dist/'],
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
        preprocessors: {
            '**/*.ts': ['typescript']
        },
        reporters: ['progress', 'coverage'],
        typescriptPreprocessor: {
            // options passed to the typescript compiler
            options: {
                sourceMap: false, // (optional) Generates corresponding .map file.
                target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
                module: 'commonjs', // (optional) Specify module code generation: 'commonjs' or 'amd'
                noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
                noResolve: true, // (optional) Skip resolution and preprocessing.
                removeComments: true // (optional) Do not emit comments to output.
            },
            // transforming the filenames
            transformPath: function(path) {
                return path.replace(/\.ts$/, '.js');
            }
        }
    });
};