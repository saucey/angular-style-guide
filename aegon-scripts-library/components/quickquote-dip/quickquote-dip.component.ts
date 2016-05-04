import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";

const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteDipTemplate'));

@Component({
  selector: 'aegon-quickquote-dip',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote lijfrente dip">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken direct uw pensioenuitkering:</h3>
        <div class="field">
          <div class="label">
            Hoogte van uw pensioenkapitaal
            <aegon-help>
              Vul hier de hoogte van uw pensioenkapitaal in. Heeft u bij meer pensioenverzekeraars een pensioenkapitaal?
              Tel dan alle bedragen bij elkaar op en vul het totaalbedrag hier in.
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-number #amountInput prefix="€" [(ngModel)]="pensionAmount" [max]="99999999"
                               (focus)="amountTooSmall = false; amountInput.select()" (blur)="isValidAmount()"
                               (enter)="submitAmount()" [placeholder]="'minimaal 25.000'">
            </aegon-input-number>
            <button class="button arrow" *ngIf="step === 1" [disabled]="!pensionAmount" (click)="submitAmount()">
              Volgende
            </button>
          </div>
        </div>
        <p class="error" *ngIf="amountTooSmall">
          Wilt u minimaal €25.000 inleggen? Deze rekentool is vooral bedoeld voor klanten die hun pensioen buiten Aegon
          hebben opgebouwd. Heeft u uw pensioen opgebouwd bij Aegon? Dan krijgt u van ons automatisch een offerte
          toegestuurd. Hierbij hanteren we een lager minimum bedrag.
        </p>

        <div *ngIf="step > 1">
          <div class="field">
            <div class="label">
              Uw pensioenkapitaal is opgebouwd bij
              <aegon-help>
                Heeft u pensioen opgebouwd bij verschillende verzekeraars/pensioenfondsen en wilt u deze samenvoegen?
                Kies dan voor ‘Een andere verzekeraar of pensioenfonds’
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-checkbox [(ngModel)]="storedInAegon">Aegon</aegon-checkbox>
              <aegon-checkbox [(ngModel)]="storedElsewhere">Andere verzekeraar/pensioenfonds</aegon-checkbox>
            </div>
          </div>
          <p class="error" *ngIf="storedError">
            Wilt u kiezen waar uw pensioenkapitaal is opgebouwd?
          </p>
          <div class="field">
            <div class="label">Uw geboortedatum</div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="birthDateError">
            Wilt u een geldige geboortedatum invoeren?
          </p>
          <div class="field">
            <div class="label">
              Wilt u een partnerpensioen voor uw partner verzekeren?
              <aegon-help>
                Heeft u een partner? En wilt u dat uw partner een pensioenuitkering krijgt na uw overlijden?
                Dan kunt u een partnerpensioen verzekeren. De uitkering is 70% van het pensioen dat u ontvangt.
              </aegon-help>
            </div>
            <span class="inputs">
              <aegon-checkbox [(ngModel)]="deathBenefit">
                Ja, ik wil een partneruitkering bij overlijden (70% van de oorspronkelijke pensioenuitkering)
              </aegon-checkbox>
            </span>
          </div>
          <div class="field" *ngIf="deathBenefit">
            <div class="label">Geboortedatum van uw partner</div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="partnerBirthDate"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="partnerBirthDateError">
            U heeft gekozen voor een partneruitkering bij overlijden. Wilt u een geldige geboortedatum invoeren voor uw
            partner?
          </p>
          <div class="field">
            <div class="label">
              Ingangsdatum van de pensioenuitkering
              <aegon-help>
                U ontvangt de pensoenuitkering altijd achteraf, aan het einde van de maand.
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="startingDate" (change)="changeStartingDate($event.target.value)">
                <option *ngFor="#date of startingDateChoices" [value]="date.value">{{date.label}}</option>
              </select>
            </div>
          </div>
          <p class="error" *ngIf="startingDateError">
            Wilt u een ingangsdatum kiezen?
          </p>
          <div class="field">
            <div class="label"></div>
            <div class="inputs">
              <button class="button icon-right icon-calculator" [disabled]="pendingCount > 0" [ngClass]="{pending: pendingCount > 0}" (click)="submit('MockURL', '')">
                Bereken
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="result" *ngIf="linearAmount && highLowFirstAmount">
        <div class="linear">
          <div class="row">
            <span class="label">Pensioenuitkering</span>
            <span class="value"><span class="currency">€</span> <span class="amount">{{linearAmount | money}}</span> bruto p/mnd</span>
          </div>
          <div *ngIf="deathBenefitAmount" class="row">
            <span class="label">Partneruitkering bij overlijden</span>
            <span class="value"><span class="currency">€</span> <span class="amount">{{deathBenefitAmount | money}}</span> bruto p/mnd</span>
          </div>
        </div>
        <div class="high-low">
          <div class="heading">Hoog-laag-uitkering</div>
          <p>
            Hierbij ontvangt u de eerste 5 jaar een hogere en daarna een iets lagere uitkering dan normaal. U krijgt
            voor beide mogelijkheden een offerte. <a href="#TODO">Meer informatie</a>
          </p>
          <div class="row">
            <span class="label">Eerste 5 jaar</span>
            <span class="value">
              <span class="currency">€</span> <span class="amount">{{highLowFirstAmount | money}}</span> bruto p/mnd
            </span>
          </div>
          <div class="row">
            <span class="label">Na 5 jaar</span>
            <span class="value">
              <span class="currency">€</span> <span class="amount">{{highLowSecondAmount | money}}</span> bruto p/mnd
            </span>
          </div>
          <div *ngIf="deathBenefitAmount" class="row">
            <span class="label">Partneruitkering bij overlijden</span>
            <span class="value">
              <span class="currency">€</span> <span class="amount">{{highLowDeathBenefitAmount | money}}</span> bruto p/mnd
            </span>
          </div>
        </div>
        <div *ngIf="storedInAegon" class="footer">
          Uw pensioen komt vrij <strong>bij Aegon</strong>.<br>
          U krijgt binnen 3 maanden voorafgaand aan uw pensioen automatisch per brief van ons een offerte.
        </div>
        <div *ngIf="!startingDateTooFar && !storedInAegon" class="footer">
          <ul class="arrow">
            <li><a href="#TODO">Vraag een adviesgesprek aan</a></li>
          </ul>
          <button class="button orange icon-right arrow">Vrijblijvende offerte</button>
        </div>
        <div *ngIf="startingDateTooFar && !storedInAegon">
          U kunt pas binnen 3 maanden voorafgaand aan uw pensioen een offerte ontvangen.
          <ul class="arrow">
            <li><a href="#TODO">Vraag een adviesgesprek aan</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class QuickQuoteDipComponent implements OnInit {
  step: number = 1;
  pensionAmount: number;
  amountTooSmall: boolean;
  storedInAegon: boolean = false;
  storedElsewhere: boolean = false;
  storedError: boolean;
  birthDate: string;
  birthDateError: boolean;
  deathBenefit: boolean = false;
  partnerBirthDate: string;
  partnerBirthDateError: boolean;
  startingDate: string;
  startingDateError: boolean;
  startingDateChoices: any[] = [];
  startingDateTooFar: boolean = false;
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

  changeStartingDate(value: string): void {
    this.startingDate = value;
    this.startingDateTooFar = false;
    this.startingDateChoices.some((date, index) => {
      if (date.value === value && index >= 3) {
        this.startingDateTooFar = true;
        return true;
      }
    });
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

  submit(serviceUrl: string, authToken: string): void {
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
      this.calculate(serviceUrl, authToken, true);
      this.calculate(serviceUrl, authToken, false);
    }
  }

  calculate(serviceUrl: string, authToken: string, highLow: boolean): void {
    if (serviceUrl === 'MockURL') {
      let mockData = {
        "BScalculateResponse": {
          "PROCES": {
            "STATUS": "00000",
            "VOLGNUM": "1",
            "STATUST": "Success"
          },
          "AILHEADER": {
            "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
            "CORRELATIONID": "##DIP SS##"
          },
          "PENSIOENOVEREENKOMST": {
            "PENSIOENAANSPRAAK": [
              {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "OPLL",
                "BEDRAG": "5631.4"
              }, {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "PPLL",
                "BEDRAG": "1877.13"
              }, {
                "EIND_DATUM_UITKERING": "2134-12-20",
                "PENSIOENVORM": "OPT",
                "BEDRAG": "4111.45"
              }
          ]}
      }};
      setTimeout(() => this.processResult(highLow, mockData), 2000);
      return;
    }
    let body:any = {
      "BScalculateRequest": {
        "AILHEADER": {
          "CLIENTID": "BS_PENSIOENOVEREENKOMST_ROA_Rest",
          "CORRELATIONID": "##DIP SS##"
        },
        "DOSSIER": {
          "REKENFACTOREN": {
            "OVERGANG_OP_PP": 0.70,
            "VERHOUDING_HOOG_LAAG": 0.75
          },
          "PENSIOENOVEREENKOMST": {
            "STORTING_INLEG": {
              "KOOPSOM": this.pensionAmount,
              "IND_VREEMDGELD": this.storedElsewhere,
              "IND_HERKOMST_OVL": false
            },
            "PENSIOENAANSPRAAK": {
              "IND_OUDERDOMSPENSIOEN": true,
              "IND_NABESTAANDENPENSIOEN": this.deathBenefit,
              "IND_HOOG_LAAGPENSIOEN": highLow,
              "IND_PREPENSIOEN": false,
              "BEGIN_DATUM_UITKERING": this.startingDate,
              "DUUR_UITKERING_JAREN": 5,
              "TERMIJN_UITKERING": 1
            }
          },
          "PARTIJ": [
            {
              "_AE_PERSOON": {
                "VOLGNUM": 1,
                "GESLACH": "M",
                "GEBDAT": this.birthDate
              }
            }
          ]
        }
      }
    };
    if (this.deathBenefit) {
      body['BScalculateRequest']['DOSSIER']['PARTIJ'].push(
        {
          "_AE_PERSOON": {
            "VOLGNUM": 2,
            "GESLACH": "V",
            "GEBDAT": this.partnerBirthDate
          }
        }
      );
    }
    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${authToken}`});
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
    this.pendingCount -= 1;
    return Observable.throw('Server error');
  }

  processResult(highLow, data) {
    let items: any[] = data['BScalculateResponse']['PENSIOENOVEREENKOMST']['PENSIOENAANSPRAAK'],
      hlAmount = 0;
    if (!Array.isArray(items)) {
      items = [items];
    }
    items.forEach(item => {
      let s = item['PENSIOENVORM'],
        value = item['BEDRAG'];
        value = value/12;
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
      this.highLowFirstAmount = String(hlAmount);
    }
    this.pendingCount -= 1;
  }
}
