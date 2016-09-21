export const template = `
  <div class="aa-slider-input">
    <div class="aa-slider-input__header">
      <label [attr.for]="inputId">{{ label }}</label>
      <span class="aa-slider-input__hint">
        <aa-hint [text]="helpText" position="bottom-left"></aa-hint>
      </span>
      <div class="aa-slider-input__input">
        <aa-input-number [inputId]="inputId" [ngModel]="inputValue" [max]="sliderOptions.range.max"
          [placeholder]="placeholder" (ngModelChange)="inputOnChange($event)" (change)="inputChange()">
        </aa-input-number>
      </div>
    </div>
    <div class="aa-slider-input__slider">
      <aa-slider #aaSlider class="aa-qq__control" [options]="sliderOptions" [hint]="false" [(ngModel)]="value" (change)="sliderChange($event)"></aa-slider>
    </div>
  </div>
`;
