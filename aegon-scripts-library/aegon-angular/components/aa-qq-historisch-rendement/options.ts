import * as libUtil from "../../lib/util";
const PIPS_EVERY_YEARS = 50;
export const options = {
  title: 'Vergelijk sparen en beleggen',
  // Data to use for calculation
  // Date: 5-Aug-2016
  data: {
    startYear: 1871,
    savings: [0.0635,0.0781,0.0835,0.0686,0.0496,0.0533,0.0503,0.049,0.0425,0.051,0.0479,0.0526,0.0535,0.0565,0.0422,0.0426,0.0611,0.0502,0.0468,0.0541,0.0597,0.0393,0.0852,0.0332,0.0309,0.0576,0.0344,0.0355,0.0336,0.0464,0.043,0.0472,0.055,0.0434,0.0417,0.0547,0.0623,0.0532,0.0365,0.0526,0.04,0.0435,0.0565,0.0464,0.0365,0.0364,0.0425,0.0598,0.0556,0.073,0.0744,0.0458,0.0496,0.0434,0.0387,0.0428,0.0426,0.0464,0.0601,0.0415,0.0243,0.0336,0.0146,0.0101,0.0075,0.0075,0.0088,0.0088,0.0056,0.0056,0.0053,0.0063,0.0069,0.0072,0.0075,0.0076,0.0101,0.0135,0.0158,0.0132,0.0212,0.0239,0.0258,0.018,0.0181,0.0321,0.0386,0.0254,0.0374,0.0428,0.0291,0.0339,0.035,0.0409,0.0446,0.0544,0.0555,0.0617,0.0805,0.0911,0.0566,0.0462,0.0793,0.1103,0.0724,0.057,0.0528,0.0778,0.1088,0.1137,0.1763,0.146,0.0937,0.1111,0.0835,0.0731,0.0625,0.0763,0.0929,0.0843,0.0692,0.0391,0.0344,0.0435,0.0645,0.0568,0.0578,0.0568,0.0531,0.0661,0.0463,0.0185,0.0118,0.0149,0.0341,0.0532,0.0534,0.0342,0.01015,0.00455,0.00365,0.0025,0.0025,0.0025,0.0025,0.0025],
    invest: [undefined,0.113168724,-0.023483366,0.045064378,0.04845815,-0.1367713,-0.030985915,0.156923077,0.483240223,0.26223092,0.008077544,0.035472973,-0.051635112,-0.121621622,0.283018868,0.115384615,-0.003584229,0.030131827,0.06870229,-0.059479554,0.183884298,0.061705989,-0.185383244,0.032407407,0.049411765,0.030444965,0.199052133,0.286885246,0.037828947,0.208196721,0.193776521,0.082512315,-0.169030733,0.308383234,0.209964413,0.009118541,-0.237447699,0.381021898,0.161147903,-0.033730159,0.034519957,0.072368421,-0.048387097,-0.056152927,0.304812834,0.085744909,-0.174503657,0.167822469,0.192356688,-0.137032843,0.091420534,0.289041096,0.051685393,0.260475651,0.252362949,0.113833992,0.365671642,0.466628637,-0.08769107,-0.218793183,-0.429286608,-0.085542169,0.548660085,-0.078747628,0.536717063,0.330668605,-0.311540648,0.150309461,0.0336,-0.087804878,-0.086255924,0.195968645,0.234886026,0.192405063,0.384729429,-0.116537181,0.030243261,0.09844909,0.173177083,0.343601896,0.206977841,0.140553948,0.027883881,0.458758837,0.286235955,0.068403171,-0.055469954,0.395184825,0.076231571,0.062726176,0.19038848,-0.027218764,0.210113741,0.159189012,0.11518811,-0.064294899,0.159976317,0.105955387,-0.083986672,0.069981176,0.137768745,0.176863504,-0.159854754,-0.207574654,0.385611907,0.113565972,-0.085637222,0.16099723,0.168588908,0.254893118,-0.06813567,0.288710778,0.202467595,0.076627201,0.259192355,0.310293482,-0.019734604,0.178377515,0.229914859,-0.007000618,0.315760369,0.07580273,0.115662983,0.011480158,0.350263299,0.271312783,0.277518206,0.313081299,0.154960481,-0.051690879,-0.134528275,-0.200226274,0.283610913,0.060334475,0.101184178,0.133186834,-0.012407314,-0.351613044,0.323956191,0.161777533,0.034608848,0.162289133,0.254627128,0.134583727,-0.03263517,undefined]
  },
  // Slider options object
  slider: {
  	start: [ 1991, 2016 ], // Handle start position
  	connect: true, // Display a colored bar between the handles
  	step: 1, // Slider moves in increments of xx
  	margin: 1, // Handles must be more than xx apart
  	orientation: 'horizontal', // Orient the slider vertically
  	behaviour: 'snap-drag', // click anywhere to start dragging + draggable range
  	range: { // Slider can select '0' to '100'
  		'min': 1875,
  		'max': 2016
  	},
  	pips: { // Shows scale and values below chart
  		mode: 'values',
  		density: 3.5,
  		// Create scale values at PIPS_EVERY_YEARS interval
    	values: libUtil.rangeArray(1875, 2016, (value) => {
    	  return value % PIPS_EVERY_YEARS === 0;
    	})
  	}
  },
  period: {
    label: 'Selecteer een periode'
  },
  result: {
    period: {
      label: 'Gemiddeld resultaat voor periode*'
    },
    savings: {
      label: 'Sparen',
      help: 'Resultaat is gebaseerd op het gemiddelde rendement van de geselecteerde periode.'
    },
    invest: {
      label: 'Beleggen',
      help: 'Resultaat is gebaseerd op het gemiddelde rendement van de geselecteerde periode.'
    }
  },
  cta: {
    text: 'Begin met Beleggen',
    url: '/particulier/beleggen/u-wilt-zelf-voor-het-eerst-beleggen'
  },
  disclaimer: "Bovenstaande berekening is een indicatie. Aan deze indicatie kunnen geen rechten worden ontleend. Beleggen brengt kosten en risico's met zich mee die niet bij sparen voorkomen. De waarde van uw belegging kan fluctueren. In het verleden behaalde resultaten bieden geen garantie voor de toekomst.",
  chartUpdateDelay: 500 // // Update chart at most every given milliseconds, e.g. 1000 for 1 sec throttle.
};
