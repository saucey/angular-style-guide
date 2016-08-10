export const template = `
  <div class="aa-qq-beleggen aa-qq" #root data-productcategory="beleggen" data-productname="beleggen">
    <div class="aa-qq__triangle"></div>
    <div class="aa-qq__calculation">
      <h3> {{ options.title }} </h3>
      <div class="aa-split-view">
        <div class="aa-qq__chart aa-split-view__left">
          <aa-highchart (ready)="calculate()" #chart></aa-highchart>
        </div>
        <div class="aa-qq__controls aa-split-view__right">
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="initialInlay" (change)="calculate()" [sliderOptions]="options.inlay.slider" [label]="options.inlay.label" [helpText]="options.inlay.help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="periodicInlay" (change)="calculate()" [sliderOptions]="options.periodic.slider" [label]="options.periodic.label" [helpText]="options.periodic.help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--year" [(ngModel)]="durationAmount" (change)="calculate()" [sliderOptions]="options.duration.slider" [label]="options.duration.label" [helpText]="options.duration.help"></aa-slider-input>
        </div>
      </div>
    </div>
    <div class="aa-qq__result">
      <div class="aa-qq__result-group aa__clearfix">
        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result.inlay.label }}</div>
            <div class="aa-qq__result-amount"> &euro; {{ resultInlay | money }}</div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result.savings.label }}
              <aa-hint position="bottom-left" [text]="options.result.savings.help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount"> &euro; {{ resultSavings | money:true }} </div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result.invest.label }}
              <aa-hint position="bottom-left" [text]="options.result.invest.help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount">&euro; {{ resultNeutral | money:true }}</div>
          </div>
        </div>
      </div>

      <div class="aa__clearfix">
        <a *ngIf="options.conversate?.text && options.conversate?.url" class="aa-qq__conversate" [attr.href]="options.conversate.url">{{ options.conversate.text }}</a>
        <p class="aa-qq__cta-button">
          <a [attr.href]="options.cta.url" data-stepname="completion" class="button orange-gradient icon-right arrow">{{ options.cta.text }} </a>
        </p>
      </div>
    </div>
    <div class="aa-qq__disclaimer aa-qq__disclaimer--star">{{ options.disclaimer }} </div>
  </div>
`;