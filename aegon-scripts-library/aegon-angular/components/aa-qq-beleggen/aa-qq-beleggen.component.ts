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
import {Component, Input, ElementRef, ViewChild, AfterViewInit} from 'angular2/core';
import {MoneyPipe} from "../../pipes/money.pipe";
import {SliderInputComponent} from '../aa-slider-input/aa-slider-input.component';
import {HintComponent} from '../aa-hint/aa-hint.component';
import {HighchartComponent} from "../aa-highchart/aa-highchart.component";
import {loadScript} from "../../lib/scripts";
import * as libFormat from "../../lib/format";
import * as libInterest from "../../lib/calculations/interest";
import * as libUtil from "../../lib/util";
import {template} from "./template";
import {options} from "./options";
import {createChartConfig, createPlotLinesData, createSeriesData} from "./chart";

declare var jQuery;
const TIMEOUT_CHART_UPDATE = 1000, // Update chart at most every given milliseconds, e.g. 1000 for 1 sec throttle.
  ROUND_AMOUNT_PRECISION = -1; // Show numbers rounded to given number of decimals. Negative = rounded multiples, e.g. 3 = 1000's.


@Component({
  selector: 'aa-qq-beleggen',
  directives: [
    HintComponent, SliderInputComponent, HighchartComponent
  ],
  template: template,
  pipes: [MoneyPipe]
})
export class QQBeleggenComponent implements AfterViewInit {
  @ViewChild('root') rootEl: ElementRef;
  @ViewChild('chart') highchart: HighchartComponent;
  private chartState:any = {}; // store internal state of the chart to prevent redraw
  private currentTimeout: any = undefined;
  private calculate : any = libUtil.debounce(() => {
      this.doCalculate();
    }, 500);

  options : any = options;
  initialInlay: number = 100;
  periodicInlay: number = 10;
  durationAmount: number = 10;
  resultInlay: number = 0;
  resultSavings: number = 0;
  resultPessimistic: number = 0;
  resultNeutral: number = 0;
  resultOptimistic: number = 0;
  interestSavings: number = 0.5;
  interestPessimistic: number = 1.0;
  interestNeutral: number = 2.0;
  interestOptimistic: number = 3.0;

  constructor() {
  }
  /**
   * Triggers after view has been inited. This is after template loading and intializing.
   */
  ngAfterViewInit(): void {
    var nativeElem = this.rootEl ? this.rootEl.nativeElement : undefined;
    if (!nativeElem) {
      return;
    }
    // Grab interest rates from html
    this.interestSavings = libFormat.numberFromAttribute(nativeElem, 'data-interestSavings', this.interestSavings);
    this.interestPessimistic = libFormat.numberFromAttribute(nativeElem, 'data-interestInvestPessimistic', this.interestPessimistic);
    this.interestNeutral = libFormat.numberFromAttribute(nativeElem, 'data-interestInvestNeutral', this.resultNeutral);
    this.interestOptimistic = libFormat.numberFromAttribute(nativeElem, 'data-interestInvestOptimistic', this.interestOptimistic);
    // Show chart
    var self = this;
  }

  /**
   * Calculate the results and update the chart
   */
  doCalculate(): void {
    // Update main result values
    this.resultInlay = libInterest.inlayResult(this.initialInlay, this.periodicInlay, this.durationAmount);
    this.resultSavings = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestSavings, ROUND_AMOUNT_PRECISION);
    this.resultPessimistic = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestPessimistic, ROUND_AMOUNT_PRECISION);
    this.resultNeutral = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestNeutral, ROUND_AMOUNT_PRECISION);
    this.resultOptimistic = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestOptimistic, ROUND_AMOUNT_PRECISION);
    // Chart
    this.updateChart();
  }

  /**
   * Create or update the chart
   */
  updateChart() : void {
    var chartState = {
        initialInlay: this.initialInlay,
        periodicInlay: this.periodicInlay,
        durationAmount: this.durationAmount
      };
    // Nothing to do; prevents chart redraw without change
    if (JSON.stringify(this.chartState) === JSON.stringify(chartState)) {
      return;
    }
    var
      // Update series data for the chart
      rawData = {
        savings: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestSavings, ROUND_AMOUNT_PRECISION),
        investPessimistic: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestPessimistic, ROUND_AMOUNT_PRECISION),
        investNeutral: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestNeutral, ROUND_AMOUNT_PRECISION),
        investOptimistic: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.interestOptimistic, ROUND_AMOUNT_PRECISION),
        inlay: libInterest.inlaySeries(this.initialInlay, this.periodicInlay, this.durationAmount),
      },
      chart = this.highchart, // Reference to current highcharts() object
      plotLines = createPlotLinesData(rawData),
      seriesData = createSeriesData(rawData),
      updateSeriesData = [rawData.investOptimistic, rawData.investNeutral, rawData.investPessimistic, rawData.savings, rawData.inlay];
    // Init or update chart?
    // Update only: if duration is the same, and chart is available
    if (false && chart && (chartState.durationAmount === this.chartState.durationAmount) && chart.updateSeries(updateSeriesData)) {
      // Update plotlines
      var axis = chart.highcharts.yAxis[0];
      axis.removePlotLine('savings');
      axis.removePlotLine('invest');
      if (this.currentTimeout) {
        clearTimeout(this.currentTimeout);
      }
      // Wait for chart animation to finish
      this.currentTimeout = setTimeout(function () {
        plotLines.forEach(function (plotLine) {
          axis.addPlotLine(plotLine);
        });
      }, TIMEOUT_CHART_UPDATE);
      this.chartState = chartState;
      return;
    };
    // Otherwise init/redraw chart
    var config = createChartConfig(seriesData, plotLines);
    this.highchart.createChart(config);
    this.chartState = chartState;
  }
}
