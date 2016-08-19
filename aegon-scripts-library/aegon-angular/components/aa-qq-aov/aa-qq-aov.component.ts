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

@Component({
  selector: 'aa-qq-aov',
  directives: [
    // New
    AAInputNumberComponent, AASliderInputComponent, AAInputRadioComponent, AAInputDropDownComponent,
    // Old
    InputDateComponent, InputDateValueAccessor, CheckboxComponent, CheckboxValueAccessor, HelpComponent
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
      this.fetchCalculationSpecification(() => {
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

  processCalculationSpecification(response, cb) {
    cb();
  }

  fetchCalculationSpecification(callback: any = () => {}) {
    if (this.riskFactor) {
      if (options.mockData) {
        this.processCalculationSpecification(mockSpecificationResponse, callback);
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
        this.processCalculationSpecification(responseData, callback);
      });
    }
  }

  validateEmail() {
    var emailAddress_regexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.emailAddressError = (
      this.emailAddress != "" && 
      (this.emailAddress.length <= 5 || !emailAddress_regexp.test(this.emailAddress))
    );

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
      'SOAPAction': this.options.mailUrl
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

    this.http.post(this.options.mailUrl , oSerializer.serializeToString(XMLBody), options)
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(data => {
          this.emailButtonPending = false;
          this.reSendEmailShown = true;
        }, error => console.error(error));

    return false;
  }

}