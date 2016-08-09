import {formatNumber, round} from '../../lib/format';

// Some styling constants
var fontFamily = "senticosansdtlight, Arial, Verdana, sans-serif",
  labelStyle = {
    fontSize: '0.9em',
    fontWeight: 'normal',
    fontFamily: "senticosansdtlight, Arial, Verdana, sans-serif",
    animation: 'aa-fade-in ease-in 300ms',
    animationFillMode: 'forwards',
    opacity: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '5px'
  };

/**
 * Create plot lines data structure based on raw calculation data
 * @param {Object} rawData Raw calculation data
 * @return {Object[]} Plotlines configuration object to add to Highcharts configuration object
 */
export function createPlotLinesData(rawData: any) : any {
  var finalIdx = rawData.inlay.length - 1,
    finalValue = {
      inlay: rawData.inlay[finalIdx],
      savings: rawData.savings[finalIdx],
      invest: rawData.investNeutral[finalIdx]
    },
    plotLines = [{
        value: finalValue.savings,
        color: 'rgba(51,149,211, 0.5)',
        width: 1,
        id: 'savings',
        label: {
          useHTML: true,
          style: labelStyle,
          text: 'Sparen: ' + '€ ' + formatNumber(round(finalValue.savings))
        },
        zIndex: 99
      },{
        value: finalValue.invest,
        color: 'rgba(73,175,87,0.5)',
        width: 1,
        id: 'invest',
        label: {
          useHTML: true,
          style: labelStyle,
          text: 'Beleggen: ' + '€ ' + formatNumber(round(finalValue.invest))
        },
        zIndex: 99
      }
    ];
  return plotLines;
}
/**
 * Creates the series array based on the raw calculation data. Adds styling, etc.
 * @param {Object} rawData Raw data format with the calculation results for the different scenarios
 * @returns {Number[]} Series data array
 */
export function createSeriesData(rawData: any) : any {
  return [{
      name: 'Beleggen - optimistisch',
      data: rawData.investOptimistic,
      fillColor: 'rgba(73,175,87,0.3)',
      color: 'rgba(73,175,87,0.5)',
      dashStyle: 'dash',
      showInLegend: false,
      lineWidth: 2,
    }, {
      name: 'Beleggen',
      data: rawData.investNeutral,
      color: '#49af57',
      fillColor: 'transparent',
      lineWidth: 5,
      legendIndex: 2
    }, {
      name: 'Beleggen - pessimistisch',
      data: rawData.investPessimistic,
      fillColor: 'white',
      color: 'rgba(73,175,87,0.5)',
      dashStyle: 'dash',
      showInLegend: false,
      lineWidth: 2
    }, {
      name: 'Sparen',
      data: rawData.savings,
      fillColor: 'transparent',
      color: '#3395d3',
      lineWidth: 5,
      legendIndex: 1
    }, {
      name: 'Inleg',
      data: rawData.inlay,
      fillColor: 'transparent',
      color: '#8E8E8C',
      lineWidth: 5,
      legendIndex: 0
    }
  ];
}
/**
 * Creates the chart config object to feed to highcharts
 * @param {Number[]} seriesData Array with full series data to plot
 * @param {Object[]} plotLines Array with all the plotlines to draw
 * @returns {Object} Final Highcharts object to initialize a chart with
 */
export function createChartConfig(seriesData: number[], plotLines:any[] = []) : any {
  return {
    chart: {
      type: 'area',
      spacingBottom: 15,
      spacingTop: 5,
      spacingLeft: 15,
      spacingRight: 15,
      animation: {
        duration: 1000
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined,
      floating: true
    },
    xAxis: {
      allowDecimals: false,
      gridLineWidth: 0,
      labels: {
        style: {
          color: '#1d1d1b',
          fontSize: '1em',
          fontWeight: 'normal',
          fontFamily: fontFamily
        }
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      xfloating: true,
      borderWidth: 0,
      xitemMarginTop: 5,
      xitemMarginBottom: 5,
      color: '#1d1d1b',
      backgroundColor: 'white',
      itemStyle: {
        fontSize: '1.1em',
        fontWeight: 'normal',
        fontFamily: fontFamily
      }
    },
    yAxis: {
      title: {
        text: undefined
      },
      opposite: true,
      gridLineWidth: 0,
      labels: {
        enabled: false,
        style: {
          color: '#1d1d1b',
          fontSize: '1.1em',
          fontWeight: 'normal',
          fontFamily: fontFamily
        },
        // enabled: false,
        formatter: function() {
          return '€ ' + formatNumber(this.value);
        }
      },
      plotLines: plotLines
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillOpacity: 1,
        states: {
          hover: {
            enabled: false
          }
        },
        events: {
          legendItemClick: function () {
            return false; // Disable enabling/disabling certain lines on click
          }
        },
        marker: {
          enabled: false
        }
      }
    },
    series: seriesData
  }
}