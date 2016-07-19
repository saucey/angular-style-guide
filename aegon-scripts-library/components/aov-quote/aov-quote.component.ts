import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {SoloSliderComponent, SoloSliderValueAccessor} from "../angular-components/solo-slider.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SoloSliderComponent, SoloSliderValueAccessor
  ],
  template: templateElem ? templateElem.value : `
  <div class="quickquote angular aov-quote">
    <h3 prefix="/">Uw gegevens</h3>
    <div class="field">
      <div class="label">
        Wat is uw geboortedatum?     
      </div>
      <div class="inputs">
        <aegon-input-date></aegon-input-date>
      </div>
    </div>
    <div class="field">
      <div class="label">
        Wat is uw beroep?
        <aegon-help>
          Maak uw beroepskeuze
        </aegon-help>          
      </div>
      <div class="inputs">
        <select class="no-dd" required>
          <option value="" disabled>1 maand</option>
          <option [value]="0">2 weken</option>
          <option [value]="0">2 weken</option>
          <option [value]="1">1 maand</option>
          <option [value]="2">3 maanden</option>
          <option [value]="3">1 jaar</option>
        </select>
      </div>      
    </div>
    <div class="field">
      <div class="label">
        Wat is uw bruto jaarinkomen?
        <aegon-help>
          Maak uw beroepskeuze
        </aegon-help>          
      </div>
      <div class="inputs">
        <aegon-input-number prefix="€" [max]="99999999"></aegon-input-number>
      </div>
    </div>
    <div class="field">
      <div class="label">        
      </div>
      <div class="inputs">
        <button class="button icon-right icon-calculator" (click)="step = 'calculation'">
          Bereken premie
        </button>      
      </div>
    </div>
  
    <div class="calculation indication" *ngIf="step === 'calculation'">
      <h3 prefix="/">Uw keuzes</h3>
      <div class="field">
        <div class="label">
          Na welk termijn wilt u dat u uitkering start?
          <aegon-help>
            Maak uw beroepskeuze
          </aegon-help>
        </div>
        <div class="inputs">
          <aegon-checkbox>2 weken</aegon-checkbox>
          <aegon-checkbox>1 maand</aegon-checkbox>
          <aegon-checkbox>3 maanden</aegon-checkbox>
          <aegon-checkbox>1 jaar</aegon-checkbox>
        </div>
      </div>
      <div class="field">
        <div class="label">
          Welk bruto jaarbedrag wilt u verzekeren?
          <aegon-help>Help !</aegon-help>
        </div>
        <div class="inputs">
          <aegon-input-number prefix="€" [(ngModel)]="grossYearAmount" [max]="99999999"></aegon-input-number>
        </div>
        <aegon-solo-slider prefix="€" [(ngModel)]="grossYearAmount" [range]="{
          'min': [  minGrossYearAmount ],
          '25%': [  1000 ],
          '50%': [ 2000 ],
          '75%': [  3000 ],
          'max': [ 999999 ]
        }">
        </aegon-solo-slider>
        <div class="min">&euro; {{minGrossYearAmount}}</div>
        <div class="max">&euro; {{maxGrossYearAmount}}</div>
      </div>
      <div class="result">
        <div class="linear">
          <div class="row">
            <div class="label">
              Bruto premie per maand
            </div>
            <div class="value">&euro; 300<span>,-</span></div>
            <span class="helptext">
              Dit is het bedrag dat u maandelijks betaalt, inclusief 5% doorlopende korting. 
              Uw premie is fiscaal aftrekbaar. Als u een uitkering krijgt dan betaalt u daar belasting over.
            </span>
          </div>
          <div class="row">
            <div class="label">
              Netto premie per maand        
            </div>
            <div class="value">&euro; 300<span>,-</span></div>
            <span class="helptext"> 
              Dit is het bedrag na aftrek van belastingvoordeel. 
              Wij rekenen met gemiddeld belastingvoordeel van 35%. 
              Voor uw situatie kan dit meer of minder zijn.
            </span> 
          </div>
        </div>
      </div>
      <div class="field">
        <a class="button orange icon-right arrow">
          Adviesgesprek aanvragen
        </a>
        <div class="label">
          <a href="#" class="icon-skinnyarrow">
            Bekijk en mail overzicht
          </a>
        </div>
      </div>
    </div>
  </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class AovQuoteComponent implements OnInit {
  grossYearAmount: number = 17500;
  minGrossYearAmount: number = 700;
  maxGrossYearAmount: number = 35000;

  constructor(
    private http:Http
  ) {}


  ngOnInit() {


  }

}
