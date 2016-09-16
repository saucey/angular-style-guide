/**
 * Date utils
 */

import {isString, isDate} from "angular2/src/facade/lang";

/**
 * Calculate the current age, given a certain date.
 * @param {any} birthDate Date object or String formatted like 'yyyy-mm-dd'.
 */
export function calculateAge(birthDate: any): number {
  let age: number;

  if (isString(birthDate)) {
    // Convert String to Date.
    let tokens: string[] = birthDate.split("-"),
        year = parseInt(tokens[0], 10),
        month = parseInt(tokens[1], 10) - 1,
        day = parseInt(tokens[2], 10);
    birthDate = new Date(year, month, day, 0, 0, 0, 0);
  }

  if (isDate(birthDate)) {
    // It's a valid date.
    let today = new Date(),
      m = today.getMonth() - birthDate.getMonth();
    age = today.getFullYear() - birthDate.getFullYear();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
  }
  return age;
}

/**
 * Format date as a sortable string: YYYYMMDDHHMM
 */
export function formatDateSorted(input : any) : string {
  var pad = function pad(number, padTo) {
      return ('00000000000000000000' + number.toString()).slice(-padTo);
    },
    date = isDate(input) ? input : isString(input) ? new Date(input) : new Date(),
    years = date.getFullYear(),
    mons = pad(date.getMonth() + 1, 2),
    days = pad(date.getDate(), 2),
    hours = pad(date.getHours(), 2),
    mins = pad(date.getMinutes(), 2);
  return [years, mons, days, hours, mins].join('');
}
/**
 * Return date from string
 * @param {any} date String formatted like 'yyyy-mm-dd'.
 * @returns {Date} Date object
 *
 * EXAMPLE
 * - stringToDate('2015-03-21') -> Date object for 2015-03-21
 */
export function stringToDate(date: string): Date {
  let splitted = this.birthDate.split('-');
  if (splitted.length === 3) {
    return new Date(parseInt(splitted[0], 10), parseInt(splitted[1], 10), parseInt(splitted[2], 10));
  }
  return null;
}


/**
 * Clone a Date object
 * @param {Date} date Date object.
 * @returns {Date} Date object
 *
 * EXAMPLE
 * - cloneDate(new Date()) -> Date object
 */
export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}


/**
 * Add an amount of years to a date object
 * @param {Date} date Date object.
 * @param {number} years amount of years to add.
 * @returns {Date} Date object
 *
 * EXAMPLE
 * - addYearsToDate(new Date(), 30) -> Date object 30 years from now
 * - addYearsToDate(new Date(), -10) -> Date object 10 years in the past
 */
export function addYearsToDate(date: Date, years: number): void {
  date.setFullYear(date.getFullYear() + years);
}


/**
 * Resturn the difference between two dates as years
 * @param {Date} date Date object.
 * @param {Date} date Date object.
 * @returns {number} Amount of years
 *
 * EXAMPLE
 * - getDateDiffInYears(dateObject, dateObject) -> Number of years
 */
export function getDateDiffInYears(dateOne: Date, dateTwo: Date): number {
  let timeDiff = Math.abs(dateTwo.getTime() - dateOne.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24 * 365));
}

/*
 * Validates date strings in format yyyy-mm-dd
 * @param {string} date: date string in format yyyy-mm-dd.
 * @param {boolean} future. If it should be a future date.
 * @returns {boolean} if is valid date.
 *
 * EXAMPLE
 * - validateDate('1867-15-12') -> false (There's no 15th month)
 * - validateDate('1867-12-15') -> true
 */
export function validateDate(date: string, future: boolean = false): boolean {
  // Accepted date format RegExp (yyyy-mm-dd).
  let dateFmt = /^\d{4}\-\d{2}\-\d{2}$/;

  if (!dateFmt.test(date)) {
    return false;
  }

  // Divide year, month and day.
  let y = date.slice(0, 4),
      m = date.slice(5, 7),
      d = date.slice(-2);

  // Month and day validation.
  if (parseInt(m) > 12 || parseInt(d) > 31) {
    return false;
  } 
  else {
    // Checks if the day number is higher than the available in the month.
    if ((m == '04' || m == '06' || m == '09' || m == '11') && +d > 30) {
      return false;
    }
    // February check.
    if (m == '02') {
      // Checks if the day is higher than 29.
      if (parseInt(d) > 29) {
         return false;
      } else {
        // Leap year day validation.
        if (!(((+y % 4 === 0) && (+y % 100 !== 0)) || (+y % 400 === 0)) && parseInt(d) > 28) {
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
