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
  Drupal.behaviors.personalDetailsWidget = {
    validation: {  //  this is part of the form validation routine; when it is working correctly, this should be bumped to a general level
      zip: "^d+\w*$",
    },

    attach: function () {
      Drupal.behaviors.tooltip.activate("#personal_details_widget");

      Drupal.behaviors.validation.IEFix("form[name=personal_details_form]", false);
      Drupal.behaviors.validation.prepareSubmit("form[name=personal_details_form]");

      // activate the tabs for Dutch or foreign addresses
      // residential address
      $("input[name=ra_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]:checked").click();
      // communication address
      $("input[name=ca_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]:checked").click();
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
