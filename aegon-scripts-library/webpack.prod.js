/*
 * cXstudio
 * Webpack Dev Config
 * See gulpfile.js (gulp task webpack)
 */
'use strict';

var webpack = require('webpack'),
    webpackMerge = require('webpack-merge'),
    webpackCommonConfig = require('./webpack.common.js'),
    WebpackMd5Hash = require('webpack-md5-hash');

module.exports = webpackMerge(webpackCommonConfig, {
    output: {
        path: __dirname + 'dist/scripts',
        filename: 'bundle.js'
    },

    devtool: 'source-map',

    plugins: [
        // Plugin: WebpackMd5Hash
        // Description: Plugin to replace a standard webpack chunkhash with md5.
        //
        // See: https://www.npmjs.com/package/webpack-md5-hash
        new WebpackMd5Hash(),

        // Plugin: DedupePlugin
        // Description: Prevents the inclusion of duplicate code into your bundle
        // and instead applies a copy of the function at runtime.
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        // See: https://github.com/webpack/docs/wiki/optimization#deduplication
        new webpack.optimize.DedupePlugin(),

        // Plugin: UglifyJsPlugin
        // Description: Minimize all JavaScript output of chunks.
        // Loaders are switched into minimizing mode.
        //
        // See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
        new webpack.optimize.UglifyJsPlugin({
            //beautify: true, //debug
            //mangle: false, //debug
            //dead_code: false, //debug
            //unused: false, //debug
            //deadCode: false, //debug
            //compress: {
            //  screw_ie8: true,
            //  keep_fnames: true,
            //  drop_debugger: false,
            //  dead_code: false,
            //  unused: false
            //}, // debug
            //comments: true, //debug
            beautify: false, //prod
            mangle: {
                screw_ie8 : true,
                keep_fnames: true
            }, //prod
            minimize: true,
            compress: {
                screw_ie8: true
            }, //prod
            comments: false //prod
        })
    ],
    // Html loader advanced options
    //
    // See: https://github.com/webpack/html-loader#advanced-options
    // Needed to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
        ],
        customAttrAssign: [/\)?\]?=/]
    }
});
