/**
 * aa-wia-content.component.ts created on 9/29/16 2:20 PM.
 *
 * @description Provides functionality for showing/hiding content under headers.
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Component, ElementRef, OnInit } from '@angular/core';
import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-wia-content',
  providers: [],
  template: template
})

export class AAWiaContentComponent extends AABaseComponent implements OnInit {

  constructor(private elementRef: ElementRef) {
    super(elementRef);
  }

  public myFunc(): void {
    /*this*/
  }

  ngOnInit():void {
    super.ngOnInit();
  }
}
