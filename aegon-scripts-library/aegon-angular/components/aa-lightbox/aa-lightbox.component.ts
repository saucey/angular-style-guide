import {Injector, DynamicComponentLoader, Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';

@Component({
  selector: 'aa-lightbox',
  template: template
})

export class AALightboxComponent extends AABaseComponent {
  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(private elementRef: ElementRef) {
    super(elementRef);
  }
}
