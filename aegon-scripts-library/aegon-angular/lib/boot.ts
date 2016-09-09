/**
 * Aegon Angular boot script
 * Runs on initial download (as js file, not as a TypeScript module)
 * You don't need to bootstrap components yourself in the page
 */
declare var System;

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Bootstrap full library from separate module
   */
  System.import('aegon-angular/lib/bootComponents')
  .then((module) => {
    module.init();
  }, console.error.bind(console));
});