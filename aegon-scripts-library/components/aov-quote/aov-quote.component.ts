import {Component, OnInit, Input} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions, Response} from "angular2/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HelpComponent} from '../angular-components/help.component'
import {InputNumberComponent, InputNumberValueAccessor, formatNumber} from '../angular-components/input-number.component';
import {InputDateComponent, InputDateValueAccessor} from '../angular-components/input-date.component';
import {CheckboxComponent, CheckboxValueAccessor} from '../angular-components/checkbox.component';
import {MoneyPipe} from "../angular-components/money.pipe";

var templateElem = (<HTMLTextAreaElement>document.querySelector('#aovQuoteTemplate'));

@Component({
  selector: 'aegon-aov-quote',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor, InputDateComponent, InputDateValueAccessor,
    CheckboxComponent, CheckboxValueAccessor
  ],
  template: templateElem ? templateElem.value : `
    Hallo wereld
  `,
  providers: [HTTP_PROVIDERS],
  pipes: [MoneyPipe]
})
export class AovQuoteComponent implements OnInit {
  

  constructor(
    private http:Http
  ) {}

  ngOnInit() {
    
  }

}
