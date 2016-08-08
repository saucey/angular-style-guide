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
import {InputChoiceDropDownComponent} from "../angular-components/input-choice-dropdown.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SoloSliderComponent, SoloSliderValueAccessor, InputRadioComponent, InputRadioValueAccessor,
    InputChoiceDropDownComponent
  ],
  template: templateElem ? templateElem.value : `
  <div class="quickquote angular aov-quote">
    <section class="personal-details" *ngIf="page !== 'summary'">
      
      <h3 prefix="/">Uw gegevens</h3>
      <div class="field gray-field">
        <div class="label">
          Wat is uw geboortedatum?
        </div>
        <div class="inputs">
          <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
        </div>
      </div>
      <p class="error" *ngIf="birthDateError">
          Controleer of uw geboortedatum klopt. Is dit juist? Dan is uw leeftijd te dicht op de maximale leeftijd
          die wij voor uw beroep verzekeren. Of u bent jonger dan 18 jaar. Neem contact op met een adviseur voor
          een advies op maat.
      </p>
        
      <div class="field gray-field">
        <div class="label">
          Wat is uw beroep?
          <aegon-help>
            Vul de eerste letters van uw beroep in en kies uw beroep uit de lijst. Staat uw beroep er niet tussen? 
            Kies dan het beroep dat het best bij uw werkzaamheden past.
          </aegon-help>          
        </div>
        <div class="inputs">
          <aegon-input-choice-dropdown
            [model]="profession"
            [items]="professions"
            [emptyMessage]="'Er zijn geen beroepen gevonden'"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="profession = $event">
          </aegon-input-choice-dropdown>
        </div>
      </div>
      <p class="error" *ngIf="professionError">
        Voor dit beroep kan geen premie worden berekend. Neem contact op met een adviseur voor een advies op maat.
      </p>
            
      <div class="field gray-field">
        <div class="label">
          Wat is uw bruto jaarinkomen?
          <aegon-help>
            Vul uw bruto inkomen in voor aftrek van belasting. Als dit schommelt, geeft u een gemiddelde over de 
            afgelopen drie jaar. Als starter geeft u een indicatie wat u denkt te gaan verdienen.
          </aegon-help>          
        </div>
        <div class="inputs">
          <aegon-input-number [(ngModel)]="grossIncome" prefix="€" [max]="1000000"></aegon-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">
        Geef hier uw bruto jaarinkomen op. Deze moet minimaal €3.125 zijn. U kunt 80% van uw inkomen voor 
        arbeidsongeschiktheid verzekeren.
      </p>
            
      <div class="field gray-field">
        <div class="label"></div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="showCalculation()">
            Bereken premie
          </button>
        </div>
      </div>
      

    </section>
    
    <section *ngIf="step === 'calculation'" class="calculation">
      <div class="calculation indication">
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
    </section>
    
    
    <div id="aov-quote-summary" *ngIf="page === 'summary'">
      <h1>Samenvatting</h1>
      <h2 class="subtitle">Uw premie-indicatie</h2>
      <div id="premium-section" class="call-execution-block container_12  same-height row-fluid">
        <div class="data-section span12 container_12">
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
            <label class="label span6 dark-blue" for="field-bruto-premie">Bruto premie per maand</label>
            <span id="field-bruto-premie" class="value span6 dark-blue">€ 167</span>
          </div>
          <div class="span12 container_12 data-fields">
            <label class="label span6 dark-blue" for="field-netto-premie">Netto premie per maand</label>
            <span id="field-netto-premie" class="value span6 dark-blue">€ 108</span>
          </div>
        </div>
        <div class="action-section span12">
          <div class="row-fluid">
            <label class="span12 dark-blue" for="email-address-field">Samenvatting e-mailen</label>
            <div class="email-send-form-wrapper" [hidden]="reSendEmailShown">
              <input class="span5" id="email-address-field" [(ngModel)]="emailAddress" placeholder="Uw e-mailadres" tabindex="1" type="text">
              <button class="arrow span4" type="button" [class.pending]="emailButtonPending" [disabled]="emailAddress.trim()==''||emailButtonPending" (click)="sendEmailClick()">Vesturen</button>
              <p class="error span12" *ngIf="emailAddressError">
                Wilt u een geldige e-mailadres invoeren?
              </p>
            </div>
            <div class="email-resend-wrapper" [hidden]="!reSendEmailShown">
              <label class="span5 dark-blue" for="email-address-field">E-mail verstuurd</label>
              <button type="button" (click)="reSendEmailShown=false" class="button transparent arrow span6">Nogmaals versturen</button>
            </div>
            
            <label class="label span12 aanvragen-label dark-blue" for="aanvragen">Wilt u een vrijblijvend adviesgesprek?</label>
            <button class="arrow span8 orange aanvragen-button" type="button">Adviesgesprek aanvragen</button>
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

  @Input()  public  page: string;
  @Input()  private mailUrl: string;
  @Input()  private professionUrlCredentials: string = 'appAegonNLCalculateTST:YXBwQWVnb25OTENhbGN1bGF0ZVRTVDo3T3V3Tk5UVlM0ako4bU81RjBiSA';
  @Input()  private professionUrl: string = 'http://ail.test.intra.aegon.nl/US_RestGatewayWeb/rest/requestResponse/BS_AE_POLIS_AOV_02/retrieveProfessions';
  @Input()  private summaryPath: string = '';

  public step: string;
  public grossYearAmount: number = 17500;
  public minGrossYearAmount: number = 700;
  public maxGrossYearAmount: number = 35000;

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
  public emailAddress: string = "";
  public emailAddressError: boolean;
  public emailButtonPending: boolean = false;
  public grossMonthly: number;
  public netMonthly: number;
  public reSendEmailShown: boolean = false;

  private rawProfessions: string[];
  private credentials: string;
  public  serviceError: boolean;


  //TODO variables in session storage
  // aovQQ
  //   aovBirthDate     aovProfession     aovGrossIncome     aovStartingTerm     aovInsuranceAmount    aovGrossMonthly   aovNetMonthly
  //

  constructor(
    private http:Http
  ) {}

  ngOnInit() {
    this.initProfessions();
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    return Observable.throw('Server error');
  }

  initProfessions() {
    let options:any = {};
    options.withCredentials = true;

    let headers = new Headers({"Authorization" : `Basic ${this.professionUrlCredentials}`});
    options.headers = headers;

    return this.http.get(this.professionUrl, options)
       .toPromise()
       .then((response) => {
         // TODO use the xml to fill the professions array
         console.log(response);
       })
       .catch(this.handleError);
  }

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;

    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    // Calculate age.
    let age = 0;
    if (this.birthDate) {
      let bd: string[] = this.birthDate.split("-");
      let today = new Date();
      let nowyear = today.getFullYear();
      let nowmonth = today.getMonth();
      let nowday = today.getDate();

      let birthyear = parseInt(bd[0], 10);
      let birthmonth = parseInt(bd[1], 10);
      let birthday = parseInt(bd[2], 10);

      age = nowyear - birthyear;
      let age_month = nowmonth - birthmonth;
      let age_day = nowday - birthday;

      if (age_month < 0 || (age_month == 0 && age_day < 0)) {
        age -= 1;
      }
    }

    if (!this.birthDate || age < 18 || age > 59 ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    if (!this.profession) {
      this.professionError = true;
      hasErrors = true;
    }
    if (!this.grossIncome || (this.grossIncome && this.grossIncome < 3125 && this.grossIncome > 1000000)) {
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
    // Show the next steps that the user needs to fill in.
    if (this.validatePersonalInformation()) {
      this.step = 'calculation';
    }
  }

  showSummary() {
    // This needs to redirect to another page. use this.summaryPath
    console.log('show summary');
    this.page = 'summary';
  }

  fetchProfessions(searchString) {
    console.log('fetchProfessions');
    // Dummy professions
    this.professions = ['Programmeur', 'Goeroe', 'Putjeschepper type A', 'Putjeschepper type B', 'Kaasmaker']

    // Create service call.
  }

  validateEmail() {
    var emailAddress_regexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.emailAddressError = false;

    if (this.emailAddress != "" && (this.emailAddress.length <= 5 || !emailAddress_regexp.test(this.emailAddress))) {
      this.emailAddressError = true;
    }

    return this.emailAddressError;
  }

  sendEmailClick() {
    // TODO look at quickquote dip, it has a http.post example.

    this.emailButtonPending = true;
    if(!this.validateEmail()) {
      this.reSendEmailShown = true;
    }
    this.emailButtonPending = false;
  }
}
