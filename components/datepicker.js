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
      showOn: "button",
      buttonImage: "images/calendar.gif",
      buttonImageOnly: true,
      buttonText: "Select date"
          });
        });
    }, // end attach
    attached: false,
  }; // end Drupal
})(jQuery); 


