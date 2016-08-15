/**
 * Component related utily functions
 */
import {Component} from 'angular2/core';

/**
 * Dynamically create a component based on supplied input/template
 * @param {String} selector Selector to use for the newly created component,
 *   e.g. my-component or #my-id
 * @param {String} template Template string for the new component
 * @param {Any[]} directives List of directives to include
 * @returns {Component} Newly created component definition
 */
export function toComponent(selector: string = 'dummy', template, directives = []) : any {
  @Component({ selector, template, directives })
  class FakeComponent { }
  return FakeComponent;
};
