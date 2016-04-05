"use strict";

(function () {
  // Currently available Angular 2 based components.
  var angularComponents = [
    {dirName: 'quickquote-dip', selector: '#aegon-quickquote-dip'}
  ],
  i;

  // Generic configuration for all Angular 2 based components.
  /*System.config({
    packages: {
      'components': {
        format: 'register',
        defaultExtension: 'js'
      }
    },
    map: {
      "components": "/scripts/components"
    }
  });*/

  for (i = 0; i < angularComponents.length; i++) {
    addDrupalBehavior(angularComponents[i]);
  }

  function addDrupalBehavior(component) {
    var componentName = component.dirName;
    Drupal.behaviors[componentName] = {
      attach: function (context, settings) {// jshint ignore:line
        var pathToJS,
          containerElem = document.querySelector(component.selector);
        if (containerElem) {
          // Found the element to bootstrap Angular on.
          if (window.location.hostname.lastIndexOf('aegon.nl') === window.location.hostname.length - 'aegon.nl'.length) {
            pathToJS = '/' + Drupal.settings.pathToTheme + '/dist/js/';
          }
          else {
            pathToJS = '/scripts/';
          }
          require([pathToJS + 'angular2-deps.js'], function () {
            require([pathToJS + 'ts-compiled.js'], function () {
              /* jshint ignore:start */
              System.import('components/' + componentName + '/main')
                .then(null, console.error.bind(console));
              /* jshint ignore:end */
            });
          });
        }
      }
    };
  }
})();
