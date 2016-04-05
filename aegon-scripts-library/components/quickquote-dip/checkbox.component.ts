import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

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

  model: boolean;

  toggle() {
    this.model = !this.model;
    this.modelChange.emit(this.model);
  }

  setValue(value) {
    this.model = value;
  }
}

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => CheckboxValueAccessor), multi: true}));

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
