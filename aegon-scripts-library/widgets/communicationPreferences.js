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

      // activate the panel for alert options
      var cp_alerts = $(document).find("input[name=alerts]"),
          cp_alertOpt = $(document).find(".communication_preferences form .alerts-opt");
      $(document).ready(function(){
        if(cp_alerts.is(":checked")){
          cp_alertOpt.addClass('visible');
        }else{
          cp_alertOpt.removeClass('visible');
        }
      });
      cp_alerts.on('click', function () {
        var enabled = $(this).is(":checked");
        cp_alertOpt.toggleClass("visible", enabled);
      });
    },
  };

})(this.document, this, this.jQuery, this.Drupal);
