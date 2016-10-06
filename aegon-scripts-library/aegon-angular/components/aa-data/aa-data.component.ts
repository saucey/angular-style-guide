import {Injector, Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import * as libXsr from "../../lib/xsr";
import * as libUtil from "../../lib/util";
import * as libKeyValue from "../../lib/keyvalue";

@Component({
  selector: 'aa-data',
  template: ''
})

export class AADataComponent extends AABaseComponent {
  @Input() data: any = {};
  @Input() path: string;
  @Input() value: string;
  @Input() type: string = 'text';

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(private elementRef: ElementRef) {
    super(elementRef);
  }
  // Runs after bindings have evaluated
  ngOnInit(): void {
    super.ngOnInit();
    var value,
      source = this.value || this.contentHtml;
    // Parse content HTML as data and assign to this.data at <path>
    if (!source) {
      return;
    }
    switch (this.type) {
      // JSON
      case 'json':
        value = libUtil.tryParseJson(source);
        break;
      // Just raw string; use [innerHtml] to bind in template attribute
      case 'text':
        value = source;
        break;
      // path=value strings on every line
      case 'keyvalue':
        value = libKeyValue.parse(source);
        break;
    }
    // Set value at supplied path (replace this.data if no path given)
    libXsr.path(this.data, this.path, value);
    // console.log('aa-data', this.data, this.path, value)
  }
}
