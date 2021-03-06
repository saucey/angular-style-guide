/**
 * Mortgage quick quote
 */

import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {AABaseComponent} from "../../lib/classes/AABaseComponent";

// Locals
import {defaultOptions} from "./defaultOptions";
const template = require('./template.html');

@Component({
  selector: 'aa-qq-mortgage',
  template: template,
  providers: []
})

export class AAQQMortgageComponent extends AABaseComponent implements OnInit {
  public  defaultOptions: any = defaultOptions;
  @Input() options: any = {};
  @Input() data: any = {};
  
  incomeValue: number;
  incomePartnerValue: number;
  interestYears: number;
  keyIncome: number;
  interest: number
  step: number = 1;
  extraMonth: boolean = false;
  vacationMoney: boolean = false;
  extraMonthPartner: boolean = false;
  vacationMoneyPartner: boolean = false;
  playWithMortgage: boolean = false;
  playValue: number;
  calculatedValue: number = 0;
  monthlyPayment: number = 0;
  irGroup1: Array<number> = [];
  irGroup2: Array<number> = [];

  @ViewChild('interest') interestRef: ElementRef;

  constructor(private thisElement: ElementRef, private http: Http) { 
    super(thisElement); 
  }

  ngOnInit() {
    super.ngOnInit();
    this.createInterestRatesArrays();    
  }

  getNumberRoundedToHundreds(value): number {
    return (100 * Math.round(value / 100));
  }

  createInterestRatesArrays(): void {
    for(let key in this.data.options.irGroup1) this.irGroup1.push(this.data.options.irGroup1[key]);
    for(let key in this.data.options.irGroup2) this.irGroup2.push(this.data.options.irGroup2[key]);    
  }

  calculate(): void {        
    if(this.incomeValue) {
      let yearSalary = this.getTotalYearSalary(this.incomeValue, this.extraMonth, this.vacationMoney);
      let yearSalaryPartner = this.getTotalYearSalary(this.incomePartnerValue, this.extraMonthPartner, this.vacationMoneyPartner);
      let togetherIncome = yearSalary + yearSalaryPartner;
      let highestSalaryVar = this.getHighestSalary(yearSalary,yearSalaryPartner);
      let annuitiesFactorVar = this.getCalculatedAnnuity();      
      this.keyIncome = this.getKeyIncome(highestSalaryVar, togetherIncome, yearSalary);
      let woonquoteBox = this.getCalculateWoonquoteBox();
      this.playWithMortgage = false;
      this.playValue = this.calculatedValue = this.getNumberRoundedToHundreds((togetherIncome * woonquoteBox / 12) * annuitiesFactorVar);
      this.monthlyPayment = this.getMonthlyPayment();
    }
  }

  getMonthlyPayment(): number {
    let monthlyInterest = this.interest / 12;
    let pow = Math.pow((1 + monthlyInterest), -360);

    return Math.round((monthlyInterest / (1 - pow)) * this.playValue);
  }

  getTotalYearSalary(salary: number = 0, extraMonth: boolean, vacationMoney: boolean): number {
    let yearSalary = salary * 12;
    
    if(extraMonth) yearSalary = salary * 13;
    if(vacationMoney) yearSalary = yearSalary * 1.08;
    
    return yearSalary;
  }

  getHighestSalary(salary1: number, salary2: number): number {
    return (salary1 => salary2) ? salary1 : salary2;
  }

  getKeyIncome(incomeHigher: number, togetherIncome: number, yearSalary: number) {
    if (this.incomePartnerValue !== 0) {
      this.keyIncome = incomeHigher + ((togetherIncome - incomeHigher) / 2);
      return this.keyIncome;
    }

    return yearSalary;
  }

  getCalculatedAnnuity(): number {
    this.interest = this.data.options.annuityInterestDefault;

    if(this.interestYears >= 10) {      
      let interestPercentage = this.irGroup2[this.interestYears - 10];
      this.interest = interestPercentage / 100;      
    }
    
    let duration = 30;
    let monthlyInterest = this.interest / 12;
    let durationCalculation = duration * 12;
    let pow = Math.pow((1 / (1 + monthlyInterest)), durationCalculation);
    
    return (1 - pow) / monthlyInterest;
  }

  getCalculateWoonquoteBox() {
    let interestPercentage = this.interest * 100;
    let matrixCol: number = 0;
    let matrixRow: number = 0;
    
    for(let i = this.irGroup1.length - 1; i >= 0; i--) {
      
      if(interestPercentage >= this.irGroup1[i]) {
        matrixCol = i + 1;
        break;
      }
    }
    
    for(let i = keyIncomeRows.length - 1; i >= 0; i--) {
      
      if(this.keyIncome >= keyIncomeRows[i]) {
        matrixRow = i + 1;
        break;
      }
    }

    return percMatrix[matrixRow][matrixCol] / 100;
  }

  submitAmount(): void {
    this.step += 1;
  }
}

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