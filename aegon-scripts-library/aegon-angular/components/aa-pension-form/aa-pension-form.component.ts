/**
 * AOV quick quote
 */
import {
  Component, OnInit, ElementRef, trigger, state, animate, transition, style, SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {calculateAge} from "../../lib/date";

// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";


import {template} from "./template";

const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

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


  public currentStep = 'step1';
  public dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  public step = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };

  public startingDate: string = '';
  public startingDateChoices: any[] = [];

  public amountIsValid: boolean = false;
  public userToYoung: boolean = false;
  public userToOld: boolean = false;
  public userAgeInvalid: boolean = false;

  public minAge: number = 50;
  public maxAge: number = 75;
  public isAgeValid: boolean = true;
  public hasPartner: string = "hidden";
  public partnerDob: string = "hidden";

  public usersDobReadable: string = '';
  public partnersDobReadable: string = '';

  public visibility = {
    1: 'show',
    2: 'hidden',
    3: 'hidden',
    4: 'hidden',
    5: 'hidden'
  };

  constructor(
    private elementRef: ElementRef
  ) {
    super(elementRef);
  }

  ngOnInit() {
    // super.ngOnInit();
    let date: Date = new Date(),
      year: number = date.getFullYear(),
      month: number = date.getMonth() + 1;
    for (let i: number = 0; i < 12; i++) {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1;
      }
      let value = year + '-' + (month < 10 ? '0': '') + month + '-01',
        label = '1 ' + monthLabels[month - 1] + ' ' + year;
      this.startingDateChoices.push({value: value, label: label});
    }
  }

  changeStartingDate(value: string): void {
    this.startingDate = value;
    // this.startingDateTooFar = false;
    this.startingDateChoices.some((date, index) => {
      if (date.value === value && index >= 3) {
        // this.startingDateTooFar = true;
        return true;
      }
    });
  }

  editVisibility(val): any{
    if(this.step[val]) return 'hidden';
    return this.visibility[val] == 'show' ? 'hidden' : 'show';
  }

  goTo(current, next): any {
    this.step[current] = false;
    this.visibility[current] = "hidden";
    this.visibility[next] = "show";
  }

  editSection(val): any {
    for (let i = 1; i <= 5; i++) {
      this.visibility[i] = (val == i) ? 'show' : 'hidden';
    }
  }

  btnValidationForUserPartner(): boolean {

    if(this.hasPartner == 'hidden') return false;

    if(this.hasPartner !== 'hidden' && this.partnerDob == 'hidden') return false;

    if(!this.isAgeValid) return false;

    return true;
  }

  isValidAmount(): boolean {

    if(this.pensionAmount !== undefined && this.pensionAmount !== 0){

      this.amountTooSmall = this.pensionAmount >= 25000;
      this.amountIsValid = !this.amountTooSmall;

      return !this.amountTooSmall;
    }

    this.amountIsValid = false;
    return true;

  }


  validateAge(val): any {

    this.age = calculateAge(val);

    this.usersDobReadable = new Date(val).toLocaleDateString('nl-NL', this.dateOptions);

    if(this.age == undefined){
      this.userAgeInvalid = true;
      this.userToYoung = false;
      this.userToOld = false;

      return this.isAgeValid = true;
    }

    if(this.age < this.minAge){
      this.userAgeInvalid = false;
      this.userToYoung = true;
      this.userToOld = false;

      return this.isAgeValid = true;
    }

    if(this.age > this.maxAge){
      this.userAgeInvalid = false;
      this.userToYoung = false;
      this.userToOld = true;

      return this.isAgeValid = true;
    }

    this.userAgeInvalid = false;
    this.userToYoung = false;
    this.userToOld = false;

    return this.isAgeValid = false;

  }
}

