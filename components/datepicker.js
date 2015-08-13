/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.datepicker = {
    attach: function () {
      $( "#datepicker" ).datepicker({
      showButtonPanel: true,
      minDate: -20, 
      maxDate: "+1M +10D"
    });

      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
  };
})(jQuery);


