/**
 * Calculations for the Savings vs. Investment return on investment
 * based on HISTORICAL data for the past 140 years
 */

export class HistoricalRoi {
  data: any;
  constructor(data){
    this.data = data;
  }
  /**
   * Calculates return on investment for savings and invest
   * @param {Number} lower Lower year to start with (inclusive)
   * @param {Number} upper Upper yeat to end with (exclusive)
   * @returns {Object} Result object with:
   * - savings {Number} Savings ROI number (0.06 = 6%)
   * - invest {Number} Investment ROI number
   */
  roi(lower: number, upper: number) : any {
    var startYear = this.data.startYear,
      startIdx = lower - startYear,
      len = upper - lower,
      savingsArray = this.data.savings.slice(startIdx, startIdx + len),
      investArray = this.data.invest.slice(startIdx, startIdx + len),
      reduceFunc = (prevValue, newValue) => {
        return prevValue + newValue;
      },
      roiSavings = (savingsArray.reduce(reduceFunc) / len) * 100,
      roiInvest = (investArray.reduce(reduceFunc) / len) * 100;
    // console.log('savings', roiSavings, '%', lower, upper, 'length', len, 'data', savingsArray);
    // console.log('invest', roiInvest, '%', lower, upper, 'length', len, 'data', investArray);
    return {
      savings: roiSavings,
      invest: roiInvest
    }
  }
};