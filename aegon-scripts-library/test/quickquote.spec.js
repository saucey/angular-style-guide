(function () {
  'use strict';

  describe('quickquote lijfrente uitkeren', function () {
    var qqLijfrente = Drupal.behaviors.quickquoteLijfrente;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrente.calculateMonthlyPayment(20, 0)).toEqual(0);
        expect(qqLijfrente.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return the proper values after calculation (but will fail because these values are not correct)', function() {
        expect(qqLijfrente.calculateMonthlyPayment(10000, 5)).toEqual("174,34");
      });
    });
  });

  describe('quickquote lijfrente sparen', function () {
    var qqLijfrenteSparen = Drupal.behaviors.quickquoteLijfrenteSparen;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrenteSparen.calculateMonthlyPayment(20,0,0,0,0)).toEqual(0);
        expect(qqLijfrenteSparen.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return the proper values after calculation (but will fail because these values are not correct)', function() {
        expect(qqLijfrenteSparen.calculateMonthlyPayment(3333, 150, 1000, 10, 10)).toEqual(23012.61);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(10000,100, 0, 10, 10)).toEqual(24106.52);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(40000,1000, 5000, 10, 10)).toEqual(173444.15);
        expect(qqLijfrenteSparen.calculateMonthlyPayment(80000,0, 60000, 10, 10)).toEqual(94363.56);
      });
    });
  });
})();
