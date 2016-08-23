/**
 * Component related utily functions
 */
import {Component, ElementRef} from 'angular2/core';
import {AATemplateComponent} from './classes/AATemplateComponent';

/**
 * Dynamically create a component based on supplied input/template
 * @param {String} selector Selector to use for the newly created component,
 *   e.g. my-component or #my-id
 * @param {String} template Template string for the new component
 * @param {Any[]} directives List of directives to include
 * @returns {Component} Newly created component definition
 */
export function toComponent(selector: string, template: string, directives : any[] = []) : any {
  @Component({
    selector: selector,
    directives: directives,
    template: template
  })
  class TemplateComponent extends AATemplateComponent {
    // Let parent class initialize config; the dependency injection with ElementRef
    // doesn't work directly so we have to call it explicitly.
    constructor(private elementRef: ElementRef) {
      super(elementRef);
    }
  }
  return TemplateComponent;
};
