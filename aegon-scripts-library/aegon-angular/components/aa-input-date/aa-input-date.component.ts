import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import {template} from "./template";

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => AAInputDateComponent), multi: true}));

@Component({
  selector: 'aa-input-date',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})
export class AAInputDateComponent implements ControlValueAccessor {
  @Input() required: boolean;
  @Output() modelChange: any = new EventEmitter();

  @ViewChild('monthEl') monthEl: ElementRef;
  @ViewChild('yearEl') yearEl: ElementRef;

  model: string;

  day: string;
  month: string;
  year: string;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  writeValue(value: any) : void {
    this.setValue(value);
  }

  constructor() {}

  keydown(event: KeyboardEvent): void {
    let kc = event.keyCode;
    if ((kc > 57 && kc < 96) || kc > 105 ) {
      // No numeric char, so cancel.
      event.preventDefault();
      return;
    }
  }

  keyup(part: string, event: KeyboardEvent): void {
    let value: string = (<HTMLInputElement>event.target).value,
      change: any = {};
    // Avoid typing more numbers than allowed.
    if (value.length > 4 && part === 'year') {
      value = value.substring(0, 4);
      this.yearEl.nativeElement.value = value;
    }
    this[part] = change[part] = value;
    this.emitChange(change);
    if (value.length === 2 &&
      (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105)) {
      // Only when number is entered.
      if (part === 'day') {
        this.monthEl.nativeElement.focus();
      }
      else if (part === 'month') {
        this.yearEl.nativeElement.focus();
      }
    }
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
      this.year = tokens[0];
      this.month = tokens[1];
      this.day = tokens[2];
    } else {
      this.day = this.month = this.year = null;
    }
  }
}
