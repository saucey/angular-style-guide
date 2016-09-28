/*
 * cXstudio
 * Karma config
 */
'use strict';

module.exports = function(config) {
    config.set({

        // Frameworks
        //
        // See: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // List of the files we load into the browser
        //
        // See: http://karma-runner.github.io/0.13/config/configuration-file.html
        files: [
            'node_modules/es6-shim/es6-shim.min.js',
            'karma.entry.js'
        ],
        // Enable console debug messages
        browserConsoleLogOptions: {level: "debug", format: "%b %T: %m", terminal: true},

        // Enable remote debug http://127.0.0.1:9876/debug.html
        port:9876,

        // Preprocessors
        //
        // See: https://npmjs.org/browse/keyword/karma-preprocessor
        // Important: coverage should be 1st item in array
        preprocessors: {
            'karma.entry.js': ['coverage', 'webpack']
        },

        // Include webpack config
        //
        // See: https://github.com/webpack/karma-webpack
        webpack: require('./webpack.test'),

        // No console logs from webpack
        //
        // See: https://github.com/webpack/karma-webpack
        webpackServer: {
            noInfo: true
        },

        // Reporters
        //
        // See: https://www.npmjs.com/browse/keyword/karma-reporter
        reporters: ['spec', 'junit', 'progress', 'coverage'],

        // disable auto testing when file changes
        //
        // See: http://karma-runner.github.io/0.13/config/configuration-file.html
        autoWatch: false,

        // Ci mode, set to true if you want to karma to stop after running the tests
        //
        // See: http://karma-runner.github.io/0.13/config/configuration-file.html
        singleRun: true,

        // List of browsers that karma uses and captures
        //
        // See: http://karma-runner.github.io/0.13/config/browsers.html
        browsers: ['PhantomJS'], //, 'PhantomJS_Custom'],
        // customLaunchers: {
        //     'PhantomJS_Custom': {
        //         base: 'PhantomJS',
        //         options: {
        //             windowName: 'AIP1.5',
        //             settings: {
        //                 webSecurityEnabled: false
        //             },
        //         },
        //         flags: ['--load-images=true'],
        //         debug: true
        //     }
        // },

        // Coverage reporter
        //
        // See: https://karma-runner.github.io/0.8/config/coverage.html
        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'text-summary' },
                { type: 'json' },
                { type: 'html' },
                { type: 'cobertura'}
            ]
        },

        junitReporter: {
            outputDir: './coverage', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'jasmine.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: '', // suite will become the package name attribute in xml testsuite element
            useBrowserName: false, // add browser name to report and classes names
            nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
            classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element,
            properties: {} // key value pair of properties to add to the <properties> section of the report
        }

    });
};
