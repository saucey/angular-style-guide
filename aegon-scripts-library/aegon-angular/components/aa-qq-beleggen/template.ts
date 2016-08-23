export const template = `
  <div class="aa-qq-beleggen aa-qq" #root data-productcategory="beleggen" data-productname="beleggen">
    <div class="aa-qq__triangle"></div>
    <div class="aa-qq__calculation">
      <h3> {{ data.options.title }} </h3>
      <div class="aa-split-view">
        <div class="aa-qq__chart aa-split-view__left">
          <aa-highchart (ready)="calculate()" #chart></aa-highchart>
        </div>
        <div class="aa-qq__controls aa-split-view__right">
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="data.initialInlay" (change)="calculate()" [sliderOptions]="data.options.inlay.slider" [label]="data.options.inlay.label" [helpText]="data.options.inlay.help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="data.periodicInlay" (change)="calculate()" [sliderOptions]="data.options.periodic.slider" [label]="data.options.periodic.label" [helpText]="data.options.periodic.help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--year" [(ngModel)]="data.durationAmount" (change)="calculate()" [sliderOptions]="data.options.duration.slider" [label]="data.options.duration.label" [helpText]="data.options.duration.help"></aa-slider-input>
        </div>
      </div>
    </div>
    <div class="aa-qq__result">
      <div class="aa-qq__result-group aa__clearfix">
        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ data.options.result.inlay.label }}</div>
            <div class="aa-qq__result-amount aa-amount--euro">{{ data.resultInlay | money:true }}</div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ data.options.result.savings.label }}
              <aa-hint position="bottom-left" [text]="data.options.result.savings.help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount aa-amount--euro">{{ data.resultSavings | money:true }} </div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ data.options.result.invest.label }}
              <aa-hint position="bottom-left" [text]="data.options.result.invest.help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount aa-amount--euro">{{ data.resultNeutral | money:true }}</div>
          </div>
        </div>
      </div>

      <div class="aa__clearfix">
        <a *ngIf="data.options.conversate?.text && data.options.conversate?.url" class="aa-qq__conversate" [attr.href]="data.options.conversate.url">{{ data.options.conversate.text }}</a>
        <p class="aa-qq__cta-button">
          <a [attr.href]="data.options.cta.url" data-stepname="completion" class="button orange-gradient icon-right arrow">{{ data.options.cta.text }} </a>
        </p>
      </div>
    </div>
    <div class="aa-qq__disclaimer aa-qq__disclaimer--star">{{ data.options.disclaimer }} </div>
  </div>
`;