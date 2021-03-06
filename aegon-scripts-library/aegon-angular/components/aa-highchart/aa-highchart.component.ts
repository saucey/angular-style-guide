/**
 * Simple wrapper for the highcharts charting component.
 * Highcharts script is lazily loaded at most once
 * This component basically initializes the element and offers a simple way to
 * render a chart by supplying a chart options object.
 * See: http://api.highcharts.com/highcharts
 */
import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {loadScript} from "../../lib/scripts";
import {template} from "./template";

declare var jQuery;

@Component({
  selector: 'aa-highchart',
  template: template
})

export class AAHighchartComponent {
  // Options object for chart. If supplied chart will be based on this,
  // otherwise use .createChart(options)
  @Input() options: any;
  // Fired when library is loaded
  @Output() ready: any = new EventEmitter();
  // Placeholder for the chart
  @ViewChild('chart') chartEl: ElementRef;
  // Highcharts interface on the element
  public highcharts: any; // highcharts reference; only available after the chart has been initialized (drawn)
  private loaded : any;

  /**
   * Constructor
   */
  constructor() {
    // Load highcharts at most once
    this.loaded = loadScript('highcharts')
    .then(() => {
      this.ready.emit();
      // Init chart if options supplied
      if (this.options) {
        this.createChart();
      }
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
    // Run after script has loaded
    return this.loaded
    .then(() => {
      var elem = this.getElement(),
        highcharts = elem.highcharts ? elem.highcharts(options) : undefined;
      highcharts = elem.highcharts();
      if (!highcharts) {
        return;
      }
      this.highcharts = highcharts;
      return highcharts;
    });
  }

  /**
   * Reflow/draw chart
   */
  reflow() : void {
    this.highcharts ? this.highcharts.reflow() : undefined;
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
