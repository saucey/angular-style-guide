/**
 * DOM manipulation library
 */
import * as libUtil from "./util";

/**
 * Add class names to an element
 * @param {Element} elem Element to modify
 * @param {String|String[]} names Class name(s) to add
 */
export function addClass(elem : any, names : any) : void {
	names = libUtil.isArray(names) ? names : [names];
	var clArray = elem.className.split(' ');
	clArray = clArray.concat(names);
	clArray = libUtil.uniqueArray(clArray);
	elem.className = clArray.join(' ');
}

/**
 * Remove classes from an element
 * @param {Element} elem Element to modify
 * @param {String|String[]} names Class name(s) to remove
 */
export function removeClass(elem : any, names : any) : void {
	names = libUtil.isArray(names) ? names : [names];
	var clArray = elem.className.split(' '),
		clObject = {};
	// Save current class names
	clArray.map((key) => {
		clObject[key] = true;
	});
	// Remove the ones to remove
	names.map((key) => {
		delete clObject[key];
	});
	// Create class string and put on element
	clArray = Object.keys(clObject);
	elem.className = clArray.join(' ');
}

/**
 * Toggle class name on element
 * @param {Element} elem HTML element reference to set class on
 * @param {String} name Name of the class to toggle
 */
export function toggleClass(elem : any, name : string) : void {
	var cl = elem.className.split(' ');
	if (cl.indexOf(name) === -1) {
		cl.push(name);
	}
	elem.className = cl.join(' ');
}

/**
 * Add dynamic css to the document
 * @param {String} css CSS string to add
 * @param {Object} options Options:
 *   - {Boolean} .prepend Prepend to head instead of append
 */
var cssInserted = {};
export function insertCss(css: string, options: any): void {
	if (!css || cssInserted[css]) return;
	cssInserted[css] = true;

	// Create style element
	var elem = document.createElement('style');
	elem.setAttribute('type', 'text/css');
	if ('textContent' in elem) {
		elem.textContent = css;
	} else {
		elem['styleSheet'].cssText = css;
	}

	// Add to DOM
	var head = document.getElementsByTagName('head')[0];
	if (options && options.prepend) {
		head.insertBefore(elem, head.childNodes[0]);
	}
	else {
		head.appendChild(elem);
	}
};
