/**
 * Date utils
 */

import {isString, isDate} from "angular2/src/facade/lang";

/**
 * Calculate the current age, given a certain date.
 * @param {any} birthDate Date object or String formatted like 'yyyy-mm-dd'.
 * @returns {number} The rounded number
 *
 * EXAMPLE
 * - round(12345.6789, 2) -> 12345.68
 * - round(12345.6789, -2) -> 12300
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