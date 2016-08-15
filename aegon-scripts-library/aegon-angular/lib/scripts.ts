/**
 * Library to dynamically load a javascript file in the browser.
 * - Scripts can be aliased; which centralizes script urls.
 * - Scripts are loaded at most once
 */

/**
 * Lookup table with script aliases. Use aliases as much as possible, that makes
 * upgrading easier. Also all external scripts are listed in a single file.
 */
var SCRIPTFILES = {
    highcharts: 'https://code.highcharts.com/4.2.6/highcharts.js',
  },
  // Internal promises hash for loaded scripts
  promises = {};
/**
 * Loads an external javascript file at most once. Even if this library is
 * included in multiple files and/or the loadscript is called multiple times.
 * The script that is loaded is either an alias script, which is looked up in
 * SCRIPTFILES. Otherwise the supplied string is treated as the script url.
 *
 * @param {String} srcId Script alias id (if available), or script url
 * @returns {Promise} The promise resolves when the script is loaded. It
 *   doesn't matter if the script is already loaded or needs to be loaded.
 *   You can trust the promise :)
 *
 * EXAMPLE: loadScript('highcharts').then(() => { runs after script is loaded });
 */
export function loadScript(srcId: string) : any {
  // Script already loaded? Return initial promise.
  if (promises[srcId]) {
    return promises[srcId];
  }
  // New script: load it
  var src = SCRIPTFILES[srcId],
    s = document.createElement('script'),
    promise = new Promise(function (resolve, reject) {
      if (!src) {
        // Script id not found; use id as src url
        src = srcId;
      }
      var ready = function () {
          s.removeEventListener('load', ready, false);
          resolve();
        };
      s.async = true;
      s.setAttribute('src', src);
      s.addEventListener('load', ready, false);
      document.head.appendChild(s);
    });
  promises[srcId] = promise;
  return promise;
}