import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

import {AAInputNumberComponent} from '../aa-input-number/aa-input-number.component';
import {AASliderComponent} from '../aa-slider/aa-slider.component';
import {AAHintComponent} from '../aa-hint/aa-hint.component';
import {template} from "./template";

const CUSTOM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AASliderInputComponent),
  multi: true
};


declare var noUiSlider: any;

@Component({
  selector: 'aa-slider-input',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})

export class AASliderInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() helpText: string;
  @Input() sliderOptions:any;

  @Output() modelChange: any = new EventEmitter();
  @Output() focus: any = new EventEmitter();
  @Output() change: any = new EventEmitter();
  @ViewChild('aaSlider') aaSlider: AASliderComponent;

  value: number;
  inputValue: number;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  writeValue(value: any): void {
    // Incoming change from outside
    this.value = value;
    this.inputValue = value;
  }
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Main component
   */

  // Use the slider's model as the change model for our own change emitter
  // In case the input changes the slider updates, and then triggers this handler
  sliderChange(value) : void {
    // Notify outside world with new value (provided by slider)
    this.value = value;
    this.inputValue = value;
    this.modelChange.emit(value);
    this.change.emit(value);
  }
  // If input changes, update the model. This will update the slider.
  // The slider will round to an acceptable range and trigger the ngModel events.
  inputOnChange(value) : void {
    this.inputValue = value;

    let min = this.sliderOptions.range && this.sliderOptions.range.min || void 0;

    // Updating internal model will trigger slider change
    if (min !== void 0) {
      // Input value is below minimum, set the slider to minimal.
      this.value = value >= min ? value : min;
    } else {
      this.value = value;
    }
  }
  // Input has changed, make sure the input reflects the slider value.
  inputChange() {
    this.inputValue = this.value;
  }
}
