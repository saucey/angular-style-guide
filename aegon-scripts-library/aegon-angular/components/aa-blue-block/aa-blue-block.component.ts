import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {defaultOptions} from "./defaultOptions";
import {GenericService} from "./generic.service";
import {round, roundToTenth, zeroPad} from "../../lib/format";

import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-blue-block',
  template: template,
  providers: [GenericService]
})

export class AABlueBlockComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  // Scope variable initiation.
  // Used for tealium.
  initiated: boolean = false;
  finalized: boolean = false;
  
  public  defaultOptions: any = defaultOptions;

  constructor(
    private thisElement: ElementRef,
    private genericService: GenericService
  ) {
    super(thisElement);
  }
  /*
   * Function that runs first
   */
  ngOnInit():void {
    super.ngOnInit();
  }

  /*
   * Initial tealium event
   *
   * @param index {number}: the index
   */
  init(index: number): void {
    this.initiated = true;
  }

  /*
   * Check if shows the button
   *
   */
  showButton(): boolean {
    return true;
  }
  
}
