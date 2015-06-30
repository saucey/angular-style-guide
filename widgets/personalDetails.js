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
console.log("attach");
      $("input[name=ra_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]").click();

      $("input[name=ca_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]").click();
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
