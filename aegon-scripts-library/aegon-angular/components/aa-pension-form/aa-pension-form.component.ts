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

  public pension: any = clientStorage.session.getItem("pensionInfo") || {startingDate:"", birthDateOfPartner: ""};
  public defaultOptions: any = defaultOptions;
  public amountTooSmall: boolean;
  public aanpassenButton: {} = {show: !!clientStorage.session.getItem("pensionInfo")};
  public message: boolean = false;
  public age: number;
  public sectionIndex: number = 1;
  public initChangeHasPartner: boolean;
  public initChangeNoPolicy: boolean;
  public pensionAmountMin: number = this.defaultOptions.pensionAmountMin

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

    // set default validation state for date inputs
    if (this.pension['birthDateOfPartner']) {
      this.validateAge(this.pension['birthDateOfPartner'], 1, 'partner', 'partner');
    }

    if (this.pension['birthDate']) {
      this.validateAge(this.pension['birthDate'], 2, 'user', 'user');
    }
  }

  changeStartingDate(value: string): void {
    // this.startingDateTooFar = false;
    this.startingDateChoices.some((date, index) => {
      if (date.value === value && index >= 3) {
        // this.startingDateTooFar = true;
        return true;
      }
    });
    // HACK: make Angular realise there has been change in `pensionStartingDate` which
    // doesn't get registered for some reason
    this.aanpassenButton['show'] = typeof value != 'undefined' && value != "";
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
    this.sectionIndex = val;

    // this.bbpage.hidePage();

    for (let i = 1; i <= 5; i++) {
      this.visibility[i] = (val == i) ? 'show' : 'hidden';
    }
  }

  isInValidAmount(): boolean {
    if (this.sectionIndex == 1) {
      if (this.pension.pensionAmount !== undefined && this.pension.pensionAmount !== 0) {

        this.amountTooSmall = this.pension.pensionAmount >= this.pensionAmountMin;
        this.amountIsValid = !this.amountTooSmall;

        this.aanpassenButton['show'] = this.amountTooSmall;

        return !this.amountTooSmall;
      }
      this.amountIsValid = false;
      return true;
    }
  }
  /**
   * Validates location, returns true if it's valid and shows the Aanpassen button
   * @param val
   * @returns {boolean}
   */
  pensionLocation(val): boolean {
    if (this.sectionIndex == 2) {
      this.aanpassenButton['show'] = false;
      if (!val || typeof val == 'undefined') {
        return false;
      }

      this.aanpassenButton['show'] = true;
      return true;
    }
  }

  btnValidationForUserPartner(): boolean {
    if (this.sectionIndex == 3) {
      // by default, don't show the button
      this.aanpassenButton['show'] = false;

      if (this.pension['havePartner'] == undefined) return false;
      if (this.pension['havePartner'] == false) {
        this.aanpassenButton['show'] = true;
        return true;
      }

      if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == false) {
        this.aanpassenButton['show'] = true;
        return true;
      }

      if (this.pension['havePartner'] == true && this.pension['insurablePartner'] == true && this.isAgeValid[1] == undefined && this.pension['birthDateOfPartner'] !== undefined) return false;

      if (this.isAgeValid[1] == false) {
        this.aanpassenButton['show'] = true;
        return true;
      }
    }
  }

  btnValidationForUser(): boolean {
    if (this.sectionIndex == 4) {
      this.aanpassenButton['show'] = false;

      if (typeof this.pension['birthDate'] == 'undefined' || this.pension['birthDate'] == "") {
        return false;
      }

      if (typeof this.isAgeValid[2] == 'undefined' || this.isAgeValid[2] == true) {
        return false;
      }

      this.aanpassenButton['show'] = true;
      return true;
    }
  }

  pensionStartDate(val): boolean {
    if (this.sectionIndex == 5) {
      if (val !== "") {
        //show
        this.aanpassenButton['show'] = true;
      } else {
        //hide
        this.aanpassenButton['show'] = false;
      }

      return val !== "" && typeof val != 'undefined';
    }
  }

  /**
   * This returns true when the age is not valid.
   * @param val
   * @param index
   * @param minAgeIndex
   * @param maxAgeIndex
   * @returns {boolean}
   */
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
