/*
 * Jasmine spec for 
 * aegon-frontend-library/aegon-scripts-library/components/validation.js
 */
(function () {
  'use strict';
  describe('Drupal Behaviors Validation', function () {
  	var validation = Drupal.behaviors.validation.validators;

    describe('IBAN validation', function () {
      var iban = validation.iban.rxs;
      it('should return true for valid Dutch and German IBAN\'s', function() {
        expect('NL91ABNA0417164300').toMatch(iban.nl);
        expect('DE89370400440532013000').toMatch(iban.de);
      });
      it('should return false for invalid Dutch and  German IBAN\'s', function() {
        expect('whatever01234').not.toMatch(iban.nl);
        expect('01234whatever').not.toMatch(iban.de);
      });
    });

    describe('Integer validation', function () {
      it('should return true for numberic inputs', function() {
        expect('999').toMatch(validation.integer);
      });
      it('should return false for not numeric inputs', function() {
        expect('NaN').not.toMatch(validation.integer);
      });
    });

    describe('Text validation', function () {
      it('should return true for alphabetical inputs', function() {
        /* I don't know where this is used, but this regExp includes
         * [a-zA-Z_0-9] so it's not only text.
         */ 
        expect('Word').toMatch(validation.text);
      });
    });

    describe('Email validation', function () {
      it('should return true for valid emails', function() {
        expect('someone@aegon.nl').toMatch(validation.email);
      });
      it('should return false for invalid emails', function() {
        expect('someone@aegon').not.toMatch(validation.email);
      });
    });
    /* Some validations use match() funtion so they will return either an
     * array with the matches found or null if no matches were found.
     */
    describe('Phone validation', function () {
      it('should return an array for valid phone numbers or empy values', function() {
        expect(validation.phone('0612345678')).not.toBeNull();
        expect(validation.phone('')).not.toBeNull();
        expect(validation.phone('0044612345678')).not.toBeNull();
      });
      it('should return null for invalid phone numbers', function() {
        expect(validation.phone('0612345')).toBeNull();
        expect(validation.phone('invalid')).toBeNull();
        });
    });

    describe('Mobile phone validation', function () {
      it('should return an array for valid mobile phone numbers', function() {
        expect(validation.mobile.nl('0612345678')).not.toBeNull();
        expect(validation.mobile.nl('0044612345678')).not.toBeNull();
      });
      it('should return null for invalid phone numbers or empy values', function() {
        expect(validation.mobile.nl('0912345678')).toBeNull();
        expect(validation.mobile.nl('invalid')).toBeNull();
        expect(validation.mobile.nl('')).toBeNull();
      });
    });

    describe('House number validation', function () {
      it('should return an array for valid house numbers', function() {
        expect(validation['house-nr']('6A')).not.toBeNull();
        expect(validation['house-nr']('744')).not.toBeNull();
      });
      it('should return null for invalid house numbers', function() {
        expect(validation['house-nr']('__')).toBeNull();
        expect(validation['house-nr']('...  ')).toBeNull();
      });
    });

  });
})();