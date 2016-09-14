(function () {
  'use strict';
  describe('Drupal Behaviors Validation', function () {
  	var validation = Drupal.behaviors.validation.validators;

    describe('Integer validation', function () {
      it('should return false for not numeric inputs', function() {
        expect('NaN').not.toMatch(validation.integer);
      });
      it('should return true for numberic inputs', function() {
        expect('999').toMatch(validation.integer);
      });
    });

    describe('Text validation', function () {
      it('should return true for alphabetical inputs', function() {
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

    describe('Phone validation', function () {
      it('should return true for valid phone numbers', function() {
        expect(validation.phone('0612345678')).not.toBeNull();
        expect(validation.phone('0044612345678')).not.toBeNull();
      });
      it('should return false for invalid phone numbers', function() {
        expect(validation.phone('0612345')).toBeNull();
        expect(validation.phone('invalid')).toBeNull();
      });
	});

    describe('Mobile phone validation', function () {
      it('should return true for valid mobile phone numbers', function() {
        expect(validation.mobile.nl('0612345678')).not.toBeNull();
        expect(validation.mobile.nl('0044612345678')).not.toBeNull();
      });
      it('should return false for invalid phone numbers', function() {
        expect(validation.mobile.nl('0912345678')).toBeNull();
        expect(validation.mobile.nl('invalid')).toBeNull();
      });
	});
  });
})();