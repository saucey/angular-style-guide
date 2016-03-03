(function () {
  'use strict';

  var calculator = {
    add: function (arg1, arg2) {
      return arg1 + arg2;
    }
  };

  describe('calculator', function() {
    describe('add()', function() {
      it('should add 2 numbers togoether', function() {
        // assertions here
        expect(calculator.add(1, 4)).toEqual(5);
      });
    });
  });

  //var Drupal = require('../vendor/drupal_misc/drupal.js');
  var qq = require('../components/quickquote-lijfrente.js');

  describe('quickquote lijfrente uitkeren', function () {
    var qq = Drupal.behaviors.quickquoteLijfrente;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qq.calculateMonthlyPayment('foo', 'bar')).toEqual(0);
        expect(qq.calculateMonthlyPayment(20, 0)).toEqual(0);
        expect(qq.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return some values (but will fail because these values are not correct)', function() {
        expect(qq.calculateMonthlyPayment(1, 2)).toEqual(9000);
        expect(qq.calculateMonthlyPayment(3, 4)).toEqual(300);
        expect(qq.calculateMonthlyPayment(5, 6)).toEqual(750);
      });
    });
  });
})();
