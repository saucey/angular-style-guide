import {Component, Input} from 'angular2/core';
import {template} from "./template";

@Component({
  selector: 'aa-sticky',
  template: template
})
export class AAStickyComponent {
  @Input() heading: string;
}
