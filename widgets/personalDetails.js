/*jshint multistr: true */
/**
 * Mijn Gegevens widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.personalDetailsWidget = {
    attach: function () {
      Drupal.behaviors.tooltip.activate("#personal_details_widget");

      Drupal.behaviors.validation.IEFix("form[name=personal_details_form]", false);
      // Drupal.behaviors.validation.otherFix("form[name=personal_details_form]", false);

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
      this.attached = true;
    },
    attached: false,
  };

})(this.document, this, this.jQuery, this.Drupal);
