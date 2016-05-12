import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {MoneyPipe} from "../angular-components/money.pipe";

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
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" [value]="true">Ja</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="livingWithPartner1" [name]="'livingWithPartner'" [value]="false">Nee</aegon-input-radio>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Heeft u thuiswonende kinderen
              <aegon-help>
                Dit is de tweede helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="children">
                <option value="" selected>Maak uw keuze</option>
                <option value="nee">Nee</option>
                <option value="1">Ja, 1 kind</option>
                <option value="2">Ja, 2 kinderen</option>
                <option value="3">Ja, 3 kinderen</option>
                <option value="4">Ja, 4 kinderen</option>
              </select>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Type woning
              <aegon-help>
                Dit is de derde helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="typeOfResidence">
               <option value="" selected>Maak uw keuze</option>
                <option value="Galerij">appartement</option>
                <option value="RijtjeswoningTussen">tussenwoning</option>
                <option value="TweeOnderEenKap">hoekwoning</option>
                <option value="VrijstaandGroot">vrijstaand</option>
              </select>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Heeft u een koop- of huurwoning?
              <aegon-help>
                Dit is de vierde helptekst
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" [value]="'koop'">Koopwoning</aegon-input-radio>
              <aegon-input-radio [(ngModel)]="residenceType1" [name]="'residenceType'" [value]="'huur'">Huurwoning</aegon-input-radio>
            </div>
          </div>
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
            <button class="button arrow" *ngIf="step === 1" [disabled]="!pensionAmount" (click)="submitAmount()">
              Volgende
            </button>
          </div>
        </div>
         <div class="field">
          <div class="label">
            Netto gezinsinkomen
            <aegon-help>
              Dit is de zesde helptekst.
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-number #amountInput prefix="€" [(ngModel)]="pensionAmount" [max]="99999999"
                               [placeholder]="'0'">
            </aegon-input-number>
          </div>
        </div>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" (click)="submit('https://service.nibud.nl/api/uitgaven/v1-0/aegon/referentiebedragen/', '')">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="result" *ngIf="linearAmount && highLowFirstAmount">
        <div class="linear">
          <div class="row">
            <span class="label">Uitgave woning en energie</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{linearAmount | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgave verzekeringen en onderwijs</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{deathBenefitAmount | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven boodschappen</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{deathBenefitAmount | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Uitgaven vervoer</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{deathBenefitAmount | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
          <div class="row">
            <span class="label">Overig (kleding, huis, vrije tijd)</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{deathBenefitAmount | money}}</span>
              <span class="edit"><a href="">Wijzig</a></span>
            </span>
          </div>
        </div>
        <div class="bigger">
          <div class="row">
            <span class="label">Netto uitgaven per maand*</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{linearAmount | money}}</span>
            </span>
          </div>
          <div class="row">
            <span class="label">Dit is bruto per jaar</span>
            <span class="value">
              <span class="currency">€</span>
              <span class="amount">{{linearAmount | money}}</span>
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
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteAovComponent implements OnInit {
  step: number = 1;
  pensionAmount: number;
  storedError: boolean;
  birthDate: string;
  birthDateError: boolean;
  deathBenefit: boolean = false;
  partnerBirthDate: string;
  partnerBirthDateError: boolean;
  startingDate: string;
  startingDateError: boolean;
  startingDateChoices: any[] = [];
  startingDateTooFar: boolean = false;
  serviceError: boolean;
  pendingCount: number = 0;
  linearAmount: string;
  deathBenefitAmount: string;
  highLowFirstAmount: string;
  highLowSecondAmount: string;
  highLowDeathBenefitAmount: string;

  constructor(
    private http:Http
  ) {}

  ngOnInit() {
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
      let value = year + '-' + (month < 10 ? '0': '') + month + '-01',
        label = '1 ' + monthLabels[month - 1] + ' ' + year;
      this.startingDateChoices.push({value: value, label: label});
    }
  }


  //isValidAmount(): boolean {
  //  this.amountTooSmall = this.pensionAmount < 25000;
  //  return !this.amountTooSmall;
  //}

  submitAmount(): void {
      this.step += 1;
  }

  submit(serviceUrl: string, authToken: string): void {
    this.storedError = false;
    this.birthDateError = false;
    this.partnerBirthDateError = false;
    this.startingDateError = false;
    this.serviceError = false;
    this.linearAmount = null;
    this.deathBenefitAmount = null;
    this.highLowFirstAmount = null;
    this.highLowSecondAmount = null;
    this.highLowDeathBenefitAmount = null;

    this.pendingCount = 2;
    this.calculate(serviceUrl);
    this.calculate(serviceUrl);
  }

  calculate(serviceUrl: string): void {
    //if (serviceUrl === 'MockURL') {
    //  let mockData = {
    //    "BScalculateResponse": {
    //      "PROCES": {
    //        "STATUS": "00000",
    //        "VOLGNUM": "1",
    //        "STATUST": "Success"
    //      },
    //      "AILHEADER": {
    //        "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
    //        "CORRELATIONID": "##DIP SS##"
    //      },
    //      "PENSIOENOVEREENKOMST": {
    //        "PENSIOENAANSPRAAK": [
    //          {
    //            "EIND_DATUM_UITKERING": "2134-12-20",
    //            "PENSIOENVORM": "OPLL",
    //            "BEDRAG": "5631.4"
    //          }, {
    //            "EIND_DATUM_UITKERING": "2134-12-20",
    //            "PENSIOENVORM": "PPLL",
    //            "BEDRAG": "1877.13"
    //          }, {
    //            "EIND_DATUM_UITKERING": "2134-12-20",
    //            "PENSIOENVORM": "OPT",
    //            "BEDRAG": "4111.45"
    //          }
    //        ]}
    //    }};
    // this.processResult(highLow, mockData);
    //  return;
    //}
    let body:any = {
      "hoofdpersonen": [
        {"geboortedatum": "1980-1-1"},
        {"geboortedatum": "1980-1-1"}
      ],
      "kinderen": [{
        "geboortedatum": "2010-1-1"
      }],
      "autos": [{
        "nieuwwaarde": 10000,
        "kilometersPerJaar": 5000
      }],
      "nettoBesteedbaarInkomenPerMaand": 2500,
      "woning": {
        "soort": "Koopwoning",
        "typeWoning": "Galerij",
        "bouwjaar": "Van1976TotEnMet1979",
        "wozWaarde": 200000
      }
    };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    this.http.post(serviceUrl, JSON.stringify(body), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.processResult(data);
      }, error => console.log(error));
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    this.pendingCount -= 1;
    return Observable.throw('Server error');
  }

  processResult(data) {
    console.log(data);
    //let items: any[] = data['BScalculateResponse']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'],
    //  hlAmount = 0;
    //if (!Array.isArray(items)) {
    //  items = [items];
    //}
    //items.forEach(item => {
    //  let s = item['PENSIOENVORM'],
    //    value = item['BEDRAG'];
    //this.pendingCount -= 1;
  }
}
