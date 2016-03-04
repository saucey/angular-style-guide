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

  //describe('quickquote lijfrente uitkeren', function () {
  //  var qqLijfrenteSparen = Drupal.behaviors.quickquoteLijfrenteSparen;
  //
  //  describe('lijfrente berekenen', function () {
  //    it('should return 0 for invalid input values', function() {
  //      expect(qqLijfrenteSparen.calculateMonthlyPayment(20, 0)).toEqual(0);
  //      expect(qqLijfrenteSparen.calculateMonthlyPayment('')).toEqual(0);
  //    });
  //    it('should return the proper values after calculation (but will fail because these values are not correct)', function() {
  //      expect(qqLijfrenteSparen.calculateMonthlyPayment(10000, 5)).toEqual("174,34");
  //    });
  //  });
  //});
})();
