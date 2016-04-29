import {
  Component, Input, Output, EventEmitter, Provider, Directive, forwardRef, ViewChild, ElementRef
} from 'angular2/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "angular2/common";
import {CONST_EXPR} from "angular2/src/facade/lang";
import {InputNumberComponent, InputNumberValueAccessor} from './input-number.component';
import {HelpComponent} from './help.component'
import {AfterViewInit} from "angular2/core";
import {NgZone} from "angular2/core";

declare var noUiSlider: any;
declare var wNumb: any;

@Component({
  selector: 'aegon-slider',
  directives: [
    HelpComponent, InputNumberComponent, InputNumberValueAccessor
  ],
  template: `
    <div class="one-off slider">
      <div class="input-header">
        <label for="one-off-input">{{label}}</label>
        <div class="input-container">
          <aegon-input-number #amountInput [prefix]="prefix" [suffix]="suffix" [(ngModel)]="value" [max]="range.max"
                               (blur)="slider.noUiSlider.set(value)"
                               (enter)="slider.noUiSlider.set(value)" [placeholder]="placeholder">
          </aegon-input-number>
        </div>
        <aegon-help>
          {{helpText}}
        </aegon-help>
      </div>
      <div class="slider-container">
        <div #slider></div>
        <!--<span id="one-off-error" class="errorMessage">Vul een bedrag in tussen de &euro;0,- en &euro;5000,-</span>-->
      </div>
    </div>
  `
})
export class SliderComponent implements AfterViewInit {
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() placeholder: string;
  @Input() range: any;
  @Input() initial: number;
  @Input() label: string;
  @Input() helpText: string;
  @Output() modelChange: any = new EventEmitter();
  @Output() focus: any = new EventEmitter();
  @Output() change: any = new EventEmitter();
  @Output() blur: any = new EventEmitter();
  @Output() enter: any = new EventEmitter();
  @ViewChild('slider') sliderEl: ElementRef;

  value: number;
  manualSlide: boolean = false;
  slideTimer: any;

  constructor(private zone:NgZone){}

  ngAfterViewInit(): void {
    var sliderElement = this.sliderEl.nativeElement;
    var settings = {
      start: [ this.value === void 0 ? this.initial : this.value ],
      range: this.range,
      format: wNumb({
        decimals: 0
      })
    };
    noUiSlider.create(sliderElement, settings);
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
      this.zone.run(() => {
        this.value = parseFloat(values[0]);
        this.modelChange.emit(this.value);
        setTimeout(() => {
          this.change.emit(this.value);
        });
      });
    });
  }

  setValue(value) {
    this.value = value;
    if (this.sliderEl && !this.manualSlide) {
      // Only set the slider when the value comes from outside this component.
      this.sliderEl.nativeElement.noUiSlider.updateOptions({range: this.range});
      this.sliderEl.nativeElement.noUiSlider.set(this.value);
    }
  }
}

const CUSTOM_VALUE_ACCESSOR = CONST_EXPR(new Provider(
  NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => SliderValueAccessor), multi: true}));

@Directive({
  selector: 'aegon-slider',
  host: {'(modelChange)': 'onChange($event)'},
  providers: [CUSTOM_VALUE_ACCESSOR]
})
export class SliderValueAccessor implements ControlValueAccessor {
  onChange = (_) => {};
  onTouched = () => {};

  constructor(private host: SliderComponent) {}

  writeValue(value: any): void {
    this.host.setValue(value);
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
