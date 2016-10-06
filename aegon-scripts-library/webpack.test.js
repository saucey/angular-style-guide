/*
 * cXstudio
 * Webpack Test Config
 * Used to run Karma tests
 */
'use strict';

var webpackMerge = require('webpack-merge'),
    webpackCommonConfig = require('./webpack.common.js');

module.exports = webpackMerge(webpackCommonConfig, {
    // Html loader advanced options
    //
    // See: https://github.com/webpack/html-loader#advanced-options
    // Needed to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    htmlLoader: {
        minimize: false,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
        ],
        customAttrAssign: [/\)?\]?=/]
    },


    /**
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    module: {
        postLoaders: [

            /**
             * Instruments JS files with Istanbul for subsequent code coverage reporting.
             * Instrument only testing sources.
             *
             * See: https://github.com/deepsweet/istanbul-instrumenter-loader
             */
            {
                test: /\.ts$/, loader: 'istanbul-instrumenter-loader',
                include: __dirname,
                exclude: [
                    /\.(e2e|spec)\.ts$/,
                    /node_modules/
                ]
            }
        ]
    }

});
