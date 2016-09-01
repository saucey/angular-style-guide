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
// Create body for form POST data
// https://code.google.com/archive/p/form-serialize/downloads
export function serializeForm(form: any): any {
	if (!form || form.nodeName !== "FORM") {
		return {};
	}
	var i, j,
		result = {},
		addResult = function (name, value) {
			result[name] = value;
		};
	for (i = form.elements.length - 1; i >= 0; i = i - 1) {
		// Only add named fields
		if (form.elements[i].name === "") {
			continue;
		}
		let field = form.elements[i],
			fieldName = field.name,
			fieldNodeName = field.nodeName,
			type = field.type,
			fieldValue = field.value;
		switch (fieldNodeName) {
			case 'INPUT':
				switch (field.type) {
					case 'text':
					case 'hidden':
					case 'password':
					case 'button':
					case 'reset':
					case 'submit':
						addResult(fieldName, fieldValue);
						break;
					case 'checkbox':
					case 'radio':
						if (field.checked) {
							addResult(fieldName, fieldValue);
						}
						break;
					case 'file':
						break;
				}
				break;
			case 'TEXTAREA':
				addResult(fieldName, fieldValue);
				break;
			case 'SELECT':
				switch (type) {
					case 'select-one':
						addResult(fieldName, fieldValue);
						break;
					case 'select-multiple':
						for (j = field.options.length - 1; j >= 0; j = j - 1) {
							if (field.options[j].selected) {
								addResult(fieldName, field.options[j].value);
							}
						}
						break;
				}
				break;
			case 'BUTTON':
				switch (type) {
					case 'reset':
					case 'submit':
					case 'button':
						addResult(fieldName, fieldValue);
						break;
				}
				break;
		}
	}
	console.log('libDom', result);
	return result;
}