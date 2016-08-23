/**
 * Base class that adds the functionality to configure your component
 * The initial configuration is put in this.options (by your component)
 * During element init the aaConfig attribute is read as JSON
 * This object is merged with the options object
 * Key names in the config object are paths into the options object
 * - Example: title -> modifies options.title
 * - inlay.slider.start -> modifies the options.inlay.slider.start property
 */
import {Component, ElementRef, OnInit} from 'angular2/core';
import * as libUtil from "../util";
import * as libXsr from "../xsr";

declare var window : any;

const GLOBAL_PROPERTY = '__AA__';
const GLOBAL_PATH_INSTANCES = 'instances';

/**
 * General base class for all AA components
 * Adds basic functionality
 */
export class AAConfigComponent implements OnInit{
  // Config is under aaConfig attribute
  protected element: any;
  public config: any = {};
  public options: any;
  public contentHtml: any;
  public aaId: string;
  constructor(thisElement: ElementRef) {
    var nativeElement = thisElement.nativeElement,
      aaContent = nativeElement.getAttribute('aacontent');
    // native element reference
    this.element = nativeElement;
    // Parse config
    this.config = libUtil.jsonAttribute(nativeElement, 'aaconfig') || {};
    // Parse content HTML
    if (aaContent) {
      this.contentHtml = aaContent;
    }
    // Parse id
    this.aaId = nativeElement.getAttribute('aaid');
    if (this.aaId) {
      this.registerAAInstance();
    }
  }
  // Runs when input/output is parsed (in this case options)
  ngOnInit(): void {
    var keys = Object.keys(this.config) || [];
    // Merge options with config (overrides)
    this.options = this.options ? libUtil.clone(this.options) : {};
    keys.map((key) => {
      libXsr.path(this.options, key, this.config[key]);
    });
    // console.log('merged', this.options);
  }

  /**
   * Set a path/value in the global AA window object
   */
  getGlobal(path: string = undefined): any {
    var globals = window[GLOBAL_PROPERTY] || {};
    return libXsr.path(globals, path).value;
  }

  /**
   * Read a path/value from the global AA window object
   */
  setGlobal(path: string, value: any) : any {
    var globals = window[GLOBAL_PROPERTY] || {},
      result = libXsr.path(globals, path, value);
    window[GLOBAL_PROPERTY] = globals;
    return result;
  }

  /**
   * Register this instance in the global AA registry
   * This way it can be accessed from the plain Javascript world.
   * - Will only happen if aaId property is set
   * - These references are not cleaned up; so make sure to only
   *   use it for static components.
   */
  registerAAInstance() : any {
    return this.setGlobal([GLOBAL_PATH_INSTANCES, this.aaId].join('.'), this);
  }
}

