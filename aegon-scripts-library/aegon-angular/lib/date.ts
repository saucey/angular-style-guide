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

 * Return date from string
 * @param {any} date String formatted like 'yyyy-mm-dd'.
 * @returns {Date} Date object
 *
 * EXAMPLE
 * - stringToDate('2015-03-21') -> Date object for 2015-03-21
 */
export function stringToDate(date: string) {
  let splitted = this.birthDate.split('-');
  if (splitted.length === 3) {
    return new Date(parseInt(splitted[0], 10), parseInt(splitted[1], 10), parseInt(splitted[2], 10));
  }
  return null;
}

/**
 * Add an amount of years to a date object
 * @param {Date} date Date object .
 * @param {number} years amount of years to add.
 * @returns {Date} Date object
 *
 * EXAMPLE
 * - addYears(new Date(), 30) -> Date object 30 years from now
 * - addYears(new Date(), -10) -> Date object 10 years in the past
 */
export function addYearsToDate(date: Date, years: number) {
  return new Date().setFullYear(date.setFullYear(date.getFullYear() + years));
}



