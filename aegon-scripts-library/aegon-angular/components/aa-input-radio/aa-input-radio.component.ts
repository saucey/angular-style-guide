import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

// Locals
import {template} from "./template";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AAInputRadioComponent),
  multi: true
};

@Component({
  selector: 'aa-input-radio',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})
export class AAInputRadioComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input() name: any;

  // When updating to a newer version of angular the aaChange can be removed.
  // The way to go is using the ngModelChange event.
  @Output() aaChange: any = new EventEmitter();
  @Output() modelChange: any = new EventEmitter();

  model: any;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // Model update
  writeValue(value: any) : void {
    this.model = value;
  }
  setValue(value) {
    this.model = value;
    this.modelChange.emit(value);

    setTimeout(() => {
      // When updating to a newer version of angular the aaChange can be removed.
      // The way to go is using the ngModelChange event.
      this.aaChange.emit(value);
    });
  }
}
