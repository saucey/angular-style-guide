import {Component, Input, ElementRef, ViewChild, AfterViewInit} from 'angular2/core';
import {MoneyPipe} from "../../pipes/money.pipe";
import {SliderComponent} from '../aa-slider/aa-slider.component';
import {HintComponent} from '../aa-hint/aa-hint.component';
import {HighchartComponent} from "../aa-highchart/aa-highchart.component";
import * as libUtil from "../../lib/util";
import {template} from "./template";
import {options} from "./options";
import {HistoricalRoi} from "../../lib/calculations/historicalRoi";
import {createChartConfig, createSeriesData} from "./chart";

const TIMEOUT_CHART_UPDATE = 1000,
  UPDATE_THROTTLE = 500;

declare var jQuery;

@Component({
  selector: 'aa-qq-historisch-rendement',
  directives: [
    SliderComponent, HintComponent, HighchartComponent
  ],
  template: template,
  pipes: [MoneyPipe]
})
export class QQHistorischRendementComponent implements AfterViewInit {
  @ViewChild('chart') highchart: HighchartComponent;
  private historicalRoi: HistoricalRoi = new HistoricalRoi(options.data);
  private chartState:any = {};
  private currentTimeout: any = undefined;
  private calculate: any = libUtil.debounce(() => {
      this.doCalculate();
    }, UPDATE_THROTTLE);

  options : any = options;
  resultData: any = {};
  inputData: any = {
    lower: options.slider.start[0],
    upper: options.slider.start[1]
  }

  constructor() {
  }
  /**
   * Triggers after view has been inited. This is after template loading and intializing.
   */
  ngAfterViewInit(): void {
    this.doCalculate();
  }

  /*
   * Slider update callback
   */
  updateSlider(newValue : any) : void {
    this.inputData = newValue;
    this.calculate();
  }

  /**
   * Calculate the results and update the chart
   */
  doCalculate(): void {
    // Update main result values
    // Chart
    this.updateChart();
  }

  /**
   * Create or update the chart
   */
  updateChart() : void {
    var chartState = {
        lower: this.inputData.lower,
        upper: this.inputData.upper
    };
    // Nothing to do; prevents chart redraw without change
    if (JSON.stringify(this.chartState) === JSON.stringify(chartState)) {
      return;
    }
    var roiData = this.historicalRoi.roi(chartState.lower, chartState.upper);
    this.resultData = roiData;
    // console.log('calc', roiData);
    var chart = this.highchart, // Reference to current highcharts() object
      seriesData = createSeriesData(roiData),
      updateSeriesData = [];
    // Init or update chart?
    var config = createChartConfig(seriesData);
    // console.log('chart config', config);
    if (this.highchart.createChart(config)) {
      this.chartState = chartState;
    }
  }
}


