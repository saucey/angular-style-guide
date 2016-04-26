import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {SliderComponent, SliderValueAccessor} from '../angular-components/slider.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {AfterViewInit} from "angular2/core";
import {ViewChild} from "angular2/core";
import {ElementRef} from "angular2/core";


var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteMortgageTemplate'));
@Component({
  selector: 'aegon-quickquote-mortgage',
  directives: [
    HelpComponent, SliderComponent, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SliderValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote lijfrente sparen mortgage" #interest data-interest="2.95,3.25,3.25,3.25,3.25,3.25,3.35,3.35,3.35,3.35,3.35,3.70,3.70,3.70,3.70,3.70,3.70,3.70,3.70,3.70,3.70">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken uw maximale hypotheek</h3>
        <div class="field">
          <div class="inputs slider">
            <aegon-slider (click)="submitAmount()" (change)="calculate()" [range]="{
              'min': [  200 ],
              '25%': [  1000 ],
              '50%': [ 2000 ],
              '75%': [  3000 ],
              'max': [ 7500 ]
            }" [initial]="200" [label]="'Inkomen'" [helpText]="'Dit is de helptekst voor de eerste slider'" [(ngModel)]="incomeValue" >
            </aegon-slider>
          </div>
        </div>
        <div *ngIf="step > 1">
          <div class="field">
            <div class="inputs right">
              <aegon-checkbox (change)="calculate()" [(ngModel)]="extraMonth">Vaste 13e maand</aegon-checkbox>
              <aegon-checkbox (change)="calculate()" [(ngModel)]="vacationMoney">Vakantiegeld</aegon-checkbox>
            </div>
          </div>
          <div class="field">
            <div class="inputs slider">
              <aegon-slider [range]="{
                'min': [  200 ],
                '25%': [  1000 ],
                '50%': [ 2000 ],
                '75%': [  3000 ],
                'max': [ 7500 ]
              }" [initial]="200" [label]="'Inkomen Partner'" [helpText]="'Dit is de helptekst voor de tweede slider'" (change)="calculate()" [(ngModel)]="incomePartnerValue" >
              </aegon-slider>
            </div>
          </div>
          <div class="field">
            <div class="inputs right">
              <aegon-checkbox (change)="calculate()" [(ngModel)]="extraMonthPartner">Vaste 13e maand</aegon-checkbox>
              <aegon-checkbox (change)="calculate()" [(ngModel)]="vacationMoneyPartner">Vakantiegeld</aegon-checkbox>
            </div>
          </div>
          <div class="field">
            <div class="inputs slider">
              <aegon-slider [range]="{
                'min': [  2 ],
                '25%': [  5 ],
                '50%': [ 10 ],
                '75%': [  15 ],
                'max': [ 28 ]
              }" [initial]="2" (change)="calculate()" [label]="'Rentevaste periode'" [helpText]="'Dit is de helptekst voor de derde slider'" [(ngModel)]="interestYears">
              </aegon-slider>
            </div>
          </div>
          <div class="field">
            <span class="inputs">
              <aegon-checkbox [(ngModel)]="playWithMorgage">
               Bereken wat uw huis per maand kost
              </aegon-checkbox>
            </span>
          </div>
          <div *ngIf="playWithMorgage" class="field">
            <div class="inputs slider">
              <aegon-slider [range]="{
                'min': [  0 ],
                'max': [ calculatedValue ]
              }" [initial]="calculatedValue" [label]="'Maximale hypotheek'" [helpText]="'Dit is de helptekst voor de vierde slider'" [(ngModel)]="playWithMorgageValue" >
              </aegon-slider>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="step > 1" class="result" >
        <div class="payment-result">
          <div class="result1">
            <div class="title">Hypotheekbedrag</div>
            <div id="pension-calculated" class="calculated">&euro; {{calculatedValue}}<span>,- *</span></div>
          </div>
          <div class="result2">
            <div class="title">Bruto maandlasten</div>
            <div id="interest-calculated" class="calculated">&euro; {{monthlyPayment}}<span>,- *</span></div>
          </div>
        </div>
        <p class="result-button">
          <button class="button orange-gradient icon-right arrow"><a href="/particulier/hypotheek/hypotheekadvies">Direct regelen</a></button>
        </p>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteMortgageComponent   {
  incomeValue:  number;
  incomePartnerValue: number;
  interestYears: number;
  playWithMorgageValue: number;
  keyIncome: number;
  interest: number;
  step: number = 1;
  amountTooSmall: boolean;
  extraMonth: boolean = false;
  vacationMoney: boolean = false;
  extraMonthPartner: boolean = false;
  vacationMoneyPartner: boolean = false;
  playWithMorgage: boolean = false;
  calculatedValue: number = 0;
  monthlyPayment: number = 0;
  @ViewChild('interest') interestRef: ElementRef;

  constructor(
    private http:Http
  ) {}


  calculate(): void {
    if (this.incomeValue && this.incomePartnerValue) {
      var yearSalary = this.yearSalaryCalculation(this.incomeValue, this.extraMonth, this.vacationMoney),
          yearSalaryPartner = this.yearSalaryCalculation(this.incomePartnerValue, this.extraMonthPartner, this.vacationMoneyPartner),
          togetherIncome = yearSalary + yearSalaryPartner,
          highestSalaryVar = this.highestSalary(yearSalary,yearSalaryPartner),
          annuitiesFactorVar = this.annuitiesFactor();
          this.keyIncome = this.getKeyIncome(highestSalaryVar, togetherIncome, yearSalary);
      var woonquoteBox1Var = this.woonquoteBox1();
      this.calculatedValue = Math.round((togetherIncome*woonquoteBox1Var/12)*annuitiesFactorVar);
      this.monthlyPayment = Math.round(this.getMonthlyPayment());
    }
  }

  getMonthlyPayment(): number {
    let monthlyInterest = this.interest / 12;
    let pow = Math.pow((1 + monthlyInterest), - 360);
    return (monthlyInterest / (1 - pow)) * this.calculatedValue;
  }

  yearSalaryCalculation(salary, extraMonth, vacationMoney): number {
    var yearSalary = salary * 12;
    if (extraMonth) {
      yearSalary = salary * 13;
    }
    if (vacationMoney) {
      yearSalary = yearSalary * 1.08;
    }
    return yearSalary;
  }

  highestSalary(salary1, salary2): number {
    if (salary1 => salary2) {
      return salary1
    }
    else {
      return salary2
    }
  }

  getKeyIncome(incomeHigher, togetherIcome, yearSalary) {
    if (this.incomePartnerValue !== 0) {
      this.keyIncome = incomeHigher +((togetherIcome-incomeHigher)/2);
      return this.keyIncome;
    }
    return yearSalary
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
        pow = Math.pow((1/(1 + monthlyInterest)),durationCalculation);
    var annuity = (1-pow) / monthlyInterest;
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
