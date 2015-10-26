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
  Drupal.behaviors.communicationPreferences = {
    attach: function () {
      Drupal.behaviors.tooltip.activate("#communication_preferences");

      Drupal.behaviors.validation.IEFix("form[name=communication_preferences_form]", false);
    },
  };

})(this.document, this, this.jQuery, this.Drupal);
