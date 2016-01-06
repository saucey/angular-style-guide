/**
 * jQuery UI Slider
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.slider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep, Currenty) {
      Drupal.behaviors.tooltip.activate(".quickquote");
      $(sliderClass).slider({
        range: "max",
        value:sliderValue,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        slide: function( event, ui ) {
          $(inputClass).val( Currenty + ui.value );
        }
      });
      $(inputClass).val( Currenty + $(sliderClass).slider( "value" ) );
      $(inputClass).keyup(function() {
        $(sliderClass).slider("value" , $(this).val().replace(/\u20ac/g, ''))
      });
    }
  };
})(jQuery); 