/**
 * Number formatting, parsing, rounding utils
 */

/**
 * Round number to supplied number of decimals, e.g. 10,277754 -> 10,28
 * @param {Number} input Input number to round
 * @param {Number} decimals The number of decimals to round to.
 * - Positive: fractional rounding, e.g. 3: round to 3 digits precision
 * - Negative: multiples rounding, e.g. -3: round to 1000's
 * @returns {number} The rounded number
 *
 * EXAMPLE
 * - round(12345.6789, 2) -> 12345.68
 * - round(12345.6789, -2) -> 12300
 */
export function round(input:number, decimals:number = 0):number {
  var factor = Math.pow(10, decimals);
  return Math.round(input * factor) / factor;
}

/**
 * Format number, e.g.: 100.000,34 (dutch localization)
 * @param {Boolean} fractional Use the fractional part or omit it
 * @param {Boolean} forceDecimals Force the addition of ,00 for the output
 * @returns {String} The fully formatted number
 */
export function formatNumber(value: any, fractional: boolean = true, forceDecimals: boolean = false): string {
  // Round to 2 fraction digits. We don't use toFixed(), because we won't enforce the fractional part on round numbers.
  value = Math.round(parseFloat(value) * 100) / 100;
  if (isNaN(value)) {
    return '';
  }
  let regExp = /(\d+)(\d{3})/,
    tokens = String(value).split('.'),
    thousandsSeparated = tokens[0].replace(/^\d+/, (w) => {
      while (regExp.test(w)) {
        w = w.replace(regExp, '$1.$2');
      }
      return w;
    });
  if (tokens[1] && fractional) {
    let zero = tokens[1].length === 1 ? '0' : '';
    return thousandsSeparated + ',' + tokens[1] + zero;
  } else {
    if (forceDecimals) {
      return thousandsSeparated + ',00';
    }
    return thousandsSeparated;
  }
}

/**
 * Parse input number and return Javascript number
 * Input format is assumed to be in DUTCH localization: 12.345,67 (for 12345.67)
 * @param {String} value Input to parse
 * @returns {Number} Parsed value
 */
export function parseNumber(value: any): number {
  if (typeof value === 'number') {
    // Nothing to do.
    return value;
  }
  // Remove all dots, assuming they're thousands separators and replace comma's with dots for proper float parsing.
  value = parseFloat(value.replace(/\./g, '').replace(',', '.'));
  if (isNaN(value)) {
    return null;
  } else {
    // Round to 2 fraction digits.
    value = Math.round(parseFloat(value) * 100) / 100;
    return value;
  }
}

/*
 * Rounds integers to the closest
 * multiple of 10.
 * @param num {number}: the int number
 * @param deg {number}: the multiple of 10 to round to.
 */
export function roundToTenth(num: number, round: number): number {
  /*
   * If the int is multiple of the round
   * returns the same number
   */
  if(num % round === 0) {
    return num;
  }
  return Math.ceil(num / round) * round;
}


/**
 * Read attribute from element and try to return a number
 * @param {Element} element DOM element to get attribute from
 * @param {String} name Attribute name to get value from
 * @param {Number} fallback Fallback result if value not available or parsing fails
 * @returns {Number} Parsed value or fallback value on fail
 */
export function numberFromAttribute(element: Element, name:string, fallback:number = 0) : number {
  if (!element || !element.getAttribute) {
    return fallback;
  }
  var str = element.getAttribute(name),
    num = str ? parseFloat(str) : fallback;
  return isNaN(num) ? fallback : num;
}

/**
 * Convert number to zero padded String of given length.
 * @param {number} num Number to pad.
 * @param {number} len Length of the String to which we pad the number.
 */
export function zeroPad(num: number, len: number): String {
  var zero = len - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
