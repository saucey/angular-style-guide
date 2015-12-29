/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function () {
      function ammount() {
        $( "#ammount-slider" ).slider({
          value:500,
          min: 0,
          max: 5000,
          step: 100,
          slide: function( event, ui ) {
            $( "#ammount-input" ).val( "€" + ui.value );
          }
        });
        $( "#ammount-input" ).val( "€" + $( "#ammount-slider" ).slider( "value" ) );
      }
      ammount();
      function time() {
        $( "#time-slider" ).slider({
          value:10,
          min: 0,
          max: 30,
          step: 1,
          slide: function( event, ui ) {
            $( "#time-input" ).val(ui.value);
          }
        });
        $( "#time-input" ).val( "€" + $( "#ammount-slider" ).slider( "value" ) );
      }
      time();
    }
  };
})(jQuery);