import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {round, roundToTenth, zeroPad} from "../../lib/format";

const template = require('./template.html');

@Component({
  selector: 'aa-loader',
  template: template,
  providers: []
})

export class AALoaderComponent extends AABaseComponent implements OnInit {
  //@Input() options: any = {};
  //@Input() data: any = {};

  constructor(
    private thisElement: ElementRef
  ) {

    super(thisElement);
  }

  /*
   * Function that runs first
   */
  ngOnInit():void {
    super.ngOnInit();
  }

  init(): void {

  }

}
