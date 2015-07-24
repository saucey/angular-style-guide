/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.validation = {
    attach: function () {
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,

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
    // 
    prepareSubmit: function (form_selector) {
      // use filter, because the first selector on its own runs a lot faster without :visible and filter then only takes up the selection
console.log("fs " + form_selector);
      $(form_selector).submit( function () {
        $(form_selector).find("input, select, textarea").filter(":visible")
        // add blurred, so that validation takes place on all visible elements
          .addClass("blurred");
      });
    }
  };
})(jQuery);
