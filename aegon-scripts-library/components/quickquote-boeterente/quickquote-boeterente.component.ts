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
            <p>Resterende rentevastperiode: <b>{{ periodTimeLeft }}</b> {{ periodTimeLeft > 1 ? 'maanden' : 'maand' }}<b></b></p>
            <p>Vergelijkingsrente: {{ newInterest }}% <span> </span></p>
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
  periodTimeLeft: number;
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
    // hides the value.
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
    let repymnt = this.initialAmount;
    if(this.extraPymnt === true) {
       repymnt = this.initialAmount - this.pymntThisYear - this.pymntPrevYears;
    }
    

    // 3. Basis penalty-calculation (grondslag boeteberekening).
    let basisFee = repymnt - feeFree;

    /* 4. Total cash value (Totale contante waarde) */
    let tcw: number = 0, monthlyIntsts: number;
    // 4.1. Define Interest rate contract per month.
    let monthlyIntRate = +(this.oldIntRate / 12).toFixed(4);
    // 4.2. Define interest rate market per month
    let d = new Date();
    // Set current date to 1st of next month.
    let currDate = d.getFullYear() + '-' + ((d.getMonth() + 2) < 10 ? '0' + (d.getMonth() + 2) : (d.getMonth() + 2)) + '-' + '01';
    // Difference in dates rounded down to years.
    let dateDiff = this.dateDiff(currDate, this.interestPeriodEnd, 'years');

    this.periodTimeLeft = dateDiff;
    this.log('Difference in years: ' + dateDiff);

    /**** @todo ADD SERVICE FOR NHG ****/
    if(this.nhg === true) {
      this.newInterest = 6;
    }
    else {
      this.newInterest = 8;
    }

    monthlyIntsts = (this.newInterest / 12);

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
    // Loop through periods.
    for (let i = 0; i < periods; i++){
      let cw = periodIntstDiff / ( Math.pow((monthlyIntsts + 1), (periods - +(i) +1)) );
      tcw = tcw + cw;
    }
    // Set the value of total fee.
    this.totalFee = ((repymnt - feeFree) / basisFee) * tcw;
    this.log(this.totalFee);
    // Removes the class pending in the button.
    this.calculating = false;
    // Shows the value.
    this.calculated = true;
  }

  /*
   * Calculate the difference between two dates
   * and return the amount of years.
   */
  dateDiff(date: string, latestDate: string, inType: string = null): number {
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