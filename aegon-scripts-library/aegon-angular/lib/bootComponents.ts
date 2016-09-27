/**
 * Aegon Angular boot script
 * Compiles new aa-templates and bootstraps them
 * You don't need to bootstrap components yourself in the page
 */
// Core
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

const platform = platformBrowserDynamic();

// LibsW
import * as libComponent from "./component";
import * as libUtil from "./util";

declare var System;

const

  /**
   * Selector to use for auto bootstrap templates
   */
  AA_TEMPLATE_SELECTOR = 'aa-template',
  /**
   * Selector to use for components that want access to their content innerHTML
   * For root components Contentchildren/innerHTML is not available (by design)
   * This is a workaround for that. After processing the innerHTML is is available
   * in the aaContentHtml attribute, and on this.contentHtml if you base your
   * component on AABaseComponent
   */
  AA_CONTENT_SELECTOR = 'aa-data,aa-css';

/**
 * Boot the components
 */
var bootComponents = function () {
  var components = [],
    // Moves inner html to aaContentHtml attribute. This is the only way to
    // save innerHtml. After angular boot it isn't available anymore on the element.
    saveContentHtml = function (elem) {
      if (!elem) {
        return;
      }
      elem.setAttribute('aaContentHtml', libUtil.trim(elem.innerHTML));
    },
    // Create random id based on time
    randomId = function (prefix : string = 'id-') {
      return prefix + new Date().getTime().toString(36);
    },
    elems;

  /**
   * Store innerHTML for subset of elements
   */
  elems = document.querySelectorAll(AA_CONTENT_SELECTOR);
  for (let i = 0; i < elems.length; i++) {
    saveContentHtml(elems[i]);
  }

  /**
   * Now we create unique components for each aa-template we encounter
   */
  elems = document.querySelectorAll(AA_TEMPLATE_SELECTOR);
  for (let i = 0; i < elems.length; i++) {
    let id = randomId(),
      elem = elems[i],
      // Create unique component with inner html as template
      componentModule = libComponent.toComponentModule('#' + id, elem.innerHTML);
    elem.id = id;

    platform.bootstrapModule(componentModule);
  }
};


document.addEventListener('DOMContentLoaded', function() {

  bootComponents();
});
