/**
 * Aegon Angular boot script
 * Bootstraps aa-* components on the page.
 * You don't need to bootstrap components yourself in the page
 */
declare var System;
const COMPONENTS = {
  'aa-qq-beleggen': 'aegon-angular/components/aa-qq-beleggen/bootstrap',
  'aa-qq-historisch-rendement': 'aegon-angular/components/aa-qq-historisch-rendement/bootstrap'
  };
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Check for existence and boot up component
   * - First checking, might result in higher start up times
   * - If no component is found the component is not initialized
   * - Currently the code for every component is loaded anyway on every page
   */
  var bootComponents = function () {
      Object.keys(COMPONENTS).map((key) => {
        var elem = document.querySelectorAll(key);
        if (elem && elem.length > 0) {
          var value = COMPONENTS[key];
          // console.log('bootstrap', key, elem, value);
          if (value) {
            System.import(value)
            .then(null, console.error.bind(console));
          }
        }
      });
    };
  bootComponents();
});