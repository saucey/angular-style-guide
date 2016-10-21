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

  //public serviceResArray: any = [1, 2, 3, 4, 5, 6];
  //public serviceResIterator = this.serviceResArray[Symbol.iterator]();
  
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
    /*
      this.genericService[this.data.options.template]()
        .then((data) => {
          console.log("Data from component: ", data);
        });
    */
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
   * Check if show the button
   *
   */
  showButton(): boolean {
    if(!this.data.options.button.show) {
      return false;
    }
    return true;
  }

  /*
   * Check if is a string
   *
   */
  isString(obj: any): boolean {
    return typeof obj === "string";
  }    

  
}
