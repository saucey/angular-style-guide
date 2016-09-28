/**
 * General base class for all AA directives
 */
import {ElementRef, OnInit} from '@angular/core';

export class AABaseDirective{
  public element: any;

  constructor(thisElement: ElementRef) {
    var nativeElement = thisElement.nativeElement;
    // native element reference
    this.element = nativeElement;
  }
}

