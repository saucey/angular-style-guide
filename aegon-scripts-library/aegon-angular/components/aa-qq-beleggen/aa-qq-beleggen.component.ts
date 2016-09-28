/**
 * QuickQuote Beleggen v2
 * - Rewritten existing version in angular 2
 * - Added a chart
 * - Added optimistic/pessimistic calculation
 * - Added number rounding
 * - Rewritten slider and help
 * - Rewritten responsive design
 *
 * FILE STRUCTURE
 * - template.ts: The HTML template
 * - options.ts: Configuration and texts
 * - chart.ts: Chart options
 */
import {Component, Input, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as libInterest from "../../lib/calculations/interest";
import * as libUtil from "../../lib/util";
// AA components
import {AABaseComponent} from '../../lib/classes/AABaseComponent';
import {AAHighchartComponent} from "../aa-highchart/aa-highchart.component";
// Locals
import {template} from "./template";
import {defaultOptions} from "./defaultOptions";
import {createChartConfig, createPlotLinesData, createSeriesData} from "./chart";

declare var jQuery;

/**
 * aa-qq-beleggen component
 */
@Component({
  selector: 'aa-qq-beleggen',
  template: template
})
export class AAQQBeleggenComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @ViewChild('root') rootEl: ElementRef;
  @ViewChild('chart') highchart: AAHighchartComponent;

  public defaultOptions : any = defaultOptions;

  private chartState:any = {}; // store internal state of the chart to prevent redraw
  private currentTimeout: any = undefined;
  private calculate : any;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(thisElement: ElementRef) {
    super(thisElement);
  }
  ngOnInit() : void {
    super.ngOnInit();
    this.calculate = libUtil.debounce(() => {
      this.doCalculate();
    }, this.data.options.chartUpdateDelay);
  }

  /**
   * Calculate the results and update the chart
   */
  doCalculate(): void {
    // Update main result values
    this.data.resultInlay = libInterest.inlayResult(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount);
    this.data.resultSavings = libInterest.interestResult(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.savings, this.data.options.resultRoundPrecision);
    this.data.resultPessimistic = libInterest.interestResult(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.pessimistic, this.data.options.resultRoundPrecision);
    this.data.resultNeutral = libInterest.interestResult(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.neutral, this.data.options.resultRoundPrecision);
    this.data.resultOptimistic = libInterest.interestResult(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.optimistic, this.data.options.resultRoundPrecision);
    // Chart
    this.updateChart();
  }

  /**
   * Create or update the chart
   */
  updateChart() : void {
    var chartState = {
        initialInlay: this.data.initialInlay,
        periodicInlay: this.data.periodicInlay,
        durationAmount: this.data.durationAmount
      };
    // Nothing to do; prevents chart redraw without change
    if (JSON.stringify(this.chartState) === JSON.stringify(chartState)) {
      return;
    }
    var
      // Update series data for the chart
      rawData = {
        savings: libInterest.interestSeries(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.savings, this.data.options.result.roundPrecision),
        investPessimistic: libInterest.interestSeries(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.pessimistic, this.data.options.resultRoundPrecision),
        investNeutral: libInterest.interestSeries(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.neutral, this.data.options.resultRoundPrecision),
        investOptimistic: libInterest.interestSeries(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount, this.data.options.interest.optimistic, this.data.options.resultRoundPrecision),
        inlay: libInterest.inlaySeries(this.data.initialInlay, this.data.periodicInlay, this.data.durationAmount),
      },
      chart = this.highchart, // Reference to current highcharts() object
      plotLines = createPlotLinesData(rawData),
      seriesData = createSeriesData(rawData),
      updateSeriesData = [rawData.investOptimistic, rawData.investNeutral, rawData.investPessimistic, rawData.savings, rawData.inlay];
    // Init/redraw chart
    var config = createChartConfig(seriesData, plotLines);
    this.highchart.createChart(config);
    this.chartState = chartState;
  }
}
