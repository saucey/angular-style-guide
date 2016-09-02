/**
 * Path accessor library to "dot into" an object and get/set values
 * Paths don't need to exist, they will be created dynamically
 * Example: set path 'a.b.c' to 'test': xsr.path(<object>, 'a.b.c', 'test')
 * Returns: { a: { b: { c: 'test' } } }
 */
import * as libUtil from "./util";

/**
 * Get/set a property of an object by means of path notation, e.g. 'a.b.c.d'
 * @param {Object} obj Object to query
 * @param {String} path Path to get/set
 * @param {Any} value Value to set path to (optional)
 * @param {Object} options Options (optional)
 * - {Boolean} .merge: if true values are merged into multi valued arrays. Otherwise value is overwritten.
 * - {Boolean} .dotFunction: if true you can "dot" into functions (e.g. path.function.call); hardly used
 * - {Boolean} .arrayValues: if true always set value as an array (easy for multi valued values, and functional style programming)
 * @returns {Object} On GET: Value at the path. On SET: value object with properties:
 * - {Any} .value The actual value at requested path
 * - {Any} .context The parent object that contains the last value at property
 * - {String} .property Property name of the last step. If you do context[property] you get actual value (also in .value)
 *
 * EXAMPLE:
 * var obj = {a:{b: 'old'}}
 * - path(obj, 'a.b') -> returns 'old'
 * - path(obj, 'a.b', 'new value') -> updates obj and sets 'old' to 'new value'
 *
 *  todo: get multiple values from objects in array, e.g. comments.text for comments: [{text:..}, {text:..}]
 */
export function path(obj: any, path: string = undefined, value: any = undefined, options: any = {}) : any {
  // Return object if no path supplied, or undefined if not a string
  if (!libUtil.isString(path)) {
    return {
      value: path === undefined ? obj : undefined,
      context: undefined,
      property: undefined
    };
  }
  var split = path.split('.'),
    curObj = obj,
    doSet = value !== undefined,
    ctx,
    shouldMerge = options.merge === true,
    arrayValues = options.arrayValues === true,
    dotFunction = options.dotFunction === true, // Allow "dotting" into functions
    lastStep;
  // Create new object if no input defined
  if (doSet && curObj === undefined) {
    curObj = {};
  }
  // GET CONTEXT
  split.map((step, idx) => {
    lastStep = step;
    // Reset context & object path not found or dotting into a function
    if (!libUtil.isObject(curObj) || (libUtil.isFunction(curObj) && !dotFunction) ) {
      ctx = undefined;
      curObj = undefined;
    }
    // CHANGE CONTEXT
    if (libUtil.isObject(curObj)) {
      ctx = curObj;
      // console.log('step', step, 'ctx', ctx, 'res', ctx[step]);
      curObj = ctx[step]; // Dot into context
      // Auto create non existing paths (todo: make this an option: auto create paths)
      if (doSet && curObj === undefined) {
        if (idx < split.length - 1) {
          curObj = {};
          ctx[step] = curObj;
        }
      }
    }
  });
  // SET
  if (doSet && ctx) {
    if (shouldMerge && ctx[lastStep] !== undefined) {
      // Existing value
      if (libUtil.isArray(ctx[lastStep])) {
        // Push to array
        ctx[lastStep].push(value);
      } else {
        // Migrate current value to array and push new value
        ctx[lastStep] = [ctx[lastStep]];
        ctx[lastStep].push(value);
      }
    } else {
      // No existing value; set value as array
      if (shouldMerge) {
        // Add value in array
        if (arrayValues) {
          ctx[lastStep] = [value];
        } else {
          ctx[lastStep] = value;
        }
      } else {
        // Normal assign override
        ctx[lastStep] = value;
      }
    }
  }
  return {
    value: doSet ? obj : curObj,
    context: ctx,
    property: lastStep
  };
};



