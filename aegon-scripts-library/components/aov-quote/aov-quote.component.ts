import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";
import {SoloSliderComponent, SoloSliderValueAccessor} from "../angular-components/solo-slider.component";
import {InputRadioComponent, InputRadioValueAccessor} from '../angular-components/input-radio.component';
import {InputChoiceDropDownComponent} from "../angular-components/input-choice-dropdown.component";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));



var dummyProfessions = {
  "retrieveProfessionsResponse": {
    "PROCES": {
      "STATUS": "MS000",
      "VOLGNUM": "1",
      "STATUST": "Success"
    },
    "AILHEADER": {
      "CLIENTID": "A2T1 HappyFlow",
      "CORRELATIONID": "##BS_AE_POLIS_AOV_02##Mon Aug 08 12:49:39 BST 2016##"
    },
    "_AE_BEROEPENLIJST_AOV": [
      {
        "_AE_BRPNAAM": "Aannemer",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "1",
        "_AE_BRPSUBNM": "Aannemer",
        "BKLASSE": "4",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Aannemer",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "723",
        "_AE_BRPSUBNM": "Aannemer commercieel, leidinggevend",
        "BKLASSE": "2"
      },
      {
        "_AE_BRPNAAM": "Kweker",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "387",
        "_AE_BRPSUBNM": "Aardbeienkweker (kassen)",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Kweker",
        "_AE_BKLSMIN": "3.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "401",
        "_AE_BRPSUBNM": "Aardbeienkweker (koude grond)",
        "BKLASSE": "4",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Aardewerkdecorateur",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "2",
        "_AE_BRPSUBNM": "Aardewerkdecorateur",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Accountmanager",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "5",
        "_AE_BRPSUBNM": "Account-manager",
        "BKLASSE": "1",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Accountant",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "3",
        "_AE_BRPSUBNM": "Accountant",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Accountant",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "4",
        "_AE_BRPSUBNM": "Accountant - Administratie consultant",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Acquisiteur",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "6",
        "_AE_BRPSUBNM": "Acquisiteur",
        "BKLASSE": "2",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Acrobaat",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "7",
        "_AE_BRPSUBNM": "Acrobaat",
        "BKLASSE": "0",
        "_AE_BRPOPM": "Niet acceptabel"
      },
      {
        "_AE_BRPSUBNM": "Acteur",
        "_AE_BRPNAAM": "Acteur",
        "_AE_BKLSMAX": "4.0",
        "_AE_MINWTTD": "90",
        "_AE_BRPOPM": "Acceptatie in overleg met maatschappij",
        "BKLASSE": "3",
        "_AE_BRPCODE": "8",
        "_AE_BKLSVAST": "N",
        "_AE_BKLSMIN": "3.0"
      },
      {
        "_AE_BRPNAAM": "Actuarieel medewerker",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "9",
        "_AE_BRPSUBNM": "Actuarieel medewerker",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Actuarieel rekenaar",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "10",
        "_AE_BRPSUBNM": "Actuarieel rekenaar",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Actuaris",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "11",
        "_AE_BRPSUBNM": "Actuaris",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Acupuncturist",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "12",
        "_AE_BRPSUBNM": "Acupuncturist (geen arts)",
        "BKLASSE": "0",
        "_AE_BRPOPM": "Niet acceptabel"
      },
      {
        "_AE_BRPNAAM": "Acupuncturist",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "13",
        "_AE_BRPSUBNM": "Acupuncturist (tevens arts)",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Administrateur",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "14",
        "_AE_BRPSUBNM": "Administrateur",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Winkelier",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "695",
        "_AE_BRPSUBNM": "Winkelier slijterij",
        "BKLASSE": "2",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Winkelier",
        "_AE_BKLSMIN": "3.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "703",
        "_AE_BRPSUBNM": "Winkelier wild en gevogelte",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Winkelier",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "704",
        "_AE_BRPSUBNM": "Winkelier witgoed",
        "BKLASSE": "2"
      },
      {
        "_AE_BRPNAAM": "Woninginrichter",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "709",
        "_AE_BRPSUBNM": "Woninginrichter",
        "BKLASSE": "4",
        "_AE_MAXENDLF": "60",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Stoffeerder",
        "_AE_BKLSMIN": "3.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "588",
        "_AE_BRPSUBNM": "Woningstoffeerder",
        "BKLASSE": "5",
        "_AE_MAXENDLF": "60"
      },
      {
        "_AE_BRPNAAM": "Leraar",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "424",
        "_AE_BRPSUBNM": "Yogaleraar",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Teler",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "606",
        "_AE_BRPSUBNM": "Zaadteler (kassen)",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Zadelmaker",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "712",
        "_AE_BRPSUBNM": "Zadelmaker",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Zanger",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "713",
        "_AE_BRPSUBNM": "Zanger",
        "BKLASSE": "3",
        "_AE_BRPOPM": "Acceptatie in overleg met maatschappij",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Leraar",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "423",
        "_AE_BRPSUBNM": "Zangleraar",
        "BKLASSE": "2",
        "_AE_BKLSMAX": "2.0"
      },
      {
        "_AE_BRPNAAM": "Zangpedagoog",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "715",
        "_AE_BRPSUBNM": "Zangpedagoog",
        "BKLASSE": "2",
        "_AE_BKLSMAX": "2.0"
      },
      {
        "_AE_BRPNAAM": "Visser",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "716",
        "_AE_BRPSUBNM": "Zeevisser",
        "_AE_MINWTTD": "90",
        "BKLASSE": "4",
        "_AE_MAXENDLF": "60",
        "_AE_BRPOPM": "Alleen acceptabel voor exploitant of mede-exploitant"
      },
      {
        "_AE_BRPNAAM": "Zeilmaker",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "717",
        "_AE_BRPSUBNM": "Zeilmaker",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Zenuwarts",
        "_AE_BKLSVAST": "J",
        "_AE_BRPCODE": "718",
        "_AE_BRPSUBNM": "Zenuwarts",
        "BKLASSE": "1"
      },
      {
        "_AE_BRPNAAM": "Beveiligingsbeambte",
        "_AE_BKLSMIN": "3.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "98",
        "_AE_BRPSUBNM": "beveiligingsbeambte",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Bromfiets- en rijwielhersteller",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "125",
        "_AE_BRPSUBNM": "bromfiets- en rijwielhersteller",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Bakker",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "66",
        "_AE_BRPSUBNM": "broodbakker",
        "BKLASSE": "3",
        "_AE_MAXENDLF": "60",
        "_AE_BKLSMAX": "4.0"
      },
      {
        "_AE_BRPNAAM": "Handelaar",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "247",
        "_AE_BRPSUBNM": "fruithandelaar (detailhandel)",
        "BKLASSE": "3",
        "_AE_BKLSMAX": "3.0"
      },
      {
        "_AE_BRPNAAM": "Winkelier",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "659",
        "_AE_BRPSUBNM": "winkelier in banket/brood",
        "BKLASSE": "2"
      },
      {
        "_AE_BRPNAAM": "Winkelier",
        "_AE_BKLSMIN": "2.0",
        "_AE_BKLSVAST": "N",
        "_AE_BRPCODE": "700",
        "_AE_BRPSUBNM": "winkelier in videos",
        "BKLASSE": "2",
        "_AE_BKLSMAX": "3.0"
      }
    ]
  }
};

var dummyRiskFactor = {
  "calculateRiskFactorResponse": {
    "_AE_RISICOKLASSE_AOV": {
      "_AE_RISKKLASSE": "3.5"
    },
    "PROCES": {
      "STATUS": "MS000",
      "VOLGNUM": "1",
      "STATUST": "Success"
    },
    "AILHEADER": {
      "CLIENTID": "RCAL",
      "CORRELATIONID": "## batch 7 ##"
    }
  }
}





@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor, SoloSliderComponent, SoloSliderValueAccessor, InputRadioComponent, InputRadioValueAccessor,
    InputChoiceDropDownComponent
  ],
  template: templateElem ? templateElem.value : `
  <div class="quickquote angular aov-quote">
    <section class="personal-details" *ngIf="page !== 'summary'">
      
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
          <aegon-input-choice-dropdown
            [model]="profession"
            [items]="professionsFiltered"
            [emptyMessage]="'Er zijn geen beroepen gevonden'"
            [minChars]="2"
            (aaFetch)="fetchProfessions($event)"
            (aaSelect)="selectProfession($event)">
          </aegon-input-choice-dropdown>
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
          <aegon-input-number [(ngModel)]="grossIncome" prefix="€" [max]="1000000"></aegon-input-number>
        </div>
      </div>
      <p class="error" *ngIf="grossIncomeError">
        Geef hier uw bruto jaarinkomen op. Deze moet minimaal €3.125 zijn. U kunt 80% van uw inkomen voor 
        arbeidsongeschiktheid verzekeren.
      </p>
            
      <div class="field gray-field" *ngIf="!showCalculator">
        <div class="label"></div>
        <div class="inputs">
          <button class="button icon-right icon-calculator" (click)="showCalculation()">
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
            Na welk termijn wilt u dat u uitkering start?
            <aegon-help>
              Maak uw beroepskeuze
            </aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-radio name="startingTerm">2 weken </aegon-input-radio>
            <aegon-input-radio name="startingTerm">1 maand</aegon-input-radio>
            <aegon-input-radio name="startingTerm">3 maanden</aegon-input-radio>
            <aegon-input-radio name="startingTerm">1 jaar</aegon-input-radio>
          </div>
        </div>
        <div class="field">
          <div class="label">
            Welk bruto jaarbedrag wilt u verzekeren?
            <aegon-help>Help !</aegon-help>
          </div>
          <div class="inputs">
            <aegon-input-number prefix="€" [(ngModel)]="grossYearAmount" [max]="99999999"></aegon-input-number>
          </div>
          <aegon-solo-slider prefix="€" [(ngModel)]="grossYearAmount" [range]="{
            'min': [  minGrossYearAmount ],
            '25%': [  1000 ],
            '50%': [ 2000 ],
            '75%': [  3000 ],
            'max': [ 999999 ]
          }">
          </aegon-solo-slider>
          <div class="min">&euro; {{minGrossYearAmount}}</div>
          <div class="max">&euro; {{maxGrossYearAmount}}</div>
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
            <a href="#" class="icon-skinnyarrow" (click)="showSummary()">
              Bekijk en mail overzicht
            </a>
          </div>
        </div>
      </div>
    </section>
    
    
    <div id="aov-quote-summary" *ngIf="page === 'summary'">
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
export class AovQuoteComponent implements OnInit {
  @Input()  public  page: string;
  @Input()  private mailUrl: string;
  @Input()  private serviceCredentials: string = 'appAegonNLCalculateTST:7OuwNNTVS4jJ8mO5F0bH';
  @Input()  private serviceUrl: string = 'http://ail.test.intra.aegon.nl/US_RestGatewayWeb/rest/requestResponse/BS_AE_POLIS_AOV_02/';
  @Input()  private summaryPath: string = '';

  public  showCalculator: boolean;
  public  grossYearAmount: number = 17500;
  public  minGrossYearAmount: number = 700;
  public  maxGrossYearAmount: number = 35000;

  public  birthDate: string;
  public  birthDateError: boolean;
  public  professionError: boolean;
  public  grossIncome: number;
  public  grossIncomeError: boolean;
  public  startingTerm: string;
  public  startingTermError: boolean;
  public  insuranceAmount: number;
  public  insuranceAmountError: boolean;
  public  emailAddress: string = "";
  public  emailAddressError: boolean;
  public  emailButtonPending: boolean = false;
  public  grossMonthly: number;
  public  netMonthly: number;
  public  reSendEmailShown: boolean = false;

  public  profession: any = {};
  public  professions: any[] = [];
  public  professionsFiltered: any[] = [];
  private rawProfessions: any = {};

  public  riskFactor: any = {};

  public  serviceError: boolean;


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
    return Observable.throw('Server error');
  }

  processProfessions(response) {
    if (response.retrieveProfessionsResponse &&
        response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
      for (let prof of response.retrieveProfessionsResponse._AE_BEROEPENLIJST_AOV) {
        this.rawProfessions[prof._AE_BRPCODE] = prof;
        this.professions.push({key: prof._AE_BRPCODE, label: prof._AE_BRPSUBNM || prof._AE_BRPNAAM})
      }
    }
  }

  initProfessions() {
    this.serviceError = false;

    if (dummyProfessions) {
      this.processProfessions(dummyProfessions);
      return;
    }

    let body = {
      "retrieveProfessionsRequest": {
        "AILHEADER": { "CLIENTID": "A2T1 HappyFlow" }
      }
    };

    let headers = new Headers({'Content-Type': 'application/json', "Authorization" : `Basic ${this.serviceCredentials}`});
    let options = new RequestOptions({headers: headers});

    // Calculate and riskfactor
    this.http.post(this.serviceUrl + 'retrieveProfessions', JSON.stringify(body), options)
      .map(res => res.json())
      .catch(this.handleError)
      .subscribe(data => {
        this.processProfessions(data);
      }, error => console.log(error));
  }

  validatePersonalInformation(): boolean {
    let hasErrors: boolean = false;

    this.birthDateError = false;
    this.professionError = false;
    this.grossIncomeError = false;

    // Calculate age.
    let age = 0;
    if (this.birthDate) {
      let bd: string[] = this.birthDate.split("-");
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

    if (!this.birthDate || age < 18 || age > 59 ) {
      this.birthDateError = true;
      hasErrors = true;
    }

    if (!this.profession) {
      this.professionError = true;
      hasErrors = true;
    }

    if (!this.grossIncome || (this.grossIncome && this.grossIncome < 3125 && this.grossIncome > 1000000)) {
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

  showCalculation() {
    // Show the next steps that the user needs to fill in.
    if (this.validatePersonalInformation()) {
      this.showCalculator = true;

      this.fetchCalculationSpecification();
    }
  }

  showSummary() {
    // This needs to redirect to another page. use this.summaryPath
    this.page = 'summary';
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
          "_AE_RISICOKLASSE_AOV": {
            "PERREIS": "20",
            "PERHAND": "80",
            "_AE_OPLHBOWO": "true",
            "PERADM": "2"
          }
        }
      }
    };

    if (rawProfession) {

      if (rawProfession.BKLASSE) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['BKLASSE'] = rawProfession.BKLASSE;
      }
      if (rawProfession._AE_BKLSMIN) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMIN'] = rawProfession._AE_BKLSMIN;
      }
      if (rawProfession._AE_BKLSMAX) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMAX'] = rawProfession._AE_BKLSMAX;
      }
      if (rawProfession._AE_BKLSVAST) {
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

  fetchCalculationSpecification() {
    if (this.riskFactor) {
      let body = {
      "calculateRiskFactorRequest": {
        "AILHEADER": {
          "CLIENTID": "RCAL",
          "CORRELATIONID": "## batch 7 ##"
        },
        "_AE_BEROEPENLIJST_AOV": {
          "_AE_RISICOKLASSE_AOV": {
            "PERREIS": "20",
            "PERHAND": "80",
            "_AE_OPLHBOWO": "true",
            "PERADM": "2"
          }
        }
      }
    };

    if (rawProfession) {

      if (rawProfession.BKLASSE) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['BKLASSE'] = rawProfession.BKLASSE;
      }
      if (rawProfession._AE_BKLSMIN) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMIN'] = rawProfession._AE_BKLSMIN;
      }
      if (rawProfession._AE_BKLSMAX) {
        body.calculateRiskFactorRequest._AE_BEROEPENLIJST_AOV['_AE_BKLSMAX'] = rawProfession._AE_BKLSMAX;
      }
      if (rawProfession._AE_BKLSVAST) {
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
    // TODO look at quickquote dip, it has a http.post example.

    this.emailButtonPending = true;
    if(!this.validateEmail()) {
      this.reSendEmailShown = true;
    }
    this.emailButtonPending = false;
  }
}
