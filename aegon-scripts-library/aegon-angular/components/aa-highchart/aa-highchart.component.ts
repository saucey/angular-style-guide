import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {loadScript} from "../../lib/scripts";
import {template} from "./template";

declare var jQuery;

@Component({
  selector: 'aa-highchart',
  template: template
})

export class HighchartComponent {
  @Input() options: any = {};
  @Output() ready: any = new EventEmitter();

  @ViewChild('chart') chartEl: ElementRef;
  public highcharts: any; // highcharts reference; only available after the chart has been initialized (drawn)

  /**
   * Constructor
   */
  constructor() {
    // Load highcharts at most once
    loadScript('highcharts')
    .then(() => {
      this.ready.emit();
    });
  }
  /**
   * Return the jQueried highchart element
   * @returns {Object} jQueried highchart element
   */
  getElement() : any {
    var nativeElem = this.chartEl ? this.chartEl.nativeElement : undefined;
    if (!nativeElem) {
      return;
    }
    return jQuery(nativeElem);
  }

  /**
   * Creates a new chart and returns it
   * @param {Object} Highchart options object to create a chart
   * @returns {Object} Highcharts object of created chart
   */
  createChart(options: any = this.options) : any {
    var elem = this.getElement(),
      highcharts = elem.highcharts ? elem.highcharts(options) : undefined;
    if (!highcharts) {
      return;
    }
    this.highcharts = elem.highcharts();
    return highcharts;
  }

  /**
   * Update the chart series, and let it animate
   * @param {Number[]} New series data
   * @returns {Boolean} True if series succesfully updated. False if no chart or series available
   */
  updateSeries(newSeries: any) : boolean {
    var chart = this.highcharts;
    if (chart && chart.series) {
      // Update chart
      chart.series.forEach(function (series, i) {
        series.setData(newSeries[i]);
      });
      return true;
    }
    return false;
  }
}

