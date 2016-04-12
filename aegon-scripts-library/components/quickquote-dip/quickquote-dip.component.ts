import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from './help.component'
import {InputMoneyComponent, InputMoneyValueAccessor, formatNumber} from './input-money.component';
import {InputDateComponent, InputDateValueAccessor} from './input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from './checkbox.component';
import {MoneyPipe} from "./money.pipe";

const monthLabels: string[] = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

var templateElem = (<HTMLTextAreaElement>document.querySelector('#quickQuoteDipTemplate'));

@Component({
  selector: 'aegon-quickquote-dip',
  directives: [
    HelpComponent, InputMoneyComponent, InputMoneyValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    <div class="quickquote lijfrente dip">
      <div class="triangle"></div>
      <div class="calculation">
        <h3>Bereken direct uw pensioenuitkering:</h3>
        <div class="field">
          <div class="label">
            Beschikbaar pensioenkapitaal
            <aegon-help>
              Vul het totale bedrag in waarmee u wilt rekenen. Het gaat hierbij alleen om pensioenkapitaal uit een
              beschikbare premieregeling. Wij helpen u bij het herkennen van deze regeling <strong style="color:red;">(link naar situatiepagina)</strong>.
              Heeft u meerdere pensioenbedragen uit verschillende beschikbare premieregelingen? Dan kunt u die bij elkaar
              optellen.
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-money #amountInput currency="€" [(ngModel)]="pensionAmount" [max]="99999999"
                               (focus)="amountTooSmall = false; amountInput.select()" (blur)="isValidAmount()"
                               (enter)="submitAmount()">
            </aegon-input-money>
          </div>
        </div>
        <p class="error" *ngIf="amountTooSmall">
          U moet minimaal €25.000 inleggen. Deze rekentool is vooral bedoeld voor klanten die hun pensioen buiten Aegon
          hebben opgebouwd. Heeft u uw pensioen opgebouwd bij Aegon? Dan krijgt u van ons automatisch een offerte
          toegestuurd. Hierbij hanteren we een lager minimum bedrag.
        </p>
        <button class="button arrow" *ngIf="step === 1" [disabled]="!pensionAmount" (click)="submitAmount()">
          Volgende
        </button>

        <div *ngIf="step > 1">
          <div class="field">
            <div class="label">
              Pensioenkapitaal is opgebouwd bij
              <aegon-help>
                Heeft u pensioen opgebouwd bij verschillende verzekeraars/pensioenfondsen en wilt u deze samenvoegen?
                Kies dan voor ‘Een andere verzekeraar of pensioenfonds.’
              </aegon-help>
            </div>
            <div class="inputs">
              <aegon-checkbox [(ngModel)]="storedInAegon">Aegon</aegon-checkbox>
              <aegon-checkbox [(ngModel)]="storedElsewhere">Andere verzekeraar/pensioenfonds</aegon-checkbox>
            </div>
          </div>
          <p class="error" *ngIf="storedError">
            U moet kiezen waar uw pensioenkapitaal is opgebouwd.
          </p>
          <div class="field">
            <div class="label">Uw geboortedatum</div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="birthDate"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="birthDateError">
            Voer een geldige geboortedatum in.
          </p>
          <div class="field">
            <div class="label">Uitkering bij overlijden</div>
            <span class="inputs">
              <aegon-checkbox [(ngModel)]="deathBenefit">
                Ja, ik wil een partneruitkering bij overlijden (70% van de oorspronkelijke pensioenuitkering)
              </aegon-checkbox>
            </span>
          </div>
          <div class="field" *ngIf="deathBenefit">
            <div class="label">Geboortedatum partner</div>
            <div class="inputs">
              <aegon-input-date [(ngModel)]="partnerBirthDate"></aegon-input-date>
            </div>
          </div>
          <p class="error" *ngIf="partnerBirthDateError">
            U heeft gekozen voor een partneruitkering bij overlijden. Voer een geldige geboortedatum in voor uw partner.
          </p>
          <div class="field">
            <div class="label">
              Ingangsdatum pensioenuitkering
              <aegon-help>
                U ontvangt de pensoenuitkering altijd achteraf, aan het einde van de maand.
              </aegon-help>
            </div>
            <div class="inputs">
              <select [ngModel]="startingDate" (change)="startingDate = $event.target.value">
                <option value="" disabled selected>Maak uw keuze</option>
                <option *ngFor="#date of startingDateChoices" [value]="date.value">{{date.label}}</option>
              </select>
            </div>
          </div>
          <p class="error" *ngIf="startingDateError">
            U moet een ingangsdatum kiezen.
          </p>

          <button class="button icon-right icon-calculator" [disabled]="pendingCount > 0" [ngClass]="{pending: pendingCount > 0}" (click)="submit('MockURL', '')">
            Bereken
          </button>
        </div>
      </div>
      <div class="result" *ngIf="linearAmount && highLowFirstAmount">
        <div class="linear">
          <div class="row">
            <span class="label">Pensioenuitkering</span>
            <span class="value"><span class="currency">€</span> <span class="amount">{{linearAmount | money}}</span> bruto p/mnd</span>
          </div>
          <div *ngIf="deathBenefitAmount" class="row">
            <span class="label">Uitkering bij overlijden</span>
            <span class="value"><span class="currency">€</span> <span class="amount">{{deathBenefitAmount | money}}</span> bruto p/mnd</span>
          </div>
        </div>
        <div class="high-low">
          <div class="row">
            <span class="label">Hoog-laag-uitkering*</span>
            <span class="value">
              <span class="currency">€</span> <span class="amount">{{highLowFirstAmount | money}}</span> eerste 5 jaar<br>
              <span class="currency">€</span> <span class="amount">{{highLowSecondAmount | money}}</span> na 5 jaar
            </span>
          </div>
          <div *ngIf="deathBenefitAmount" class="row">
            <span class="label">Hoog-laag-uitkering bij overlijden*</span>
            <span class="value">
              <span class="currency">€</span> <span class="amount">{{highLowDeathBenefitAmount | money}}</span> eerste 5 jaar<!--TODO shouldn't this be bruto p/mnd?-->
            </span>
          </div>
        </div>
        <div *ngIf="storedInAegon" class="footer">
          Uw pensioen komt vrij <strong>bij Aegon</strong>.<br>
          U krijgt binnen [periode]<!-- TODO --> automatisch per brief van ons een offerte.
        </div>
        <div *ngIf="!storedInAegon" class="footer">
            <ul class="arrow">
                <li><a href="#TODO">Vraag een adviesgesprek aan</a></li>
            </ul>
            <button class="button orange icon-right arrow">Vrijblijvende offerte</button>
        </div>
      </div>
    </div>
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
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
                "BEDRAG": "1201.32"
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
      this.highLowFirstAmount = String(hlAmount);
    }
    this.pendingCount -= 1;
  }
}
