import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {InputNumberComponent, InputNumberValueAccessor} from '../angular-components/input-number.component';
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {AfterViewInit} from "angular2/core";
import {ViewChild} from "angular2/core";
import {ElementRef} from "angular2/core";


var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteMortgageTemplate'));
@Component({
  selector: 'aegon-quickquote-boeterente',
  directives: [
    HelpComponent, InputDateComponent, InputDateValueAccessor, InputNumberComponent, InputNumberValueAccessor, InputRadioComponent, InputRadioValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote angular boeterente">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken indicatie omzettingskosten</h3>
        <div class="field">
          <div class="label">
            Hypotheekvorm van het leningdeel
            <aegon-help>
              Voer hier de hypotheekvorm in van het leningdeel waarvan u de omzettingskosten wilt berekenen.
            </aegon-help>
          </div>
          <div class="inputs">
            <select [(ngModel)]="mortgageType" class="no-dd" (change)="mortgageType = $event.target.value;validate();">
              <option [value]="0" selected>Maak uw keuze</option>
              <option [value]="1">Aflossingsvrij</option>
              <option [value]="2">Annuitair</option>
              <option [value]="3">(Bank)Spaar</option>
              <option [value]="4">Lineair</option>
              <option [value]="5">Overig</option>
            </select>
          </div>
        </div>
        <div *ngIf="mortgageType == 2 || mortgageType == 4">
          <div class="messages messages--alert visible">
            <span class="icon"><span class="pathA"></span><span class="pathB"></span><span class="pathC"></span></span>
            <div class="content">
              <b>Let op!</b> Voor een lineaire of annuitaïre hypotheek zullen de werkelijke omzettingskosten lager uitvallen dan in deze indicatieberekening.
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType > 0">
          <div class="field first">
            <div class="label">
              Oorspronkelijke bedrag
              <aegon-help>
                Het totale bedrag van het leningdeel op het moment dat u de hypotheek afsloot.
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-number #amountInput [(ngModel)]="initialAmount" prefix="€" [placeholder]="'0'" (blur)="validate()"></aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Heeft u al extra afgelost op dit bedrag?
              <aegon-help>
                Als u een annuitaïre of lineaire hypotheek heeft en u naast de reguliere aflossing niet extra heeft afgelost kiest u 'Nee'
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'extraPymnt'" (change)="extraPymnt = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'extraPymnt'" (change)="extraPymnt = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div *ngIf="extraPymnt == true">
            <div class="field">
              <div class="label">
                Dit jaar
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntThisYear"></aegon-input-number>
              </div>
            </div>
            <div class="field">
              <div class="label">
                Voorgaande jaren
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntPrevYears"></aegon-input-number>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Einddatum rentevastperiode
            </div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="interestPeriodEnd" (change)="validate()"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="hasPartnerError">
             Kies of u een partner heeft of niet.
          </p>
          <div class="field">
            <div class="label">
              Huidig rentepercentage
              <aegon-help>
                Het rentepercentage dat is vastgelegd in uw huidige hypotheekcontract. 
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-number #amountInput [(ngModel)]="oldIntRate" [max]="100"
                                 [placeholder]="'4,0%'" (change)="validate()">
              </aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              NHG van toepassing
              <aegon-help>
                Geef hier aan of op uw hypotheek de Nationale Hypotheek Garantie (NHG) van toepassing is. 
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'nhg'" (change)="nhg = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'nhg'" (change)="nhg = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [disabled]="!isReady" [ngClass]="{pending: calculating}" (click)="calculate()">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="result" *ngIf="calculated">
        <div class="bigger">
          <div class="row">
            <span class="label">Indicatie omzettingskosten</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{totalFee | money}}*</span>
            </span>
          </div>
        </div>
        <div class="small">
          <div class="row">
            <p>Resterende rentevastperiode: <b>{{ periodsLeft }}</b> {{ periodsLeft > 1 ? 'maanden' : 'maand' }}<b></b></p>
            <p>Vergelijkingsrente: {{ newIntRate }}% <span> </span></p>
          </div>
        </div>
        <div class="footer">
          <div class="label"></div>
          <a class="button orange icon-right arrow" [attr.href]="'/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/arbeidsongeschiktheidsverzekering-berekenen?AO1_VERZSOM=' + grossTotalCosts">Bekijk de adviesmogelijkheden</a>
        </div>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteBoeterenteComponent {
  // Scope variable initiation.
  mortgageType: number = 0;
  initialAmount: number;
  extraPymnt: boolean;
  pymntThisYear: number = 0;
  pymntPrevYears: number = 0;
  interestPeriodEnd: string;
  oldIntRate: number;
  nhg: boolean;
  totalFee: number = 0;
  periodsLeft: number;
  newIntRate: number;
  isReady: boolean = false;
  calculating: boolean = false;
  calculated: boolean = false;

  constructor(
    private http: Http
  ) {}

  public log(logMsg: any) {
    console.log(logMsg);
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
      this.validateDate(this.interestPeriodEnd) &&
      this.oldIntRate > 0 &&
      this.nhg !== undefined);
  }

  /*
   * Calculates the penalty fee using
   * the available fields.
   */
  calculate(): void {
    // Adds the loader to the submit button.
    this.calculating = true;

    // 1. Amount penalty-free repayment (Bedrag boetevrije aflossing).
    // Default 10%.
    let penaltyFree = this.roundToDeg((0.1 * this.initialAmount), 2);

    // 2. Repayment (Bedrag aflossing).
    let repymnt = 0;
    if(this.extraPymnt === true) {
      repymnt = this.pymntThisYear + this.pymntPrevYears;
    }
    
    // 3. Basis penalty-calculation (grondslag boeteberekening).
    let basisFee = (this.initialAmount - penaltyFree - repymnt);

    /* 4. Total cash value (Totale contante waarde) */
    // 4.1. Define Interest rate contract per month.
    let oldMonthlyIntRate = this.roundToDeg((this.oldIntRate / 12), 4);

    // 4.2. Define interest rate market per month
    let d = new Date();
    // Current date.
    let currDate = d.getFullYear() + '-' + this.numberPadding((d.getMonth() + 1), 2) + '-' + this.numberPadding(d.getDate(), 2);

    // Set current date to 1st of next month.
    let startDate = d.getFullYear() + '-' + this.numberPadding((d.getMonth() + 2), 2) + '-' + '01';

    /**** @todo ADD SERVICE FOR NHG ****/
    if(this.nhg === true) {
      this.newIntRate = 3.95;
    }
    else {
      this.newIntRate = 3.95;
    }

    let tcw: number = 0, 
        newMonthlyIntRate: number;
    // Market monthly interest rate.
    newMonthlyIntRate = this.newIntRate / 12;

    // 4.3. Define interest for 1 period based on contract interest.
    let oldPeriodIntst = ((oldMonthlyIntRate * basisFee) / 100).toFixed(2);

    // 4.4. Define interest for 1 period based on market interest.
    let newPeriodIntst = ((newMonthlyIntRate * basisFee) / 100).toFixed(2);

    // 4.5. Define difference or missed interest for 1 period.
    let periodIntstDiff = +(oldPeriodIntst) - +(newPeriodIntst);
    periodIntstDiff = +(periodIntstDiff.toFixed(2));

    /* 4.6.Define periods to be calculated (!!Ingangsdatum leenlaag
     * is geen invoer )
     */
    let periodStart = this.getTermsAmount(currDate, startDate, 'start');

    this.periodsLeft = this.getTermsAmount(currDate, this.interestPeriodEnd, 'end');

    // Loop through periods.
    // =F2/(POWER(1+$Invoer.$H$34,A2-$Invoer.$H$28+1))
    for (let i = periodStart; i < this.periodsLeft + 1; i++) {
      let cw = periodIntstDiff / (Math.pow((1 + (newMonthlyIntRate / 100)), (+i - periodStart + 1)));
      cw = +(cw.toFixed(2));
      tcw = tcw + cw;
    }
    // Set the value of total fee.
    if (((this.initialAmount - repymnt) > penaltyFree) && (this.newIntRate < this.oldIntRate)) {
      this.totalFee = (((this.initialAmount - repymnt) - penaltyFree) * tcw) / basisFee;
    }
    else {
      this.totalFee = 0;
    }

    // Removes the class pending in the button.
    this.calculating = false;
    // Shows the value.
    this.calculated = true;
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
    if (!this.validateDate(date) || !this.validateDate(latestDate)) {
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
   * Validates date strings
   * @param date: date string in format yyyy-mm-dd
   * @return boolean
   */
  validateDate(date: string): boolean {
    // Accepted date format RegExp (yyyy-mm-dd).
    let dateFmt = /^\d{4}\-\d{2}\-\d{2}$/;

    if (!dateFmt.test(date)) {
      return false;
    }

    let d, m, y;
    // Divide year, month and day.
    y = date.slice(0, 4);
    m = date.slice(5, 7);
    d = date.slice(-2);

    // Month and day validation.
    if (parseInt(m) > 12 || parseInt(d) > 31) {
      return false;
    } 
    else {
      // Checks if the day number is higher than the month has.
      if ((m == '04' || m == '06' || m == '09' || m == '11') && d > 30) {
        return false;
      }
      // February check.
      if (m == '02') {
        // Checks if the day is higher than 29.
        if (parseInt(d) > 29) {
          return false;
        } 
        else {
          // Leap year day validation.
          if (!(((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)) && parseInt(d) > 28) {
            return false;
          }
        }
      }
    }
    // Passed all validations.
    return true;
  }
}