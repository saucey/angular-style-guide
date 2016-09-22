import {Component} from 'angular2/core';
import {template} from "./template";

@Component({
  selector: 'aa-editable-value',
  template: template
})
export class AAEditableValueComponent {
  public editing: boolean = false;
}
