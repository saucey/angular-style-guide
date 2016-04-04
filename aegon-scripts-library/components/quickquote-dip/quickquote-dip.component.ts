import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from './help.component'
import {InputMoneyComponent, InputMoneyValueAccessor} from './input-money.component';
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

    if (this.validate()) {
      let body: any = {
        "BScalculateRequest": {
          "AILHEADER": {
            "CLIENTID": "TC--P1",
            "CORRELATIONID": "##DIP SS##"
          },
          "DOSSIER": {
            "REKENFACTOREN": {
              "OVERGANG_OP_PP": "0.70",
              "VERHOUDING_HOOG_LAAG": "8.0"
            },
            "PENSIOENOVEREENKOMST": {
              "STORTING_INLEG": {
                "KOOPSOM": String(this.pensionAmount),
                "IND_VREEMDGELD": String(this.storedElsewhere),
                "IND_HERKOMST_OVL": "true"
              },
              "PENSIOENAANSPRAAK": {
                "IND_OUDERDOMSPENSIOEN": "true",
                "IND_NABESTAANDENPENSIOEN": "true",
                "IND_HOOG_LAAGPENSIOEN": "false",
                "IND_PREPENSIOEN": "false",
                "BEGIN_DATUM_UITKERING": this.startingDate,
                "DUUR_UITKERING_JAREN": "5",
                "STIJGING_PERC": "0.0",
                "TERMIJN_UITKERING": "3",
                "EIND_DATUM_UITKERING": "2020-10-28"
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
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      this.http.post(serviceUrl, JSON.stringify(body), options)
        .map(res => res.json())
        .catch(this.handleError)
        .subscribe(data => {
          console.log('RESULT', data);
        }, error => console.log(error));
    }
  }

  handleError(error: Response) {
    this.serviceError = true;
    console.log('Server error', error);
    return Observable.throw('Server error');
  }
}
