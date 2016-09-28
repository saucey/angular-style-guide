/*
 * cXstudio
 * Webpack Dev Config
 * See gulpfile.js (gulp task webpack-dev-server)
 */
'use strict';

var webpackMerge = require('webpack-merge'),
    webpackCommonConfig = require('./webpack.common.js');

module.exports = webpackMerge(webpackCommonConfig, {

    output: {
        path: __dirname + 'dist/scripts',
        filename: 'bundle.js'
    },
    // To be able to DEBUG (at least using visual studio code)
    devtool: "source-map",
    // This is also needed to debug our app (it must match the output forder)
    devServer: {
        contentBase: "dist/"
    }
});
