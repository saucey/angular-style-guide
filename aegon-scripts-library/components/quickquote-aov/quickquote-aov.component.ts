import {Component, OnInit, Input} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {NibudService} from "./nibud.service";


const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteAovTemplate'));

@Component({
  selector: 'aegon-quickquote-aov',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    InputRadioComponent, InputRadioValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote angular aov">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Wat kost het om uw maandelijkse uitgaven te verzekeren?</h3>
        <div *ngIf="step == 1">
          <div class="field first">
            <div class="label">
              Wat geeft u maandelijks uit?
            </div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" (click)="submitAmount()">
                Bereken mijn maandelijkse uitgaven
              </button>
              <a href="/bla" class="monthly-spendings">Ik weet mijn maandelijkse uitgeven</a>
            </div>
          </div>
        </div>
        <div *ngIf="step > 1">
          <div class="field">
            <div class="label">
              Woont u samen met een partner?
              <aegon-help>
                Dit is de eerste helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" (change)="hasPartner = true" [value]="true">Ja</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" (change)="hasPartner = false" [value]="false">Nee</aegon-input-radio>
            </div>
          </div>
          <p class="error" *ngIf="hasPartnerError">
             Kies of u een partner heeft of niet.
           </p>
          <div class="field">
            <div class="label">
              Heeft u thuiswonende kinderen
              <aegon-help>
                Dit is de tweede helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="children" (change)="children = $event.target.value">
                <option value="" selected>Maak uw keuze</option>
                <option value="nee">Nee</option>
                <option value="1">Ja, 1 kind</option>
                <option value="2">Ja, 2 kinderen</option>
                <option value="3">Ja, 3 kinderen</option>
                <option value="4">Ja, 4 kinderen</option>
                <option value="5">Ja, 5 kinderen</option>
                <option value="6">Ja, 6 kinderen</option>
                <option value="7">Ja, 7 kinderen</option>
                <option value="8">Ja, 8 kinderen</option>
                <option value="9">Ja, 9 kinderen</option>
                <option value="10">Ja, 10 of meer kinderen</option>
              </select>
            </div>
          </div>
           <p class="error" *ngIf="childrenError">
              Kies of u een kinderen heeft of niet.
            </p>
          <div class="field">
            <div class="label">
              Type woning
              <aegon-help>
                Dit is de derde helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="typeOfResidence" (change)="typeOfResidence = $event.target.value">
               <option value="" selected>Maak uw keuze</option>
                <option value="Galerij">appartement</option>
                <option value="RijtjeswoningTussen">tussenwoning</option>
                <option value="TweeOnderEenKap">hoekwoning</option>
                <option value="VrijstaandGroot">vrijstaand</option>
              </select>
            </div>
          </div>
          <p class="error" *ngIf="typeOfResidenceError">
             Kies uw woning type
          </p>
          <div class="field">
            <div class="label">
              Heeft u een koop- of huurwoning?
              <aegon-help>
                Dit is de vierde helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" (change)="mortgageKind = 'koop'" [value]="'koop'">Koopwoning</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" (change)="mortgageKind = 'huur'" [value]="'huur'">Huurwoning</aegon-input-radio>
            </div>
          </div>
          <p class="error" *ngIf="mortgageKindError">
            Kies of u een koop of wuurwoning heeft.
          </p>
         <div class="field">
          <div class="label">
            Netto maandlasten hypotheek of huur
            <aegon-help>
              Dit is de vijfde helptekst
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-number  prefix="€" [(ngModel)]="costResidence" [max]="99999999"
                                [placeholder]="'0'">
            </aegon-input-number>
          </div>
        </div>
        <p class="error" *ngIf="costResidenceError">
            Vul uw netto maandlaen hypotheek of huur in.
          </p>
         <div class="field">
          <div class="label">
            Netto gezinsinkomen
            <aegon-help>
              Dit is de zesde helptekst.
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-number #amountInput prefix="€" [(ngModel)]="familyIncome" [max]="99999999"
                               [placeholder]="'0'">
            </aegon-input-number>
          </div>
        </div>
        <p class="error" *ngIf="familyIncomeError">
            Vul uw netto gezinsinkomen in.
          </p>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator"  [disabled]="pendingCount > 0" [ngClass]="{pending: pendingCount > 0}" (click)="submit()">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="result" *ngIf="housingCosts">
        <div class="linear">
          <div class="row">
            <span class="label">Uitgave woning en energie</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{housingCosts | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgave verzekeringen en onderwijs</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{otherFixedCharges | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven boodschappen</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{groceries | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven vervoer</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{transport | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Overig (kleding, huis, vrije tijd)</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{irregularExpenses | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
        </div>
        <div class="bigger">
          <div class="row">
            <span class="label">Netto uitgaven per maand*</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{totalCosts | money}}</span>
            </span>
          </div>
          <div class="row">
            <span class="label">Dit is bruto per jaar</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{grossTotalCosts | money}}</span>
            </span>
          </div>
        </div>
        <div class="footer">
          <div class="label"></div>
          <button class="button orange icon-right arrow">Vrijblijvende offerte</button>
        </div>
      </div>
    </div>
  `,
  providers: [NibudService, HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteAovComponent implements OnInit {
  step: number = 1;
  storedError: boolean;
  hasPartner: boolean;
  hasPartnerError: boolean;
  children: number;
  childrenError: boolean;
  typeOfResidence: any;
  typeOfResidenceError: boolean;
  mortgageKind: any;
  mortgageKindError: boolean;
  mortgageAmount: any;
  mortgageAmountError: boolean;
  familyIncome: number;
  familyIncomeError: boolean;
  costResidence: number;
  costResidenceError: boolean;
  birthDateError: boolean;
  serviceError: boolean;
  pendingCount: number = 0;
  housingCosts: number;
  transport: number;
  otherFixedCharges: number;
  groceries: number;
  irregularExpenses: number;
  totalCosts: number;
  grossTotalCosts: number;

  constructor(
    private nibudService: NibudService
  ) {}

  ngOnInit() {
  }

  //isValidAmount(): boolean {
  //  this.amountTooSmall = this.pensionAmount < 25000;
  //  return !this.amountTooSmall;
  //}

  submitAmount(): void {
    this.step += 1;
  }

  validate(): boolean {
    let hasErrors: boolean = false;
    this.storedError = null;
    if (typeof this.hasPartner === "undefined") {
      this.hasPartnerError = true;
      hasErrors = true;
    }
    if (!this.children) {
      this.childrenError = true;
      hasErrors = true;
    }
    if (!this.typeOfResidence) {
      this.typeOfResidenceError = true;
      hasErrors = true;
    }
    if (!this.mortgageKind) {
      this.mortgageKindError = true;
      hasErrors = true;
    }
    if (!this.mortgageAmount) {
      this.mortgageAmountError = true;
      hasErrors = true;
    }
    if (!this.costResidence) {
      this.costResidenceError = true;
      hasErrors = true;
    }
    if (!this.familyIncome) {
      this.familyIncomeError = true;
      hasErrors = true;
    }

    return !hasErrors;
  }
  submit(): void {
    this.storedError = false;
    this.serviceError = false;
    this.childrenError = false;
    this.typeOfResidenceError = false;
    this.mortgageKindError = false;
    this.mortgageAmountError = false;
    this.costResidenceError = false;
    this.familyIncomeError = false;
    this.hasPartnerError = false;
    this.housingCosts = 0;

    if (this.validate()) {
      this.pendingCount = 2;
      this.calculate();
    }
    this.calculate();
  }

  calculate(): void {


    //if (true) {
    //  let mockData = this.nibudService.getMockData();
    //
    //  this.processResult(mockData);
    //  return;
    //}

    let body = this.getPostData();

    console.log(this.nibudService.referencePrices(body));
    this.nibudService.referencePrices(body).then(function(data) {
      this.processResult(data);
    });

  }

  private getPostData() {
    let body:any = {
      "hoofdpersonen": [
        {"geboortedatum": this.generateBirthdate(40)}
      ],
      "kinderen": [],
      "autos": [{
        "nieuwwaarde": 10000,
        "kilometersPerJaar": 5000
      }],
      "nettoBesteedbaarInkomenPerMaand": this.familyIncome,
      "woning": {
        "soort": this.mortgageKind,
        "typeWoning": this.typeOfResidence,
        "bouwjaar": "Van1989TotEnMet2000",
        "energielabel": "Onbekend",
        "wozWaarde": 225000
      }
    };

    for (var count = 0; count < this.children; count++) {
      body['kinderen'].push(
        {
          "geboortedatum": this.generateBirthdate(10),
          "woonsituatie": "Thuiswonend",
          "schooltype": "Basis"
        }
      );
    }

    if (this.hasPartner) {
      body['hoofdpersonen'].push(
        {
          "geboortedatum": this.generateBirthdate(40),
          "geslacht": "Man"
        },
        {
          "geboortedatum": this.generateBirthdate(40),
          "geslacht": "Vrouw"
        },
      );
    }
    return body;
  }

  generateBirthdate(age: number): any {
    let date : Date = new Date(),
      dd : any = date.getDate(),
      mm : any = date.getMonth() +1,
      yyyy : any = date.getFullYear();

    yyyy = yyyy - age;

    if(dd<10) {
      dd="0"+dd
    }

    if(mm<10) {
      mm="0"+mm
    }

    return dd+'-'+mm+'-'+yyyy;
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    this.pendingCount -= 1;
    return Observable.throw('Server error');
  }

  processResult(response) {
    let items: any[] = response,
      groupedCosts;

    var flattenedArray = [];
    items.forEach(item => {
      flattenedArray['' + item['id']]= item['basis'];
    });

    this.mapCosts(flattenedArray);

    this.pendingCount -= 1;
  }

  private mapCosts(flattenedArray) {
    var mapping = {
      'housingCosts': [0, 1, 2, 10, 11, 12, 13, 14, 15],
      'transport': [60,61,62,63,64,65,66,70],
      'otherFixedCharges': [20,21,22,23,33,34,35,36,37,38,40,50,51,52],
      'groceries': [130,132,133,134],
      'irregularExpenses': [80,90,100,110,111,113,120]
    };

    this.totalCosts = 0;
    for (var costGroup in mapping) {
      if (!mapping.hasOwnProperty(costGroup)) {
        continue;
      }
      this[costGroup] = this.getAmountForGroupedCosts(mapping[costGroup], flattenedArray);
      this.totalCosts += this[costGroup];
    }

    this.grossTotalCosts = Math.round((this.totalCosts / .65) * 12);
  }

  private getAmountForGroupedCosts(costMapping, flattenedArray) {
    var groupCosts = 0;
    costMapping.forEach(costId => {
      groupCosts = groupCosts + flattenedArray[costId];
    });

    return groupCosts;
  }
}
