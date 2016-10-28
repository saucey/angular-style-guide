/**
 * Base class that adds the functionality to configure your component
 * The initial configuration is put in this.options (by your component)
 * During element init the aaConfig attribute is read as JSON
 * This object is merged with the options object
 * Key names in the config object are paths into the options object
 * - Example: title -> modifies options.title
 * - inlay.slider.start -> modifies the options.inlay.slider.start property
 */
import {Component, ElementRef, Input, OnInit} from '@angular/core';
import * as libUtil from "../util";
import * as libXsr from "../xsr";

// Global windows key for cross component communication
const GLOBAL_KEY = '__AA__';

declare var window : any;

/**
 * General base class for all AA components
 * Adds basic functionality
 */
export class AABaseComponent implements OnInit {
  public element: any;
  public defaultOptions: any = {};
  public data: any = {};
  public options: any = {};
  public contentHtml: string;

  // Global registration
  // Now we use a global window object to enable external Javascript access.
  // We could also use a public static property, but that would prevent external
  // access.
  public global : any = window[GLOBAL_KEY] = window[GLOBAL_KEY] || {};
  private globalId: string;

  constructor(thisElement: ElementRef) {
    var nativeElement = thisElement.nativeElement,
      aaContentHtml = nativeElement.getAttribute('aaContentHtml');
    // Native element reference
    this.element = nativeElement;
    // aaData json
    var attrData = this.element.getAttribute('aaData'),
      json;
    if (attrData) {
      // Parse data attribute as JSON
      this.data = libUtil.tryParseJson(attrData, {});
    }

    // Parse content HTML
    if (aaContentHtml) {
      this.contentHtml = aaContentHtml;
    }
  }
  /**
   * Get a key from global window object
   */
  getGlobal(key : string) : any {
    return this.global[key];
  }
  /**
   * Set a key on global window object
   */
  setGlobal(key : string, value : any) : any {
    this.global[key] = value;
    return value;
  }
  /**
   * Runs when input/output is parsed (in this case options)
   */
  ngOnInit(): void {
    var keys = Object.keys(this.options) || [],
      aaId = this.element.getAttribute('aaId');
    // Register aaId as global?
    if (aaId) {
      this.setGlobal(aaId, this);
      this.globalId = aaId;
    }
    // Merge options with default options
    if (this.options || this.defaultOptions) {

      // First clone default options
      this.data.options = this.defaultOptions ? libUtil.clone(this.defaultOptions) : {};
      keys.map((key) => {
        libXsr.path(this.data.options, key, this.options[key]);
      });
    }
    // Reset state
    this.reset();
  }
  reset() : void {
    // Init/reset state
  }

  // Unregister on destroy
  ngOnDestroy() {
    if (this.globalId) {
      // Unregister object
      this.setGlobal(this.globalId, undefined);
    }
  }
  /**
   * Force a dirty check from "outside" to make sure all bindings are refreshed
   */
  public refresh(func: any = undefined) : void {
    func = func || (() => {});
    // Run dirty check
    // Use this['zone'] notation, because of a TypeScript quirk
    // You cannot declare zone here, and have it injected in the constructor of the
    // derived class without getting warnings.
    if (this['zone']) {
      this['zone'].run(func);
    }
    // Trigger resize to make sure components redraw
    window.dispatchEvent(new Event('resize'));
  }
}
