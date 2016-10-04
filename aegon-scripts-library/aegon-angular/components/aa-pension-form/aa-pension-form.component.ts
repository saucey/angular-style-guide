/**
 * AOV quick quote
 */
import {Component, OnInit, ElementRef, trigger, state, animate, transition, style} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {calculateAge} from "../../lib/date";

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

  public pensionAmount: number;
  public amountTooSmall: boolean;
  public message: boolean = false;
  public birthDate: string;
  public age: number;

  public step1: boolean = true;
  public step2: boolean = true;
  public step3: boolean = true;
  public step4: boolean = true;
  public step5: boolean = true;

  public minAge: number = 50;
  public maxAge: number = 75;
  public isAgeValid: boolean = true;
  public partnerDob: string = "hidden";

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
    three: 'hidden',
    four: 'hidden',
    five: 'hidden'
  };

  constructor(
    private elementRef: ElementRef
  ) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  editVisibility1(val): any {
    return val == 'show' ? 'hidden' : 'show';
  }

  editVisibility2(val): any {

    if(this.step2) return 'hidden';
    return val == 'show' ? 'hidden' : 'show';

  }

  editVisibility3(val): any {

    if(this.step3) return 'hidden';
    return val == 'show' ? 'hidden' : 'show';

  }

  editVisibility4(val): any {

    if(this.step4) return 'hidden';
    return val == 'show' ? 'hidden' : 'show';

  }

  editVisibility5(val): any {

    if(this.step5) return 'hidden';
    return val == 'show' ? 'hidden' : 'show';

  }

  submitAmount(): void {

    if (!this.isValidAmount()) {
      //show the hidden div with money value
      this.visibility.one = "hidden";
      this.visibility.two = "show";
    }

  }

  submitPensionLocation(): void {

      this.step2 = false;
      this.visibility.two = "hidden";
      this.visibility.three = "show";
  }

  submitDob(): void{
      this.step3 = false;
      this.visibility.three = "hidden";
      this.visibility.four = "show";
  }

  submitUserPartnerDob(): void{
    this.step4 = false;
    this.visibility.four = "hidden";
    this.visibility.five = "show";
  }

  submitFinal(): void{
    this.step5 = false;
    this.visibility.five = "hidden";
  }

  isValidAmount(): boolean {

    this.amountTooSmall = this.pensionAmount > 25000;
    return !this.amountTooSmall;

  }

  validateAge(val): any {

    this.age = calculateAge(val);
    console.log(this.age, 'age');

    if(!this.age){
      return this.isAgeValid = true;
      console.log('this is undefined!!!!');
    }

    if(this.age < this.minAge){
      console.log('age is too young');
      return this.isAgeValid = true;
    }

    if(this.age > this.maxAge){
      console.log('age is too old');
     return this.isAgeValid = true;
    }

    return this.isAgeValid = false;

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
        this.visibility.four = 'hidden';
        this.visibility.five = 'hidden';
        break;
      case "box2":
        this.visibility.one = 'hidden';
        this.visibility.two = 'show';
        this.visibility.three = 'hidden';
        this.visibility.four = 'hidden';
        this.visibility.five = 'hidden';
        break;
      case "box3":
        this.visibility.one = 'hidden';
        this.visibility.two = 'hidden';
        this.visibility.three = 'show';
        this.visibility.four = 'hidden';
        this.visibility.five = 'hidden';
        break;
      case "box4":
        this.visibility.one = 'hidden';
        this.visibility.two = 'hidden';
        this.visibility.three = 'hidden';
        this.visibility.four = 'show';
        this.visibility.five = 'hidden';
        break;
      case "box5":
        this.visibility.one = 'hidden';
        this.visibility.two = 'hidden';
        this.visibility.three = 'hidden';
        this.visibility.four = 'hidden';
        this.visibility.five = 'show';
        break;
      default:
    }
  }
}

