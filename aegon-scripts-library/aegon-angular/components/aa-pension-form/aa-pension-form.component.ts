/**
 * AOV quick quote
 */
import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ElementRef,
  trigger,
  state,
  animate,
  transition,
  style,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {calculateAge} from "../../lib/date";

// AA components
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {defaultOptions} from "./defaultOptions";
const template = require('./template.html');

import {aegonTealium} from "../../lib/aegon_tealium";

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

  public pension: any = clientStorage.session.getItem("pensionInfo") || {startingDate: ""};

  public sessionPartnerDob = this.pension['birthDateOfPartner'] || '';

  public defaultOptions: any = defaultOptions;
  public amountTooSmall: boolean;
  public aanpassenSet: boolean;
  public message: boolean = false;
  public age: number;
  public sectionIndex: number = 1;
  public initChangeHasPartner: boolean;
  public initChangeNoPolicy: boolean;

  public currentStep = 'step1';
  public dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};

  public step = {
    1: false,
    2: this.pension['pensionLocation'] !== undefined ? false : true,
    3: this.pension['havePartner'] !== undefined ? false : true,
    4: this.pension['birthDate'] !== undefined ? false : true,
    5: this.pension['startingDate'] !== "" ? false : true,
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

  public hasPartner: string = this.pension['havePartner'] == true ? "show" : "hidden";
  public partnerDob: string = this.pension['insurablePartner'] == true ? "show" : "hidden";

  public partnersDobReadable: any[] = [];

  public visibility = {
    1: this.pension['pensionAmount'] !== undefined ? 'hidden' : 'show',
    2: 'hidden',
    3: 'hidden',
    4: 'hidden',
    5: 'hidden'
  };

  constructor(private elementRef: ElementRef) {
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
      let value = year + '-' + (month < 10 ? '0' : '') + month + '-01',
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

  editVisibility(val): any {
    if (this.step[val]) return 'hidden';
    return this.visibility[val] == 'show' ? 'hidden' : 'show';
  }

  goTo(current, next): any {

    this.sectionIndex = next;

    this.step[current] = false;
    this.visibility[current] = "hidden";
    this.visibility[next] = "show";

    switch (current) {
      case 1:
        this.sendTealiumTagging("02", "qq_start");
        break;
      case 2:
        this.sendTealiumTagging("03", "qq_step_03");
        break;
      case 3:
        this.sendTealiumTagging("04", "qq_step_04");
        break;
      case 4:
        this.sendTealiumTagging("05", "qq_step_05");
        break;
      case 5:
        this.sendTealiumTagging("06", "qq_completed");
        break;

      default:
        // no Tealium tagging
        break;
    }
  }

  editSection(val): any {
    //set a variable from here to find what index the section is on
    if (this.sectionIndex == 1) {
      if (this.isInValidAmount() !== false) {
        return true;
      }
    }

    if (this.sectionIndex == 2) {
      if (this.pension['pensionLocation'] == undefined) {
        return true;
      }
    }

    if (this.sectionIndex == 3) {
      if (this.btnValidationForUserPartner() !== false) {
        return true;
      }
    }

    if (this.sectionIndex == 4) {
      if (this.btnValidationForUser() !== false) {
        return true;
      }
    }

    if (this.sectionIndex == 5) {
      if (this.pension['startingDate'] == "") {
        return true;
      }
    }

    this.sectionIndex = val;

    for (let i = 1; i <= 5; i++) {
      this.visibility[i] = (val == i) ? 'show' : 'hidden';
    }
  }

  btnValidationForUserPartner(): boolean {
    const showAanpassenButton = true
    if (this.sectionIndex != 3) {
      return false;
    }

    // by default, don't show the button
    this.aanpassenSet = !showAanpassenButton

    if (this.pension.sessionSet) {

      if (this.pension['havePartner'] == false) return false;
      if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == false) return false;
      if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == true && this.isAgeValid[1] == undefined && this.pension['birthDateOfPartner'] !== undefined) return false;

      if (this.isAgeValid[1] == false) return false;

      if (this.initChangeNoPolicy == true) return false;

      if (this.hasPartner == 'show') {
        // TODO: is this right?
        this.aanpassenSet = showAanpassenButton;
        return true;
      }

      if (this.hasPartner == 'hidden' && this.initChangeHasPartner == false) return false;
      this.aanpassenSet = showAanpassenButton;
      return true;
    }

    if (this.pension['havePartner'] == false) return false;
    if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == false) return false;
    if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == true && this.isAgeValid[1] == undefined && this.pension['birthDateOfPartner'] !== undefined) return false;

    if (this.isAgeValid[1] == false) return false;

    if (this.initChangeNoPolicy == true) return false;

    if (this.hasPartner == 'show') {
      this.aanpassenSet = showAanpassenButton;
      return true;

    }

    if (this.hasPartner == 'hidden' && this.initChangeHasPartner == false) return false;
    this.aanpassenSet = showAanpassenButton;
    return true;
   }

  pensionLocation(val): boolean {
    if (this.sectionIndex != 2) {
      return false;
    }

    this.aanpassenSet = !val;

    return !val;
  }

  pensionStartDate(val): boolean {
    if (this.sectionIndex == 5) {
      if (val !== "") {
        //show
        this.aanpassenSet = false;

      } else {
        //hide
        this.aanpassenSet = true;

      }
    }

    return val == "";
  }

  btnValidationForUser(): boolean {
    if (this.sectionIndex != 4) {
      return false;
    }

    const showAanpassenButton = true
    this.aanpassenSet = !showAanpassenButton;

    if (this.pension.sessionSet) {

      if (this.pension['birthDate'] !== "" && this.isAgeValid[2] == false) {

        return false;
      }

      if (this.pension['birthDate'] !== "" && this.pension['birthDate'] !== undefined && this.isAgeValid[2] == undefined) {

        return false;
      }

      //hide the button
      this.aanpassenSet = showAanpassenButton;
      return true;
    }

    if (this.pension['birthDate'] !== "" && this.isAgeValid[2] == false) {

      return false;
    }

    if (this.pension['birthDate'] !== "" && this.pension['birthDate'] !== undefined && this.isAgeValid[2] == undefined) {

      return false;
    }

    //hide the button
    this.aanpassenSet = showAanpassenButton;
    return true;
  }

  isInValidAmount(): boolean {
    if (this.sectionIndex != 1) {
      return false;
    }

    if (this.pension.pensionAmount !== undefined && this.pension.pensionAmount !== 0) {

      this.amountTooSmall = this.pension.pensionAmount >= this.defaultOptions.pensionAmountMin;
      this.amountIsValid = !this.amountTooSmall;

      if (!this.amountTooSmall) {
        this.aanpassenSet = true;
      } else {
        console.log("isInvalidAmount set to false")

        this.aanpassenSet = false;
      }

      if (this.pension.sessionSet) {
        if (!this.amountTooSmall) {
          this.aanpassenSet = true;
        } else {
          console.log("isInValidAmount 2 set to false")

          this.aanpassenSet = false;
        }
      }

      return !this.amountTooSmall;
    }

    this.amountIsValid = false;
    return true;

  }


  validateAge(val, index, minAgeIndex, maxAgeIndex): any {

    this.age = calculateAge(val);

    this.partnersDobReadable[index] = new Date(val).toLocaleDateString('nl-NL', this.dateOptions);

    if (this.age == undefined) {
      this.userAgeInvalid[index] = true;
      this.userToYoung[index] = false;
      this.userToOld[index] = false;

      return this.isAgeValid[index] = true;
    }

    if (this.age < this.minAge[minAgeIndex]) {
      this.userAgeInvalid[index] = false;
      this.userToYoung[index] = true;
      this.userToOld[index] = false;

      return this.isAgeValid[index] = true;
    }

    if (this.age > this.maxAge[maxAgeIndex]) {
      this.userAgeInvalid[index] = false;
      this.userToYoung[index] = false;
      this.userToOld[index] = true;

      return this.isAgeValid[index] = true;
    }

    this.userAgeInvalid[index] = false;
    this.userToYoung[index] = false;
    this.userToOld[index] = false;

    return this.isAgeValid[index] = false;

  }

  submitForm(data): void {
    //this is were we need to set session and api call
    if (data['havePartner'] == false) {

      data['insurablePartner'] = false;

    }

    data['sessionSet'] = true;

    clientStorage.session.setItem("pensionInfo", data);

    if (this.options.initializeBlueBlocks) {
      this.bbpage.initialize();
      this.bbleft.callService();
      this.bbright.callService();
    }
  }

  testMethod(val: number): number {
    return val;
  }

  ngAfterViewInit() {
    this.sendTealiumTagging("01", "qq_view");
  }

  private sendTealiumTagging(_step: string, _event: string) {
    let tealiumObj: any = {
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'berekening',
      page_cat_3_section: "particulier",
      page_cat_4_productgroup: 'pensioen',
      page_cat_5_product: "direct_ingaand_pensioen_berekenen",
      product_name: ['direct_ingaand_pensioen_berekenen'],
      product_category: ['pensioen'],
      page_step: _step,
      event: _event
    }

    aegonTealium(tealiumObj);

  }
}
