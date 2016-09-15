/**
 * AOV quick quote
 */
import {Component, OnInit, Input, EventEmitter, ElementRef} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import * as libUtil from "../../lib/util";

import {HelpComponent} from '../../../components/angular-components/help.component';
// AA components
import {AAMoneyPipe} from "../../pipes/money.pipe";
import {AAInputRadioComponent} from "../aa-input-radio/aa-input-radio.component";
import {AAInputDropDownComponent} from "../aa-input-dropdown/aa-input-dropdown.component";
import {AASliderInputComponent} from "../aa-slider-input/aa-slider-input.component";
import {AAInputNumberComponent} from '../aa-input-number/aa-input-number.component';
import {AAInputDateComponent} from '../aa-input-date/aa-input-date.component';
// Locals
import {template} from "./template";
import {defaultOptions} from "./defaultOptions";
import {calculateAge, stringToDate, addYearsToDate, getDateDiffInYears, cloneDate} from "../../lib/date";
import {zeroPad} from "../../lib/format";
import {mockProfessionsResponse} from "./mock-professions";
import {mockRiskFactorResponse} from "./mock-riskfactor";
import {mockSpecificationResponse} from "./mock-specification";
import {AAHintComponent} from "../aa-hint/aa-hint.component";
import {AABaseComponent} from "../../lib/classes/AABaseComponent";


@Component({
  selector: 'aa-qq-aov',
  directives: [
    AAInputNumberComponent,
    AASliderInputComponent,
    AAInputRadioComponent,
    AAInputDropDownComponent,
    AAInputDateComponent,
    AAHintComponent
  ],
  template: template,
  providers: [HTTP_PROVIDERS],
  pipes: [AAMoneyPipe]
})
export class AAQQAovComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};
  public  defaultOptions: any = defaultOptions;

  public  showCalculator: boolean;

  public  birthDate: string;
  public  birthDateError: boolean;

  public  profession: any = {};
  public  professions: any[] = [];
  public  professionsFiltered: any[] = [];
  private rawProfession: any;
  private rawProfessions: any = {};

  public  professionError: boolean;
  public  grossIncome: number;
  public  grossIncomeError: boolean;

  public  startingTerm: number;
  public  grossYearAmount: number;

  public  serviceError: boolean;
  public  pending: number = 0;

  public  riskFactor: any = {};

  public  grossPremium: number = 0;
  public  netPremium: number = 0;

  public  fetchSpecification$: EventEmitter<any> = new EventEmitter;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(
    private elementRef: ElementRef,
    private http: Http
  ) {
    super(elementRef);
  }

  ngOnInit() {
    super.ngOnInit();

    this.startingTerm = this.data.options.startingTerm.initial;

    this.initProfessions();

    // Debounce the request so it doesn't fire constantly.
    this.fetchSpecification$.debounceTime(this.data.options.specificationCallDelay)
      .subscribe(() => {
        this.fetchSpecification(() => {
          let bdTokens = this.birthDate.split('-');
          let summaryData = {
            birthDate: `${bdTokens[2]}-${bdTokens[1]}-${bdTokens[0]}`,
            profession: this.profession && this.profession.label || "",
            grossIncome: this.grossIncome || 0,
            startingTerm: this.startingTerm || 30,
            grossYearAmount: this.grossYearAmount || 0,
            grossPremium: this.grossPremium || 0,
            netPremium: this.netPremium || 0
          };
          clientStorage.session.setItem("aovQQ", summaryData);
        });
      });
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
    if (response && response.retrieveProfessionsResponse &&
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
    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.data.options.serviceCredentials}`});
    let options = new RequestOptions({headers: headers});
    this.pending += 1;
    this.http.post(this.data.options.serviceUrl + name, JSON.stringify(data), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.pending -= 1;
        callback(data);
      }, error => console.error(error));
  }

  initProfessions() {
    this.serviceError = false;

    if (this.data.options.mockProfessions) {
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
        age < this.data.options.birthDate.minAge ||
        age > this.data.options.birthDate.maxAge ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    if (!this.profession || this.professions.indexOf(this.profession) === -1) {
      // Profession isn't one of the profession objects!
      this.professionError = true;
      hasErrors = true;
    }

    if (!this.grossIncome || this.grossIncome < this.data.options.income.min || this.grossIncome > this.data.options.income.max) {
      this.grossIncomeError = true;
      hasErrors = true;
    }

    return !hasErrors;
  }

  openCalculator() {
    // Validate the personal information. If it is valid then the calculator can be shown.
    if (this.validatePersonalInformation()) {
      // Show calculator once we have fetched the data.
      this.fetchSpecification(() => {
        this.showCalculator = true;
      });

    }
  }

  gotoSummary() {
    window.location.href = this.data.options.summaryPath;
  }

  prefillGrossYearAmount(amount) {
    let min = this.data.options.grossYearAmount.slider.range.min;
    let max = Math.min(
      this.data.options.grossYearAmount.maxInsuranceAmount,
      Math.max(
        min,
        Math.round(amount * 0.8)
      )
    );

    this.grossYearAmount = max;
    this.data.options.grossYearAmount.slider.range.max = max;
  }

  processRiskFactor(response) {
    this.riskFactor = response;
  }

  fetchRiskFactor(rawProfession) {
    if (this.data.options.mockRiskFactor) {
      this.processRiskFactor(mockRiskFactorResponse);
      return;
    }

    let body = {
      "calculateRiskFactorRequest": {
        "AILHEADER": {
          "CLIENTID": "RCAL",
          "CORRELATIONID": "## batch 7 ##"
        },
        "_AE_BEROEPENLIJST_AOV": {}
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
      this.rawProfession = this.rawProfessions[professionObj.key];
      this.fetchRiskFactor(this.rawProfession);
    } else {
      // No profession found, empty the riskFactor.
      this.rawProfession = null;
      this.riskFactor = {};
    }
  }

  fetchProfessions(searchString) {
    this.professionsFiltered = this.professions.filter((value) => {
      return value.label.toLowerCase().indexOf(searchString.toLowerCase()) > -1;
    });
  }

  processSpecification(response, callback) {
    let src: any = response;
    let path = ['calculateSpecificationResponse', 'CONTRACT_POLIS', 'DEKKING', 0, 'DEKKING_AOV'];

    for (let part of path) {
      if (src[part]) {
        src = src[part]
      } else {
        src = null;
        break;
      }
    }

    if (src && src['_AE_JAARPREM']) {
      let monthly = src['_AE_JAARPREM'] / 12;
      this.grossPremium = Math.round(monthly);
      this.netPremium = Math.round(monthly * 0.65);

      callback();
    }

  }

  fetchSpecification(callback: any = () => {}) {
    if (this.riskFactor) {
      if (!this.validatePersonalInformation()) {
        return;
      }

      if (this.data.options.mockSpecification) {
        this.processSpecification(mockSpecificationResponse, callback);
        return;
      }

      let now: Date = new Date();
      let dateString = `${now.getFullYear()}-${zeroPad(now.getMonth() + 1, 2)}-${zeroPad(now.getDate(), 2)}`;

      let birthDate = stringToDate(this.birthDate);

      
      let maxAge = parseInt(this.rawProfession._AE_MAXENDLF || this.data.options.defaultMaxEndAge, 10);

      let maxInsuranceDate = cloneDate(birthDate);
      addYearsToDate(maxInsuranceDate, maxAge);

      let maxInsuranceDateString = `${maxInsuranceDate.getFullYear()}-${zeroPad(maxInsuranceDate.getMonth() + 1, 2)}-${zeroPad(maxInsuranceDate.getDate(), 2)}`;

      let body = {
        "calculateSpecificationRequest": {
          "AILHEADER": {
            "CLIENTID": "RCAL",
            "CORRELATIONID": "## batch 7 ##"
          },
          "CONTRACT_POLIS": {
            "DPRC": "0",
            "INGDAT": dateString,
            "_AE_BETAALAFSPRAAK": {
              "BETTERM": "1"
            },
            "_AE_VERZEKERD_OBJECT": {
              "_AE_OVERIG": {
                "_AE_OBJECT_PERSOON": {
                  "OBJECT_PERS_BEROEP_GEGEV": {
                    "_AE_RISICOKLASSE_AOV": {
                      "_AE_RISKKLASSE": this.riskFactor.calculateRiskFactorResponse._AE_RISICOKLASSE_AOV._AE_RISKKLASSE
                    }
                  },
                  "GEBDAT": this.birthDate
                }
              }
            },
            "DEKKING": {
              "VERZSOM": this.grossYearAmount,
              "HVVDAT": maxInsuranceDateString,
              "MYCODE": "1150",
              "DEKKING_AOV": {
                "VERZSOM_B": this.grossYearAmount,
                "_AE_COMBINATIEKORT": "false",
                "_AE_COMMERCIELEKORT": "5",
                "WACHTTY": this.startingTerm,
                "_AE_AANVANGSKORT": "false",
                "UDRAFWJ": getDateDiffInYears(now, maxInsuranceDate),
                "AOPVU": "25",
                "CBSSTG": "false",
                "ENDLFTD": maxAge,
                "INDEX": "false",
                "TARIEF": "C"
              }
            }
          }
        }
      };

      this.callService('calculateSpecification', body, responseData => {
        this.processSpecification(responseData, callback);
      });
    }
  }
}
