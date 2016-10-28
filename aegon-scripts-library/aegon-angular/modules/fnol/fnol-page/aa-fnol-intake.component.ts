import {
  Component, ElementRef, OnInit, OnChanges, Input,
  trigger, state, animate, transition, style
} from '@angular/core';

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-fnol-intake',
  //template: 'I am from Test Name Display component XYZ'
  template: template
})

export class FNOLIntakeComponent {

}

