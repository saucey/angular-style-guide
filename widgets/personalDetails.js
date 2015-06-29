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
console.log("changed ra " + this);
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
