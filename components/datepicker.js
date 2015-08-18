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
        $( ".datepicker" ).datepicker({
 //     showOn: "button",
 //     buttonImage: "https://image.freepik.com/free-photo/calendar-31th-vector_318-1908.jpg",
 //     buttonImageOnly: true,
      changeMonth: true,
      changeYear: true,
      buttonText: "Select date"
          });
        });
    }, // end attach
    attached: false,
  }; // end Drupal
})(jQuery); 


