(function () {
  'use strict';

  describe('quickquote lijfrente uitkeren', function () {
    var qq = Drupal.behaviors.quickquoteLijfrente;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qq.calculateMonthlyPayment(20, 0)).toEqual(0);
        expect(qq.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return some values (but will fail because these values are not correct)', function() {
        expect(qq.calculateMonthlyPayment(10000, 5)).toEqual("174,34");
      });
    });
  });
})();
