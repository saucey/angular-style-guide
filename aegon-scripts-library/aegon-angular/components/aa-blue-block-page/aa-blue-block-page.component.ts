/**
 * Page component
 */

// Imports
import {Component, ElementRef, Input, OnInit} from "@angular/core";
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {defaultOptions} from "./defaultOptions";

// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-blue-block-page',
  template: template,
})

export class AABlueBlockPageComponent extends AABaseComponent implements OnInit {
  public  defaultOptions: any = defaultOptions;
  @Input() options: any = {};
  @Input() data: any = {};
  
  constructor(private thisElement: ElementRef) {
    super(thisElement);
  }

  ngOnInit() {
    super.ngOnInit();  
  }
}