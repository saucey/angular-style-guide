(function () {
  'use strict';

  describe('quickquote lijfrente uitkeren', function () {
    var qqLijfrente = Drupal.behaviors.quickquoteLijfrente;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrente.calculateMonthlyPayment(20, 0)).toEqual(0);
        expect(qqLijfrente.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return the monthly payment', function() {
        expect(qqLijfrente.calculateMonthlyPayment(10000, 5)).toEqual(174.34);
      });
    });
  });

  describe('quickquote lijfrente sparen', function () {
    var qqLijfrenteSparen = Drupal.behaviors.quickquoteLijfrenteSparen;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrenteSparen.calculateMonthlyPayment(20,0,0,0,0,0)).toEqual(0);
        expect(qqLijfrenteSparen.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return the proper values after calculation', function() {
        expect(qqLijfrenteSparen.calculateMonthlyPayment(3333, 150, 1000, 10, 10, 1.25)).toEqual(23012.61);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(10000,100, 0, 10, 10, 1.25)).toEqual(24106.53);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(40000,1000, 5000, 10, 10, 1.25)).toEqual(173444.15);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(80000,0, 60000, 10, 10, 1.25)).toEqual(94363.56);
      });
      it('Calculate the One-off-Inlay with the deposito added', function() {
        expect(qqLijfrenteSparen.calculateOneTimeInlay(3333, 1000, 10, 10, 1.3)).toEqual(33357.69);
        expect(qqLijfrenteSparen.calculateOneTimeInlay(40000, 5000, 10, 10, 1.3)).toEqual(488481.23);
      });

      it('Calculate the One-off-Inlay without the deposito added', function() {
        expect(qqLijfrenteSparen.calculateOneTimeInlay(3333, 0, 10, 10, 1.8)).toEqual(1190036.73);
        expect(qqLijfrenteSparen.calculateOneTimeInlay(40000, 0, 10, 10, 1.8)).toEqual(14281868.91);
      });

      it('should calculate the amount of interest expressed in Euros', function() {
          expect(qqLijfrenteSparen.calculateInterest(3333, 1000, 10, 1000)).toEqual(-122333);
      });
    });
  });
})();
