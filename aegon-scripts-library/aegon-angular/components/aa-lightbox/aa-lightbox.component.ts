import {Injector, DynamicComponentLoader, Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {template} from "./template";
import {AAConfigComponent} from '../../lib/classes/AAConfigComponent';

@Component({
  selector: 'aa-lightbox',
  template: template
})

export class AALightboxComponent extends AAConfigComponent {
  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  // constructor(private elementRef: ElementRef) {
  //   super(elementRef);
  //   console.log('this', this);
  // }

  constructor(loader: DynamicComponentLoader, elementRef: ElementRef, injector: Injector) {
    super(elementRef);
  }
}
