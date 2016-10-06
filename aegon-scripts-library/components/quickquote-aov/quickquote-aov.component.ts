import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Jsonp, Http, Headers, RequestOptions, Response} from "@angular/http";
import 'rxjs/Rx';

import {migrateTemplate} from "../../aegon-angular/lib/util";

import {NibudService} from "./nibud.service";


const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteAovTemplate'));

@Component({
  selector: 'aegon-quickquote-aov',
  template: templateElem ? migrateTemplate(templateElem.value) : `
    <div class="quickquote angular aov">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Inzicht in uw maandelijkse uitgaven</h3>
        <div *ngIf="step === 'start'">
          <div class="field first">
            <div class="label">
              Wat geeft u maandelijks uit? *
            </div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" (click)="step = 'calculation'">
                Bereken hier uw maandelijkse uitgaven
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
              Uw maandelijkse uitgaven
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
                Heeft u wel een partner, maar woont u niet samen? Vul dan 'nee' in.
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
              <select [ngModel]="children" (change)="children = $event.target.value; triggerValueChanged();" required>
                <option value="" disabled>Maak uw keuze</option>
                <option [value]="0">Nee</option>
                <option [value]="1">Ja, 1 kind</option>
                <option [value]="2">Ja, 2 kinderen</option>
                <option [value]="3">Ja, 3 kinderen</option>
                <option [value]="4">Ja, 4 of meer kinderen</option>
              </select>
            </div>
          </div>
          <p class="error" *ngIf="childrenError">
            Kies of u thuiswonende kinderen heeft of niet.
          </p>
          <div class="field">
            <div class="label">
              Type woning
              <aegon-help>
                Staat uw type woning er niet bij? Kies dan het woningtype dat het meest op uw woningtype lijkt.
                Woont u bijvoorbeeld in een galerijflat, kies dan appartement. Woont u in een 2-onder-1-kapwoning,
                kies dan een hoekwoning.
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="typeOfResidence" (change)="typeOfResidence = $event.target.value; triggerValueChanged();" required>
                <option value="" disabled>Maak uw keuze</option>
                <option value="Galerij">Appartement</option>
                <option value="RijtjeswoningTussen">Tussenwoning</option>
                <option value="TweeOnderEenKap">Hoekwoning</option>
                <option value="VrijstaandGroot">Vrijstaand</option>
              </select>
            </div>
          </div>
          <p class="error" *ngIf="typeOfResidenceError">
            Kies uw woning type.
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
            Kies of u een koop- of huurwoning heeft.
          </p>
          <div class="field">
            <div class="label">
              Netto maandlasten hypotheek of huur
              <aegon-help>
                Vul het bedrag in dat u maandelijks betaalt aan hypotheek of huur. Eventuele hypotheekrente&shy;aftrek
                of huurtoeslag haalt u van dit bedrag af.
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-number prefix="€" [(ngModel)]="costResidence" [max]="99999999"
                                  [placeholder]="'0'" (modelChange)="triggerValueChanged();">
              </aegon-input-number>
            </div>
          </div>
          <p class="error" *ngIf="costResidenceError">
            Vul uw netto maandlasten hypotheek of huur in.
          </p>
          <div class="field">
            <div class="label">
              Netto maandelijks gezinsinkomen
              <aegon-help>
                Vul uw netto gezinsinkomen in. Woont u samen met een partner? Tel dan bij uw eigen inkomen als
                zelfstandige netto inkomsten van uw partner op. Inclusief vakantiegeld en eventuele toeslagen.
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
          <a class="button orange icon-right arrow" [attr.href]="'/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/arbeidsongeschiktheidsverzekering-berekenen?verzekerdbedrag=' + netToGross(familyIncome)">
            Bereken uw premie
          </a>
        </div>
      </div>
      <div *ngIf="isValidated && pendingCount === 0" class="result">
        <div class="heading">
          Gemiddelde netto uitgaven per maand per uitgavenpost *
        </div>
        <div class="linear">
          <div class="row">
            <span class="label">
              Woning en energie
              <aegon-help>
                Hieronder vallen: huur/hypotheek, servicekosten/erfpacht, gas, elektriciteit, water, onroerende
                zaakbelasting, reinigingsheffing, rioolheffing, waterschapslasten, bijdrage VvE.
              </aegon-help>
            </span>
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
            <span class="label">
              Verzekeringen en onderwijs
              <aegon-help>
                Hieronder vallen: zorgverzekering, aansprake&shy;lijkheidsverzekering, inboedelverzekering,
                opstalverzekering, uitvaartverzekering, vaste telefoon, televisie, internet, mobiele telefoon,
                (sport-)verenigingen, kranten, tijdschriften, school- en studiekosten kinderen.
              </aegon-help>
            </span>
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
            <span class="label">
              Boodschappen
              <aegon-help>
                Hieronder vallen onder meer: voeding, was- en schoonmaakmiddelen, persoonlijke verzorging.
              </aegon-help>
            </span>
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
            <span class="label">
              Vervoer
              <aegon-help>
                Hieronder vallen onder meer: fiets, openbaar vervoer.
              </aegon-help>
            </span>
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
            <span class="label">
              Overig (kleding, huis, vrije tijd)
              <aegon-help>
                Hieronder vallen: kleding, schoenen, inventaris, onderhoud huis en tuin, vakantie, vrije tijd.
              </aegon-help>
            </span>
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
        <div class="bigger" *ngIf="!showTotalAmount">
          <div class="row">
            <span class="label">Herkent u zich in deze bedragen?</span>
            <button class="button icon-right icon-calculator" (click)="showTotalAmount = true">
              Bereken totaal
            </button>
          </div>
        </div>
        <div class="total-amount" *ngIf="showTotalAmount">
          <div class="bigger">
            <div class="row">
              <span class="label">Totaal uitgavenposten</span>
              <span class="value">
                <span class="currency">€</span>
                <span class="amount">{{totalCosts | money}}</span>
                p. mnd.
              </span>
            </div>
          </div>
          <div class="heading">Voor dit bedrag een AOV?</div>
          <div class="footer">
            <div class="label">
              U kunt dit bedrag verzekeren via een AOV.<br>
              Dit hoeft niet duur te zijn.
            </div>
            <a class="button orange icon-right arrow" [attr.href]="'/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/arbeidsongeschiktheidsverzekering-berekenen?verzekerdbedrag=' + grossTotalCosts">
              Bereken uw premie
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="notes">
      <div class="note">
        <span class="symbol">*</span>
        Indicatie van gemiddelde uitgaven per maand is tot stand gekomen ism Nibud.<br>
        Voor de berekening is gebruik gemaakt van een aantal aannames.
      </div>
    </div>
  `,
  providers: [NibudService]
})
export class QuickQuoteAovComponent implements OnInit {
  step: string = 'start';
  hasPartner: boolean;
  hasPartnerError: boolean;
  children: any = '';
  childrenError: boolean;
  typeOfResidence: string = '';
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
      'transport': [65,66,70],
      'otherFixedCharges': [20,21,22,23,33,34,35,36,37,38,40,50,51,52],
      'groceries': [130,132,133,134],
      'irregularExpenses': [80,90,100,110,111,113,120]
    };
  }

  ngOnInit() {}

  private validate(): boolean {
    let hasErrors: boolean = false;
    if (typeof this.hasPartner === "undefined") {
      this.hasPartnerError = true;
      hasErrors = true;
    }
    if (this.children === '') {
      this.childrenError = true;
      hasErrors = true;
    }
    if (this.typeOfResidence === '') {
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
  private submit(): void {
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

  private calculate(): void {
    let body = this.getPostData();

    this.nibudService.getReferenceCosts(body).then(
      data => {
        this.processResult(data);
      },
      error => console.log(error)
    );
  }

  private triggerValueChanged(): void {
    this.isValidated = false;
  }

  private getPostData() {
    let body:any = {
      "hoofdpersonen": [
        {"geboortedatum": this.generateBirthdate(40)}
      ],
      "kinderen": [],
      "autos": [],
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
      body['hoofdpersonen'] =
        [
          {
          "geboortedatum": this.generateBirthdate(40),
          "geslacht": "Man"
        },
        {
          "geboortedatum": this.generateBirthdate(40),
          "geslacht": "Vrouw"
        }
        ];
    }
    return body;
  }

  private generateBirthdate(age: number): any {
    let date : Date = new Date(),
      dd : any = Math.max(1, date.getDate() - 1),
      mm : any = date.getMonth() +1,
      yyyy : any = date.getFullYear();

    yyyy = yyyy - age;


    return yyyy+'-'+mm+'-'+dd;
  }

  private handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    this.pendingCount -= 1;
    return Observable.throw('Server error');
  }

  private processResult(response) {
    let items: any[] = response;

    var flattenedArray = [];
    items.forEach(item => {
      flattenedArray['' + item['id']]= item['voorbeeld'];
    });

    this.mapCosts(flattenedArray);
    this.housingCosts += this.costResidence || 0;
    this.calculateTotals();
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

    this.grossTotalCosts = this.netToGross(this.totalCosts);
  }

  private netToGross(netAmount){
    let result = Math.round((netAmount / .65) * 12);
    clientStorage.session.setItem("grossYearlyExpenseAmount", result);
    return result;
  };

  private getAmountForGroupedCosts(costMapping, flattenedArray) {
    var groupCosts = 0;
    costMapping.forEach(costId => {
      groupCosts = groupCosts + flattenedArray[costId];
    });

    return groupCosts;
  }
}
