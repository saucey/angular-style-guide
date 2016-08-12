import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import {InputNumberComponent} from '../aa-input-number/aa-input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../../../components/angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../../../components/angular-components/checkbox.component';
import {MoneyPipe} from "../../pipes/money.pipe";
import {InputRadioComponent} from "../aa-input-radio/aa-input-radio.component";
import {InputDropDownComponent} from "../aa-input-dropdown/aa-input-dropdown.component";
import {SliderInputComponent} from "../aa-slider-input/aa-slider-input.component";
import {template} from "./template";
import {options} from "./options";

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    InputNumberComponent, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SliderInputComponent, InputRadioComponent,
    InputDropDownComponent
  ],
  template: template,
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

  public options: any = options;

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
          this.processRiskFactor(data);
        }, error => console.log(error));
    }
  }

  selectProfession(professionObj) {
    // Set the profession
    this.profession = professionObj;

    if (professionObj) {
      // A profession is known so riskfactor can be retrieved.
      this.fetchRiskFactor(this.rawProfessions[professionObj.key])
    } else {
      this.riskFactor = {};
    }

  }


  processCalculationSpecification(response, cb) {
    cb();
  }

  fetchCalculationSpecification(cb:any = () => {}) {
    if (this.riskFactor) {

      // if (dummyCalculateSpecification) {
      //   this.processCalculationSpecification(dummyCalculateSpecification, cb);
      //   return;
      // }


      let body = {
        "calculateSpecificationRequest": {
          "AILHEADER": {
            "CLIENTID": "RCAL",
            "CORRELATIONID": "## batch 7 ##"
          },
          "CONTRACT_POLIS": {
            "DPRC": "0",
            "INGDAT": "2011-09-05",
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
    // TODO look at quickquote dip, it has a http.post example.   this.mailUrl

    this.emailButtonPending = true;
    if(!this.validateEmail()) {
      this.reSendEmailShown = true;
    }
    this.emailButtonPending = false;

    let XMLBody = {};

    let headers = new Headers({'Content-Type': 'application/xml', "Authorization" : `Basic ${this.mailCredentials}`});
    let options = new RequestOptions({headers: headers});

    this.http.post(this.mailUrl , JSON.stringify(XMLBody), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        console.log('send');
      }, error => console.log(error));
    }


}