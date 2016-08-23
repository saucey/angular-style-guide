import {Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef} from 'angular2/core';
// Locals
import {template} from "./template";
import {isString} from "angular2/src/facade/lang";

@Component({
  selector: 'aa-input-dropdown',
  template: template
})
export class AAInputDropDownComponent {
  @Input()  model: any = {label: ''};
  @Input()  required: boolean;
  @Input()  placeholder: string;
  @Input()  emptyMessage: string;
  @Input()  items: any[] = [];
  @Input()  minChars: number = 2;

  @Output() aaSelect: EventEmitter<any> = new EventEmitter();
  @Output() aaFetch: EventEmitter<any> = new EventEmitter();

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

  blur(dropDownEl) {
    if (isString(this.model)) {
      this.items.some((item, index) => {
        if (item.label.toLowerCase() === this.model.toLowerCase()) {
          this.aaSelect.emit(item);
          return true;
        }
      });
    }
    // No item selected. If the typed text matches the label of an item, select it.
    if (!dropDownEl.querySelector(":hover")) {
      this.enabled = false;
    }
  }

  handleKey(event) {
    if (this.enabled && this.items.length > 0) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        let nextIndex: number,
            foundItemIndex: number = -1;
        if (!isString(this.model)) {
          // It's currently one of the items. Find out which one it is, so we use this as the offset for the next item.
          this.items.some((item, index) => {
            if (item === this.model) {
              foundItemIndex = index;
              return true;
            }
          });
        }
        if (event.key === 'ArrowDown') {
          // Continue to next item
          nextIndex = foundItemIndex + 1;
          if (nextIndex === this.items.length) {
            nextIndex = 0;
          }
        } else {
          // ArrowUp
          nextIndex = foundItemIndex - 1;
          if (nextIndex === -1) {
            nextIndex = this.items.length - 1;
          }
        }
        this.aaSelect.emit(this.items[nextIndex]);
      } else if (event.key === 'Enter') {
        if (isString(this.model)) {
          // User typed something, but didn´t select an item with the arrow keys. Select it now.
          this.select(this.items[0]);
        } else {
          // User already selected an item, so we only need to clean up and close the drop down unconditionally.
          this.enabled = false;
          this.items = [];
        }
      }
    }
  }
}