/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
    Drupal.behaviors.slider = {
      attach: function () {

     if($.ui){
     alert("jQuery-UI is loaded");//jQuery UI is loaded
     }
     else
     {
       alert("jQuery-UI not loaded");//jQuery UI is not loaded
     } 

     $(function() {
    $( "#slider-1" ).slider();
  });

    }, // hoort bij attach
    attached: false,
  }; // hoort bij Drupal
})(jQuery); // hoort bij function($)

