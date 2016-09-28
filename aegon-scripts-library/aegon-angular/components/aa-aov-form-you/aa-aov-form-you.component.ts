/**
 * Help/hint component. Fully css based; angular only acts as a html template
 * For now only .hint--bottom-left positioning works.
 * @input {String} Text to display in the popup
 * @input {String} position Position relative to the cursor to position the hint
 * - Currently only bottom-left is supported
 */
import {Component, Input, ElementRef, OnInit} from "@angular/core";
import {template} from "./template";


@Component({
  selector: 'aa-aov-form-you',
  template: template,
})

export class AAAovFormYouComponent {
  public  birthDate: string;

  constructor(private elementRef:ElementRef) {}

  ngOnInit() {

  }
}
