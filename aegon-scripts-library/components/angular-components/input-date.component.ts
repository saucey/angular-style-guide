import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

@Component({
  selector: 'aegon-input-date',
  template: `
    <span class="input date">
      <input #dayEl class="day" placeholder="dd" [required]="required" [ngModel]="day"
             type="number" min="0" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('day', $event)"
             (focus)="dayEl.select()" (input)="keyup('day', $event)" (blur)="day = format(day, 2)">
      <input #monthEl class="month" placeholder="mm" [required]="required" [ngModel]="month"
             type="number" min="0" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('month', $event)"
             (focus)="monthEl.select()" (input)="keyup('month', $event)" (blur)="month = format(month, 2)">
      <input #yearEl class="year" placeholder="jjjj" [required]="required" [ngModel]="year"
             type="number" min="0" max="9999" maxLength="4" inputmode="numeric" pattern="[0-9]*"
             (keydown)="keydown($event)" (keyup)="keyup('year', $event)"
             (focus)="yearEl.select()" (input)="keyup('year', $event)" (blur)="year = format(year, 4)">
    </span>
  `
})
export class InputDateComponent {
  @Input() required: boolean;
  @ViewChild('monthEl') monthEl: ElementRef;
  @ViewChild('yearEl') yearEl: ElementRef;
  day: string;
  month: string;
  year: string;

  @Output() modelChange: any = new EventEmitter();

  keydown(event: KeyboardEvent): void {
    if (event.keyCode > 57) {
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
