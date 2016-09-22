/**
 * Aegon Angular boot script
 * Compiles new aa-templates and bootstraps them
 * You don't need to bootstrap components yourself in the page
 */
// Core
import {Component} from 'angular2/core';
import 'components/angular-bootstrap/main';
import {bootstrap} from 'angular2/platform/browser';
// Libs
import * as libComponent from "./component";
import * as libUtil from "./util";

// Include all components; they will be added to the dynamic component directives
import {AAHighchartComponent} from '../components/aa-highchart/aa-highchart.component';
import {AAHintComponent} from '../components/aa-hint/aa-hint.component';
import {AAAovFormMeComponent} from '../components/aa-aov-form-me/aa-aov-form-me.component';
import {AAAovFormYouComponent} from '../components/aa-aov-form-you/aa-aov-form-you.component';
import {AAAovFormBothComponent} from '../components/aa-aov-form-both/aa-aov-form-both.component';
import {AACollapseComponent} from '../components/aa-collapse/aa-collapse.component';
import {AAInputDropDownComponent} from '../components/aa-input-dropdown/aa-input-dropdown.component';
import {AAInputNumberComponent} from '../components/aa-input-number/aa-input-number.component';
import {AAInputRadioComponent} from '../components/aa-input-radio/aa-input-radio.component';
import {AASliderComponent} from '../components/aa-slider/aa-slider.component';
import {AALightboxComponent} from '../components/aa-lightbox/aa-lightbox.component';
import {AASliderInputComponent} from '../components/aa-slider-input/aa-slider-input.component';
import {AADataComponent} from '../components/aa-data/aa-data.component';
// Quick quotes
import {AAQQBeleggenComponent} from '../components/aa-qq-beleggen/aa-qq-beleggen.component';
import {AAQQHistorischRendementComponent} from '../components/aa-qq-historisch-rendement/aa-qq-historisch-rendement.component';
import {AAQQAovComponent} from '../components/aa-qq-aov/aa-qq-aov.component';
import {AAAovFormComponent} from '../components/aa-aov-form/aa-aov-form.component';
import {AAQQSummaryComponent} from '../components/aa-qq-summary/aa-qq-summary.component';

declare var System;

const
  /**
   * These will be added to dynamically generated components so you can use them automatically
   * Add your own component here to be able to use it in an <aa-template>
   */
  ALL_COMPONENTS = [
    // Components
    AAHighchartComponent,
    AAHintComponent,
    AAInputDropDownComponent,
    AAInputNumberComponent,
    AAInputRadioComponent,
    AASliderComponent,
    AASliderInputComponent,
    AALightboxComponent,
    AADataComponent,
    AACollapseComponent,
    AAAovFormYouComponent,
    AAAovFormBothComponent,
    // Quick quotes
    AAAovFormMeComponent,
    AAQQBeleggenComponent,
    AAQQHistorischRendementComponent,
    AAQQAovComponent,
    AAAovFormComponent,
    AAQQSummaryComponent
  ],
  /**
   * Allow these components as bootstrap components
   * If an element is in here you can use it directly in the page
   * Otherwise you need to use it inside an aa-template (which is actually better)
   */
  BOOTSTRAP_COMPONENTS = {
    // 'aa-qq-historisch-rendement': 'aegon-angular/components/aa-qq-historisch-rendement/bootstrap',
    // 'aa-qq-beleggen': 'aegon-angular/components/aa-qq-beleggen/bootstrap',
  },
  /**
   * Selector to use for auto bootstrap templates
   */
  AA_TEMPLATE_SELECTOR = 'aa-template',
  /**
   * Selector to use for components that want access to their content innerHTML
   * For root components Contentchildren is not available (by design), and this
   * is a workaround for that. After processing it is available in the
   * aaContent attribute, and on this.contentHtml
   */
  AA_CONTENT_SELECTOR = 'aa-data'

/**
 * Check for existence and boot up component
 * - First checking, might result in higher start up times
 * - If no component is found the component is not initialized
 * - Currently the code for every component is loaded anyway on every page, so
 *   we don't reduce download size in this way.
 */
var bootComponents = function () {
  var importsTodo = [],
    components = [],
    // Load all used components at once
    importComponents = function () {
      importsTodo.map((value) => {
        System.import(value)
        .then(null, console.error.bind(console));
      });
    },
    // Moves inner html to aaContent attribute. Is used because innerhtml is lost after component creation.
    saveContentHtml = function (elem) {
      if (!elem) {
        return;
      }
      elem.setAttribute('aaContentHtml', libUtil.trim(elem.innerHTML));
    },
    randomId = function (prefix : string = 'id-') {
      return prefix + new Date().getTime().toString(36);
    },
    elems;
  /**
   * Store innerHTML for some components
   * Add inner html as attribute, because innerHTML is not available anymore
   * in the constructor
   * Here we hack the innerhtml into an attribute, and use it on component
   * instantiation.
   */
  elems = document.querySelectorAll(AA_CONTENT_SELECTOR);
  for (let i = 0; i < elems.length; i++) {
    saveContentHtml(elems[i]);
  }
  /**
   * Now we can create unique components for each template we encounter
   * Create unique component and bootstrap
   */
  elems = document.querySelectorAll(AA_TEMPLATE_SELECTOR);
  for (let i = 0; i < elems.length; i++) {
    let id = randomId(),
      elem = elems[i],
      // Create unique component with innerhtml as template
      component = libComponent.toComponent('#' + id, elem.innerHTML, ALL_COMPONENTS);
    elem.id = id;
    bootstrap(component);
  };
  /**
   * Auto bootstrap a selected list of components
   * DEPRECATED: now always use aa-template with in it the template you want to
   * bootstrap
   */
  Object.keys(BOOTSTRAP_COMPONENTS).map((key) => {
    let elems = document.querySelectorAll(key);
    if (elems && elems.length > 0) {
      // Save inner html for all of them
      for (let i = 0; i < elems.length; i++) {
        saveContentHtml(elems[i]);
      }
      // Import component script
      var value = BOOTSTRAP_COMPONENTS[key];
      if (value) {
        importsTodo.push(value);
      }
    }
  });
  // Load actual components scripts
  importComponents();
};

export function init() : void {
  bootComponents();
}
