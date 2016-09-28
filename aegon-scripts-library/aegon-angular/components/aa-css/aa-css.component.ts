import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import * as libDom from "../../lib/dom";

@Component({
  selector: 'aa-css',
  template: ''
})

export class AACssComponent extends AABaseComponent {
  @Input() value: string;
  @Input() prepend: boolean = false;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(private elementRef: ElementRef) {
    super(elementRef);
  }
  // Runs after bindings have evaluated
  ngOnInit(): void {
    super.ngOnInit();
    /**
     * This.contentHtml is only stored for elements that are listed in
     * AA_CONTENT_SELECTOR in bootComponents
     */
    var css = this.value || this.contentHtml;
    if (!css) {
      return;
    }
    libDom.insertCss(css, {
      prepend: this.prepend
    })
  }
}
