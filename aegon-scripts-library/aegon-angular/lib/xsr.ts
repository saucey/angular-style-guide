/**
 * Path accessor library to "dot into" an object and get/set values
 * Paths don't need to exist, they will be created dynamically
 * Example: set a.b.c to 'test': xsr.path(object, 'a.b.c', 'test')
 */
import * as libUtil from "./util";

/**
 * Get/set a property of an object by means of path notation, e.g. 'a.b.c.d'
 * @param {Object} obj Object to query
 * @param {String} path Path to request
 * @param {Any} value Value to set path to (optional)
 * @param {Object} options Options (optional)
 * - {Boolean} merge: if true values are merged into multi valued arrays. Otherwise value is overwritten.
 * - {Boolean} dotFunction: if true you can "dot" into functions (e.g. path.function.call); hardly used
 * - {Boolean} arrayValues: if true always set value as an array (easy for multi valued values, and functional style programming)
 * @returns {Object} Value at the path or full object on value set
 * - {Any} value The actual value at requested path
 * - {Any} context The parent object that contains the last value at property
 * - {String} property Property name of the last step. If you do context[property] you get value.
 *
 * EXAMPLE:
 * var obj = {a:{b: 'old'}}
 * - path(obj, 'a.b') -> returns 'old'
 * - path(obj, 'a.b', 'new value') -> updates obj and sets 'old' to 'new value'
 */
export function path(obj: any, path: string = undefined, value: any = undefined, options: any = {}) : any {
  if (path === undefined) {
    return {
      value: obj,
      context: undefined,
      property: undefined
    };
  }
  if (!libUtil.isString(path)) {
    return {
      value: undefined,
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
  split.map((step, idx) => {
    lastStep = step;
    // todo: get multiple values from objects in array, e.g. comments.text for comments: [{text:..}, {text:..}]
    // Reset context & object path not found or dotting into a function
    if (!libUtil.isObject(curObj) || (libUtil.isFunction(curObj) && !dotFunction) ) {
      ctx = undefined;
      curObj = undefined;
    }
    // Only dot into objects, or functions if dotFunction is true
    if (libUtil.isObject(curObj) && (!libUtil.isFunction(curObj) || dotFunction)) {
      ctx = curObj;
      curObj = ctx[step];
      if (doSet && curObj === undefined) {
        if (idx < split.length - 1) {
          curObj = {};
          ctx[step] = curObj;
        }
      }
    }
  });
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



