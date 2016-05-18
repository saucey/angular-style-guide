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
        <div *ngIf="step === 'start'">
          <div class="field first">
            <div class="label">
              Wat geeft u maandelijks uit?
            </div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" (click)="step = 'calculation'">
                Bereken mijn maandelijkse uitgaven
              </button>
              <div>
                <ul class="arrow">
                  <li><a href="#" (click)="step = 'noCalculation'; $event.preventDefault()">Ik weet mijn maandelijkse uitgaven</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="step === 'noCalculation'" class="monthly-spendings">
          <div class="field">
            <div class="label">
              Uw vaste uitgaven per maand
            </div>
            <div class="inputs">
              <aegon-input-number prefix="€" [(ngModel)]="familyIncome" [max]="99999999"></aegon-input-number>
              <div>
                <ul class="arrow">
                  <li><a href="#" (click)="step = 'calculation'; $event.preventDefault()">Gebruik de uitgaven rekenhulp</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="step === 'calculation'">
          <div class="field">
            <div class="label">
              Woont u samen met een partner?
              <aegon-help>
                Dit is de eerste helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" (change)="hasPartner = true; triggerValueChanged();" [value]="true">Ja</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" (change)="hasPartner = false; triggerValueChanged();" [value]="false">Nee</aegon-input-radio>
            </div>
          </div>
          <p class="error" *ngIf="hasPartnerError">
             Kies of u een partner heeft of niet.
           </p>
          <div class="field">
            <div class="label">
              Heeft u thuiswonende kinderen?
            </div>
            <div class="inputs">
              <select [ngModel]="children" (change)="children = $event.target.value; triggerValueChanged();">
                <option value="" selected>Maak uw keuze</option>
                <option value="0">Nee</option>
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
                Dit is de helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="typeOfResidence" (change)="typeOfResidence = $event.target.value; triggerValueChanged();">
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
            </div>
            <div class="inputs">
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" (change)="mortgageKind = 'Koopwoning'; triggerValueChanged();" [value]="'koop'">Koopwoning</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" (change)="mortgageKind = 'Huurwoning'; triggerValueChanged();" [value]="'huur'">Huurwoning</aegon-input-radio>
            </div>
          </div>
          <p class="error" *ngIf="mortgageKindError">
            Kies of u een koop of huurwoning heeft.
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
                                [placeholder]="'0'" (modelChange)="triggerValueChanged();">
            </aegon-input-number>
          </div>
        </div>
        <p class="error" *ngIf="costResidenceError">
            Vul uw netto maandlasten hypotheek of huur in.
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
                               [placeholder]="'0'" (modelChange)="triggerValueChanged();">
            </aegon-input-number>
          </div>
        </div>
        <p class="error" *ngIf="familyIncomeError">
            Vul uw netto gezinsinkomen in.
          </p>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [disabled]="pendingCount > 0" [ngClass]="{pending: pendingCount > 0}" (click)="submit()">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="result tiny" *ngIf="step === 'noCalculation' && familyIncome > 0">
        <div class="row">
          <span class="label"></span>
          <a class="button orange icon-right arrow" [attr.href]="'#TODO?spendings=' + familyIncome">Bereken uw premie</a>
        </div>
      </div>
      <div class="result" *ngIf="isValidated">
        <div class="linear">
          <div class="row">
            <span class="label">Uitgave woning en energie</span>
            <span class="value">
              <span class="currency" *ngIf="!editingHouse">€</span>
              <span class="amount" *ngIf="!editingHouse">{{housingCosts | money}}</span>
              <span class="amount" *ngIf="editingHouse">
                <aegon-input-number prefix="€" [(ngModel)]="housingCosts" [max]="99999999"
                                    placeholder="0">
                </aegon-input-number>
              </span>
              <span class="edit" *ngIf="!editingHouse" tabindex="0" (click)="editingHouse = !editingHouse">Wijzig</span>
              <button class="save" *ngIf="editingHouse" (click)="editingHouse = !editingHouse; calculateTotals()">Bewaar</button>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgave verzekeringen en onderwijs</span>
             <span class="value">
              <span class="currency" *ngIf="!editingFixed">€</span>
              <span class="amount" *ngIf="!editingFixed">{{otherFixedCharges | money}}</span>
              <span class="amount" *ngIf="editingFixed">
                <aegon-input-number prefix="€" [(ngModel)]="otherFixedCharges" [max]="99999999"
                                    placeholder="0">
                </aegon-input-number>
              </span>
              <span class="edit" *ngIf="!editingFixed" tabindex="0" (click)="editingFixed = !editingFixed">Wijzig</span>
              <button class="save" *ngIf="editingFixed" (click)="editingFixed = !editingFixed; calculateTotals()">Bewaar</button>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven boodschappen</span>
             <span class="value">
              <span class="currency" *ngIf="!editingGroceries">€</span>
              <span class="amount" *ngIf="!editingGroceries">{{groceries | money}}</span>
              <span class="amount" *ngIf="editingGroceries">
                <aegon-input-number prefix="€" [(ngModel)]="groceries" [max]="99999999"
                                    placeholder="0">
                </aegon-input-number>
              </span>
              <span class="edit" *ngIf="!editingGroceries" tabindex="0" (click)="editingGroceries = !editingGroceries">Wijzig</span>
              <button class="save" *ngIf="editingGroceries" (click)="editingGroceries = !editingGroceries; calculateTotals()">Bewaar</button>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven vervoer</span>
            <span class="value">
              <span class="currency" *ngIf="!editingTransport">€</span>
              <span class="amount" *ngIf="!editingTransport">{{transport | money}}</span>
              <span class="amount" *ngIf="editingTransport">
                <aegon-input-number prefix="€" [(ngModel)]="transport" [max]="99999999"
                                    placeholder="0">
                </aegon-input-number>
              </span>
              <span class="edit" *ngIf="!editingTransport" tabindex="0" (click)="editingTransport = !editingTransport">Wijzig</span>
              <button class="save" *ngIf="editingTransport" (click)="editingTransport = !editingTransport; calculateTotals()">Bewaar</button>
            </span>
          </div>
          <div class="row">
            <span class="label">Overig (kleding, huis, vrije tijd)</span>
            <span class="value">
              <span class="currency" *ngIf="!editingIrregular">€</span>
              <span class="amount" *ngIf="!editingIrregular">{{irregularExpenses | money}}</span>
              <span class="amount" *ngIf="editingIrregular">
                <aegon-input-number prefix="€" [(ngModel)]="irregularExpenses" [max]="99999999"
                                    placeholder="0">
                </aegon-input-number>
              </span>
              <span class="edit" *ngIf="!editingIrregular" tabindex="0" (click)="editingIrregular = !editingIrregular">Wijzig</span>
              <button class="save" *ngIf="editingIrregular" (click)="editingIrregular = !editingIrregular; calculateTotals()">Bewaar</button>
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
  step: string = 'start';
  netFamilyIncome: number;
  amountTooSmall: boolean;
  storedInAegon: boolean = false;
  storedElsewhere: boolean = false;
  storedError: boolean;
  hasPartner: boolean;
  hasPartnerError: boolean;
  children: number;
  childrenError: boolean;
  typeOfResidence: any;
  typeOfResidenceError: boolean;
  mortgageKind: any;
  mortgageKindError: boolean;
  familyIncome: number;
  familyIncomeError: boolean;
  costResidence: number;
  costResidenceError: boolean;
  isValidated: boolean;
  serviceError: boolean;
  pendingCount: number = 0;
  mapping: any;

  /**
   * grouped costs from nibud service call result:
   */
  housingCosts: number;
  transport: number;
  otherFixedCharges: number;
  groceries: number;
  irregularExpenses: number;
  totalCosts: number;
  grossTotalCosts: number;

  constructor(
    private nibudService: NibudService
  ) {
    this.mapping = {
      'housingCosts': [0, 1, 2, 10, 11, 12, 13, 14, 15],
      'transport': [60,61,62,63,64,65,66,70],
      'otherFixedCharges': [20,21,22,23,33,34,35,36,37,38,40,50,51,52],
      'groceries': [130,132,133,134],
      'irregularExpenses': [80,90,100,110,111,113,120]
    };
  }

  ngOnInit() {}

  isValidAmount(): boolean {
    this.amountTooSmall = this.netFamilyIncome < 25000;
    return !this.amountTooSmall;
  }

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
    if (!this.costResidence) {
      this.costResidenceError = true;
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

    this.isValidated = !hasErrors;

    return !hasErrors;
  }
  submit(): void {
    this.storedError = false;
    this.serviceError = false;
    this.childrenError = false;
    this.typeOfResidenceError = false;
    this.mortgageKindError = false;
    this.costResidenceError = false;
    this.familyIncomeError = false;
    this.hasPartnerError = false;

    if (this.validate()) {
      this.pendingCount = 1;
      this.calculate();
    }
  }

  calculate(): void {
    let body = this.getPostData();

    this.nibudService.getReferenceCosts(body).then(
      data => {
        this.processResult(data);
      },
      error => console.log(error)
    );
  }

  triggerValueChanged(): void {
    this.isValidated = false;
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
        }
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


    return yyyy+'-'+mm+'-'+dd;
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    this.pendingCount -= 1;
    return Observable.throw('Server error');
  }

  processResult(response) {
    let items: any[] = response;

    var flattenedArray = [];
    items.forEach(item => {
      flattenedArray['' + item['id']]= item['basis'];
    });

    this.mapCosts(flattenedArray);

    this.pendingCount -= 1;
  }

  private mapCosts(flattenedArray) {
    var mapping = this.mapping;

    for (var costGroup in mapping) {
      if (!mapping.hasOwnProperty(costGroup)) {
        continue;
      }
      this[costGroup] = this.getAmountForGroupedCosts(mapping[costGroup], flattenedArray);
    }
    this.calculateTotals();
  }

  private calculateTotals() {
    var mapping = this.mapping;

    this.totalCosts = 0;
    for (var costGroup in mapping) {
      if (!mapping.hasOwnProperty(costGroup)) {
        continue;
      }
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
