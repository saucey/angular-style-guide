/**
 * Example JavaScript component
 */
// Closure with jQuery support

// datepicker

(function($) {
  'use strict';

  // Add new item to public Drupal object
    Drupal.behaviors.datepicker = {
      attach: function () {
      $(function() {
        $( "#datepicker" ).datepicker({
      showButtonPanel: true,
      minDate: -20, 
      maxDate: "+1M +10D",
      changeMonth: true,
      changeYear: true
          });
        });
    }, // end attach
    attached: false,
  }; // end Drupal
})(jQuery); 


