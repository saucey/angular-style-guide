"use strict";

// Simplified version of the angular testing seed: (should be updated when going to new angular release and/or webpack
// https://github.com/juliemr/ng2-test-seed/blob/098fa7160e0ea918bbc27dee41d29df4e72411ec/karma.conf.js

/* globals __karma__, Promise */

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.import('angular2/testing').then(function(testing) {
    return System.import('angular2/platform/testing/browser').then(function(providers) {
        testing.setBaseTestProviders(providers.TEST_BROWSER_PLATFORM_PROVIDERS,
            providers.TEST_BROWSER_APPLICATION_PROVIDERS);
    });
}).then(function() {
    return Promise.all(
        Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(function(moduleName) {
                // loads all spec files via their global module names (e.g. 'base/src/app/hero.service.spec')
                return System.import(moduleName);
            }));
    })
    .then(function() {
        __karma__.start();
    }, function(error) {
        //__karma__.error(error.stack || error);
        __karma__.error(error);
    });

function onlySpecFiles(path) {
  return /\.spec\.js$/.test(path);
}