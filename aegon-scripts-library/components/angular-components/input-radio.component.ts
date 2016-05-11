import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

@Component({
  selector: 'aegon-input-radio',
  template: `
    <label class="radio">
      <input type="radio" [name]="name" (click)="setValue(value)">
      <span class="radio"></span>
      <ng-content></ng-content>
    </label>
  `
})
export class InputRadioComponent {
  @Output() modelChange: any = new EventEmitter();
  @Output() change: any = new EventEmitter();
  @Input() value: any;
  @Input() name: any;
  model: boolean;

  setValue(value) {
    this.model = value;
  }
}

const RADIO_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => InputRadioValueAccessor), multi: true}
));

@Directive({
  selector: 'aegon-input-radio',
  host: {'(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()'},
  bindings: [RADIO_VALUE_ACCESSOR]
})
export class InputRadioValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: InputRadioComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }
  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }
}
