import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
// Locals
import {template} from "./template";

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {
      useExisting: forwardRef(() => AAInputRadioComponent),
      multi: true
    })
  );

@Component({
  selector: 'aa-input-radio',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})
export class AAInputRadioComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input() name: any;

  @Output() modelChange: any = new EventEmitter();
  @Output() aaChange: any = new EventEmitter();

  model: any;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // Modal update
  writeValue(value: any) : void {
    this.model = value;
  }
  setValue(value) {
    this.model = value;
  }

}
