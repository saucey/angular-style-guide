export const template = `
  <div class="aa-qq aa-qq-historisch-rendement" #root>
    <div class="aa-qq__triangle"></div>
    <div class="aa-qq__calculation">
      <h3> {{ options.title }} </h3>
      <div>
        <div class="aa-qq__chart">
          <aa-highchart (ready)="calculate()" #chart></aa-highchart>
        </div>
        <div class="aa-qq__controls">
          <aa-slider class="aa-qq__control aa-slider--timeline" (change)="updateSlider($event)" [options]="options.slider" [hint]="true"></aa-slider>
        </div>
      </div>
    </div>
    <div class="aa-qq__result">
      <div class="aa-group aa__clearfix">
        <div class="aa-qq__result-box">
          <div class="aa-qq__group">
            <div class="aa-qq__result-title">{{ options.result_summary_label }}</div>
            <div class="aa-qq__result-amount"> {{ inputData.lower }} - {{ inputData.upper }} </div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result_savings_label }}
              <aa-hint position="bottom-left" [text]="options.result_savings_help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount"> {{ resultData.savings | number:'.1-1' }} % </div>
          </div>
        </div>

        <div class="aa-qq__result-box">
          <div class="aa-group">
            <div class="aa-qq__result-title">{{ options.result_invest_label }}
              <aa-hint position="bottom-left" [text]="options.result_invest_help" class="aa-hint--light"></aa-hint>
            </div>
            <div class="aa-qq__result-amount">{{ resultData.invest | number:'.1-1' }} %</div>
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