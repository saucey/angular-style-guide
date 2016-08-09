import {formatNumber, round} from '../../lib/format';

// Some styling constants
var fontFamily = "senticosansdtlight, Arial, Verdana, sans-serif",
  labelStyle = {
    fontSize: '1em',
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
 * Creates the series array based on the raw calculation data. Adds styling, etc.
 * @param {Object} rawData Raw data format with the calculation results for the different scenarios
 * @returns {Number[]} Series data array
 */
export function createSeriesData(rawData: any) : any {
  return [
    {
      name: 'Sparen',
      data: [rawData.savings, null],
      fillColor: '#3395d3',
      color: '#3395d3',
      lineWidth: 5,
      legendIndex: 1
    },
    {
      name: 'Beleggen',
      data: [null, rawData.invest],
      fillColor: '#49af57',
      color: '#49af57',
      lineWidth: 5,
      legendIndex: 1
    }

    // {
    //   name: 'Sparen',
    //   data: [rawData.savings, undefined],
    //   fillColor: '#3395d3',
    //   color: '#3395d3',
    //   lineWidth: 5,
    //   legendIndex: 1
    // }, {
    //   name: 'Beleggen',
    //   data: [undefined, rawData.invest],
    //   color: '#49af57',
    //   fillColor: '#49af57',
    //   lineWidth: 5,
    //   legendIndex: 2
    // }
    ];
};

/**
 * Creates the chart config object to feed to highcharts
 * @param {Number[]} seriesData Array with full series data to plot
 * @param {Object[]} plotLines Array with all the plotlines to draw
 * @returns {Object} Final Highcharts object to initialize a chart with
 */
export function createChartConfig(seriesData: number[]) : any {
  return {
    chart: {
      type: 'column',
      spacingBottom: 30,
      spacingTop: 40,
      spacingLeft: 30,
      spacingRight: 30,
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
    legend: {
      enabled: false
    },
    xAxis: {
      allowDecimals: false,
      gridLineWidth: 0,
      categories: [
        'Sparen',
        'Beleggen'
      ],
      labels: {
        style: {
          color: '#1d1d1b',
          fontSize: '18px',
          fontWeight: 'normal',
          fontFamily: fontFamily
        }
      }
    },
    yAxis: {
      enabled: false,
      title: {
        text: ''
      },
      stackLabels: {
        enabled: true,
        useHTML: true,
        format: '{total:.1f}%',
        style: {
          fontSize: '26px',
          fontWeight: 'normal',
          color: '#1d1d1b',
          fontFamily: "senticosansdtregular, Arial, Verdana, sans-serif",
          animation: 'aa-fade-in ease-in 300ms',
          animationFillMode: 'forwards',
          opacity: 0,
          left: 0,
          marginTop: '-10px',
          transform: 'translateY(-10px)',
          backgroundColor: 'rgba(255,255,255,0.9)'
        }
      },
      gridLineWidth: 0,
      labels: {
        enabled: false
      }
    },
    tooltip: {
      enabled: false
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false,
          style: {
            display: 'none'
          }
        },
        stacking: 'normal',
        states: {
          hover: {
            enabled: false
          }
        },
        fillOpacity: 1,
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