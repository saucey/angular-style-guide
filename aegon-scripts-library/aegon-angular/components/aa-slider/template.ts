export const template = `
  <div class="aa-slider" [class.aa-slider--ranges]="options.ranges">
    <div #slider></div>
    <span *ngFor="let label of options.labels; let first=first, let last=last" class="aa-slider__label"
    [class.slider__label--first]="first && label.value === options.range.min"
    [class.slider__label--last]="last && label.value === options.range.max"
    [style.marginLeft.%]="label.value">
    {{label.label}}
    </span>
  </div>
`;
