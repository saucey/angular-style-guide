/**
 * AOV quick quote
 */
import {
  Component, Input, EventEmitter, Output, OnInit, ElementRef, trigger, state, animate, transition, style, SimpleChanges
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {calculateAge} from "../../lib/date";

// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {defaultOptions} from "./defaultOptions";
const template = require('./template.html');

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
        opacity: 0,
      })),
      transition('* => *', animate('.5s ease')),
    ])
  ]
})

export class AAPensionFormComponent extends AABaseComponent implements OnInit {

  @Input() options: any = {};
  @Input() data: any = {};
  @Input() bbpage;
  @Input() bbleft;
  @Input() bbright;

  public pension: any = clientStorage.session.getItem("pensionInfo") || {};

  public sessionPartnerDob = this.pension['birthDateOfPartner'] || '';

  public defaultOptions: any = defaultOptions;
  public amountTooSmall: boolean;
  public message: boolean = false;
  public age: number;
  public initChangeHasPartner: boolean;
  public initChangeNoPolicy: boolean;

  public currentStep = 'step1';
  public dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  public step = {
    1: false,
    2: this.pension['pensionLocation'] !== undefined ? false : true,
    3: this.pension['havePartner'] !== undefined ? false : true,
    4: this.pension['birthDate'] !== undefined ? false : true,
    5: this.pension['startingDate'] !== undefined ? false : true,
  };

  public startingDate: string = '';
  public startingDateChoices: any[] = [];
  public isAgeValid: any[] = [];
  public userAgeInvalid: any[] = [];
  public userToOld: any[] = [];
  public userToYoung: any[] = [];

  public amountIsValid: boolean = false;

  public minAge = {
    user: 50,
    partner: 18
  };

  public maxAge = {
    user: 75,
    partner: 115,
  };

  public hasPartner: string = this.pension['havePartner'] == "true" ? "show" :"hidden";
  public partnerDob: string = this.pension['insurablePartner'] == "true" ? "show" :"hidden";

  public partnersDobReadable: any[] = [];

  public visibility = {
    1: this.pension['pensionAmount'] !== undefined ? 'hidden' : 'show',
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
    super.ngOnInit();

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
      // this.bbpage.hidePage();
    if(this.isValidAmount() == true || this.btnValidationForUserPartner() !== false || this.btnValidationForUser() !== false) return false;

    for (let i = 1; i <= 5; i++) {
      this.visibility[i] = (val == i) ? 'show' : 'hidden';
    }
  }

  btnValidationForUserPartner(): boolean {
    if(this.pension['havePartner'] == "false") return false;
    if(this.pension['havePartner'] == "true" && this.pension['insurablePartner'] == "false") return false;
    if(this.pension['havePartner'] == "true" && this.pension['insurablePartner'] == "true" && this.isAgeValid[1] == undefined && this.pension['birthDateOfPartner'] !== undefined) return false;

    if(this.isAgeValid[1] == false) return false;

    if(this.initChangeNoPolicy == true) return false;

    if(this.hasPartner == 'show') return true;

    if(this.hasPartner == 'hidden' && this.initChangeHasPartner == false) return false;

    //hidden the button validation
    return true;
  }

  btnValidationForUser(): boolean {

    if(this.pension['birthDate'] !== "" && this.isAgeValid[2] == false ){

      return false;
    }

    if(this.pension['birthDate'] !== "" && this.pension['birthDate'] !== undefined && this.isAgeValid[2] == undefined ){

      return false;
    }

    //hide the button
    return true;
  }

  isValidAmount(): boolean {

    if(this.pension.pensionAmount!== undefined && this.pension.pensionAmount !== 0){

      this.amountTooSmall = this.pension.pensionAmount >= 25000;
      this.amountIsValid = !this.amountTooSmall;

      return !this.amountTooSmall;
    }

    this.amountIsValid = false;
    return true;

  }


  validateAge(val, index, minAgeIndex, maxAgeIndex): any {

    this.age = calculateAge(val);

    this.partnersDobReadable[index] = new Date(val).toLocaleDateString('nl-NL', this.dateOptions);

    if(this.age == undefined){
      this.userAgeInvalid[index] = true;
      this.userToYoung[index] = false;
      this.userToOld[index] = false;

      return this.isAgeValid[index] = true;
    }

    if(this.age < this.minAge[minAgeIndex]){
      this.userAgeInvalid[index]  = false;
      this.userToYoung[index]  = true;
      this.userToOld[index]  = false;

      return this.isAgeValid[index] = true;
    }

    if(this.age > this.maxAge[maxAgeIndex]){
      this.userAgeInvalid[index]  = false;
      this.userToYoung[index]  = false;
      this.userToOld[index]  = true;

      return this.isAgeValid[index] = true;
    }

    this.userAgeInvalid[index] = false;
    this.userToYoung[index] = false;
    this.userToOld[index] = false;

    return this.isAgeValid[index] = false;

  }

  submitForm(data): void {
    //this is were we need to set session and api call
    console.log(data, 'pension');

    if(data['havePartner'] == false){

      data['insurablePartner'] = false;

    }

    clientStorage.session.setItem("pensionInfo", data);

    if(this.options.initializeBlueBlocks) {
      this.bbpage.initialize();
      this.bbleft.callService();
      this.bbright.callService();
    }
  }

  testMethod(val: number): number {
    return val;
  }
}
