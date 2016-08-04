/*
 * Here goes all validation function as exportable
 * so they can be reused.
 */

/*
 * Validates date strings
 * @param date: date string in format yyyy-mm-dd
 * @param future: boolean. If it should be a furure date
 * @return boolean
 */
export function validateDate(date: string, future: boolean = false): boolean {
	// Accepted date format RegExp (yyyy-mm-dd).
	let dateFmt = /^\d{4}\-\d{2}\-\d{2}$/;

	if (!dateFmt.test(date)) {
		return false;
	}

	let d, m, y;
	// Divide year, month and day.
	y = date.slice(0, 4);
	m = date.slice(5, 7);
	d = date.slice(-2);

	// Month and day validation.
	if (parseInt(m) > 12 || parseInt(d) > 31) {
		return false;
	} 
	else {
		// Checks if the day number is higher than the month has.
		if ((m == '04' || m == '06' || m == '09' || m == '11') && d > 30) {
	    	return false;
	  	}
		// February check.
		if (m == '02') {
	    	// Checks if the day is higher than 29.
	    	if (parseInt(d) > 29) {
	      		return false;
	    	} 
	    	else {
	      		// Leap year day validation.
	      		if (!(((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)) && parseInt(d) > 28) {
	        		return false;
	      		}
	    	}
	  	}
	}
	/* If passed, checks the given date
	 * to be a future date.
	 */
	if(future) {
		let fDate = new Date(date);
		let today = new Date();

		if(fDate <= today) {
			return false;
		}
	}

	// Passed all validations.
	return true;
}
