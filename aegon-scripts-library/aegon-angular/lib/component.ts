/**
 * Component related utily functions
 */
import {Component, ElementRef, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AATemplateComponent} from './classes/AATemplateComponent';
import {AppComponentModule} from '../app.module'

/**
 * Dynamically create a component based on supplied input/template
 * @param {String} selector Selector to use for the newly created component,
 *   e.g. my-component or #my-id
 * @param {String} template Template string for the new component
 * @param {Any[]} directives List of directives to include
 * @returns {Component} Newly created component definition
 */
export function toComponentModule(selector: string, template: string) : any {

  @Component({
    selector: selector,
    template: template
  })
  class TemplateComponent extends AATemplateComponent {
    // Let parent class initialize config; the dependency injection with ElementRef
    // doesn't work directly so we have to call it explicitly.
    constructor(private elementRef: ElementRef) {
      super(elementRef);
    }
  }

  @NgModule({
    imports:      [ AppComponentModule, BrowserModule ],
    declarations: [ TemplateComponent ],
    bootstrap:    [ TemplateComponent ]
  })
  class TemplateComponentModule { }

  return TemplateComponentModule;
};
