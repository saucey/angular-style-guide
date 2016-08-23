import {Component, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {AABaseComponent} from './AABaseComponent';
import * as libUtil from "../util";

export class AATemplateComponent extends AABaseComponent implements OnInit {
  constructor(thisElement: ElementRef) {
    super(thisElement);
    var attrData = this.element.getAttribute('data'),
      json;
    if (attrData) {
      // Parse data attribute as JSON
      this.data = libUtil.tryParseJson(attrData, {});
    }
  }
  ngOnInit(): void {
    // Add loaded class; hides loading indicator
    // Do this after all values and options have been initialized
    super.ngOnInit();
    setTimeout(() => {
      this.element.className += ' aa-template--loaded';
    }, 0)
  }
}
