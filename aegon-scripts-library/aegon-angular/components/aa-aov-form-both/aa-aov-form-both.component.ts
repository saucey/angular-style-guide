/**
 * Help/hint component. Fully css based; angular only acts as a html template
 * For now only .hint--bottom-left positioning works.
 * @input {String} Text to display in the popup
 * @input {String} position Position relative to the cursor to position the hint
 * - Currently only bottom-left is supported
 */
import {Component, Input, ElementRef, OnInit} from "angular2/core";
import {template} from "./template";

import {InputDateComponent, InputDateValueAccessor} from '../../../components/angular-components/input-date.component';

@Component({
  selector: 'aa-aov-form-both',
  template: template,
  directives:[InputDateComponent, InputDateValueAccessor]
})
export class AAAovFormBothComponent {
  public  birthDate: string;

  constructor(private elementRef:ElementRef) {}

  ngOnInit() {

  }
}
