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

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteBoeterenteTemplate'));
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
            <aegon-help position="top">
              Voer hier de hypotheekvorm in van het leningdeel waarvan u de omzettingskosten wilt berekenen.
            </aegon-help>
          </div>
          <div class="inputs">
            <select [(ngModel)]="mortgageType" class="no-dd" [class.error]="mortgageTypeErr" (change)="init($event.target.value);">
              <option *ngFor="#m of mortgageOps; #i = index" [value]="i">{{m}}</option>
            </select>
          </div>
        </div>
        <div *ngIf="mortgageType == 2 || mortgageType == 4">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content">
              <b>Let op!</b> Voor een lineaire of annuitaïre hypotheek zullen de werkelijke omzettingskosten lager uitvallen dan in deze indicatieberekening.
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType == 3">
          <div class="messages messages--alert visible">
            <span class="icon"></span>
            <div class="content">
              <b>Let op!</b> U krijgt over het spaarsaldo dezelfde rente als u betaalt over de hypotheek. Een lagere hypotheekrente leidt tot een hogere spaarpremie. Ga goed na of uw netto maandlasten bij een lagere rente wel omlaag gaan en of u uw doelkapitaal haalt.
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType > 0">
          <div class="field first">
            <div class="label">
              Oorspronkelijke bedrag
              <aegon-help position="top">
                Het totale bedrag van het leningdeel op het moment dat u de hypotheek afsloot.
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-number #amountInput [(ngModel)]="initialAmount" prefix="€" [placeholder]="'0'" [class.error]="initialAmountErr" (blur)="validate()"></aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Heeft u al extra afgelost op dit bedrag?
              <aegon-help position="top">
                Als u een annuitaïre of lineaire hypotheek heeft en u naast de reguliere aflossing niet extra heeft afgelost kiest u 'Nee'
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'extraPymnt'" [checked] (change)="extraPymnt = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'extraPymnt'" (change)="extraPymnt = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div *ngIf="extraPymnt == true">
            <div class="field">
              <div class="label">
                Dit jaar
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntThisYear" (blur)="validate()" [class.error]="pymntThisYear > 0 && pymtsErr"></aegon-input-number>
              </div>
            </div>
            <div class="field">
              <div class="label">
                Voorgaande jaren
              </div>
              <div class="inputs">
                <aegon-input-number prefix="€" [(ngModel)]="pymntPrevYears" (blur)="validate()" [class.error]="pymntPrevYears > 0 && pymtsErr"></aegon-input-number>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Einddatum rentevastperiode
            </div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="interestPeriodEnd" [class.error]="interestPeriodEndErr" (change)="validate()"></aegon-input-date>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Huidig rentepercentage
              <aegon-help position="top">
                Het rentepercentage dat is vastgelegd in uw huidige hypotheekcontract. 
              </aegon-help>
            </div>
            <div class="inputs short">
              <aegon-input-number #amountInput [(ngModel)]="oldIntRate" [class.error]="oldIntRateErr" [max]="100"
                                 [placeholder]="'4,0%'" (change)="validate()" forceDecimals="1">
              </aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              NHG van toepassing
              <aegon-help position="top">
                Geef hier aan of op uw hypotheek de Nationale Hypotheek Garantie (NHG) van toepassing is. 
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'nhg'" [class.error]="nhgErr" (change)="nhg = false; validate()">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'nhg'" [class.error]="nhgErr" (change)="nhg = true; validate()">Ja</aegon-input-radio>
            </div>
          </div>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [class.disabled]="!isReady" [ngClass]="{pending: calculating}" (click)="calculate()">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="calculated">
        <div class="result">
          <div *ngIf="validIntst">
            <div class="bigger">
              <div class="row">
                <span class="label">Indicatie omzettingskosten</span>
                <div class="value">
                  <span class="curr">€</span>
                  <span class="amount">{{ totalFee | money }}*</span>
                </div>
                <div class="small">
                  <div class="row">
                    <div class="label"><p>Op basis van:<br>Resterende rentevastperiode: <b>{{ periodsLeft }} {{ periodsLeft > 1 ? 'maanden' : 'maand' }}</b><br>
                      Vergelijkingsrente: {{ newIntRate | money }}% <aegon-help position="top">Het actuele rentepercentage dat geldt voor de periode van uw resterende rentevastperiode. U vindt de geldende percentages op onze pagina met actuele rentepercentages. </aegon-help></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Optie 1: omzetten naar marktrente</span>
                <div class="small">
                  <div class="row">
                    <!-- Indicatie nieuwe rente intro text -->
                    <p>Na betaling van de omzettingskosten kunt u profiteren van een lagere rente. Het verschil in maandlasten is afhankelijk van de nieuwe rentevastperiode die u wenst.</p>
                  </div>                
                  <div class="row">
                    <div class="label"><p>Nieuwe rentevastperiode<span *ngIf="newPeriod > -1"> met rente: <b>{{ newPeriodInt | money }}%</b></span></p>
                    </div>
                    <div class="label">
                      <!-- These are the options for the interest period, the value is in months. -->
                      <select [(ngModel)]="newPeriod" class="no-dd" (change)="newPeriod = $event.target.value; calculateNewMonthlyPymnt();">
                        <option [value]="-1">Kies</option>
                        <option [value]="0">Variabele rente</option>
                        <option [value]="24">2 jaar</option>
                        <option [value]="60">5 jaar</option>
                        <option [value]="120">10 jaar</option>
                        <option [value]="180">15 jaar</option>
                        <option [value]="240">20 jaar</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="label"><p>Huidige rente per maand</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount">{{ monthlyFee | money }}</span> <small>bruto</small>
                    </span>
                  </div>
                  <div class="row">
                    <div class="label"><p>Nieuwe rente per maand</p></div>
                    <span class="value">
                      <span class="curr">€</span>
                      <span class="amount"><span *ngIf="newPeriod > -1">{{ newMonthlyPymnt | money }}</span><span *ngIf="newPeriod == -1">- </span></span> <small>bruto</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Optie 2: rentemiddelen</span>
                <div class="small">
                  <div class="row"><div>
                    <!-- Optie 2 text -->
                    <p>De omzettingskosten worden met een renteopslag doorberekend. De oude en nieuwe rente wordt 'gemiddeld'. Log in bij Mijn Aegon om uw nieuwe rente per maand te zien.</p>
                  </div></div>
                </div>
              </div>
            </div>
            <div class="bigger">
              <div class="row">
                <span class="label">Hoe verder?</span>
                <div class="small">
                  <div class="row">
                    <!-- Hoe verder text -->
                    <p>Als het aanpassen van uw hypotheekrente u interessant lijkt ga dan naar Mijn Aegon en download uw hypotheekrente opties als PDF</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="cta-wrapper">
              <div class="row clearfix">
                <a href="#" class="button transparent arrow flleft">Meer over de voor- en nadelen van de opties</a>
                <a href="/mijnaegon/" class="button green icon-right icon-lock not-loggedin-content">Log in bij Mijn Aegon</a>
              </div>
            </div>
          </div>
          <div *ngIf="!validIntst" class="not-possible">
            <!-- User interest lower than market interest message -->
            <h4>Berekening niet mogelijk</h4>
            <p>Het ingevoerde rentepercentage is lager dan de nu geldende marktrente. Het is daarom niet mogelijk om de omzettingskosten te berekenen. Controleer of u het juiste rentepercentage heeft ingevoerd.</p>
          </div>
        </div>
        <div class="disclaimer">
        * De uitkomst van deze berekening is een indicatie en kan u helpen bij de overweging om uw hypotheekrente aan te passen. Aan de berekening kunnen geen rechten worden ontleend.
        </div>
      </div>
    </div>
  `,
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
      let penaltyFree = this.roundToDeg((0.1 * this.initialAmount), 2);

      // 2. Repayment (Bedrag aflossing).
      if (this.extraPymnt === true) {
        this.repymnt = this.pymntThisYear + this.pymntPrevYears;
      } else {
        this.repymnt = 0;
      }

      // 3. Basis penalty-calculation (grondslag boeteberekening).
      let basisFee = (this.initialAmount - penaltyFree - this.repymnt);

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
      this.intstService.getMarketInterestRate({months: this.periodsLeft, nhg: this.nhg}).then((interests) => {
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
      this.intstService.getMarketInterestRate({months: this.newPeriod, nhg: this.nhg}).then((interests) => {
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