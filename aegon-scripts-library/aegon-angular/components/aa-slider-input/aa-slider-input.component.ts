import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef, AfterViewInit} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import {AAInputNumberComponent} from '../aa-input-number/aa-input-number.component';
import {AASliderComponent} from '../aa-slider/aa-slider.component';
import {AAHintComponent} from '../aa-hint/aa-hint.component';
import {template} from "./template";

// Custom value accessor for ngModel support
const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => AASliderInputComponent), multi: true}));

declare var noUiSlider: any;

@Component({
  selector: 'aa-slider-input',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  directives: [
    AASliderComponent, AAHintComponent, AAInputNumberComponent
  ],
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

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  writeValue(value: any): void {
    // Incoming change from outside
    this.value = value;
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
    this.modelChange.emit(value);
    this.change.emit(value);
  }
  // If input changes, update the model. This will update the slider.
  // The slider will round to an acceptable range and trigger the ngModel events
  inputChange(value) : void {
    // Updating internal model will trigger slider change
    this.value = value;
  }
}
