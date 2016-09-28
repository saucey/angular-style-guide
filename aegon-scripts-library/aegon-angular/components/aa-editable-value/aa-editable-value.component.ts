import {Component} from '@angular/core';
import {template} from "./template";

@Component({
  selector: 'aa-editable-value',
  template: template
})
export class AAEditableValueComponent {
  public editing: boolean = false;
}
