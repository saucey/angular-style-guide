/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.validation = {
    attach: function () {
      this.init();
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,

    init: function () {
      var that = this;
      $("[data-validate]").each( function () {
        var v = this.attributes['data-validate'].value;
        // check if validator key is in the form [key], if not, it needs a . in front for eval
        v = v[0] === "[" ? v : "." + v;
        try {
          var validator = eval("that.validators" + v) || (v.bla.bla); // if validator is empty, also throw an error
        }
        catch (e) {
          window.console && window.console.warn("error getting validator " + v + ". Maybe it was not defined?");
        }
        
        // react to different formats of validator
        switch (typeof validator) {
          case "function":

            break;
          case "object": //regex
            // get rid of the / / around the pattern
            validator = validator.source;
            // if there is already a pattern defined, this takes prevalence
            this.pattern = this.pattern || validator;
            break;
        }
      });
    },

    testSelector: function (selector) {
      if (!document.querySelector) {    //checks if querySelector is implemented and raises an error if not
        throw "Cannot test for selector " + selector + " because document.querySelector is not available.";
      }
      try {document.querySelector(selector)} catch (e) {return false}
      return true;
    },

    test: function () {
      return this.testSelector("form:invalid");
    },
    // fixes form validation for IE, using validVal, since :invalid is not implemented in IE
    IEFix: function (form_selector, keyup) {
      if (!this.test()) {  //if the userAgent does not know the :invalid pseudoclass, we need the validation workaround provided by validVal
        $(form_selector).validVal({
          validate: {
            onKeyup: keyup, //if checking is required in RealTime, this has to be true
          },
        });
      }
    },

    invalid: function (form_selector) {
      if (!this.test()) {
        $(form_selector).trigger( "validate" );
      }
      $(form_selector).find("input, select, textarea").removeClass("blurred").filter(":visible")
      // add blurred, so that validation takes place on all visible elements
        .addClass("blurred");
      try {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred, input:invalid.blurred, select:invalid.blurred, textarea:invalid.blurred").length;
      }
      catch (e) {
        return $(form_selector).find("input.invalid.blurred, select.invalid.blurred, textarea.invalid.blurred").length;        
      }
    },
    // nested validators are possible, enclose non - \w - names in ['']
    validators: {
      ['zip']: {
        nl: /^\s*\d{4}\s*[a-zA-Z]{2}\s*$/,
      },
    }
  };
})(jQuery);
