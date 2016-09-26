import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

// TODO Remove me, i am replaced by aegon-angular aa-input-dropdown

@Component({
  selector: 'aegon-input-choice-dropdown',
  template: `
    <span class="input choice-dropdown" #dropDownEl>
      <input #inputEl type="text" [attr.placeholder]="placeholder" [attr.required]="required"
             [ngModel]="model.label" (ngModelChange)="modelChange($event)" (blur)="closeDropDown(dropDownEl)">
      <ul class="choice-dropdown-choices" *ngIf="enabled && fetchValue.length >= minChars">
        <li *ngIf="!items && emptyMessage">{{emptyMessage}}</li>
        <li class="choice-dropdown-choice" *ngFor="let item of items" (click)="select(item)">{{item.label}}</li>
      </ul>
    </span>
  `
})
export class InputChoiceDropDownComponent {
  @Input()  model: any;
  @Input()  required: boolean;
  @Input()  placeholder: string;
  @Input()  emptyMessage: string;
  @Input()  items: string[] = [];
  @Input()  minChars: number = 2;

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
        this.aaSelect.emit({});
      }

      // Set fetch values
      this.fetchValue = value;
      if (value.length >= this.minChars) {
        this.aaFetch.emit(value)
      }

      this.aaSelect.emit(value);
    }
  }

  select(value) {
    this.enabled = false;
    this.fetchValue = value;
    this.aaSelect.emit(value);
    this.items = [];
  }

  closeDropDown(dropDownEl) {
    if (!dropDownEl.querySelector(":hover")) {
      this.enabled = false;

    }
  }
}
