import {
  Component, ElementRef, OnInit, OnChanges, Input,
  trigger, state, animate, transition, style
} from '@angular/core';

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { Category } from "../shared/models/category.model";

const template = require('./template.html');

@Component({
  selector: 'aa-fnol-intake',
  //template: 'I am from Test Name Display component XYZ'
  template: template,
  providers: [FNOLDataService]
})

export class FNOLIntakeComponent {

  fnolCategories: Category[];

  constructor(private fnolDataService: FNOLDataService) {

    this.fnolCategories = this.fnolDataService.getCategories();
  }

}

