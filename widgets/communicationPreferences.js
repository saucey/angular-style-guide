/*jshint multistr: true */
/**
 * Mijn Gegevens widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  var testSelector = function (selector) {
    document.querySelector('*');  //checks if querySelector is implemented and raises an error if not
    try {document.querySelector(selector)} catch (e) {return false}
    return true;
  }

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.communicationPreferences = {
    attach: function () {
      Drupal.behaviors.tooltip.activate("#communication_preferences");

      if (!testSelector("form:invalid")) {  //if the userAgent does not know the :invalid pseudoclass, we need the validation workaround provided by validVal
        $("form[name=personal_details_form]").validVal({
          validate: {
            onKeyup: false, //if checking is required in RealTime, this has to be true
          },
        });
      }

    },
  };

})(this.document, this, this.jQuery, this.Drupal);
