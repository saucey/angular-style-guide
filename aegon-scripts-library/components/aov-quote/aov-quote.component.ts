import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {SliderComponent} from "../angular-components/slider.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SliderComponent
  ],
  template: templateElem ? templateElem.value : `
  <div class="angular aov-quote">
    <div class="calculation">
      <h3 prefix="/">Uw gegevens</h3>
      <div class="field">
        <div class="label">
          Wat is uw geboortedatum?
        </div>
        <aegon-input-date></aegon-input-date>
      </div>
      <div class="field">
        <div class="label">
          Wat is uw beroep?
        </div>
        <div class="inputs">
          <select required>
            <option value="" disabled>Maak uw keuze</option>
            <option [value]="0">Nee</option>
            <option [value]="1">Zeepzieder</option>
            <option [value]="2">Porder</option>
            <option [value]="3">Onderwaterlasser</option>
            <option [value]="4">Boomchirurg</option>
          </select>
        </div>      
      </div>
      <div class="field">
        <div class="label">
          Wat is uw bruto jaarinkomen?
        </div>
        <aegon-input-number prefix="€" [max]="99999999"></aegon-input-number>
      </div>    
      <button class="button icon-right icon-calculator">
        Bereken premie
      </button>
    </div>
  
    <div class="calculation indication">
      <div class="field">
        <div class="label">Welke eigen risicoperiode kiest u?</div>
        <div class="inputs">
          <select required>
            <option value="" disabled>Maak uw keuze</option>
            <option [value]="0">1 maand</option>
            <option [value]="1">2 maanden</option>
            <option [value]="2">3 maanden</option>
            <option [value]="3">4 maanden</option>
            <option [value]="4">5 maanden</option>
          </select>
        </div>   
      </div>
      <div class="field">
        <div class="inputs slider">
          <aegon-slider prefix="€" [range]="{
            'min': [  200 ],
            '25%': [  1000 ],
            '50%': [ 2000 ],
            '75%': [  3000 ],
            'max': [ 7500 ]
          }" [initial]="2500" label="Welk bruto jaarbedrag wilt u verzekeren?" helpText="Dit is de helptekst voor de eerste slider">
          </aegon-slider>
        </div>
      </div>
      <div class="result">
        <div class="row">
          <div class="result1">
            <div class="title">Bruto premie per maand</div>
            <div id="pension-calculated" class="calculated">&euro; 300<span>,- *</span></div>
          </div>
          <div class="result2">
            <div class="title">Netto premie per maand</div>
            <div id="interest-calculated" class="calculated">&euro; 300<span>,- *</span></div>
          </div>
        </div>
      </div>
        <a href="#">
          Bekijk en mail overzicht
        </a>
        <a class="button orange icon-right arrow">
          Adviesgesprek aanvragen
        </a>
    </div>
  </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class AovQuoteComponent implements OnInit {


  constructor(
    private http:Http
  ) {}

  ngOnInit() {

  }

}
