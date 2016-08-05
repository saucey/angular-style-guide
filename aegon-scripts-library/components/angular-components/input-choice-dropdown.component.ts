import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";

@Component({
  selector: 'aegon-input-choice-dropdown',
  template: `
    <span class="input choice-dropdown">
      <input #inputEl type="text" [attr.placeholder]="placeholder" [attr.required]="required"
             [ngModel]="model" (ngModelChange)="modelChange($event)">
      <ul class="choice-dropdown-choices" *ngIf="enabled && fetchValue.length >= minChars">
        <li *ngIf="!items && emptyMessage">{{emptyMessage}}</li>
        <li class="choice-dropdown-choice" *ngFor="#item of items" (click)="select(item)">{{item}}</li>
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
  @Input()  model: any;

  @Output() aaSelect: EventEmitter<any> = new EventEmitter();
  @Output() aaFetch: EventEmitter<any> = new EventEmitter();

  @ViewChild('inputEl') inputEl: ElementRef;

  public prevValue: string;
  public fetchValue: string = '';
  public enabled: boolean = true;

  modelChange(value) {
    if (value !== this.prevValue) {
      this.enabled = true;
      this.prevValue = value;

      if (this.model) {
        this.aaSelect.emit(null);
      }

      // Set fetch values
      this.fetchValue = value;
      if (value.length >= this.minChars) {
        this.aaFetch.emit(value)
      }
    }
  }

  select(value) {
    this.enabled = false;
    this.fetchValue = value;
    this.aaSelect.emit(value);
    this.items = [];
  }
}