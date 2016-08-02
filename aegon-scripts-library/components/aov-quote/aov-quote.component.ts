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
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {InputChoiceDropDownComponent, InputChoiceDropDownValueAccessor} from "../angular-components/input-choice-dropdown.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SoloSliderComponent, SoloSliderValueAccessor, InputRadioComponent, InputRadioValueAccessor,
    InputChoiceDropDownComponent, InputChoiceDropDownValueAccessor
  ],
  template: templateElem ? templateElem.value : `
  <div class="quickquote angular aov-quote">
    <template [ngIf]="step !== 'summary'">
      <h3 prefix="/">Uw gegevens</h3>
      <div class="field">
        <div class="label">
          Wat is uw geboortedatum?
        </div>
        <div class="inputs">
          <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
        </div>
      </div>
      <p class="error" *ngIf="birthDateError">
        Wilt u een geldige geboortedatum invoeren?
      </p>
      <div class="field">
        <div class="label">
          Wat is uw beroep?
          <aegon-help>
            Maak uw beroepskeuze
          </aegon-help>          
        </div>
        <div class="inputs">
          <aegon-input-choice-dropdown [(ngModel)]="profession"
                                       [items]="professions"
                                       [emptyMessage]="'Er zijn geen beroepen gevonden'"
                                       [minChars]="2"
                                       (fetch)="fetchProfessions($event)"
                                       (select)="selectProfession($event)">
          </aegon-input-choice-dropdown>
        </div>
      </div>
      <p class="error" *ngIf="professionError">
        Wilt u een geldig beroep selecteren?
      </p>
      <div class="field">
        <div class="label">
          Wat is uw bruto jaarinkomen?
          <aegon-help>
            Maak uw beroepskeuze
          </aegon-help>          
        </div>
        <div class="inputs">
          <aegon-input-number [(ngModel)]="grossIncome" prefix="€" [max]="99999999"></aegon-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">
        Wilt u een jaarinkomen invoeren?
      </p>
      <div class="field">
        <div class="label">        
        </div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="showCalculation()">
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
            <aegon-input-radio [name]="option">2 weken </aegon-input-radio>
            <aegon-input-radio [name]="option">1 maand</aegon-input-radio>
            <aegon-input-radio [name]="option">3 maanden</aegon-input-radio>
            <aegon-input-radio [name]="option">1 jaar</aegon-input-radio>
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
            <a href="#" class="icon-skinnyarrow" (click)="showSummary()">
              Bekijk en mail overzicht
            </a>
          </div>
        </div>
      </div>
    </template>
    <div class="aov-quote-summary" *ngIf="step === 'summary'">
    
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


  public step: string;
  public professions: any[];

  public birthDate: string;
  public birthDateError: boolean;
  public profession: string;
  public professionError: boolean;
  public grossIncome: number;
  public grossIncomeError: boolean;
  public startingTerm: string;
  public startingTermError: boolean;
  public insuranceAmount: number;
  public insuranceAmountError: boolean;
  public grossMonthly: number;
  public netMonthly: number;

  constructor(
    private http:Http
  ) {}

  ngOnInit() {}

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;
    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    if (!this.birthDate) {
      this.birthDateError = true;
      hasErrors = true;
    }
    if (!this.profession) {
      this.professionError = true;
      hasErrors = true;
    }
    if (!this.grossIncome) {
      this.grossIncomeError = true;
      hasErrors = true;
    }

    return !hasErrors;
  }


  validateChoices(): boolean {
    let hasErrors: boolean = false;
    this.startingTermError = false;
    this.insuranceAmountError = false;

    if (!this.startingTerm) {
      this.startingTermError = true;
      hasErrors = true;
    }
    if (!this.insuranceAmount) {
      this.insuranceAmountError = true;
      hasErrors = true;
    }

    return !hasErrors;
  }

  showCalculation() {
    if (this.validatePersonalInformation()) {
      this.step = 'calculation';
    }
  }

  showSummary() {
    if (this.validatePersonalInformation() && this.validateChoices()) {
      this.step = 'calculation';
    }
  }

  fetchProfessions(searchString) {
    this.professions = [{label: 'AAAAA', key: 'AAAAA'}, {label: 'BBBBB', key: 'BBBBB'}]
  }

  selectProfession(obj) {
    this.profession = null;
    if (obj && obj.key) {
      this.profession = obj.key;
    }
  }
}
