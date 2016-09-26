import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

@Component({
  selector: 'aegon-checkbox',
  template: `
    <label class="checkbox">
      <input type="checkbox" [checked]="model" (click)="toggle()">
      <span class="checkbox"></span>
      <ng-content></ng-content>
    </label>
  `
})
export class CheckboxComponent {
  @Output() modelChange: any = new EventEmitter();
  @Output() change: any = new EventEmitter();

  model: boolean;

  toggle() {
    this.model = !this.model;
    this.modelChange.emit(this.model);
    setTimeout(() => {
      this.change.emit(this.model);
    });
  }

  setValue(value) {
    this.model = value;
  }
}

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxValueAccessor),
  multi: true
};

@Directive({
  selector: 'aegon-checkbox',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class CheckboxValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: CheckboxComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
