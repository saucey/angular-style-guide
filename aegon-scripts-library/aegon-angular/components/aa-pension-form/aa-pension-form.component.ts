/**
 * AOV quick quote
 */
import {Component, OnInit, Input, ElementRef} from '@angular/core';
// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";


import {template} from "./template";

@Component({
  selector: 'aa-pension-form',
  template: template,
})

//TODO ADD BASE64
export class AAPensionFormComponent extends AABaseComponent implements OnInit {


  constructor(
    private elementRef: ElementRef
  ) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
  }


}
