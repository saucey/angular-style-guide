/**
 * Example JavaScript component
 */
// Closure with jQuery support

// jQuery-UI slider

(function($) {
  'use strict';

  // Add new item to public Drupal object
    Drupal.behaviors.slider = {
      attach: function () {
      $(function() {
    $( "#slider-1" ).slider({
      range: "max",
      min: 0,
      max: 10,
      value: 0,
      animate:"slow",
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
      });
  });

    }, // hoort bij attach
    attached: false,
  }; // hoort bij Drupal
})(jQuery); // hoort bij function($)
