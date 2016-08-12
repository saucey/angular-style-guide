export const options = {
  title: 'AOV Quick Quote',
  slider: {
  	start: 3500, // Handle start position
  	connect: true, // Display a colored bar between the handles
  	step: 500, // Slider moves in increments of xx
  	orientation: 'horizontal', // Orient the slider vertically
  	behaviour: 'snap', // click anywhere to start dragging + draggable range
  	range: { // Slider can select '0' to '100'
  		'min': 2500,
  		'max': 125000
  	},
  	pips: { // Shows scale and values below chart
  		mode: 'range',
  		// density: 100,
  		// values: [1875, 2016],
  		density: 100,
  	}
  }
};