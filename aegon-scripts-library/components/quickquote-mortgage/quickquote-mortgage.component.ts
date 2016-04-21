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
    <div class="quickquote lijfrente sparen mortgage" id="qqBeleggen">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken uw maximale hypotheek</h3>
        {{incomeValue}}
        {{incomePartnerValue}}
        {{interestYears}}
        {{calculatedValue}}
        <div class="field">
          <div class="inputs slider">
            <aegon-slider (click)="submitAmount()" [range]="{
              'min': [  200 ],
              '25%': [  1000 ],
              '50%': [ 2000 ],
              '75%': [  3000 ],
              'max': [ 7500 ]
            }" [initial]="200" [(ngModel)]="incomeValue" >
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
              }" [initial]="200" [(ngModel)]="incomePartnerValue" >
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
              }" [initial]="2" [(ngModel)]="interestYears" >
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
                '25%': [  5 ],
                '50%': [ 10 ],
                '75%': [  15 ],
                'max': [ incomeValue ]
              }" [initial]="incomeValue" [(ngModel)]="playWithMorgageValue" >
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
      console.log(this.incomeValue);
      console.log(this.incomePartnerValue);
      this.calculatedValue =  this.incomeValue + this.incomePartnerValue;
    }
  }

  submitAmount(): void {
      this.step += 1;
  }
}
