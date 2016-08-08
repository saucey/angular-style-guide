export const template = `
  <div class="aa-qq-beleggen aa-qq" #root data-productcategory="beleggen" data-productname="beleggen"
       data-interestSavings="0.8"
       data-interestInvestPessimistic="-0.7"
       data-interestInvestNeutral="3.3"
       data-interestInvestOptimistic="5.9">
    <div class="aa-qq__triangle"></div>
    <div class="aa-qq__calculation">
      <h3> {{ options.title }} </h3>
      <div class="aa-split-view">
        <div class="aa-qq__chart aa-split-view__left">
          <aa-highchart (ready)="calculate()" #chart></aa-highchart>
        </div>
        <div class="aa-qq__controls aa-split-view__right">
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="initialInlay" (change)="calculate()" [sliderOptions]="options.inlay_slider" [range]="options.inlay_range" [label]="options.inlay_label" [helpText]="options.inlay_help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--euro" [(ngModel)]="periodicInlay" (change)="calculate()" [sliderOptions]="options.periodic_slider" [range]="options.periodic_range" [label]="options.periodic_label" [helpText]="options.periodic_help"></aa-slider-input>
          <aa-slider-input class="aa-qq__control aa-input--year" [(ngModel)]="durationAmount" (change)="calculate()" [sliderOptions]="options.duration_slider" [range]="options.duration_range" [label]="options.duration_label" [helpText]="options.duration_help"></aa-slider-input>
        </div>
      </div>
    </div>
    <div class="aa-qq__result">
      <div class="aa-qq__result-group aa__clearfix">
        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result_inlay_label }}</div>
            <div class="aa-qq__result-amount"> &euro; {{ resultInlay | money }}</div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result_savings_label }}
              <aa-hint position="bottom-left" [text]="options.result_savings_help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount"> &euro; {{ resultSavings | money:true }} </div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result_invest_label }}
              <aa-hint position="bottom-left" [text]="options.result_invest_help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount">&euro; {{ resultNeutral | money:true }}</div>
          </div>
        </div>
      </div>

      <div class="aa__clearfix">
        <a class="aa-qq__conversate" href="#">{{ options.conversate_text }}</a>
        <p class="aa-qq__cta-button">
          <a href="#" data-stepname="completion" class="button orange-gradient icon-right arrow">{{ options.cta_button_text }} </a>
        </p>
      </div>
    </div>
    <div class="aa-qq__disclaimer aa-qq__disclaimer--star">{{ options.disclaimer_text }} </div>
  </div>
`;