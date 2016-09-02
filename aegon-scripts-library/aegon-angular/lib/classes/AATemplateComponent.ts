import {Component, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {AABaseComponent} from './AABaseComponent';
import * as libUtil from "../util";

export class AATemplateComponent extends AABaseComponent implements OnInit {
  constructor(thisElement: ElementRef) {
    super(thisElement);
  }
  ngOnInit(): void {
    // Add loaded class; hides loading indicator
    // Do this after all values and options have been initialized
    super.ngOnInit();
    // Add timeout to make sure dom element moves are done before content
    // becomes visible
    setTimeout(() => {
      this.element.className += ' aa-template--loaded';
    });
  }
}
