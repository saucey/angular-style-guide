/**
 * AOV quick quote
 */
import {Component, OnInit, Input, ElementRef, trigger, state, animate, transition, style} from '@angular/core';
// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";


import {template} from "./template";

@Component({
  selector: 'aa-collapse',
  template: template,
  animations: [
    trigger('visibility', [
      state('shown', style({
        height: '*',
        overflow: 'hidden',

      })),
      state('hidden', style({
        height: '0',
        overflow: 'hidden',

      })),
      transition('* => *', animate('.3s ease'))
    ])
  ]
})

//TODO ADD BASE64
export class AACollapseComponent extends AABaseComponent implements OnInit {
  public visibility = {
    one: 'hidden',
    two: 'shown',
    three: 'hidden'
  };

  constructor(
    private elementRef: ElementRef
  ) {
    super(elementRef);
    console.log('child obj');
  }

  ngOnInit() {
    super.ngOnInit();
  }

  coll(val: string) {
    switch (val) {
      case "box1":
        this.visibility.one = 'shown';
        this.visibility.two = 'hidden';
        this.visibility.three = 'hidden';
        break;
      case "box2":
        this.visibility.one = 'hidden';
        this.visibility.two = 'shown';
        this.visibility.three = 'hidden';
        break;
      case "box3":
        this.visibility.one = 'hidden';
        this.visibility.two = 'hidden';
        this.visibility.three = 'shown';
        break;
      default:
    }
  }
}
