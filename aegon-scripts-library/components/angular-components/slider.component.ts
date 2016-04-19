import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef
} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import {InputMoneyComponent, InputMoneyValueAccessor} from './input-money.component';
import {HelpComponent} from './help.component'
@Component({
  selector: 'aegon-slider',
  directives: [
    HelpComponent, InputMoneyComponent,InputMoneyValueAccessor
  ],
  template: `
    <div class="one-off slider">
      <div class="input-header">
        <label for="one-off-input">Eerste eenmalige inleg</label>

        <div class="input-container">
          <aegon-input-money id="one-off-input" #amountInput currency="€" [(ngModel)]="pensionAmount" [max]="99999999"
                               (focus)="amountTooSmall = false; amountInput.select()" (blur)="isValidAmount()"
                               (enter)="submitAmount()" [placeholder]="'minimaal 25.000'">
            </aegon-input-money>
        </div>
        <aegon-help>
          Dit is de tekst die in het vraagtekentje komt te staan.
        </aegon-help>
      </div>
      <div class="slider-container">
        <div id="one-off-slider" class="noUi-extended"></div>
        <span id="one-off-error" class="errorMessage">Vul een bedrag in tussen de &euro;0,- en &euro;5000,-</span>
      </div>
    </div>
  `
})
export class SliderComponent {
  @Input() currency: string;
  @Input() required: boolean;
  @Input() max: number;
  @Input() placeholder: string;

  @Output() modelChange: any = new EventEmitter();
  @Output() focus: any = new EventEmitter();
  @Output() blur: any = new EventEmitter();
  @Output() enter: any = new EventEmitter();

  @ViewChild('inputEl') inputEl:ElementRef;

  model: string;

  //select(): void {
  //  this.inputEl.nativeElement.select();
  //}
  //
  //formatAndBlur(): void {
  //  this.model = formatNumber(parseNumber(this.model));
  //  this.blur.emit();
  //}
  //
  //changeValue(value) {
  //  let num = parseNumber(value),
  //    commaIndex, fractionalPart, formatted;
  //  if (this.max) {
  //    num = Math.min(num, this.max);
  //  }
  //  commaIndex = value.lastIndexOf(',');
  //  fractionalPart = commaIndex > -1 ? ',' + value.substr(commaIndex + 1).replace(/\D/g, '') : '';
  //  formatted = num ? formatNumber(num, false) + fractionalPart : '';
  //  this.model = value;
  //  this.modelChange.emit(num);
  //  // We're using a timeout, so the change detector detects a change in the model.
  //  setTimeout(() => {this.model = formatted;}, 0);
  //}
  //
  //setValue(value) {
  //  this.model = value && formatNumber(value) || '';
  //}
}
