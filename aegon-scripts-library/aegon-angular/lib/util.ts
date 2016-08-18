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
    args,
    runFunc = () => {
    	var res;
      timeout = undefined;
      lastTime = new Date().getTime();
      res = func.apply(this, args);
      args = undefined;
      return res;
    }
	return function() {
    // Already waiting for timeout
  	args = arguments;
	  if (timeout) {
	  	// Update arguments
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

export function jsonAttribute(element:any, name: string) : any {
	if (!element || !element.getAttribute) {
		return;
	}
  var str = element.getAttribute(name),
  	json;
	try {
		json = JSON.parse(str);
	} catch (e) {
		// Ignore;
		return;
	}
	return json;
}

/**
 * Simple deepclone by just serializing/deserializing object
 * @param {Object} obj Object to clone
 * @returns {Object} New deep cloned object
 */
export function clone(obj:any) : any {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Simple deep equal function
 * @param {Any} val1 First value to compare
 * @param {Any} val2 Second value to compare
 * @returns {Boolean} True if objects/values are deeply equal.
 * - JS objects are compared by stringified value. JS objects don't have
 *   ordered fields, so serializing it to JSON should give fields in random order.
 * - However in practice fields are serialized in definition order.
 * - This means that: {a: 1, b: 2} and {b: 2, a: 1} are not equal by this function!
 */
export function equal(val1: any, val2: any) : boolean {
	return JSON.stringify(val1) === JSON.stringify(val2);
}

/**
 * Merges two object and fills in omitted properties with values from the supplied
 * default object
 */
export function mergeObjects(sourceObj: any = {}, mergeObj: any = {}) : any {
	var result = clone(sourceObj),
		keys = Object.keys(mergeObj);
	// Add keys to result object
	keys.map((key) => {
		result[key] = mergeObj[key];
	})
	return result;
}

/**
 * Check whether input is an object
 * @param {Object} obj Object to check
 * @returns {Boolean} True of input is object
 */
export function isObject(input) : boolean {
	return (typeof input === "object") && (input !== null);
}

/**
 * Check whether input is a function
 * @param {Any} input Input to check
 * @returns {Boolean} True if input is a function
 */
 export function isFunction(input) : boolean {
	return (typeof input === "function");
}

/**
 * Check whether input is a string
 * @param {Any} input Input to check
 * @returns {Boolean} True if input is a string
 */
export function isString(input) : boolean {
	return (typeof input === 'string');
}

/**
 * Check whether input is a array
 * @param {Any} input Input to check
 * @returns {Boolean} True if input is an array
 */
export function isArray(input) : boolean {
	return (input instanceof Array);
}

