/**
 * AOV quick quote
 */
import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../../../components/angular-components/help.component';
// AA components
import {AAMoneyPipe} from "../../pipes/money.pipe";
import {AAInputRadioComponent} from "../aa-input-radio/aa-input-radio.component";
import {AAInputDropDownComponent} from "../aa-input-dropdown/aa-input-dropdown.component";
import {AASliderInputComponent} from "../aa-slider-input/aa-slider-input.component";
import {AAInputNumberComponent} from '../aa-input-number/aa-input-number.component';
// Old components
import {InputDateComponent, InputDateValueAccessor} from '../../../components/angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../../../components/angular-components/checkbox.component';
// Locals
import {template} from "./template";
import {options} from "./options";
import {calculateAge} from "../../lib/date";
import {zeroPad} from "../../lib/format";
import {mockProfessionsResponse} from "./mock-professions";
import {mockRiskFactorResponse} from "./mock-riskfactor";
import {mockSpecificationResponse} from "./mock-specification";
import {AAHintComponent} from "../aa-hint/aa-hint.component";

@Component({
  selector: 'aa-qq-aov',
  directives: [
    // New
    AAInputNumberComponent, AASliderInputComponent, AAInputRadioComponent, AAInputDropDownComponent,
    // Old
    InputDateComponent, InputDateValueAccessor, CheckboxComponent, CheckboxValueAccessor, AAHintComponent
  ],
  template: template,
  providers: [HTTP_PROVIDERS],
  pipes: [AAMoneyPipe]
})
//TODO ADD BASE64
export class AAQQAovComponent implements OnInit {
  public  options: any = options;

  public  showCalculator: boolean;
  public  grossYearAmount: number = options.grossYearAmount.initial;

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
    private http: Http
  ) {}

  ngOnInit() {
    this.initProfessions();
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.error('Server error', error);
    this.pending -= 1;
    alert('Het is niet gelukt om gegevens op te vragen door een technisch probleem. Probeer het later opnieuw.');
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

  callService(name: string, data: any, callback) {
    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.options.serviceCredentials}`});
    let options = new RequestOptions({headers: headers});
    this.pending += 1;
    this.http.post(this.options.serviceUrl + name, JSON.stringify(data), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.pending -= 1;
        callback(data);
      }, error => console.error(error));
  }

  initProfessions() {
    this.serviceError = false;

    if (this.options.mockData) {
      this.processProfessions(mockProfessionsResponse);
      return;
    }

    let body = {
      "retrieveProfessionsRequest": {
        "AILHEADER": { "CLIENTID": "A2T1 HappyFlow" }
      }
    };

    this.callService('retrieveProfessions', body, responseData => {
      this.processProfessions(responseData);
    });
  }

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;

    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    // Calculate age.
    let age = calculateAge(this.birthDate);

    if (!this.birthDate ||
        age < this.options.birthDate.minAge ||
        age > this.options.birthDate.maxAge ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    if (!this.profession || this.professions.indexOf(this.profession) === -1) {
      // Profession isn't one of the profession objects!
      this.professionError = true;
      hasErrors = true;
    }

    if (!this.grossIncome || this.grossIncome < this.options.income.min || this.grossIncome > this.options.income.max) {
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
      // Show calculator once we have fetched the data.
      this.fetchSpecification(() => {
        this.showCalculator = true;
      });

    }
  }

  gotoSummary() {
    window.location.href = this.options.summaryPath;
  }

  processRiskFactor(response) {
    this.riskFactor = response;
  }

  fetchRiskFactor(rawProfession) {
    if (options.mockData) {
      this.processRiskFactor(mockRiskFactorResponse);
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

      this.callService('calculateRiskFactor', body, responseData => {
        this.processRiskFactor(responseData);
      });
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

  fetchProfessions(searchString) {
    this.professionsFiltered = this.professions.filter((value) => {
      return value.label.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
    });
  }

  processSpecification(response, cb) {
    cb();
  }

  fetchSpecification(callback: any = () => {}) {
    if (this.riskFactor) {
      if (options.mockData) {
        this.processSpecification(mockSpecificationResponse, callback);
        return;
      }

      let now = new Date();
      let dateString = `${now.getFullYear()}-${zeroPad(now.getMonth() + 1, 2)}-${zeroPad(now.getDate(), 2)}`;

      // TODO: fill in the values.
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

      this.callService('calculationSpecification', body, responseData => {
        this.processSpecification(responseData, callback);
      });
    }
  }
}