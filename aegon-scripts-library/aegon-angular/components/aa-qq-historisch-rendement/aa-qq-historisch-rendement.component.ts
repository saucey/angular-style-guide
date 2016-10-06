/**
 * Quick Quote Historical ROI
 */
import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import * as libUtil from "../../lib/util";
import {HistoricalRoi} from "../../lib/calculations/historicalRoi";
// AA components
import {AABaseComponent} from '../../lib/classes/AABaseComponent';

import {AAHighchartComponent} from "../aa-highchart/aa-highchart.component";
// Locals
import {template} from "./template";
import {defaultOptions} from "./defaultOptions";
import {createChartConfig, createSeriesData} from "./chart";

@Component({
  selector: 'aa-qq-historisch-rendement',
  template: template
})
export class AAQQHistorischRendementComponent extends AABaseComponent {
  @Input() options: any = {};
  @Input() data: any = {};
  @ViewChild('chart') highchart: AAHighchartComponent;

  // Init calculation class
  private historicalRoi: HistoricalRoi = new HistoricalRoi(defaultOptions.data);
  private chartState:any = {};
  private currentTimeout: any = undefined;
  private calculate: any;

  public defaultOptions : any = defaultOptions;

  resultData: any = {};
  inputData: any = {
    lower: defaultOptions.slider.start[0],
    upper: defaultOptions.slider.start[1]
  }

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


