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
            <select [(ngModel)]="mortgageType" class="no-dd" (change)="validate()">
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
            <p>Resterende rentevastperiode: {{periodTimeLeft}}<b></b></p>
            <p>Vergelijkingsrente: <span> </span></p>
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
  mortgageType: number = 0;
  initialAmount: number;
  extraPymnt: boolean;
  pymntThisYear: number = 0;
  pymntPrevYears: number = 0;
  interestPeriodEnd: string;
  oldIntRate: number;
  nhg: boolean;
  interest: number;
  totalFee: number = 0;
  periodTimeLeft: string;
  newInterest: number;
  isReady: boolean = false;
  calculating: boolean = false;
  calculated: boolean = false;

  @ViewChild('interest') interestRef: ElementRef;

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
    this.calculated = false;

    this.isReady = (this.mortgageType > 0 &&
      this.initialAmount > -1  &&
      this.interestPeriodEnd !== undefined &&
      this.oldIntRate > -1 &&
      this.nhg !== undefined);

    this.log(this.interestPeriodEnd);
  }

  /*
   * Calculates the penalty fee using
   * the available fields.
   */
  calculate(): void {
    // Adds the loader to the submit button.
    this.calculating = true;

    // 1. Amount penalty-free repayment (Bedrag boetevrije aflossing).
    let feeFree = +((0, 1 * this.initialAmount) - this.pymntThisYear).toFixed(2);

    // 2. Repayment (Bedrag aflossing).
    let repymnt = this.initialAmount - (this.extraPymnt !== false ? this.pymntThisYear : 0) - (this.extraPymnt !== false ? this.pymntPrevYears : 0);

    // 3. Basis penalty-calculation (grondslag boeteberekening).
    let basisFee = repymnt - feeFree;

    /* 4. Total cash value (Totale contante waarde) */
    let tcw;
    // 4.1. Define Interest rate contract per month.
    let monthlyIntRate = +(this.oldIntRate / 12).toFixed(4);
    // 4.2. Define interest rate market per month
    let d = new Date();
    // Set current date to 1st of next month.
    let currDate = d.getFullYear() + '-' + ((d.getMonth() + 2) < 10 ? '0' + (d.getMonth() + 2) : (d.getMonth() + 2)) + '-' + '01';
    // Difference in dates rounded down to years.
    let dateDiff = this.dateDiff(currDate, this.interestPeriodEnd, 'years');
    this.log('Difference in years: ' + dateDiff);

    /**** ADD SERVICE FOR NHG ****/

    // 4.3. Define interest for 1 period based on contract interest.
    let periodIntst = (monthlyIntRate * basisFee).toFixed(2);

    // 4.4. Define interest for 1 period based on market interest.
    // 100 is temporary.
    let periodMktIntst = (100 * basisFee).toFixed(2);

    // 4.5. Define difference or missed interest for 1 period.
    let periodIntstDiff = (+periodIntst) - (+periodMktIntst);
    /* 4.6.Define periods to be calculated (!!Ingangsdatum leenlaag 
     * is geen invoer )
     */
    let periods = this.dateDiff(currDate, this.interestPeriodEnd, 'months');
    this.log('periods: ' + periods);

    for (let i = 0; i < periods; i++){
      
    }
  }

  /*
   * Calculate the difference between two dates
   * and return the amount of years.
   */
  private dateDiff(date: string, latestDate: string, inType: string = null): number {
    /* 
     * Throw exeption if the parameter given do not
     * have required format.
     */
    // Accepted date format RegExp (yyyy-mm-dd).
    let dateFmt = /^\d{4}\-\d{2}\-\d{2}$/;

    if (!dateFmt.test(date) || !dateFmt.test(latestDate)) {
      throw new Error("Dates should be in format yyyy-mm-dd.");
    }
    /* 
     * Throw exeption if the itType parameter do not
     * match the available options.
     */
    // Types available.
    let types = /^(years|months)$/;

    if (typeof inType !== null && !types.test(inType)) {
      throw new Error("The available types are 'years' and 'months'.");
    }    
    // Default result is in years.
    if(typeof inType === null) {
      inType = 'years';
    }
    let eDate = new Date(date);
    let lDate = new Date(latestDate);
    /*
     * Correct order if first date is bigger
     * than second.
     */
    if(eDate > lDate) {
      let tmpEDate = eDate;
      let tmpLDate = lDate;
      eDate = tmpLDate;
      lDate = tmpEDate;
    }

    // Earlier date vars.
    let d = eDate.getDate(), 
      m = eDate.getMonth(), 
      y = eDate.getFullYear();
    // Later date vars.
    let lY = lDate.getFullYear(),
      lM = lDate.getMonth(),
      lD = lDate.getDate();
    // Years difference.
    let diff = lY - y;

    if (m > lM) {
      diff--;
    }
    else {
      if (m == lM) {
        if (d > lD) {
          diff--;
        }
      }
    }
    if(inType === 'years') {
      return diff;
    }
    else {
      let monthsDiff = lM - m;
      return (diff * 12) + monthsDiff;
    }
  }
}


const interestCols = [
  2.501, 3.001, 3.501, 4.001, 4.501, 5.001, 5.501, 6.001, 6.501, 7.001, 7.501
];

const percMatrix = [
  [9.0, 9.5, 9.5, 10.0, 10.5, 10.5, 11.0, 11.5, 11.5, 12.0, 12.0, 12.5],
  [9.0, 9.5, 9.5, 10.0, 10.5, 10.5, 11.0, 11.5, 11.5, 12.0, 12.0, 12.5],
  [10.5, 10.5, 11.0, 11.5, 12.0, 12.5, 12.5, 13.0, 13.5, 13.5, 14.0, 14.0],
  [11.5, 12.0, 12.0, 12.5, 13.0, 13.5, 14.0, 14.0, 14.5, 15.0, 15.0, 15.5],
  [12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.0, 16.5, 16.5],
  [13.0, 13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 17.5, 18.0],
  [13.5, 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0],
  [14.0, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0],
  [14.5, 15.5, 16.5, 17.0, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5],
  [15.0, 15.5, 16.5, 17.5, 18.5, 19.0, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5],
  [15.0, 16.0, 17.0, 17.5, 18.5, 19.5, 20.5, 21.5, 22.0, 22.5, 23.0, 23.5],
  [15.5, 16.5, 17.5, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 23.5, 24.0, 24.5],
  [15.5, 16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.0, 24.0, 25.0, 25.0],
  [16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.0, 26.0, 26.5],
  [17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.0, 28.0],
  [18.5, 19.5, 20.5, 21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.0, 29.0],
  [19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0],
  [19.5, 20.5, 21.5, 22.5, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0],
  [20.0, 21.0, 22.0, 23.5, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0],
  [20.5, 21.5, 22.5, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0],
  [20.5, 21.5, 22.5, 24.0, 25.0, 26.0, 27.0, 28.0, 29.5, 30.5, 31.5, 32.5],
  [21.0, 22.0, 23.0, 24.0, 25.0, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5],
  [21.5, 22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5],
  [22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 28.5, 29.5, 30.5, 31.5, 32.5],
  [22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 30.5, 31.5, 32.5],
  [22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.0, 30.0, 31.0, 31.5, 32.5],
  [22.5, 23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.0, 31.0, 31.5, 32.5],
  [22.5, 23.5, 24.5, 26.0, 27.0, 28.0, 29.0, 29.5, 30.5, 31.0, 32.0, 32.5],
  [22.5, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 30.5, 31.5, 32.0, 33.0],
  [23.0, 24.0, 25.0, 26.0, 27.5, 28.0, 29.5, 30.0, 31.0, 32.0, 32.5, 33.0],
  [23.0, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.0, 32.0, 33.0, 33.5],
  [23.5, 24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.0, 33.5],
  [23.5, 24.5, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 31.5, 32.5, 33.5, 34.0],
  [23.5, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 32.5, 33.5, 34.0],
  [23.5, 25.0, 26.0, 27.0, 28.5, 29.5, 30.5, 31.0, 32.0, 33.0, 33.5, 34.5],
  [23.5, 25.0, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.0, 34.0, 34.5],
  [23.5, 25.0, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5, 32.5, 33.5, 34.0, 35.0],
  [23.5, 25.0, 26.5, 28.0, 29.0, 30.0, 31.0, 32.0, 32.5, 33.5, 34.5, 35.0],
  [23.5, 25.0, 26.5, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 33.5, 34.5, 35.0],
  [23.5, 25.0, 26.5, 28.0, 29.0, 30.5, 31.5, 32.0, 33.0, 34.0, 34.5, 35.5],
  [23.5, 25.0, 26.5, 28.0, 29.0, 30.5, 31.5, 32.5, 33.5, 34.0, 35.0, 35.5],
  [24.0, 25.0, 26.5, 28.0, 29.0, 30.5, 31.5, 32.5, 33.5, 34.5, 35.0, 36.0],
  [24.0, 25.0, 26.5, 28.0, 29.0, 30.5, 32.0, 32.5, 33.5, 34.5, 35.5, 36.0],
  [24.0, 25.5, 26.5, 28.0, 29.0, 30.5, 32.0, 33.0, 34.0, 34.5, 35.5, 36.0],
  [24.0, 25.5, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 35.0, 35.5, 36.5],
  [24.0, 25.5, 26.5, 28.0, 29.5, 30.5, 32.0, 33.0, 34.0, 35.0, 36.0, 36.5],
  [24.0, 25.5, 27.0, 28.0, 29.5, 30.5, 32.0, 33.0, 34.5, 35.0, 36.0, 36.5],
  [24.0, 25.5, 27.0, 28.0, 29.5, 30.5, 32.0, 33.0, 34.5, 35.5, 36.0, 37.0],
  [24.0, 25.5, 27.0, 28.0, 29.5, 30.5, 32.0, 33.0, 34.5, 35.5, 36.5, 37.0],
  [24.0, 25.5, 27.0, 28.5, 29.5, 31.0, 32.0, 33.0, 34.5, 35.5, 36.5, 37.0],
  [24.0, 25.5, 27.0, 28.5, 29.5, 31.0, 32.0, 33.0, 34.5, 35.5, 36.5, 37.5],
  [24.5, 25.5, 27.0, 28.5, 29.5, 31.0, 32.0, 33.0, 34.5, 35.5, 36.5, 37.5],
  [24.5, 25.5, 27.0, 28.5, 29.5, 31.0, 32.0, 33.5, 34.5, 35.5, 36.5, 37.5],
  [24.5, 26.0, 27.0, 28.5, 30.0, 31.0, 32.0, 33.5, 34.5, 35.5, 36.5, 37.5],
  [24.5, 26.0, 27.0, 28.5, 30.0, 31.0, 32.0, 33.5, 34.5, 35.5, 36.5, 38.0],
  [24.5, 26.0, 27.0, 28.5, 30.0, 31.0, 32.5, 33.5, 34.5, 35.5, 36.5, 38.0],
  [24.5, 26.0, 27.5, 28.5, 30.0, 31.0, 32.5, 33.5, 34.5, 35.5, 36.5, 38.0],
  [24.5, 26.0, 27.5, 28.5, 30.0, 31.5, 32.5, 33.5, 34.5, 36.0, 36.5, 38.0],
  [24.5, 26.0, 27.5, 28.5, 30.0, 31.5, 32.5, 33.5, 35.0, 36.0, 37.0, 38.0],
  [24.5, 26.0, 27.5, 29.0, 30.0, 31.5, 32.5, 33.5, 35.0, 36.0, 37.0, 38.0],
  [24.5, 26.0, 27.5, 29.0, 30.0, 31.5, 32.5, 34.0, 35.0, 36.0, 37.0, 38.0],
  [24.5, 26.0, 27.5, 29.0, 30.0, 31.5, 32.5, 34.0, 35.0, 36.0, 37.0, 38.0]
];
