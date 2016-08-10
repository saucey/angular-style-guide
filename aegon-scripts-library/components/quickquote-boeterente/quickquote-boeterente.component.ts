import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {InputNumberComponent, InputNumberValueAccessor} from '../angular-components/input-number.component';
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {InterestsService} from "./interests.service";
import {validateDate} from "../angular-components/validation.component";
import {template} from "./template";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteBoeterenteTemplate'));
@Component({
  selector: 'aegon-quickquote-boeterente',
  directives: [
    HelpComponent, InputDateComponent, InputDateValueAccessor, InputNumberComponent, InputNumberValueAccessor, InputRadioComponent, InputRadioValueAccessor
  ],
  template: templateElem ? templateElem.value : template,
  providers: [HTTP_PROVIDERS, InterestsService],
  pipes: [MoneyPipe]
})
export class QuickQuoteBoeterenteComponent implements OnInit {
  // Mortgage options:
  mortgageOps: Object[] = ['Maak uw keuze', 'Aflossingsvrij', 'Annuitair', '(Bank)Spaar', 'Lineair', 'Overig'];
  // Scope variable initiation.
  // Used for tealium.
  initiated: boolean = false;
  finalized: boolean = false;
  mortgageName: string;
  // User entered data vars.
  mortgageType: number = 0;
  initialAmount: number = 0;
  extraPymnt: boolean = false;
  pymntThisYear: number = 0;
  pymntPrevYears: number = 0;
  interestPeriodEnd: string;
  oldIntRate: number = 0;
  nhg: boolean;
  // Calculation variables.
  repymnt: number = 0;
  totalFee: number = 0;
  monthlyFee: number = 0;
  periodsLeft: number;
  newIntRate: number;
  isReady: boolean = false;
  newPeriod: number = -1;
  newPeriodInt: number = 0;
  newMonthlyPymnt: number = 0;
  // UI vars.
  // Adds loading class to button.
  calculating: boolean = false;
  // Shows result.
  calculated: boolean = false;
  // Shows not valid interest message.
  validIntst: boolean = true;
  // Errors
  errorsHighlighted: boolean = false;
  mortgageTypeErr: boolean = false;
  initialAmountErr: boolean = false;
  pymtsErr: boolean = false;
  interestPeriodEndErr: boolean = false;
  oldIntRateErr: boolean = false;
  nhgErr: boolean = false;

  constructor(
    private http: Http,
    private intstService: InterestsService
  ) {}

  /*
   * Function that runs first
   */
  ngOnInit():void {}

  /*
   * Initial tealium event 
   */
  init(index: number): void {
    this.mortgageType = Number(index);
    this.mortgageName = String(this.mortgageOps[index]);
    // Fired only once after the mortgage type is changed.
    if (!this.initiated && this.mortgageType > 0) {
      let formInit = {
        page_cat_4_productgroup: 'hypotheek',
        product_category: ['hypotheek'],
        form_name: 'qq-rente_wijzigen',
        step_name: 'qq-berekening-start',
        page_step:'02',
        event: 'qq_started'
      };
      this.tealium(formInit);

      this.initiated = true;
    }

    this.validate();
  }
  /*
   * Checks if the required fields have corresponding
   * values and reset the calculation.
   */
  validate(): void {
    this.calculating = false;
    // hides the value.
    this.calculated = false;

    this.isReady = (this.mortgageType > 0 &&
      this.initialAmount > 0  &&
      (!this.extraPymnt || this.extraPymnt && (this.initialAmount > (this.pymntThisYear + this.pymntPrevYears))) &&
      validateDate(this.interestPeriodEnd, true) &&
      this.oldIntRate > 0 &&
      this.nhg !== undefined);

    if (this.errorsHighlighted) {
      // Removes the highlight in errored elements.
      this.highlightErrors();
    }
  }

  /*
   * Checks each of the class properties value
   * and set error properties to true or false
   */
  highlightErrors(): void {
    // Mortgage type error.
    this.mortgageTypeErr = (this.mortgageType === 0) ? true : false;

    // Extra payments higher than mortgage value error.
    this.pymtsErr = this.extraPymnt && (this.initialAmount <= (this.pymntPrevYears + this.pymntThisYear));

    // Initial amount error.
    this.initialAmountErr = (this.initialAmount === 0 || this.initialAmount === null || this.pymtsErr) ? true : false;

    // Interest period end.
    this.interestPeriodEndErr = validateDate(this.interestPeriodEnd, true) ? false : true;
    
    // Old interest rate error.
    this.oldIntRateErr = (this.oldIntRate === 0 || this.oldIntRate === null) ? true : false;

    // NHG error.
    this.nhgErr = (this.nhg === undefined) ? true : false;

    this.errorsHighlighted = true;
  }
  /*
   * Calculates the penalty fee using
   * the available fields.
   */
  calculate(): void {
    // Highlights the fields with errors.
    this.highlightErrors();
    // If no errors.
    if (this.isReady) {
      // Adds the loader to the submit button.
      this.calculating = true;

      // 1. Amount penalty-free repayment (Bedrag boetevrije aflossing).
      // Default 10%.
      let tenPrcnt = this.roundToDeg((0.1 * this.initialAmount), 2),
          penaltyFree;

      // 2. Repayment (Bedrag aflossing).
      if (this.extraPymnt === true) {
        penaltyFree = tenPrcnt - this.pymntThisYear;
        // If payments this years is higher than 10%
        // the penalty free is = 0
        if(penaltyFree < 0) penaltyFree = 0;

        this.repymnt = this.pymntThisYear + this.pymntPrevYears;
      } else {
        penaltyFree = tenPrcnt;
        this.repymnt = 0;
      }
      console.log('Penalty free = ' + penaltyFree);
      // 3. Basis penalty-calculation (grondslag boeteberekening).
      let basisFee = (this.initialAmount - this.repymnt - penaltyFree);
      console.log('Basis fee = ' + basisFee);
      /* 4. Total cash value (Totale contante waarde) */
      // 4.1. Define Interest rate contract per month.
      let oldMonthlyIntRate = this.oldIntRate / 12;

      // 4.2. Define interest rate market per month
      let d = new Date();
      // Current date.
      let currDate = d.getFullYear() + '-' + this.numberPadding((d.getMonth() + 1), 2) + '-' + this.numberPadding(d.getDate(), 2);

      /* Set current date to 1st of next month.
       * Check month and year. If current month is December
       * sets next month to January and adds 1 to the year.
       */
      let nextMonth = d.getMonth() !== 11 ? this.numberPadding((d.getMonth() + 2), 2) : '01',
          year = d.getMonth() !== 11 ? d.getFullYear() : d.getFullYear() + 1;

      let startDate = year + '-' + nextMonth + '-' + '01';
      /* 4.6.Define periods to be calculated (!!Ingangsdatum leenlaag
       * is geen invoer )
       */
      let periodStart = this.getTermsAmount(currDate, startDate, 'start');

      this.periodsLeft = this.getTermsAmount(currDate, this.interestPeriodEnd, 'end');

      /**** @todo ADD SERVICE FOR NHG ****/
      let tcw: number = 0,
        newMonthlyIntRate: number;

      // 4.3. Define interest for 1 period based on contract interest.
      let oldPeriodIntst = ((oldMonthlyIntRate * basisFee) / 100).toFixed(2);

      /* Service that retrieves the interest rate
       * corresponding to the amount of this.periodsLeft
       */
      this.intstService.getMarketInterestRate({months: this.periodsLeft, nhg: this.nhg, lowest: true}).then((interests) => {
        this.newIntRate = interests;

        if(this.newIntRate < this.oldIntRate) {
          /* If valid if the new interest is lower than
           * the interest entered by the user.
           */
          this.validIntst = true;
          // Market monthly interest rate.
          newMonthlyIntRate = this.newIntRate / 12;

          // 4.4. Define interest for 1 period based on market interest.
          let newPeriodIntst = ((newMonthlyIntRate * basisFee) / 100).toFixed(2);

          // 4.5. Define difference or missed interest for 1 period.
          let periodIntstDiff = +(oldPeriodIntst) - +(newPeriodIntst);
          periodIntstDiff = +(periodIntstDiff.toFixed(2));

          // Loop through periods.
          for (let i = periodStart; i < this.periodsLeft + 1; i++) {
            let cw = periodIntstDiff / (Math.pow((1 + (newMonthlyIntRate / 100)), (+i - periodStart + 1)));

            tcw = tcw + cw;
          }
          // Set the value of total fee and monthly fee.
          if (((this.initialAmount - this.repymnt) > penaltyFree)) {
            let totalFee = (((this.initialAmount - this.repymnt) - penaltyFree) * tcw) / basisFee;
            this.totalFee = Math.round(totalFee);

            this.monthlyFee = Math.round(this.calculateMonthlyFee((this.initialAmount - this.repymnt), this.oldIntRate));
          }
          else {
            this.totalFee = 0;
          }
          // Removes the class pending in the button.
          this.calculating = false;
          // Shows the value.
          this.calculated = true;
        }
        else {
          /* If the current market value is bigger
           * than the interest enter by user
           * The calculation is not done.
           */
          this.validIntst = false;
          // Removes the class pending in the button.
          this.calculating = false;
          // Shows the value.
          this.calculated = true;        
        }

        // Calculation finished.
        if (!this.finalized) {
          let formComplete = {
            page_cat_4_productgroup: 'hypotheek',
            page_cat_5_product: 'hypotheek-' + this.mortgageName,
            product_name: ['hypotheek-' + this.mortgageName],
            product_category: ['hypotheek'],
            form_name: 'qq-rente_wijzigen',
            step_name: 'qq-bevestiging',
            page_step: '03',
            event: 'qq_completed',
            hypotheekvorm: this.mortgageName
          };
          this.tealium(formComplete);

          this.finalized = true;
        }
      });
    }
  }
  /*
   * Calculates the monthly payment with the new
   * interest rate.
   */
  calculateNewMonthlyPymnt(): void {
    // Retrieves the interest rate corresponding to the chosen period.
    if(this.newPeriod > -1){
      this.intstService.getMarketInterestRate({months: this.newPeriod, nhg: this.nhg, lowest: false}).then((interests) => {
          // New interest setting.
          this.newPeriodInt = interests;
          let mortgage = this.initialAmount - this.repymnt;
          // New monthly payment setting.
          this.newMonthlyPymnt = Math.round(this.calculateMonthlyFee(mortgage, this.newPeriodInt));
      });
    }
  }
   /* Calculates the monthly interest fee.
    */
  private calculateMonthlyFee(mortgage: number, interest: number):number {
    return ((mortgage * interest) / 100) / 12;
  }
  /*
   * Special calculation between two dates to get
   * penalty applicable periods
   * 
   * @param date: start date of the mortgage or applicable term.
   * @param latestDate: end date of mortgage or 
   */
  getTermsAmount(date: string, latestDate: string, type: string = 'end'): number {
    /* 
     * Throw exeption if the dates given are not
     * valid.
     */
    if (!validateDate(date) || !validateDate(latestDate)) {
      throw new Error("Dates should be in format yyyy-mm-dd.");
    }
    /* 
     * Throw exeption if the type parameter do not
     * match the available options.
     */
    // Types available.
    let types = /^(start|end)$/;
    if (typeof type !== null && !types.test(type)) {
      throw new Error("The available types are 'start' and 'end'.");
    }
    // Create date object for better manipulation.
    let eDate = new Date(date);
    let lDate = new Date(latestDate);

    /*
     * Correct order if first date is bigger
     * than second.
     */
    if (eDate > lDate) {
      let tmpEDate = eDate;
      let tmpLDate = lDate;
      eDate = tmpLDate;
      lDate = tmpEDate;
    }

    // Earlier date vars.
    let m = eDate.getMonth() + 1,
    y = eDate.getFullYear();
    // Later date vars.
    let lM = lDate.getMonth() + 1,
    lY = lDate.getFullYear();

    if(type === 'end') {
           // =(((YEAR(H14)-YEAR(H10))*12)-(MONTH(H10))+MONTH(H14))
      return (((lY - y) * 12) - m + lM);
    }
    else {
      // =(((YEAR(H18) - YEAR(H10)) * 12) - (MONTH(H10)) + MONTH(H18)) + 1
      return (((lY - y) * 12) - m + lM) + 1;
    }
  }

  /*
   * Rounds the decimals to a certain
   * amount of characters.
   * @param num: the float number
   * @param deg: the amount of decimal chars.
   */
  roundToDeg(num: number, deg: number): number {
    let degs = Math.pow(10, deg);
    return Math.round(num * degs) / degs;
  }
  /*
   * Adds leading zeros to a number.
   * @param num: the number to add padding.
   * @param length: the length of the expected number
   *   with leading zeros including the number itself.
   */
  numberPadding(num: any, length: number): string {
    let str = num.toString().length, 
        pad = '';

    for (let i = 0; i < (length - str); i++) {
      pad += '0';
    }
    return pad + num;
  }

  /*
   * Checks if utag and utag_data exist
   * and triggers tealium functions.
   */
  private tealium (data: Object): void {
    // Merge properties with global utag_data object when available.
    var opt = [
        "page_cat_1_type",
        "page_cat_2_name",
        "page_cat_3_section",
        "page_cat_4_productgroup",
        "page_cat_5_product",
        "page_cat_6_businessline"
    ];

    if (typeof utag_data == 'object') {
        for(let i=0;i<opt.length;i++) {
            if (!data.hasOwnProperty(opt[i])) {
                if (utag_data.hasOwnProperty(opt[i]) && utag_data[opt[i]] != "" ) {
                    data[opt[i]] = utag_data[opt[i]];
                }
            }
        }
    }    
    // Check if utag can be used.
    if(typeof utag == 'object' && typeof utag.view == 'function') {
      utag.view(data);
    } else {
      // Give some time to load.
      setTimeout(() => { 
        if (typeof utag == 'object' && typeof utag.view == 'function') {
          utag.view(data);
        }
      }, 1600);
    }
  }
}