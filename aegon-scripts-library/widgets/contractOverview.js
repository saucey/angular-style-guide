/*jshint multistr: true */
/**
 * Contract Overview
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * Contract Overview's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.contractOverview = {
    attach: function () {
      Drupal.behaviors.tooltip.activate(".contract_overview_widget", "top");
    }
  };

})(this.document, this, this.jQuery, this.Drupal);