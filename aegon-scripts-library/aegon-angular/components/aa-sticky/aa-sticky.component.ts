import {Component, Input, ElementRef} from 'angular2/core';
import {template} from "./template";
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {defaultOptions} from "./defaultOptions";
import {AAElementDirective} from '../../directives/aa-element/aa-element.directive';

@Component({
  selector: 'aa-sticky',
  template: template,
  directives: [AAElementDirective]
})
export class AAStickyComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @Input() heading: string;

  public defaultOptions : any = defaultOptions;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(elementRef: ElementRef) {
    super(elementRef);
  }
}
