/**
 * Base class that adds the functionality to configure your component
 * The initial configuration is put in this.options (by your component)
 * During element init the aaConfig attribute is read as JSON
 * This object is merged with the options object
 * Key names in the config object are paths into the options object
 * - Example: title -> modifies options.title
 * - inlay.slider.start -> modifies the options.inlay.slider.start property
 */
import {Component, ElementRef, Input, OnInit} from 'angular2/core';
import * as libUtil from "../util";
import * as libXsr from "../xsr";

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

  constructor(thisElement: ElementRef) {
    var nativeElement = thisElement.nativeElement,
      aaContentHtml = nativeElement.getAttribute('aaContentHtml');
    // native element reference
    this.element = nativeElement;
    // Parse content HTML
    if (aaContentHtml) {
      this.contentHtml = aaContentHtml;
    }
  }
  // Runs when input/output is parsed (in this case options)
  ngOnInit(): void {
    var keys = Object.keys(this.options) || [];
    // Merge options with default options; first clone default options
    // Add resulting options to data object
    if (this.options || this.defaultOptions) {
      this.data.options = this.defaultOptions ? libUtil.clone(this.defaultOptions) : {};
      keys.map((key) => {
        libXsr.path(this.data.options, key, this.options[key]);
      });
    }
    // console.log('merged', this.data.options);
  }
}

