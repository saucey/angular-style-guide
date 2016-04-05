import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from './help.component'
import {InputMoneyComponent, InputMoneyValueAccessor, formatNumber} from './input-money.component';
import {InputDateComponent, InputDateValueAccessor} from './input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from './checkbox.component';

const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

@Component({
  selector: 'aegon-quickquote-dip',
  directives: [
    HelpComponent, InputMoneyComponent, InputMoneyValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor
  ],
  template: (<HTMLTextAreaElement>document.querySelector('#quickQuoteDipTemplate')).value,
  providers: [HTTP_PROVIDERS]
})
export class QuickQuoteDipComponent implements OnInit {
  step: number = 1;
  pensionAmount: number = 25000;
  amountTooSmall: boolean;
  storedInAegon: boolean;
  storedElsewhere: boolean;
  storedError: boolean;
  birthDate: string;
  birthDateError: boolean;
  deathBenefit: boolean;
  partnerBirthDate: string;
  partnerBirthDateError: boolean;
  startingDate: string;
  startingDateError: boolean;
  startingDateChoices: any[] = [];
  serviceError: boolean;
  pendingCount: number = 0;
  linearAmount: string;
  deathBenefitAmount: string;
  highLowFirstAmount: string;
  highLowSecondAmount: string;
  highLowDeathBenefitAmount: string;

  constructor(
    private http:Http
  ) {}

  ngOnInit() {
    let date: Date = new Date(),
      year: number = date.getFullYear(),
      month: number = date.getMonth() + 1;
    for (let i: number = 0; i < 12; i++) {
      if (month === 12) {
        month = 1;
        year += 1;
      } else {
        month += 1;
      }
      let value = year + '-' + (month < 10 ? '0': '') + month + '-01',
        label = '1 ' + monthLabels[month - 1] + ' ' + year;
      this.startingDateChoices.push({value: value, label: label});
    }
  }

  isValidAmount(): boolean {
    this.amountTooSmall = this.pensionAmount < 25000;
    return !this.amountTooSmall;
  }

  submitAmount(): void {
    if (this.isValidAmount()) {
      this.step += 1;
    }
  }

  validate(): boolean {
    let hasErrors: boolean = false;
    this.storedError = null;
    //TODO: call service and process result.
    if (!this.storedInAegon && !this.storedElsewhere) {
      this.storedError = true;
      hasErrors = true;
    }
    if (!this.birthDate) {
      this.birthDateError = true;
      hasErrors = true;
    }
    if (this.deathBenefit && !this.partnerBirthDate) {
      this.partnerBirthDateError = true;
      hasErrors = true;
    }
    if (!this.startingDate) {
      this.startingDateError = true;
      hasErrors = true;
    }
    return !hasErrors;
  }

  submit(serviceUrl: string): void {
    this.storedError = false;
    this.birthDateError = false;
    this.partnerBirthDateError = false;
    this.startingDateError = false;
    this.serviceError = false;
    this.linearAmount = null;
    this.deathBenefitAmount = null;
    this.highLowFirstAmount = null;
    this.highLowSecondAmount = null;
    this.highLowDeathBenefitAmount = null;

    if (this.validate()) {
      this.pendingCount = 2;
      this.calculate(serviceUrl, true);
      this.calculate(serviceUrl, false);
    }
  }

  calculate(serviceUrl: string, highLow: boolean): void {
    if (serviceUrl === 'MockURL') {
      let mockData = {
        "BScalculateResponse": {
          "PROCES": {
            "STATUS": "00000",
            "VOLGNUM": "1",
            "STATUST": "Success"
          },
          "AILHEADER": {
            "CLIENTID": "???",
            "CORRELATIONID": "##BS_PENSIOENOVEREENKOMST_ROA##Wed Mar 23 14:03:12 CET 2016##"
          },
          "PENSIOENOVEREENKOMST": {
            "PENSIOENAANSPRAAK": [
              {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "OPLL",
                "BEDRAG": "15.02"
              }, {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "PPLL",
                "BEDRAG": "901.32"
              }, {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "OPT",
                "BEDRAG": "100.00"
              }
          ]}
      }};
      setTimeout(() => this.processResult(highLow, mockData), 2000);
      return;
    }
    let body:any = {
      "BScalculateRequest": {
        "AILHEADER": {
          "CLIENTID": "???", // TODO
          "CORRELATIONID": "##DIP SS##"
        },
        "DOSSIER": {
          //"REKENFACTOREN": {
          //  "OVERGANG_OP_PP": "0.70",
          //  "VERHOUDING_HOOG_LAAG": "8.0"
          //},
          "PENSIOENOVEREENKOMST": {
            "STORTING_INLEG": {
              "KOOPSOM": String(this.pensionAmount),
              "IND_VREEMDGELD": String(this.storedElsewhere),
              "IND_HERKOMST_OVL": "false"
            },
            "PENSIOENAANSPRAAK": {
              "IND_OUDERDOMSPENSIOEN": "true",
              "IND_NABESTAANDENPENSIOEN": String(this.deathBenefit),
              "IND_HOOG_LAAGPENSIOEN": highLow,
              "IND_PREPENSIOEN": "false",
              "BEGIN_DATUM_UITKERING": this.startingDate,
              "DUUR_UITKERING_JAREN": "5",
              //"STIJGING_PERC": "0.0",
              "TERMIJN_UITKERING": "1"
              //"EIND_DATUM_UITKERING": "2020-10-28"
            }
          },
          "PARTIJ": [
            {
              "_AE_PERSOON": {
                "VOLGNUM": "1",
                "GESLACH": "M",
                "GEBDAT": this.birthDate
              }
            },
            {
              "_AE_PERSOON": {
                "VOLGNUM": "2",
                "GESLACH": "V",
                "GEBDAT": this.partnerBirthDate
              }
            }
          ]
        }
      }
    };
    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : "Basic YXBwRHV4REVWOnFnV2FieEI3c1gwTFU1UHNlV1Fr"});
    let options = new RequestOptions({headers: headers});
    this.http.post(serviceUrl, JSON.stringify(body), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.processResult(highLow, data);
      }, error => console.log(error));
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    return Observable.throw('Server error');
  }

  processResult(highLow, data) {
    console.log('processResult', highLow, data);
    let items: any[] = data['BScalculateResponse']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'],
      hlAmount = 0;
    items.forEach(item => {
      let s = item['PENSIOENVORM'],
        value = item['BEDRAG'];
      if (highLow) {
        if (s === 'OPLL') {
          hlAmount += parseFloat(value);
          this.highLowSecondAmount = value;
        } else if (s === 'OPT') {
          hlAmount += parseFloat(value);
        } else if (s === 'PPLL') {
          this.highLowDeathBenefitAmount = value;
        }
      } else {
        if (s === 'OPLL') {
          this.linearAmount = value;
        } else if (s === 'PPLL') {
          this.deathBenefitAmount = value;
        }
      }
    });
    if (highLow) {
      this.highLowFirstAmount = formatNumber(hlAmount);
    }
    this.pendingCount -= 1;
  }
}
