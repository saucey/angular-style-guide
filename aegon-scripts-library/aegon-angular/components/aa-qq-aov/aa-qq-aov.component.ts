/**
 * AOV quick quote
 */
import {Component, OnInit, Input, EventEmitter, ElementRef, Renderer} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

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
import {aegonTealium} from "../../lib/aegon_tealium";


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
  public  pending: number = 0;
  public  showCalculator: boolean = false;
  public  serviceError: boolean;
  public  setFocus: boolean = true;

  public  birthDate: string;
  public  birthDateError: boolean;

  public  profession: any = {};
  public  professions: any[] = [];
  public  professionsFiltered: any[] = [];
  public  professionError: boolean;

  public  grossIncome: number;
  public  grossIncomeError: boolean;

  public  startingTerm: number;

  public  grossYearAmount: number;

  public  riskFactor: any = {};

  public  grossPremium: string = "0,00";
  public  netPremium: string = "0,00";

  public  fetchSpecification$: EventEmitter<any> = new EventEmitter();

  public  grossYearlyExpenseAmount: number = clientStorage.local.getItem("grossYearlyExpenseAmount");
  public  clientStorageAOV: any = clientStorage.session.getItem("aovQQ") || void 0;

  public globalListenFunc: Function;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(
    private elementRef: ElementRef,
    private http: Http,
    private renderer: Renderer
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
          // Data needed for the summary.
          let data = {
            birthDate: this.birthDate,
            profession: this.profession && this.profession.label || "",
            grossIncome: this.grossIncome || 0,
            startingTerm: this.startingTerm || 30,
            grossYearAmount: this.grossYearAmount || 0,
            grossPremium: this.grossPremium || 0,
            netPremium: this.netPremium || 0
          };

          // Data needed for prefilling the aov quote.
          data['professionCode'] = this.profession.raw._AE_BRPCODE;
          data['riskFactor'] = this.riskFactor;

          clientStorage.session.setItem("aovQQ", data);
        });
      });

    
    // Add a euro sign in front of the amount. This doesn't work if we set it in defaultOption.ts.
    if (!this.data.options.grossYearAmount.slider.pips.format) {
      this.data.options.grossYearAmount.slider.pips['format'] = {
        to: (value) => {
          return '€ ' + value;
        }
      }
    }

    aegonTealium({
      page_cat_1_type: 'quick_quotes',
      page_cat_2_name: 'berekening',
      page_cat_3_section: "particulier",
      page_cat_4_productgroup: 'inkomensverzekeringen',
      page_cat_5_product: "aov",
      product_name: ['aov'],
      product_category: ['inkomensverzekeringen'],
      form_name: 'aov premie',
      step_name: 'qq-berekening-view',
      page_step:'01',
      event: 'qq_view'
    });

    this.globalListenFunc = this.renderer.listenGlobal('document', 'click', (event) => {
      aegonTealium({
        page_cat_1_type: 'quick_quotes',
        page_cat_2_name: 'berekening',
        page_cat_3_section: "particulier",
        page_cat_4_productgroup: 'inkomensverzekeringen',
        page_cat_5_product: "aov",
        product_name: ['aov'],
        product_category: ['inkomensverzekeringen'],
        form_name: 'aov premie',
        step_name: 'qq-berekening-start',
        page_step:'02',
        event: 'qq_started'
      });
      this.globalListenFunc();
    });

  }

  handleError(error: Response) {
    this.serviceError = true;
    console.error('Server error', error);
    this.pending -= 1;
    alert('Het is niet gelukt om gegevens op te vragen door een technisch probleem. Probeer het later opnieuw.');
    return Observable.throw('Server error');
  }

  prefillAOVQQ(cl) {
    if (cl.birthDate) {
      this.birthDate = cl.birthDate;
    }

    if (cl.grossIncome) {
      this.grossIncome = cl.grossIncome;
    }

    if (cl.startingTerm) {
      this.startingTerm = cl.startingTerm;
    }

    if (cl.grossYearAmount) {
      this.grossYearAmount = cl.grossYearAmount;
    }

    if (cl.professionCode) {
      for (let professionObj of this.professions) {
        if (professionObj['raw']._AE_BRPCODE === cl.professionCode) {
          // Set the profession.
          this.profession = professionObj;

          // Fetch the Riskfactor and let it also fetch the specification if all personal details are available.
          let valid = cl.birthDate && cl.professionCode && cl.grossIncome;

          if (cl.riskFactor) {
            this.riskFactor = cl.riskFactor;
            if (valid) {
              this.setFocus = false;
              this.openCalculator();
            }
          } else {
            this.fetchRiskFactor(professionObj.raw, valid);
          }
          break;
        }
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

  processProfessions(response) {
    // Check if the response contains professions
    if (response && response.retrieveProfessionsResponse &&
        response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
      for (let prof of response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
        // Make each profession available for the input dropdown in the format that the dropdown needs.
        // Only professions that have a BKLASSE higher than 0 can be used.
        if (prof.BKLASSE !== "0") {
          this.professions.push({key: prof._AE_BRPCODE, label: prof._AE_BRPSUBNM || prof._AE_BRPNAAM, raw: prof})
        }
      }
    }
  }

  initProfessions() {
    this.serviceError = false;

    if (this.data.options.mockProfessions) {
      this.processProfessions(mockProfessionsResponse);

      if (this.clientStorageAOV) {
        this.prefillAOVQQ(this.clientStorageAOV);
      }
      return;
    }

    let body = {
      "retrieveProfessionsRequest": {
        "AILHEADER": {
          "CLIENTID": "AEGONNL",
          "CORRELATIONID": `##BS_AE_POLIS_AOV_02##${new Date().toString()}##`
        }
      }
    };

    this.callService('retrieveProfessions', body, responseData => {
      // Process the professions.
      this.processProfessions(responseData);

      // If the clientStorage contains AOV information, the prefill the AOV.
      if (this.clientStorageAOV) {
        this.prefillAOVQQ(this.clientStorageAOV);
      }
    });
  }

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;

    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    // Calculate age.
    let age = calculateAge(this.birthDate);

    // Calculate maximum age.
    let maxAge = this.data.options.birthDate.maxAge;

    // If we have a profession that has a maximum age, use this age instead.
    if (this.profession && this.profession.raw._AE_MAXENDLF) {
      let _AE_MAXENDLF = parseInt(this.profession.raw._AE_MAXENDLF, 10);
      if (_AE_MAXENDLF < maxAge) {
        maxAge = _AE_MAXENDLF;
      }
    }

    // Check if birthDate has been filled and that the person is not older than the maximum age.
    if (!this.birthDate ||
        age < this.data.options.birthDate.minAge ||
        age >= maxAge ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    // Check is a profession has been set.
    if (!this.profession || this.professions.indexOf(this.profession) === -1) {
      // Profession isn't one of the profession objects!
      this.professionError = true;
      hasErrors = true;
    }

    // Check if the grossIncome has been set and that is between the minimum and maximum.
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
      this.prefillGrossYearAmount(this.grossIncome);
      
      this.fetchSpecification(() => {
          this.showCalculator = true;

          aegonTealium({
            page_cat_1_type: 'quick_quotes',
            page_cat_2_name: 'berekening',
            page_cat_3_section: "particulier",
            page_cat_4_productgroup: 'inkomensverzekeringen',
            page_cat_5_product: "aov",
            product_name: ['aov'],
            product_category: ['inkomensverzekeringen'],
            form_name: 'aov premie',
            step_name: 'qq-berekening-bevestiging',
            page_step:'03',
            event: 'qq_completed'
          });
        
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

    let expenses = this.grossYearlyExpenseAmount;

    if (!this.grossYearAmount) {
      if (expenses > 0) {
        this.grossYearAmount = Math.max(min, Math.min(expenses, max));
      } else {
        this.grossYearAmount = max;
      }
    }
    
    this.data.options.grossYearAmount.slider.range.max = max;
  }

  processRiskFactor(response, prefill) {
    this.riskFactor = response;

    if (prefill) {
      // We are prefilling the form, automatically fetch the calculation.
      this.setFocus = false;
      this.openCalculator();
    }
  }

  fetchRiskFactor(rawProfession, prefill = false) {
    if (this.data.options.mockRiskFactor) {
      this.processRiskFactor(mockRiskFactorResponse, prefill);
      return;
    }

    let body = {
      "calculateRiskFactorRequest": {
        "AILHEADER": {
          "CLIENTID": "AEGONNL",
          "CORRELATIONID": `##BS_AE_POLIS_AOV_02##${new Date().toString()}##`
        },
        "_AE_BEROEPENLIJST_AOV": {}
      }
    };

    if (rawProfession) {
      // Mandatory values.
      body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['BKLASSE'] = rawProfession.BKLASSE;
      body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMAX'] = rawProfession._AE_BKLSMAX || 0;

      // Optional values
      if (rawProfession._AE_BKLSMIN) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMIN'] = rawProfession._AE_BKLSMIN;
      }
      if (rawProfession._AE_BKLSVAST) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSVAST'] = rawProfession._AE_BKLSVAST;
      }

      this.callService('calculateRiskFactor', body, responseData => {
        this.processRiskFactor(responseData, prefill);
      });
    }
  }

  selectProfession(professionObj) {
    // Set the profession
    this.profession = professionObj;

    if (professionObj) {
      // When a profession is known the riskfactor can be retrieved from the service.
      this.fetchRiskFactor(professionObj.raw);
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
      this.grossPremium = monthly.toFixed(2).replace('.', ',');
      this.netPremium = (monthly * 0.65).toFixed(2).replace('.', ',');

      callback();
    }

  }

  fetchSpecification(callback: any = () => {}) {
    if (this.riskFactor && this.riskFactor.calculateRiskFactorResponse) {
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
      
      let maxAge = parseInt(this.profession.raw._AE_MAXENDLF || this.data.options.defaultMaxEndAge, 10);

      let maxInsuranceDate = cloneDate(birthDate);
      // Add the maximum age as years to the Date object.
      addYearsToDate(maxInsuranceDate, maxAge);

      let maxInsuranceDateString = `${maxInsuranceDate.getFullYear()}-${zeroPad(maxInsuranceDate.getMonth() + 1, 2)}-${zeroPad(maxInsuranceDate.getDate(), 2)}`;

      let body = {
        "calculateSpecificationRequest": {
          "AILHEADER": {
            "CLIENTID": "AEGONNL",
            "CORRELATIONID": `##BS_AE_POLIS_AOV_02##${new Date().toString()}##`
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
                "_AE_VERZSOM_B": this.grossYearAmount,
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
    } else {
      console.error('No riskfactor has been delivered. Cannot calculate.')
    }
  }
}
