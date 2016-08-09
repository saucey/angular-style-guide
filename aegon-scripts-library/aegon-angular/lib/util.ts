/**
 * General util library. Put standalone reusable functions here that have no
 * dependencies.
 * Only add a function here if:
 * - There is no more specific util library where you can put it
 * - It is of a rare/miscellaneous/random type
 * - If you can group more than 2 functions around the same concept put it in a
 *   separate library. Example: number formatting, dom manipulation, lightbox
 */

/**
 * Returns a function that will only run once in <interval> time
 * The function is called immediately on start. If it is called again in <interval> time
 * it is scheduled to run after <timeout> after last time's invocation
 * @param {Function} func Function to throttle
 * @param {Number} interval Interval in ms to run function at most once in
 * @returns {Function} The throttled function
 */
export function throttle(func: any, interval: number = 1000) : any {
  var lastTime = 0,
    timeout,
    runFunc = () => {
      timeout = undefined;
      lastTime = new Date().getTime();
      return func.call(this);
    }
	return function() {
    // Already waiting for timeout
	  if (timeout) {
	    return;
	  }
	  var now = new Date().getTime(),
	    passed = now - lastTime;
	  // Function not called in <interval> time ago? -> run
	  if (passed > interval) {
	    return runFunc();
	  } else {
	    // Schedule timeout
	    timeout = setTimeout(runFunc, interval - passed);
	  }
	};
}
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param {Function} func Function to make debounce
 * @param {Number} wait Number of ms to wait before the debounce kicks in (debounce time)
 * @param {Boolean} immediate Should the callback also be triggered as soon as it is triggered. Will also fire after the wait timeout
 * @returns {Function} The debounced function
 */
export function debounce(func: any, wait: number = 1000, immediate: boolean = false) : any {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/**
 * Create an array of values between <from> and <to>. Used to create ranges for slider pips/scales
 * @param {Number} from Value to start with (lower)
 * @param {Number} to Value to end with (upper, inclusive)
 * @param {Function} func Optional function to decide whether to include value or not
 */
export function rangeArray (from:number, to:number, func:any) : number[] {
  var res = [];
  for (var i=from; i<=to; i++) {
    if (func) {
      if (func(i)) {
        res.push(i);
      }
    } else {
      res.push(i);
    }
  }
  return res;
};

