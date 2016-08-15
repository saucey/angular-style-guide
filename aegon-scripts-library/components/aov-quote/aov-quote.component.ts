import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {AAInputNumberComponent} from '../../aegon-angular/components/aa-input-number/aa-input-number.component';
import {AAInputRadioComponent} from "../../aegon-angular/components/aa-input-radio/aa-input-radio.component";
import {AAInputDropDownComponent} from "../../aegon-angular/components/aa-input-dropdown/aa-input-dropdown.component";
import {AASliderInputComponent} from "../../aegon-angular/components/aa-slider-input/aa-slider-input.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, AAInputNumberComponent, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, AASliderInputComponent, AAInputRadioComponent,
    AAInputDropDownComponent
  ],
  template: templateElem ? templateElem.value : `
  <div class="quickquote angular aov-quote">
    <section class="personal-details" *ngIf="!showSummary">

      <h3 prefix="/">Uw gegevens</h3>
      <div class="field gray-field">
        <div class="label">
          Wat is uw geboortedatum?
        </div>
        <div class="inputs" (click)="showCalculator = false">
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
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-dropdown
            [model]="profession"
            [items]="professionsFiltered"
            [emptyMessage]="'Er zijn geen beroepen gevonden'"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="selectProfession($event)">
          </aa-input-dropdown>
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
        <div class="inputs" (click)="showCalculator = false">
          <aa-input-number [(ngModel)]="grossIncome" prefix="€" [max]="1000000"></aa-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">
        Geef hier uw bruto jaarinkomen op. Deze moet minimaal €3.125 zijn. U kunt 80% van uw inkomen voor
        arbeidsongeschiktheid verzekeren.
      </p>

      <div class="field gray-field" *ngIf="!showCalculator">
        <div class="label"></div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="startCalculator()">
            Bereken premie
          </button>
        </div>
      </div>
    </section>


    <section *ngIf="showCalculator" class="calculation">
      <div class="calculation indication">
        <h3 prefix="/">Uw keuzes</h3>

        <div class="field">
          <div class="label">
            Welke eigen risicoperiode kiest u?
            <aa-hint text="Uw uitkering start na afloop van deze periode. De meest gekozen periode is 1 maand."></aa-hint>
          </div>
          <div class="inputs">
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="14">2 weken </aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="30">1 maand</aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="90">3 maanden</aa-input-radio>
            <aa-input-radio [(ngModel)]="startingTerm" (aaChange)="fetchCalculationSpecification()" name="term" value="365">1 jaar</aa-input-radio>
          </div>
        </div>

        <div class="field">
          <div class="inputs">
            <aa-slider-input class="aa-qq__control aa-input--euro"
              [(ngModel)]="grossYearAmount"
              (change)="fetchCalculationSpecification()"
              [sliderOptions]="sliderOptions"
              [label]="'Welk bruto jaarbedrag wilt u verzekeren?'"
              [helpText]="'Dit is het bedrag na aftrek van belastingvoordeel. Wij rekenen met een gemiddeld belastingvoordeel van 35%. Voor uw situatie kan dit meer of minder zijn.'">
            </aa-slider-input>
          </div>
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
            <a href="#" class="icon-skinnyarrow" (click)="gotoSummary()">
              Bekijk en mail overzicht
            </a>
          </div>
        </div>
      </div>
    </section>


    <div id="aov-quote-summary" *ngIf="showSummary">
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
            <a class="arrow span8 orange aanvragen-button button" href="https://www.aegon.nl/zakelijk/inkomensverzekeringen/arbeidsongeschiktheidsverzekering/afspraak-arbeidsongeschiktheidsverzekering-advies">Neem contact met mij op</a>
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
//TODO ADD BASE64
export class AovQuoteComponent implements OnInit {
  @Input()  public  showSummary: boolean = false;
  @Input()  private mailUrl: string = 'http://ail.test.intra.aegon.nl/BS_Utilities_Communication_03Web/sca/BS_Utilities_Communication_03_ExpWS';
  @Input()  private mailCredentials: string = 'AppAegonNLDrupalTST:dUACcFMYvwhnrnnfdq9h';
  @Input()  private serviceUrl: string = 'http://ail.test.intra.aegon.nl/US_RestGatewayWeb/rest/requestResponse/BS_AE_POLIS_AOV_02/';
  @Input()  private serviceCredentials: string = 'appAegonNLCalculateTST:7OuwNNTVS4jJ8mO5F0bH';
  @Input()  private summaryPath: string = '#';

  public sliderOptions = {
  	start: 3500, // Handle start position
  	connect: true, // Display a colored bar between the handles
  	step: 500, // Slider moves in increments of xx
  	orientation: 'horizontal', // Orient the slider vertically
  	behaviour: 'snap', // click anywhere to start dragging + draggable range
  	range: { // Slider can select '0' to '100'
  		'min': 2500,
  		'max': 125000
  	},
  	pips: { // Shows scale and values below chart
  		mode: 'range',
  		// density: 100,
  		// values: [1875, 2016],
  		density: 100,
  	}
  };

  public  showCalculator: boolean;
  public  grossYearAmount: number = 17500;
  public  minGrossYearAmount: number = 3125;
  public  maxGrossYearAmount: number = 100000;
  public  minAge: number = 18;
  public  maxAge: number = 59;

  public  birthDate: string;
  public  birthDateError: boolean;
  public  professionError: boolean;
  public  grossIncome: number;
  public  grossIncomeError: boolean;

  public  startingTerm: number = 30;
  public  startingTermError: boolean;
  public  insuranceAmount: number;
  public  insuranceAmountError: boolean;
  public  emailAddress: string = "";
  public  emailAddressError: boolean;

  public  serviceError: boolean;
  public  pending: number = 0;

  public  emailButtonPending: boolean = false;
  public  reSendEmailShown: boolean = false;

  public  grossMonthly: number;
  public  netMonthly: number;
  public  profession: any = {};
  public  professions: any[] = [];
  public  professionsFiltered: any[] = [];
  private rawProfessions: any = {};
  public  riskFactor: any = {};


  //TODO variables in session storage
  // aovQQ
  //   aovBirthDate     aovProfession     aovGrossIncome     aovStartingTerm     aovInsuranceAmount    aovGrossMonthly   aovNetMonthly
  //

  constructor(
    private http:Http
  ) {}

  ngOnInit() {
<<<<<<< HEAD
    // console.log(dummyProfessions);


=======
>>>>>>> b6e29ff00c6b4b73724b2fb8b3a56f3f01196611
    this.initProfessions();
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    this.pending -= 1;
    return Observable.throw('Server error');
  }

  processProfessions(response) {
    // Check if the response contains professions
    if (response.retrieveProfessionsResponse &&
        response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
      for (let prof of response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
        // Add each profession to the rawProfession dictionary under its key.
        this.rawProfessions[prof._AE_BRPCODE] = prof;
        // Make each profession available for the input dropdown in the format that the dropdown needs.
        this.professions.push({key: prof._AE_BRPCODE, label: prof._AE_BRPSUBNM || prof._AE_BRPNAAM})
      }
    }
  }

  initProfessions() {
    this.pending += 1;
    this.serviceError = false;

    // if (dummyProfessions) {
    //   this.processProfessions(dummyProfessions);
    //   this.pending -= 1;
    //   return;
    // }

    let body = {
      "retrieveProfessionsRequest": {
        "AILHEADER": { "CLIENTID": "A2T1 HappyFlow" }
      }
    };

    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.serviceCredentials}`});
    let options = new RequestOptions({headers: headers});

    // Fetch professions.
    this.http.post(this.serviceUrl + 'retrieveProfessions', JSON.stringify(body), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.processProfessions(data);
        this.pending -= 1;
      }, error => console.log(error));
  }

  calculateAge(date) {
    let age = 0;
    if (date) {
      let bd: string[] = date.split("-");
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
    return age;
  }

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;

    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    // Calculate age.
    let age = this.calculateAge(this.birthDate);

    if (!this.birthDate ||
        age < this.minAge ||
        age > this.maxAge ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    if (!this.profession) {
      this.professionError = true;
      hasErrors = true;
    }

    if (!this.grossIncome || (this.grossIncome &&
        this.grossIncome < this.minGrossYearAmount &&
        this.grossIncome > this.maxGrossYearAmount)) {
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

  startCalculator() {
    // Validate the personal information. If it is valid then the calculator can be shown.
    if (this.validatePersonalInformation()) {
      // Show calculator

      let callback = () => {
        this.showCalculator = true;
      };

      this.fetchCalculationSpecification(callback);

    }
  }

  gotoSummary() {
    // This needs to redirect to another page. use this.summaryPath
    window.location.href = this.summaryPath;
  }

  fetchProfessions(searchString) {
    this.professionsFiltered = this.professions.filter((value) => {
      return value.label.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
    });
  }

  processRiskFactor(response) {
    this.riskFactor = response;
  }


  fetchRiskFactor(rawProfession) {
    this.pending += 1;

    if (dummyRiskFactor) {
      this.pending -= 1;
      this.processRiskFactor(dummyRiskFactor);
      return;
    }

    let body = {
      "calculateRiskFactorRequest": {
        "AILHEADER": {
          "CLIENTID": "RCAL",
          "CORRELATIONID": "## batch 7 ##"
        },
        "_AE_BEROEPENLIJST_AOV": {

        }
      }
    };

    if (rawProfession) {
      // BKLASSE is mandatory.
      body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['BKLASSE'] = rawProfession.BKLASSE;

      if (rawProfession._AE_BKLSMIN) {
        // Optional
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMIN'] = rawProfession._AE_BKLSMIN;
      }
      if (rawProfession._AE_BKLSMAX) {
        // Optional
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMAX'] = rawProfession._AE_BKLSMAX;
      }
      if (rawProfession._AE_BKLSVAST) {
        // Optional
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSVAST'] = rawProfession._AE_BKLSVAST;
      }

      let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.serviceCredentials}`});
      let options = new RequestOptions({headers: headers});

      // Calculate and set riskfactor
      this.http.post(this.serviceUrl + 'calculateRiskFactor' , JSON.stringify(body), options)
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(data => {
          this.pending -= 1;
          this.processRiskFactor(data);
        }, error => console.log(error));
    }
  }

  selectProfession(professionObj) {
    // Set the profession
    this.profession = professionObj;

    if (professionObj) {
      // When a profession is known the riskfactor can be retrieved from the service.
      this.fetchRiskFactor(this.rawProfessions[professionObj.key])
    } else {
      // No profession found, empty the riskFactor.
      this.riskFactor = {};
    }
  }


  processCalculationSpecification(response, cb) {
    cb();
  }

  zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  fetchCalculationSpecification(cb:any = () => {}) {
    this.pending += 1;

    if (this.riskFactor) {

      if (dummyCalculateSpecification) {
        this.pending -= 1;
        this.processCalculationSpecification(dummyCalculateSpecification, cb);
        return;
      }

      let now = new Date();
      let dateString = `${now.getFullYear()}-${this.zeroPad(now.getMonth() + 1, 2)}-${this.zeroPad(now.getDate(), 2)}`;

      let body = {
        "calculateSpecificationRequest": {
          "AILHEADER": {
            "CLIENTID": "RCAL",
            "CORRELATIONID": "## batch 7 ##"
          },
          "CONTRACT_POLIS": {
            "DPRC": "0",
            "INGDAT": dateString,
            "_AE_BETAALAFSPRAAK": { "BETTERM": "3" },
            "_AE_VERZEKERD_OBJECT": {
              "_AE_OVERIG": {
                "_AE_OBJECT_PERSOON": {
                  "OBJECT_PERS_BEROEP_GEGEV": {
                    "_AE_RISICOKLASSE_AOV": { "_AE_RISKKLASSE": "3" }
                  },
                  "GEBDAT": "1971-07-01"
                }
              }
            },
            "DEKKING": {
              "VERZSOM": "25000",
              "HVVDAT": "2022-05-01",
              "MYCODE": "1149",
              "DEKKING_AOV": {
                "_AE_COMBINATIEKORT": "false",
                "_AE_COMMERCIELEKORT": "0",
                "_AE_MANTELKORT": "10",
                "WACHTTY": "365",
                "_AE_AANVANGSKORT": "true",
                "_AE_VERZSOM_B": "44000",
                "UDRAFWJ": "5",
                "AOPVU": "50",
                "CBSSTG": "false",
                "ENDLFTD": "60",
                "INDEX": "true",
                "TARIEF": "C",
                "INDPERC": "2",
                "KLIMPRC": "2"
              }
            }
          }
        }
      };


      let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.serviceCredentials}`});
      let options = new RequestOptions({headers: headers});

      // Update calculations.
      this.http.post(this.serviceUrl + 'calculationSpecification' , JSON.stringify(body), options)
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(data => {
          this.processCalculationSpecification(data, cb);
          this.pending -= 1;
        }, error => console.log(error));
    }
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
    this.emailButtonPending = true;
    if(this.validateEmail()) {
      this.emailButtonPending = false;
      return false;
    }

    var parser = new DOMParser(),
        oSerializer = new XMLSerializer(),
        XMLBodyString = '<soapenv:Envelope xmlns:bs="http://BS_Utilities_Communication/so/BS_Utilities_Communication" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header><wsse:Security soapenv:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"><wsse:UsernameToken wsu:Id="UsernameToken-1" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><wsse:Username>AppAegonNLDrupalTST</wsse:Username><wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">dUACcFMYvwhnrnnfdq9h</wsse:Password><wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">Ztsw326A7LCpn7fOtuzlQA==</wsse:Nonce><wsu:Created>2012-04-13T12:47:09.585Z</wsu:Created></wsse:UsernameToken></wsse:Security></soapenv:Header><soapenv:Body><bs:createSendCommunication><createSendCommunicationRequest><AILHEADER><CLIENTID>AEGONNL</CLIENTID><CORRELATIONID>#</CORRELATIONID></AILHEADER><BATCH><BATCHID>16573</BATCHID><BATCHCONFIGID>1796011752</BATCHCONFIGID><COMMUNICATIE><HEADER><VERWERKING><NABEWERKING></NABEWERKING></VERWERKING><HERKOMST><SYSTEEMID>HA</SYSTEEMID><GEBRUIKER></GEBRUIKER><OMGEVING>T</OMGEVING><BATCHNUMMER>123456786</BATCHNUMMER><BATCHFREQUENTIE>MAANDELIJKS</BATCHFREQUENTIE></HERKOMST><ZENDING><ZENDINGVOLGNUM>1</ZENDINGVOLGNUM><ZENDINGID>000001</ZENDINGID><ZENDINGBRANDING>Aegon</ZENDINGBRANDING><KANAAL><KANAALTYPE>EMAIL</KANAALTYPE><EMAIL><_AE_FROM>noreply@aegon.nl</_AE_FROM><_AE_RETURNADRES>MAbdulahpoer@aegon.nl</_AE_RETURNADRES></EMAIL></KANAAL><DOCUMENTSET><COMMUNICATIETAAL>NL</COMMUNICATIETAAL><_AE_DOCUMENT><DOCUMENTID>AGN_MijnAegon_AOV_EMAIL</DOCUMENTID><VOLGNUM>1</VOLGNUM><DOCUMENTBRANDING>Aegon</DOCUMENTBRANDING><_AE_DOC_DATPUB>2001-01-01</_AE_DOC_DATPUB><COLOFON><RECHTSPERSOON>ADMINISTRATIEVE DIENSTVERLENING</RECHTSPERSOON><LABELUNIT>SCP</LABELUNIT></COLOFON><ARCHIVERING><ARCHIVEREN>false</ARCHIVEREN></ARCHIVERING></_AE_DOCUMENT></DOCUMENTSET><ADRESSERING><EMAIL>#</EMAIL></ADRESSERING><ONTVANGER><_AE_TYPEPARTIJ>BEDRIJF</_AE_TYPEPARTIJ><_AE_BEDRIJFSNAAM>Uw tussenpersoon</_AE_BEDRIJFSNAAM></ONTVANGER></ZENDING></HEADER><_AE_DOC_DATA><DocumentData><Geboortedatum>#</Geboortedatum><Beroep>#</Beroep><Bruto_Jaarinkomen>#</Bruto_Jaarinkomen><Eigen_risicoperiode>#</Eigen_risicoperiode><Verzekerdbedrag>#</Verzekerdbedrag><Bruto_premie_permaand>#</Bruto_premie_permaand><Netto_premie_permaand>#</Netto_premie_permaand></DocumentData></_AE_DOC_DATA></COMMUNICATIE></BATCH></createSendCommunicationRequest></bs:createSendCommunication></soapenv:Body></soapenv:Envelope>';

    let XMLBody = parser.parseFromString(XMLBodyString,"text/xml");
    let headers = new Headers({
      'Content-Type': 'application/xml',
      'charset': 'utf-8',
      'SOAPAction': this.mailUrl
    });

    //Set SOAP Body with values
    XMLBody.getElementsByTagName("CORRELATIONID")[0].childNodes[0].nodeValue = "##" + Date.now() + "##";
    XMLBody.getElementsByTagName("ADRESSERING")[0].getElementsByTagName("EMAIL")[0].childNodes[0].nodeValue = this.emailAddress;
    XMLBody.getElementsByTagName("Geboortedatum")[0].childNodes[0].nodeValue = "2012-10-13";
    XMLBody.getElementsByTagName("Beroep")[0].childNodes[0].nodeValue = "beroep";
    XMLBody.getElementsByTagName("Bruto_Jaarinkomen")[0].childNodes[0].nodeValue = "100,00";
    XMLBody.getElementsByTagName("Eigen_risicoperiode")[0].childNodes[0].nodeValue = "jaarlijks";
    XMLBody.getElementsByTagName("Verzekerdbedrag")[0].childNodes[0].nodeValue = "1.500,00";
    XMLBody.getElementsByTagName("Bruto_premie_permaand")[0].childNodes[0].nodeValue = "2.500,00";
    XMLBody.getElementsByTagName("Netto_premie_permaand")[0].childNodes[0].nodeValue = "2.470,00";

    let options = new RequestOptions({headers: headers});

    this.http.post(this.mailUrl , oSerializer.serializeToString(XMLBody), options)
        .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        console.log('send');
        this.emailButtonPending = false;
        this.reSendEmailShown = true;
      }, error => console.log(error));

    return false;
  }


}