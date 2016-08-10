import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => InputRadioComponent), multi: true}));

@Component({
  selector: 'aa-input-radio',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: `
    <label class="radio">
      <input type="radio" [name]="name" (click)="setValue(value)">
      <span class="radio"></span>
      <ng-content></ng-content>
    </label>
  `
})
export class InputRadioComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input() name: any;

  @Output() modelChange: any = new EventEmitter();
  @Output() aaChange: any = new EventEmitter();

  model: boolean;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  setValue(value) {
    this.model = value;
  }

  writeValue(value: any) : void {
    this.model = value;
  }
}
