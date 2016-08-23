/**
 * Aegon Angular boot script
 * Bootstraps aa-* components on the page.
 * You don't need to bootstrap components yourself in the page
 */
// import {Component} from 'angular2/core';
declare var System;
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Check for existence and boot up component
   * - First checking, might result in higher start up times
   * - If no component is found the component is not initialized
   * - Currently the code for every component is loaded anyway on every page, so
   *   we don't reduce download size in this way.
   */
  System.import('aegon-angular/lib/bootComponents')
  .then((module) => {
    module.init();
  }, console.error.bind(console));
});