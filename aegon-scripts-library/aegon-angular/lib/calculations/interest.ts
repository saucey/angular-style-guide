/**
 * Calculations related to inlay, interest and compound interest
 */
import * as libFormat from "../format";

/**********
 * Basic
*/

/**
 * Calculates the total inlay based on initial and periodic inlay, after a period of time
 * @param {Number} initialInlay The initial inlay amount
 * @param {Number} periodicInlay The periodic inlay amount
 * @param {Number} periodCount The number of periods to calculate
 * @returns {Number} The total inlay at the end of the period
 */
export function inlayResult(initialInlay: number, periodicInlay: number, periodCount: number) : number {
  return initialInlay + (12 * periodicInlay * periodCount);
}

/**
 * Calculates the accumulated amount at the end of the period based on initial and periodic inlay
 * @param {Number} initialInlay The initial inlay amount
 * @param {Number} periodicInlay The periodic inlay amount
 * @param {Number} periodCount The number of periods to calculate
 * @param {Number} interest The interest in percentages, e.g. 6.1 (not as 0.061)
 * @param {Number} round Round the result to the given number of decimals.
 * - Negative values are accepted, e.g. to round on 1000 (round=-3)
 * - Example: 123,4567 becomes 123,46 (round=2), and 120 (round=-2)
 * @returns {Number} The total amount at the end of the period
 */
export function interestResult(initialInlay: number = 0, periodicInlay: number = 0, periodCount: number = 1, interest:number = 0, round:number = 0) : number {
  if (isNaN(initialInlay) || isNaN(periodCount)) {
    return 0;
  }
  var numMonths = 12 * periodCount,
    interestFactor = 1 + (interest / 100),
    monthlyInterest = Math.pow(interestFactor, 1 / 12) - 1,
    totalInterest = Math.pow(1 + monthlyInterest, numMonths) - 1,
    futureValue = periodicInlay * (totalInterest / monthlyInterest) * (1 + monthlyInterest),
    futureinitialInlay = initialInlay * (1 + totalInterest);
  return libFormat.round(futureValue + futureinitialInlay, round);
}

/**********
 * Series
*/

/**
 * Calculates a series of interest results, simulating a time period. Useful for charts.
 * @param {Number} initialInlay The initial inlay amount
 * @param {Number} periodicInlay The periodic inlay amount
 * @param {Number} periodCount The number of periods, e.g. in months or years
 * @param {Number} round Round the result to the given number of decimals.
 * - Negative values are accepted, e.g. to round on 1000 (round=-3)
 * - Example: 123,4567 becomes 123,46 (round=2), and 120 (round=-2)
 * @returns {Number[]} For every period contains the total inlay at the end of that period
 */
export function interestSeries(initialInlay: number = 0, periodicInlay: number = 0, periodCount: number = 1, interest:number = 0, round:number = 0) : number[] {
  var result = [];
  for(var i=0; i <= periodCount; i++){
    result.push(this.interestResult(initialInlay, periodicInlay, i, interest, round));
  }
  return result;
}

/**
 * Calculates a series of inlay numbers, simulating a time period. Useful for charts.
 * @param {Number} initialInlay The initial inlay amount
 * @param {Number} periodicInlay The periodic inlay amount
 * @param {Number} periodCount The number of periods, e.g. in months or years
 * @returns {Number[]} For every period contains the total inlay at the end of that period
 */
export function inlaySeries(initialInlay: number, periodicInlay: number, periodCount: number) : number[] {
  var result = [];
  for(var i=0; i <= periodCount; i++){
    result.push(this.inlayResult(initialInlay, periodicInlay, i));
  }
  return result;
}

