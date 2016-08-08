/**
 * Help/hint component. Fully css based; angular only acts as a html template
 * For now only .hint--bottom-left positioning works.
 * @input {String} Text to display in the popup
 * @input {String} position Position relative to the cursor to position the hint
 * - Currently only bottom-left is supported
 */

import {Component, Input} from "angular2/core";

@Component({
  selector: 'aa-hint',
  template: `
    <span class="aa-hint" [ngClass]="'aa-hint--' + position" [attr.data-hint]="text">
      <span class="aa-hint__icon aa-hint__icon--help"></span>
    </span>
  `
})
export class HintComponent {
  @Input() text: string;
  @Input() position: string = 'bottom-left';
}