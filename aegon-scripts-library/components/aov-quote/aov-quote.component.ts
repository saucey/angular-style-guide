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
          <aegon-input-choice-dropdown
            [(ngModel)]="profession"
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
    <div id="aov-quote-summary" *ngIf="step === 'summary'">
      <h1>Samenvatting</h1>
      <h2 class="subtitle">Uw premie-indicatie</h2>
      <div id="premium-section" class="call-execution-block container_12  same-height row-fluid">
        <div class="data-section span6 container_12">
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-geboortedatum">Uw geboortedatum</label>
            <span id="field-geboortedatum" class="value span6">20-03-2013</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-beroep">Uw beroep</label>
            <span id="field-beroep" class="value span6">Palingvisser</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-bruto-jaarinkomen">Uw bruto jaarinkomen</label>
            <span id="field-bruto-jaarinkomen" class="value span6">€ 40.000 netto</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-eigen-risicoperiode">Eigen risicoperiode</label>
            <span id="field-eigen-risicoperiode" class="value span6">1 maand</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-verzekerde-uitgaven">Verzekerde uitgaven</label>
            <span id="field-verzekerde-uitgaven" class="value span6">€ 1230 netto per maand</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-bruto-premie">Bruto premie per maand</label>
            <span id="field-bruto-premie" class="value span6">€ 167</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6" for="field-netto-premie">Netto premie per maand</label>
            <span id="field-bruto-premie" class="value span6">€ 108</span>
          </div>
        </div>
        <div class="action-section span6">
          <div class="row-fluid">
            <label class="span12" for="text-input">Samenvatting e-mailen</label>
            <input class="span5" id="text-input" placeholder="Uw e-mailadres" tabindex="1" type="text">
            <button class="arrow span4" type="button" disabled>Vesturen</button>
            <label class="label span12" for="aanvragen">Wilt u een vrijblijvend adviesgesprek?</label>
            <button class="arrow span7 orange" type="button">Adviesgesprek aanvragen</button>
          </div>
        </div>
      </div>
      <div class="static-section">
        <h3 class="title">Uitgangspunten</h3>
          U kunt de Aegon Arbeidsongeschiktheidsverzekering met een adviseur volledig aanpassen aan uw persoonlijke situatie.<br>
          Voor deze indicatie zijn we uitgegaan van:
          <ul class="bullet">
            <li>De meest uitgebreide dekking inclusief ongevallen, lichamelijke en psychische ziektes en zwangerschap en bevalling.</li>
            <li>Dat de verzekering tot 67 jaar loopt.</li>
            <li>Dat de hoogte van een uitkering gelijk blijft als u arbeidsongeschikt bent.</li>
            <li>Een doorlopende korting van 5%, die u houdt zolang uw verzekering bij ons loopt. U kunt ook kiezen voor een eenmalige korting van 30% in het eerste jaar.</li>
          </ul>
      </div>
      <div class="static-section">
        <h3 class="title">Uw geschatte maandpremie</h3>
        Uw geschatte premie is bruto € 167,19 per maand. Uw nettopremie na aftrek van belastingvoordeel is € 108,67 per maand. Dit is de maandpremie in het eerste kalenderjaar inclusief 5% doorlopende korting. Beide bedragen zijn een indicatie. Uw uiteindelijke maandpremie kan afwijken op basis van onder meer uw feitelijke werkzaamheden.
      </div>
      <div class="static-section">
        <h3 class="title">Hoe verder?</h3>
        Verzekeren is maatwerk. Uw adviseur kijkt samen met u wat het beste bij u past. Maak een afspraak voor een persoonlijk gesprek.<br>
        Aan het advies zijn kosten verbonden. Deze bespreekt u in het eerste vrijblijvende gesprek met de adviseur.
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
    }
    this.step = 'summary';
  }

  fetchProfessions(searchString) {
    this.professions = [
      {label: 'Programmeur', key: 'Programmeur'},
      {label: 'Goeroe', key: 'Goeroe'},
      {label: 'Putjeschepper type A', key: 'Putjeschepper type A'},
      {label: 'Putjeschepper type B', key: 'Putjeschepper type B'},
      {label: 'Kaasmaker', key: 'Kaasmaker'}
    ]
  }

  selectProfession(obj) {
    this.profession = null;
    if (obj && obj.key) {
      this.profession = obj.key;
    }
  }
}
