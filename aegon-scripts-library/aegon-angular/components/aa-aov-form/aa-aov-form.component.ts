/**
 * AOV quick quote
 */
import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../../../components/angular-components/help.component';
// AA components

import {AAMoneyPipe} from "../../pipes/money.pipe";
import {AAInputRadioComponent} from "../aa-input-radio/aa-input-radio.component";
import {AAInputDropDownComponent} from "../aa-input-dropdown/aa-input-dropdown.component";
import {AASliderInputComponent} from "../aa-slider-input/aa-slider-input.component";
import {AAInputNumberComponent} from '../aa-input-number/aa-input-number.component';
import {AASliderComponent} from "../aa-slider/aa-slider.component";
// Old components

import {InputDateComponent, InputDateValueAccessor} from '../../../components/angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../../../components/angular-components/checkbox.component';
// Locals

import {template} from "./template";
import {options} from "./options";
import {calculateAge, stringToDate, addYearsToDate} from "../../lib/date";
import {zeroPad} from "../../lib/format";
import {mockProfessionsResponse} from "./mock-professions";
import {mockRiskFactorResponse} from "./mock-riskfactor";
import {mockSpecificationResponse} from "./mock-specification";
import {AAHintComponent} from "../aa-hint/aa-hint.component";
import {AAAovFormMeComponent} from "../aa-aov-form-me/aa-aov-form-me.component";
import {AAAovFormYouComponent} from "../aa-aov-form-you/aa-aov-form-you.component";
import {AAAovFormBothComponent} from "../aa-aov-form-both/aa-aov-form-both.component";
// import {AACollapseComponent} from "../aa-collapse/aa-collapse.component";

@Component({
  selector: 'aa-aov-form',
  template: template,
})

//TODO ADD BASE64
export class AAAovFormComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public collapsed1: boolean = true;
  public collapsed2: boolean = true;
  public collapsed3: boolean = true;

  private duration: number = 500;

  public  showCalculator: boolean;
  public  grossYearAmount: number = options.grossYearAmount.initial;

  public  birthDate: string;
  public  birthDateError: boolean;
  public  professionError: boolean;
  public  grossIncome: number;
  public  grossIncomeError: boolean;

  public  startingTerm: number = 30;
  public  startingTermError: boolean;
  public  insuranceAmount: number;
  public  insuranceAmountError: boolean;
  public  emailAddress: string = "";
  public  emailAddressError: boolean;

  public  serviceError: boolean;
  public  pending: number = 0;

  public  emailButtonPending: boolean = false;
  public  reSendEmailShown: boolean = false;

  public  grossMonthly: number;
  public  netMonthly: number;
  public  profession: any = {};
  public  professions: any[] = [];
  public  professionsFiltered: any[] = [];
  private rawProfession: any;
  private rawProfessions: any = {};
  public  aov: any = {};
  public  riskFactor: any = {};
  public  type: any = {};
  public  who: any = {};
  public  press: boolean = false;


  //TODO variables in session storage
  // aovQQ
  //   aovBirthDate     aovProfession     aovGrossIncome     aovStartingTerm     aovInsuranceAmount    aovGrossMonthly   aovNetMonthly
  //

  constructor(
    private http: Http
  ) {
    // this.type = {
    //   person: 'me'
    // };
  }

  ngOnInit() {
    this.data = {
      fakevar: 500,
      options: {
        slider: {
          start: 3500, // Handle start position
          step: 500, // Slider moves in increments of xx
          orientation: 'horizontal', // Orient the slider vertically
          behaviour: 'snap', // click anywhere to start dragging + draggable range
          range: { // Slider can select '0' to '100'
            'min': 2500,
            'max': 125000
          },
          pips: { // Shows scale and values below chart
            mode: 'range',
            // density: 100,
            // values: [1875, 2016],
            density: 100,
          }
        },
      }
    };
  }

  isSmoker(val: string) {
    console.log(val, 'this is the value passed into!!!');
  }

  birthDayDate(val: string) {
    console.log(val, 'this is the birthday date in the parent!!!');
  }


  coll(box: string) {

    switch (box) {
      case "box1":
        this.collapsed1 = !this.collapsed1;
        this.collapsed2 = true;
        this.collapsed3 = true;
        break;
      case "box2":
        this.collapsed1 = true;
        this.collapsed2 = !this.collapsed2;
        this.collapsed3 = true;
        break;
      case "box3":
        this.collapsed1 = true;
        this.collapsed2 = true;
        this.collapsed3 = !this.collapsed3;
        break;
      default:
    }
  }
}
