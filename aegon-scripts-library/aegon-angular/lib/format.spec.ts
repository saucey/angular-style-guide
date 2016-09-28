import { formatNumber } from './format';

describe('formatNumber', () => {

  it('works with one argument', () => {
    expect(formatNumber(0)).toEqual('0');
    expect(formatNumber(1)).toEqual('1');
    expect(formatNumber(1.1234)).toEqual('1,12');
    expect(formatNumber(1e6 + 0.01)).toEqual('1.000.000,01');
  });

  it('works with two arguments - fractional', () => {
    expect(formatNumber(1.1234, true)).toEqual('1,12');
    expect(formatNumber(1.1234, false)).toEqual('1');

    expect(formatNumber(1e6 + 0.01, true)).toEqual('1.000.000,01');
    expect(formatNumber(1e6 + 0.01, false)).toEqual('1.000.000');
  });


  it('works with three arguments - fractional and force decimal', () => {
    expect(formatNumber(0, true, true)).toEqual('0,00');
    expect(formatNumber(1, true, true)).toEqual('1,00');
    expect(formatNumber(1.1111, true, true)).toEqual('1,11');

    expect(formatNumber(1e6, true, true)).toEqual('1.000.000,00');
  });

});
