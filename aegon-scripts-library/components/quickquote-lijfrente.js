/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function () {
      Drupal.behaviors.tooltip.activate(".quickquote");
      function quickquoteSlider(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep, Currenty) {
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

      quickquoteSlider("#ammount-slider","#ammount-input",500,0,5000,100,"€");
      quickquoteSlider("#time-slider","#time-input",10,0,30,1,"");
      
    }
  };
})(jQuery);