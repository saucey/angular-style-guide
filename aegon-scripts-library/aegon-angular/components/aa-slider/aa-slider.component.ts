/**
 * Single slider component
 * Thin wrapper for noUi-slider component
 * See: http://refreshless.com/nouislider/
 */

import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef, AfterViewInit} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import {template} from "./template";
import {options} from "./options";

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => AASliderComponent), multi: true}));

declare var noUiSlider: any;
declare var jQuery: any;

export const DEFAULT_SLIDER_OPTIONS = options;

@Component({
  selector: 'aa-slider',
  directives: [],
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR],
  template: template
})

export class AASliderComponent implements AfterViewInit, ControlValueAccessor {
  // Official nouiSlider options object
  @Input() options: any = DEFAULT_SLIDER_OPTIONS;
  // Show hint values above slider handles or not
  @Input() hint: Boolean = false;
  // ngModel change event
  @Output() modelChange: any = new EventEmitter();
  // Change event
  @Output() change: any = new EventEmitter();
  // Internal slider DOM reference
  @ViewChild('slider') sliderEl: ElementRef;

  // Public properties
  value: any;
  lowerHandle: any;
  upperHandle: any;
  manualSlide: boolean = false;
  sliderElement: any;
  slideTimer: any;

  /**
   * ControlValueAccessor interface
   */
  // Placeholder callbacks
  onChange = (_) => {};
  onTouched = () => {};
  // Triggers on change
  writeValue(value: any): void {
    // Do nothing
    if (this.manualSlide || JSON.stringify(value) === JSON.stringify(this.value)) {
      return;
    }
    this.value = value;
    if (this.sliderElement) {
      // Update noUi slider
      this.sliderElement.noUiSlider.set(this.value);
    }
  }
  // Register handlers
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  // Register handlers
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Main component class
   */
  ngAfterViewInit(): void {
    var sliderElement = this.sliderEl.nativeElement;
    // Hook up events
    noUiSlider.create(sliderElement, this.options);
    // Save handles for future use
    this.sliderElement = sliderElement;
    this.lowerHandle = jQuery(sliderElement).find('.noUi-handle-lower');
    this.upperHandle = jQuery(sliderElement).find('.noUi-handle-upper');
    // Setup events
    sliderElement.noUiSlider.on('start', () => {
      clearTimeout(this.slideTimer);
      this.manualSlide = true;
    });
    sliderElement.noUiSlider.on('end', () => {
      this.slideTimer = setTimeout(() => {
        this.manualSlide = false;
      }, 100);
    });
    sliderElement.noUiSlider.on('update', values => {
      this.sliderChange(values);
    });
  }

  // Direct noUi slider change handler
  sliderChange(values: string[]) : void {
    values = values || [];
    var newLower = values[0],
      newUpper = values[1],
      parsedLower = newLower ? parseFloat(newLower) : undefined,
      parsedUpper = newUpper ? parseFloat(newUpper) : undefined,
      newValues : any = {
        lower: parsedLower,
        upper: parsedUpper
      };
    if (parsedUpper === undefined) {
      newValues = parsedLower;
    }
    // Update hints
    if (this.hint) {
      if (parsedLower !== undefined && this.lowerHandle) {
        this.lowerHandle.attr('data-value', parsedLower);
      }
      if (parsedUpper !== undefined && this.upperHandle) {
        this.upperHandle.attr('data-value', parsedUpper);
      }
    }
    // Emit value
    this.value = newValues;
    this.modelChange.emit(newValues);
    this.change.emit(newValues);
  }
}
