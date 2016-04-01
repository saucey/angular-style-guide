"use strict";

(function () {
  // Currently available Angular 2 based components.
  var angularComponents = [
    'quickquote-dip'
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

  function addDrupalBehavior(componentName) {
    Drupal.behaviors[componentName] = {
      attach: function (context, settings) {
        if (settings.onlineAegonNl.hostname === 'local') {
          var pathToJS = '/scripts/';
        } else {
          var pathToJS = '/' + Drupal.settings.pathToTheme + '/dist/js/';
        }
        require([pathToJS + 'angular2-deps.js'], function () {
          require([pathToJS + 'ts-compiled.js'], function () {
            System.import('components/' + componentName + '/main')
                  .then(null, console.error.bind(console));
          });
        });
      }
    };
  }
})();
