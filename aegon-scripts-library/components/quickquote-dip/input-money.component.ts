import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef
} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

function formatNumber(value: any, fractional: boolean = true): string {
  let regExp = /(\d+)(\d{3})/;
  // Round to 2 fraction digits. We don't use toFixed(), because we won't enforce the fractional part on round numbers.
  value = Math.round(parseFloat(value) * 100) / 100;
  if (isNaN(value)) {
    return '';
  }
  let tokens = String(value).split('.');
  let thousandsSeparated = tokens[0].replace(/^\d+/, (w) => {
    while (regExp.test(w)) {
      w = w.replace(regExp, '$1.$2');
    }
    return w;
  });
  if (tokens[1] && fractional) {
    let zero = tokens[1].length === 1 ? '0' : '';
    return thousandsSeparated + ',' + tokens[1] + zero;
  } else {
    return thousandsSeparated;
  }
}

function parseNumber(value: any): number {
  if (typeof value === 'number') {
    // Nothing to do.
    return value;
  }
  // Remove all dots, assuming they're thousands separators and replace comma's with dots for proper float parsing.
  value = parseFloat(value.replace(/\./g, '').replace(',', '.'));
  if (isNaN(value)) {
    return null;
  } else {
    // Round to 2 fraction digits.
    value = Math.round(parseFloat(value) * 100) / 100;
    return value;
  }
}

@Component({
  selector: 'aegon-input-money',
  template: `
    <span class="input money">
      <span class="currency">{{currency}}</span>
      <input #inputEl type="text" [required]="required" [ngModel]="model" (ngModelChange)="changeValue($event)"
             (focus)="focus.emit()" (blur)="formatAndBlur()" (keydown.enter)="enter.emit()">
    </span>
  `
})
export class InputMoneyComponent {
  @Input() currency: string;
  @Input() required: boolean;

  @Output() modelChange: any = new EventEmitter();
  @Output() focus: any = new EventEmitter();
  @Output() blur: any = new EventEmitter();
  @Output() enter: any = new EventEmitter();

  @ViewChild('inputEl') inputEl:ElementRef;

  model: string;

  select(): void {
    this.inputEl.nativeElement.select();
  }

  formatAndBlur(): void {
    this.model = formatNumber(parseNumber(this.model));
    this.blur.emit();
  }

  changeValue(value) {
    let num = parseNumber(value),
      commaIndex = value.lastIndexOf(','),
      fractionalPart = commaIndex > -1 ? ',' + value.substr(commaIndex + 1).replace(/\D/g, '') : '',
      formatted = num ? formatNumber(num, false) + fractionalPart : '';
    this.model = value;
    this.modelChange.emit(num);
    // We're using a timeout, so the change detector detects a change in the model.
    setTimeout(() => {this.model = formatted;}, 0);
  }

  setValue(value) {
    this.model = value && formatNumber(value) || '';
  }
}

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => InputMoneyValueAccessor), multi: true}));

@Directive({
  selector: 'aegon-input-money',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class InputMoneyValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: InputMoneyComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
