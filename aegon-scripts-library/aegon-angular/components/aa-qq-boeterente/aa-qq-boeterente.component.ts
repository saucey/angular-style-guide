import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import 'rxjs/Rx';
import {defaultOptions} from "./defaultOptions";
import {InterestsService} from "./interests.service";
import {validateDate} from "../../lib/date";
import {round, roundToTenth, zeroPad} from "../../lib/format";
import {calculateMonthlyFee} from "../../lib/calculations/interest"

import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-qq-boeterente',
  template: template,
  providers: [InterestsService]
})
export class AAQQBoeterenteComponent extends AABaseComponent implements OnInit {
  @ViewChild('mortgageSelect') mortgageSelect: ElementRef;

  @Input() options: any = {};
  @Input() data: any = {};

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

  public  defaultOptions: any = defaultOptions;

  constructor(
    private thisElement: ElementRef,
    private intstService: InterestsService
  ) {
    super(thisElement);
  }
  /*
   * Function that runs first
   */
  ngOnInit():void {
    super.ngOnInit();
  }

  /*
   * Initial tealium event
   *
   * @param index {number}: the index
   */
  init(index: number): void {
    this.mortgageType = Number(index);
    let mortgageSelect = this.mortgageSelect.nativeElement;
    this.mortgageName = String(mortgageSelect.options[mortgageSelect.selectedIndex].text);
    // Fired only once after the mortgage type is changed.
    if (!this.initiated && this.mortgageType > 0) {
      let formInit = {
        page_cat_1_type: 'quick_quotes',
        page_cat_2_name: 'berekening',
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
      let tenPrcnt = (0.1 * this.initialAmount),
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
      // Rounded in 2 decimals.
      penaltyFree = round(penaltyFree, 2);

      // 3. Basis penalty-calculation (grondslag boeteberekening).
      let basisFee = (this.initialAmount - this.repymnt - penaltyFree);

      /* 4. Total cash value (Totale contante waarde) */
      // 4.1. Define Interest rate contract per month.
      let oldMonthlyIntRate = this.oldIntRate / 12;

      // 4.2. Define interest rate market per month
      let d = new Date();
      // Current date.
      let currDate = d.getFullYear() + '-' + zeroPad((d.getMonth() + 1), 2) + '-' + zeroPad(d.getDate(), 2);

      /* Set current date to 1st of next month.
       * Check month and year. If current month is December
       * sets next month to January and adds 1 to the year.
       */
      let nextMonth = d.getMonth() !== 11 ? zeroPad((d.getMonth() + 2), 2) : '01',
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
            this.totalFee = roundToTenth(totalFee, 100);
            let monthlyFee = calculateMonthlyFee((this.initialAmount - this.repymnt), this.oldIntRate);
            this.monthlyFee = roundToTenth(monthlyFee, 10);
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
            page_cat_1_type: 'quick_quotes',
            page_cat_2_name: 'berekening',
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
        let newMonthlyPymnt = calculateMonthlyFee(mortgage, this.newPeriodInt);
        this.newMonthlyPymnt = roundToTenth(newMonthlyPymnt, 10);
      });
    }
  }

  /*
   * Special calculation between two dates to get
   * penalty applicable periods
   *
   * @param date {string}: start date of the mortgage or applicable term.
   * @param latestDate {string}: end date of mortgage.
   * @param type {string} (start|end): if start retrieves the start period number
   *   if end retrieves the last period number.
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
   * Checks if utag and utag_data exist
   * and triggers tealium functions.
   *
   * @param data {Object}: an object with the variables.
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
