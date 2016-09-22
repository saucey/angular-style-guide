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
// DON'T FORGET TO REGISTER COMPONENT IN ALL_COMPONENTS FOR USING IN AA-TEMPLATE
// Core
import {AAElementDirective} from '../directives/aa-element/aa-element.directive';
import {AACssComponent} from '../components/aa-css/aa-css.component';
import {AADataComponent} from '../components/aa-data/aa-data.component';
// Visual components
import {AAModalComponent} from '../components/aa-modal/aa-modal.component';
import {AAHintComponent} from '../components/aa-hint/aa-hint.component';

import {AAAovFormMeComponent} from '../components/aa-aov-form-me/aa-aov-form-me.component';
import {AAAovFormYouComponent} from '../components/aa-aov-form-you/aa-aov-form-you.component';
import {AAAovFormBothComponent} from '../components/aa-aov-form-both/aa-aov-form-both.component';
import {AACollapseComponent} from '../components/aa-collapse/aa-collapse.component';
import {AAInputDropDownComponent} from '../components/aa-input-dropdown/aa-input-dropdown.component';

import {AAHighchartComponent} from '../components/aa-highchart/aa-highchart.component';
// Inputs & sliders

import {AAInputNumberComponent} from '../components/aa-input-number/aa-input-number.component';
import {AAInputRadioComponent} from '../components/aa-input-radio/aa-input-radio.component';
import {AAInputDropDownComponent} from '../components/aa-input-dropdown/aa-input-dropdown.component';
import {AASliderComponent} from '../components/aa-slider/aa-slider.component';
import {AASliderInputComponent} from '../components/aa-slider-input/aa-slider-input.component';
// Mini apps
import {AALeadformComponent} from '../components/aa-leadform/aa-leadform.component';
import {AAQuizComponent} from '../components/aa-quiz/aa-quiz.component';
// Quick quotes
import {AAQQBeleggenComponent} from '../components/aa-qq-beleggen/aa-qq-beleggen.component';
import {AAQQHistorischRendementComponent} from '../components/aa-qq-historisch-rendement/aa-qq-historisch-rendement.component';
import {AAQQAovComponent} from '../components/aa-qq-aov/aa-qq-aov.component';

import {AAAovFormComponent} from '../components/aa-aov-form/aa-aov-form.component';

import {AAQQBoeterenteComponent} from '../components/aa-qq-boeterente/aa-qq-boeterente.component';

import {AAQQSummaryComponent} from '../components/aa-qq-summary/aa-qq-summary.component';


declare var System;

const
  /**
   * These will be added to dynamically generated components so you can use them automatically
   * Add your own component here to be able to use it in an <aa-template>
   */
  ALL_COMPONENTS = [
    // Core
    AAElementDirective,
    AACssComponent,
    // Components
    AAHighchartComponent,
    AAHintComponent,
    AAInputDropDownComponent,
    AAInputNumberComponent,
    AAInputRadioComponent,
    AASliderComponent,
    AASliderInputComponent,
    AADataComponent,

    AACollapseComponent,
    AAAovFormYouComponent,
    AAAovFormBothComponent,

    AAModalComponent,
    AALeadformComponent,
    AAQuizComponent,

    // Quick quotes
    AAAovFormMeComponent,
    AAQQBeleggenComponent,
    AAQQHistorischRendementComponent,
    AAQQAovComponent,

    AAAovFormComponent,

    AAQQBoeterenteComponent,

    AAQQSummaryComponent
  ],
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
  AA_CONTENT_SELECTOR = 'aa-data,aa-css'

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
      // Create unique component with innerhtml as template
      component = libComponent.toComponent('#' + id, elem.innerHTML, ALL_COMPONENTS);
    elem.id = id;
    // Bootstrap component
    bootstrap(component);
  };
};
var initialized = false;
export function init() : void {
  if (initialized) {
    return;
  }
  initialized = true;
  bootComponents();
}
