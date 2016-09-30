/**
 * AOV quick quote
 */
import {Component, OnInit, Input, ElementRef, trigger, state, animate, transition, style} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";


import {template} from "./template";

@Component({
  selector: 'aa-pension-form',
  template: template,
  animations: [
    trigger('visibility', [
      state('show', style({
        height: '*',
        overflow: 'hidden',

      })),
      state('hidden', style({
        height: '0',
        overflow: 'hidden',

      })),
      transition('* => *', animate('.5s ease'))
    ])
  ]
})

//TODO ADD BASE64
export class AAPensionFormComponent extends AABaseComponent implements OnInit {
  public step: number = 1;
  public pensionAmount: number;
  public amountTooSmall: boolean;
  public message: boolean = false;

  form = new FormGroup({
    first: new FormControl('Nhhh', Validators.minLength(10)),
    last: new FormControl('Drew'),
    third: new FormControl('Drew'),
    fourth: new FormControl('Drew'),
  });

  get first(): any { return this.form.get('first'); }

  onSubmit(): void {
    console.log(this.form.value);  // {first: 'Nancy', last: 'Drew'}
  }

  setValue() { this.form.setValue({first: 'Carson', last: 'Drew'}); }

  public visibility = {
    one: 'show',
    two: 'hidden',
    three: 'hidden'
  };

  constructor(
    private elementRef: ElementRef
  ) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  submitAmount(): void {

    if (!this.isValidAmount()) {
      //show the hidden div with money value
      this.visibility.one = "hidden";
      this.visibility.two = "show";
    }
  }

  isValidAmount(): boolean {

    this.amountTooSmall = this.pensionAmount > 25000;
    return !this.amountTooSmall;

  }

  editSection(val): any {
    this.coll(val);
  }

    coll(val: string) {
    switch (val) {
      case "box1":
        this.visibility.one = 'show';
        this.visibility.two = 'hidden';
        this.visibility.three = 'hidden';
        break;
      case "box2":
        this.visibility.one = 'hidden';
        this.visibility.two = 'show';
        this.visibility.three = 'hidden';
        break;
      case "box3":
        this.visibility.one = 'hidden';
        this.visibility.two = 'hidden';
        this.visibility.three = 'show';
        break;
      default:
    }
  }
}

