import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

@Component({
  selector: 'aegon-input-choice-dropdown',
  template: `
    <span class="input choice-dropdown">
      <input #inputEl type="text" [attr.placeholder]="placeholder" [required]="required"
             [ngModel]="label" (ngModelChange)="goFetch($event)" (focus)="focus.emit()" (blur)="blur.emit()">
      <ul class="choice-dropdown-choices" *ngIf="fetchValue && fetchValue.length >= minChars">
        <li *ngIf="!items && emptyMessage">{{emptyMessage}}</li>
        <li class="choice-dropdown-choice" *ngFor="#item of items" (click)="select(item)">{{item.label}}</li>
      </ul>
    </span>
  `
})
export class InputChoiceDropDownComponent {
  @Input()  required: boolean;
  @Input()  placeholder: string;
  @Input()  emptyMessage: string;
  @Input()  items: string[] = [];
  @Input()  minChars: number = 2;

  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() fetch: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputEl') inputEl: ElementRef;

  public label: string;
  public model: string;
  public fetchValue: string;

  goFetch(value) {
    this.fetchValue = value;
    this.modelChange.emit(null);
    if (value.length >= this.minChars) {
      this.fetch.emit(value)
    }
  }

  select(value) {
    this.model = value;
    this.label = value.label;
    this.modelChange.emit(value);
    this.items = [];
  }

  setValue(value) {
    if (value && value.label) {
      this.model = value;
      this.label = value.label;
    } else {
      this.model = null;
      this.label = null;
    }

  }
}

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => InputChoiceDropDownValueAccessor), multi: true}));

@Directive({
  selector: 'aegon-input-choice-dropdown',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class InputChoiceDropDownValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: InputChoiceDropDownComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
