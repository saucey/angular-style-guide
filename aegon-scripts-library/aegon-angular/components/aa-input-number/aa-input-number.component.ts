/**
 * A number input control that validates input
 * It has min-max validation and prefix/postfix content
 */
import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef
} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import * as libFormat from "../../lib/format";
// Locals
import {template} from "./template";

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => AAInputNumberComponent), multi: true}));

@Component({
  selector: 'aa-input-number',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})
export class AAInputNumberComponent implements ControlValueAccessor {
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() forceDecimals: any;
  @Input() required: boolean;
  @Input() max: number;
  @Input() placeholder: string;
  @Input() defaultValue: string = '0';
  @Input() inputId: string = 'input-' + (new Date().getTime()).toString(36);  // Create unique id for input field

  @Output() modelChange: any = new EventEmitter();
  @Output() focus: any = new EventEmitter();
  @Output() blur: any = new EventEmitter();
  @Output() enter: any = new EventEmitter();

  @ViewChild('inputEl') inputEl: ElementRef;

  model: string;
  internalValue: number;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // Model change
  writeValue(value: any) : void {
    this.internalValue = value;
    this.model = value && libFormat.formatNumber(value) || this.defaultValue;
  }

  /**
   * Main component
   */
  constructor() {
    // Check if forceDecimals is set and transforme it
    // to boolean.
    if (this.forceDecimals !== undefined) {
      this.forceDecimals = Boolean(parseInt(this.forceDecimals));
    } else {
      this.forceDecimals = false;
    }
  }
  // Select the actual input element
  select(): void {
    this.inputEl.nativeElement.select();
  }
  // Format the input number and blur the input element
  formatAndBlur(): void {
    this.model = libFormat.formatNumber(libFormat.parseNumber(this.model), true, this.forceDecimals);
    this.updateExternalModel();
    this.blur.emit();
  }
  // Value change callback
  changeValue(value) {
    let num = libFormat.parseNumber(value),
      commaIndex, fractionalPart, formatted;
    if (this.max) {
      num = Math.min(num, this.max);
    }
    commaIndex = value.lastIndexOf(',');
    fractionalPart = commaIndex > -1 ? ',' + value.substr(commaIndex + 1).replace(/\D/g, '') : '';
    formatted = num ? libFormat.formatNumber(num, false) + fractionalPart : '';
    this.internalValue = num;
    // We're using a timeout, so the change detector detects a change in the model.
    setTimeout(() => {
      this.model = formatted;
      this.updateExternalModel();
    });
  }
  // Change callback
  updateExternalModel() {
    this.modelChange.emit(this.internalValue);
  }
  // Only accept numeric values.
  keydown(event: KeyboardEvent): void {
    let kc = event.keyCode;
    if ((kc > 57 && kc < 96) || kc > 105 ) {
      // No numeric char, so cancel.
      event.preventDefault();
      return;
    }
  }
}
