import {Component, Input, ElementRef} from '@angular/core';
import {template} from "./template";

@Component({
  selector: 'aa-sticky',
  template: template
})
export class AAStickyComponent {
  @Input() heading: string;
}
