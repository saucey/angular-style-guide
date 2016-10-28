import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { template } from "./template";

// Locals

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AAInputSwitchComponent),
  multi: true
};

@Component({
  selector: 'aa-input-switch',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})
export class AAInputSwitchComponent implements ControlValueAccessor {
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
  onChange = (_) => {
  };
  onTouched = () => {
  };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Model update
  writeValue(value: any): void {
    this.model = value;
  }

  toggle() {
    this.model = !this.model;
    this.modelChange.emit(this.model);

    setTimeout(() => {
      // When updating to a newer version of angular the aaChange can be removed.
      // The way to go is using the ngModelChange event.
      this.aaChange.emit(this.model);
    });
  }
}
