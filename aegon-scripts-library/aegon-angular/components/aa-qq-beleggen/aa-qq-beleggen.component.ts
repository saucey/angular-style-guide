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
import {Component, Input, ElementRef, ViewChild, OnInit} from 'angular2/core';
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
import {AAConfigComponent} from '../../lib/classes/AAConfigComponent';

declare var jQuery;

/**
 * aa-qq-beleggen component
 */
@Component({
  selector: 'aa-qq-beleggen',
  directives: [
    HintComponent, SliderInputComponent, HighchartComponent
  ],
  template: template,
  pipes: [MoneyPipe]
})
export class QQBeleggenComponent extends AAConfigComponent implements OnInit {
  @ViewChild('root') rootEl: ElementRef;
  @ViewChild('chart') highchart: HighchartComponent;

  private chartState:any = {}; // store internal state of the chart to prevent redraw
  private currentTimeout: any = undefined;
  private calculate : any;
  initialInlay: number;
  periodicInlay: number;
  durationAmount: number;
  resultInlay: number;
  resultSavings: number;
  resultPessimistic: number;
  resultNeutral: number;
  resultOptimistic: number;

  // Public properties
  public options : any = options;

  // Let parent class initialize config; the dependency injection with ElementRef
  // doesn't work directly so we have to call it explicitly.
  constructor(thisElement: ElementRef) {
    super(thisElement);
  }
  ngOnInit() : void {
    super.ngOnInit();
    this.calculate = libUtil.debounce(() => {
      this.doCalculate();
    }, this.options.chartUpdateDelay);
  }

  /**
   * Calculate the results and update the chart
   */
  doCalculate(): void {
    // Update main result values
    this.resultInlay = libInterest.inlayResult(this.initialInlay, this.periodicInlay, this.durationAmount);
    this.resultSavings = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.savings, this.options.resultRoundPrecision);
    this.resultPessimistic = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.pessimistic, this.options.resultRoundPrecision);
    this.resultNeutral = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.neutral, this.options.resultRoundPrecision);
    this.resultOptimistic = libInterest.interestResult(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.optimistic, this.options.resultRoundPrecision);
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
        savings: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.savings, this.options.result.roundPrecision),
        investPessimistic: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.pessimistic, this.options.resultRoundPrecision),
        investNeutral: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.neutral, this.options.resultRoundPrecision),
        investOptimistic: libInterest.interestSeries(this.initialInlay, this.periodicInlay, this.durationAmount, this.options.interest.optimistic, this.options.resultRoundPrecision),
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
      }, this.options.chartUpdateDelay);
      this.chartState = chartState;
      return;
    };
    // Otherwise init/redraw chart
    var config = createChartConfig(seriesData, plotLines);
    this.highchart.createChart(config);
    this.chartState = chartState;
  }
}
