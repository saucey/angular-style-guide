/*
 * cXstudio
 * Webpack Common Config
 */
'use strict';

var autoprefixer = require('autoprefixer');

module.exports = {
    entry: './entry.ts',

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    postcss: function () {
        return [autoprefixer({ browsers: ['ie >= 9', 'last 2 versions']})];
    }
};
