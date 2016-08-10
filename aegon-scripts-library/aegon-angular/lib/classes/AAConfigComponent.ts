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

export class AAConfigComponent implements OnInit{
  // Config is under aaConfig attribute
  protected element: any;
  public config: any = {};
  public options: any = {};
  constructor(thisElement: ElementRef) {
    var nativeElement = thisElement.nativeElement;
    this.element = nativeElement;
    // Parse config
    var json = libUtil.jsonAttribute(nativeElement, 'aaconfig') || {};
    this.config = json;
  }
  ngOnInit(): void {
    var keys = Object.keys(this.config) || [];
    // Merge options with config (overrides)
    keys.map((key) => {
      libXsr.path(this.options, key, this.config[key]);
    });
    // console.log('merged', this.options);
  }
}