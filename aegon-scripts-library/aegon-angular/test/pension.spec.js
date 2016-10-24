import {AAPensionForm} from "../components/aa-pension-form/aa-pension-form.component";

(function () {
  'use strict';

  describe('Pension spec new location', function () {
    var qqLijfrente = Drupal.behaviors.quickquoteLijfrente;

    console.log('the spec test!!!');

    describe('Pension spec inner new location', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrente.calculateMonthlyPayment(20, 0)).toEqual(0);
        expect(qqLijfrente.calculateMonthlyPayment('')).toEqual(0);
      });
      it('should return the monthly payment', function() {
        expect(qqLijfrente.calculateMonthlyPayment(10000, 5)).toEqual(174.34);
      });
    });
  });

  describe('Pension spec inner 2 new location', function () {
    var qqLijfrenteSparen = Drupal.behaviors.quickquoteLijfrenteSparen;

    describe('lijfrente berekenen', function () {
      it('should return 0 for invalid input values', function() {
        expect(qqLijfrenteSparen.calculateBuiltUpPension(20,0,0,0,0,0)).toEqual(0);
        expect(qqLijfrenteSparen.calculateBuiltUpPension('')).toEqual(0);
      });
      it('should return the proper values after calculation', function() {
        expect(qqLijfrenteSparen.calculateBuiltUpPension(3333, 150, 1000, 10, 10, 1.25)).toEqual(23012.61);
        expect(qqLijfrenteSparen.calculateBuiltUpPension(10000,100, 0, 10, 10, 1.25)).toEqual(24106.53);
        expect(qqLijfrenteSparen.calculateBuiltUpPension(40000,1000, 5000, 10, 10, 1.25)).toEqual(173444.15);
        expect(qqLijfrenteSparen.calculateBuiltUpPension(80000,0, 60000, 10, 10, 1.25)).toEqual(94363.56);
      });
      it('Calculate the One-off-Inlay with the deposito added', function() {
        expect(qqLijfrenteSparen.calculateSingleInlayPension(3333, 1000, 10, 10, 1.013)).toEqual(3849.96);
        expect(qqLijfrenteSparen.calculateSingleInlayPension(40000, 5000, 10, 10, 1.013)).toEqual(45802.13);
      });

      it('Calculate the One-off-Inlay without the deposito added', function() {
        expect(qqLijfrenteSparen.calculateSingleInlayPension(3333, 0, 10, 10, 1.013)).toEqual(3792.54);
        expect(qqLijfrenteSparen.calculateSingleInlayPension(40000, 0, 10, 10, 1.013)).toEqual(45514.99);
      });

      it('should calculate the amount of interest expressed in Euros', function() {
        expect(qqLijfrenteSparen.calculateInterest(3000, 100, 10, 15800)).toEqual(800);
      });
    });
  });
})();
