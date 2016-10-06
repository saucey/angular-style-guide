/**
 * Utility function to parse key value input from text fields
 */
import * as libUtil from "./util";
import * as libXsr from "./xsr";

/**
 * Parses an input string as key value pairs with the following format:
 * this.is.the.key=value; this.is.another.key=value2
 * - Every key/value pair is separated by the ; character
 * - Key is everything before the first =
 * - Value is everything after the first =
 * - Value can be: json string, number or string
 * - Value is first tried to be parsed as json, then number, then string
 * @param {String} str Input string to parse
 * @returns {Object} Returns the input data or new object if not supplied
 */
export function parse (str: string) : any {
	var resultData = {},
	  parseValue = function (value) {
			var result = libUtil.tryParseJson(value);
			// JSON
			if (result !== undefined) {
				return result;
			}
			// Number
			result = +value;
			if (!isNaN(result)) {
				return result;
			}
			// String fallback
			return value;
		},
		parseLine = function (line) {
			let i = line.indexOf('=');
			let key: string;
			let value: any;

			if (i > 0) {
				key = libUtil.trim(line.substring(0, i)) || void 0;
			}

			if (key) {
				value = parseValue(
					libUtil.trim(line.substring(i + 1, line.length))
				);
				return {
					key: key,
					value: value
				};
			}
		};
	// parse the input
	try {
		str = str || '';
		var split = str.split(/;/), // Split the input on ; char
			curKey,
			curValue;
		// Allow separator char (;) in value part. How do we detect that:
		// Check if next key has an = sign; if not: merge value with previous line
		for (let i = split.length - 1; i--; i < 0) {
			let line = split[i];
			// Not = found? merge with previous key (undo split for this value)
			if (line.indexOf('=') === -1) {
				split[i - 1] += ';' + line;
			}
		}
		// Extract value for each line
		split.map((line) => {
			var parsed = parseLine(line);
			if (parsed) {
			  resultData[parsed.key] = parsed.value;
			}
		});
	} catch (e) {
		// Ignore errors
	}
	return resultData;
}
