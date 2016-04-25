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
import {DoCheck} from "angular2/core";


var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteMortgageTemplate'));
@Component({
  selector: 'aegon-quickquote-mortgage',
  directives: [
    HelpComponent, SliderComponent, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SliderValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote lijfrente sparen mortgage" #bla id="qqMortgage" data-interest="5">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken uw maximale hypotheek</h3>
        <div class="field">
          <div class="inputs slider">
            <aegon-slider (click)="submitAmount()" [range]="{
              'min': [  200 ],
              '25%': [  1000 ],
              '50%': [ 2000 ],
              '75%': [  3000 ],
              'max': [ 7500 ]
            }" [initial]="200" [label]="'Inkomen'" [(ngModel)]="incomeValue" >
            </aegon-slider>
          </div>
        </div>
        <p class="error" *ngIf="amountTooSmall">
          Wilt u minimaal €25.000 inleggen? Deze rekentool is vooral bedoeld voor klanten die hun pensioen buiten Aegon
          hebben opgebouwd. Heeft u uw pensioen opgebouwd bij Aegon? Dan krijgt u van ons automatisch een offerte
          toegestuurd. Hierbij hanteren we een lager minimum bedrag.
        </p>
        <div *ngIf="step > 1">
          <div class="field">
            <div class="inputs right">
              <aegon-checkbox [(ngModel)]="extraMonth">Vaste 13e maand</aegon-checkbox>
              <aegon-checkbox [(ngModel)]="vacationMoney">Vakantiegeld</aegon-checkbox>
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
              }" [initial]="200" [label]="'Inkomen Partner'" [(ngModel)]="incomePartnerValue" >
              </aegon-slider>
            </div>
          </div>
          <div class="field">
            <div class="inputs right">
              <aegon-checkbox [(ngModel)]="extraMonthPartner">Vaste 13e maand</aegon-checkbox>
              <aegon-checkbox [(ngModel)]="vacationMoneyPartner">Vakantiegeld</aegon-checkbox>
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
              }" [initial]="2" [label]="'Rentevaste periode'" [(ngModel)]="interestYears" >
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
              }" [initial]="calculatedValue" [label]="'Maximale hypotheek'" [(ngModel)]="playWithMorgageValue" >
              </aegon-slider>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="step > 1" class="result" >
        <div class="payment-result">
          <div class="result1">
            <div class="title">Hypotheekbedrag</div>
            <div id="pension-calculated" class="calculated">{{calculatedValue}}<span>,- *</span></div>
          </div>
          <div class="result2">
            <div class="title">Bruto maandlasten</div>
            <div id="interest-calculated" class="calculated"> &euro; 5.850,-<span>*</span></div>
          </div>
        </div>
        <p class="result-button">
          <button class="button orange-gradient icon-right arrow">Direct regelen</button>
        </p>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteMortgageComponent implements OnInit, DoCheck {
  incomeValue:  number;
  incomePartnerValue: number;
  interestYears: number;
  playWithMorgageValue: number;
  step: number = 1;
  amountTooSmall: boolean;
  extraMonth: boolean = false;
  vacationMoney: boolean = false;
  extraMonthPartner: boolean = false;
  vacationMoneyPartner: boolean = false;
  playWithMorgage: boolean = false;
  calculatedValue: number = 100000;

  constructor(
    private http:Http
  ) {}

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.calculate();
  }

  calculate(): void {
    if (this.incomeValue && this.incomePartnerValue) {
      var yearSalary = this.yearSalaryCalculation(this.incomeValue, this.extraMonth, this.vacationMoney);
      var yearSalaryPartner = this.yearSalaryCalculation(this.incomePartnerValue, this.extraMonthPartner, this.vacationMoneyPartner);
      var togetherIncome = yearSalary + yearSalaryPartner;
      var highestSalaryVar = this.highestSalary(yearSalary,yearSalaryPartner),
          annuitiesFactorVar = this.annuitiesFactor(),
          keyIncomeVar = this.keyIncome(highestSalaryVar, togetherIncome, yearSalary),
          woonquoteBox1Var = this.woonquoteBox1();
      console.log("Highest Salary = " + highestSalaryVar);
      console.log("AnnuitiesFactor = " + annuitiesFactorVar);
      console.log("keyIcome = " + keyIncomeVar);
      console.log("Calculated Value =  " + this.calculatedValue);

      this.calculatedValue = Math.round((togetherIncome*woonquoteBox1Var/12)*annuitiesFactorVar);
    }
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

  keyIncome(incomeHigher, togetherIcome, yearSalary) {
    if (this.incomePartnerValue !== 0) {
      let keyIncome = incomeHigher +((togetherIcome-incomeHigher)/2);
      return keyIncome;
    }
    return yearSalary
  }

  annuitiesFactor(): number {
    let interest = 0.05,
    // interest = this.interest;
        duration = 30,
        monthlyInterest = interest / 12,
        durationCalculation = duration * 12,
        pow = Math.pow((1/(1 + monthlyInterest)),durationCalculation);
    var annuity = (1-pow) / monthlyInterest;

    return annuity;
  }

  woonquoteBox1() {
    return 0.3050;
  }
  submitAmount(): void {
      this.step += 1;
  }
}
