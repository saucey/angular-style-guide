import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

@Component({
  selector: 'aegon-input-date',
  template: `
    <span>
      <input placeholder="dd" type="text" [required]="required" [ngModel]="day"
             (ngModelChange)="changeDay($event) && monthEl.focus()" (blur)="day = format(day, 2)">
    </span>
    <span>
      <input #monthEl placeholder="mm" type="text" [required]="required" [ngModel]="month"
             (ngModelChange)="changeMonth($event) && yearEl.focus()" (blur)="month = format(month, 2)">
    </span>
    <span>
      <input #yearEl placeholder="jjjj" type="text" [required]="required" [ngModel]="year"
             (ngModelChange)="changeYear($event)" (blur)="year = format(year, 4)">
    </span>
  `
})
export class InputDateComponent {
  @Input() required: boolean;
  day: string;
  month: string;
  year: string;

  @Output() modelChange: any = new EventEmitter();

  sanitize(value: string, maxLength: number): string {
    return value.replace(/\D/g, '').substr(0, maxLength);
  }

  format(value: any, length): string {
    value = parseInt(value, 10);
    if (!value) {
      return null;
    }
    value = String(value);
    return value.length >= length ?
      value.substr(0, length) :
      new Array(length - value.length + 1).join('0') + value;
  }

  changeDay(value: string): boolean {
    this.day = value;
    value = this.sanitize(value, 2);
    // Use timeout to let change detector pick up the change.
    setTimeout(() => {this.day = value;}, 0);
    this.emitChange({day: value});
    return value.length === 2;
  }

  changeMonth(value: string): boolean {
    this.month = value;
    value = this.sanitize(value, 2);
    // Use timeout to let change detector pick up the change.
    setTimeout(() => {this.month = value;}, 0);
    this.emitChange({month: value});
    return value.length === 2;
  }

  changeYear(value: string): void {
    this.year = value;
    value = this.sanitize(value, 4);
    // Use timeout to let change detector pick up the change.
    setTimeout(() => {this.year = value;}, 0);
    this.emitChange({year: value});
  }

  emitChange(params: any): void {
    let day: string = params.day || this.day,
      month: string = params.month || this.month,
      year: string = params.year || this.year,
      dayNum: number = parseInt(day, 10),
      monthNum: number = parseInt(month, 10) - 1,
      yearNum: number = parseInt(year, 10),
      date: Date = new Date(yearNum, monthNum, dayNum),
      modelValue: string;
    if (date.getDate() === dayNum && date.getMonth() === monthNum && date.getFullYear() === yearNum) {
      modelValue = `${this.format(year, 4)}-${this.format(month, 2)}-${this.format(day, 2)}`;
    }
    this.modelChange.emit(modelValue);
  }

  setValue(value: any): void {
    if (value) {
      let tokens: string[] = value.split('-');
      this.day = tokens[0];
      this.month = tokens[1];
      this.year = tokens[2];
    } else {
      this.day = this.month = this.year = null;
    }
  }
}

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => InputDateValueAccessor), multi: true}));

@Directive({
  selector: 'aegon-input-date',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class InputDateValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: InputDateComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
