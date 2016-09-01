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
  console.log(years, mons, days, hours, mins)
  return [years, mons, days, hours, mins].join('');
}