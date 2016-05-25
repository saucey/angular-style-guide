import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {InputNumberComponent, InputNumberValueAccessor} from '../angular-components/input-number.component';
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {AfterViewInit} from "angular2/core";
import {ViewChild} from "angular2/core";
import {ElementRef} from "angular2/core";


var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteMortgageTemplate'));
@Component({
  selector: 'aegon-quickquote-boeterente',
  directives: [
    HelpComponent, InputDateComponent, InputDateValueAccessor, InputNumberComponent, InputNumberValueAccessor, CheckboxComponent, CheckboxValueAccessor, InputRadioComponent, InputRadioValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote angular aov boeterente">
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
            <select [ngModel]="mortgageType" class="no-dd" (change)="console.log(mortgageType)">
              <option value="0" selected>Maak uw keuze</option>
              <option value="1">Aflossingsvrij</option>
              <option value="2">Annuitair</option>
              <option value="3">(Bank)Spaar</option>
              <option value="4">Lineair</option>
              <option value="5">Overig</option>
            </select>
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
            <aegon-input-number #amountInput prefix="€" [(ngModel)]="initialAmount" [placeholder]="'0'">
            </aegon-input-number>
            </div>
          </div>
          <div class="field first">
            <div class="label">
              Heeft u al extra afgelost op dit bedrag?
              <aegon-help>
                Sample text
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-input-radio [name]="'extraPymnt'" [value]="0" (change)="extraPymnt = false;">Nee</aegon-input-radio>
              <aegon-input-radio [name]="'extraPymnt'" [value]="1" (change)="extraPymnt = true;">Ja</aegon-input-radio>
            </div>
          </div>
        </div>
        <div *ngIf="extraPymnt == true && mortgageType > 0" class="monthly-spendings">
          <div class="field">
            <div class="label">
              Dit jaar
            </div>
            <div class="inputs">
              <aegon-input-number prefix="€" [(ngModel)]="extraPymntThisYear"></aegon-input-number>
            </div>
          </div>
          <div class="field">
            <div class="label">
              Voorgaande jaren
            </div>
            <div class="inputs">
              <aegon-input-number prefix="€" [(ngModel)]="extraPymntPrevYears"></aegon-input-number>
            </div>
          </div>
        </div>
        <div *ngIf="mortgageType > 0">
          <div class="field">
            <div class="label">
              Einddatum rentevastperiode
            </div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="interestPeriodEnd"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="hasPartnerError">
             Kies of u een partner heeft of niet.
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
          <a class="button orange icon-right arrow" [attr.href]="'/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/arbeidsongeschiktheidsverzekering-berekenen?AO1_VERZSOM=' + netToGross(familyIncome)">Bereken uw premie</a>
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
          <a class="button orange icon-right arrow" [attr.href]="'/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/arbeidsongeschiktheidsverzekering-berekenen?AO1_VERZSOM=' + grossTotalCosts">Bereken uw premie</a>
        </div>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteBoeterenteComponent   {
  step: number = 1;
  initialAmount: number;
  extraPymnt: boolean = false;
  extraPymntThisYear: number;
  extraPymntPrevYears: number;
  interestPeriodEnd: string;
  incomePartnerValue: number;
  interestYears: number;
  keyIncome: number;
  interest: number;
  extraMonth: boolean = false;
  vacationMoney: boolean = false;
  extraMonthPartner: boolean = false;
  vacationMoneyPartner: boolean = false;
  playWithMortgage: boolean = false;
  playValue: number;
  calculatedValue: number = 0;
  monthlyPayment: number = 0;
  mortgageType: number = 0;

  @ViewChild('interest') interestRef: ElementRef;

  constructor(
    private http: Http
  ) {}

  calculate(): void {
    // if (this.incomeValue) {
    //   var yearSalary = this.yearSalaryCalculation(this.incomeValue, this.extraMonth, this.vacationMoney),
    //       yearSalaryPartner = this.yearSalaryCalculation(this.incomePartnerValue, this.extraMonthPartner, this.vacationMoneyPartner),
    //       togetherIncome = yearSalary + yearSalaryPartner,
    //       highestSalaryVar = this.highestSalary(yearSalary,yearSalaryPartner),
    //       annuitiesFactorVar = this.annuitiesFactor();
    //       this.keyIncome = this.getKeyIncome(highestSalaryVar, togetherIncome, yearSalary);
    //   var woonquoteBox1Var = this.woonquoteBox1();
    //   this.playWithMortgage = false;
    //   this.playValue = this.calculatedValue = Math.round((togetherIncome * woonquoteBox1Var / 12) * annuitiesFactorVar);
    //   this.monthlyPayment = this.getMonthlyPayment();
    // }
  }

  getMonthlyPayment(): number {
    let monthlyInterest = this.interest / 12;
    let pow = Math.pow((1 + monthlyInterest), -360);
    return Math.round((monthlyInterest / (1 - pow)) * this.playValue);
  }

  yearSalaryCalculation(salary: number = 0, extraMonth: boolean, vacationMoney: boolean): number {
    var yearSalary = salary * 12;
    if (extraMonth) {
      yearSalary = salary * 13;
    }
    if (vacationMoney) {
      yearSalary = yearSalary * 1.08;
    }
    return yearSalary;
  }

  highestSalary(salary1: number, salary2: number): number {
    return (salary1 => salary2) ? salary1 : salary2;
  }

  getKeyIncome(incomeHigher: number, togetherIncome: number, yearSalary: number) {
    if (this.incomePartnerValue !== 0) {
      this.keyIncome = incomeHigher + ((togetherIncome - incomeHigher) / 2);
      return this.keyIncome;
    }
    return yearSalary;
  }

  annuitiesFactor(): number {
    var interestElement = this.interestRef.nativeElement.getAttribute('data-interest');
    this.interest = 0.05;
    if (this.interestYears >= 10 && interestElement !== undefined) {
      let interestRaw = JSON.parse("[" + interestElement + "]");
      let interestPercentage = interestRaw[this.interestYears -10];
      this.interest = interestPercentage / 100;
    }
    let duration = 30,
        monthlyInterest = this.interest / 12,
        durationCalculation = duration * 12,
        pow = Math.pow((1 / (1 + monthlyInterest)),durationCalculation);
    var annuity = (1 - pow) / monthlyInterest;
    return annuity;
  }

  woonquoteBox1() {
    var interestPercentage = this.interest *100;
    var matrixCol: number = 0;
    for (let i = interestCols.length - 1; i >= 0; i--) {
      if (interestPercentage >= interestCols[i]) {
        matrixCol = i + 1;
        break;
      }
    }
    var matrixRow: number = 0;
    for (let i = keyIncomeRows.length - 1; i >= 0; i--) {
      if (this.keyIncome >= keyIncomeRows[i]) {
        matrixRow = i + 1;
        break;
      }
    }
    var result = percMatrix[matrixRow][matrixCol] / 100;
    return result;
  }

  submitAmount(): void {
    this.step += 1;
  }
}


const interestCols = [
  2.501, 3.001, 3.501, 4.001, 4.501, 5.001, 5.501, 6.001, 6.501, 7.001, 7.501
];

const keyIncomeRows = [
  19500, 20000, 20500, 21000, 21500, 22000, 22500, 23000, 23500, 24000, 24500, 25000, 26000, 27000, 28000, 29000, 30000,
  31000, 32000, 42000, 47000, 52000, 57000, 58000, 59000, 60000, 61000, 62000, 63000, 64000, 65000, 66000, 67000, 68000,
  69000, 70000, 71000, 72000, 73000, 74000, 75000, 76000, 77000, 78000, 79000, 80000, 81000, 82000, 83000, 84000, 85000,
  86000, 87000, 88000, 89000, 90000, 93000, 94000, 95000, 96000, 110000
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
