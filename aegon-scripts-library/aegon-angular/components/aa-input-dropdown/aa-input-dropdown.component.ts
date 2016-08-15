import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
// Locals
import {template} from "./template";

@Component({
  selector: 'aa-input-dropdown',
  template: template
})
export class AAInputDropDownComponent {
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