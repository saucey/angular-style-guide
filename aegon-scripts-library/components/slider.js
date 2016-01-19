// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.slider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep,currency, options) {

      // Default options
      var defaults = {
        range: "max",
        value:sliderValue,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        slide: function( event, ui ) {
          $(inputClass).val( currency + ui.value );
        }
      };

      // Extend default options (optional)
      var settings = $.extend({}, defaults, options);

      // Init slider
      $(sliderClass).slider(settings);

      $(inputClass).val( currency + $(sliderClass).slider("value"));
      $(inputClass).keyup(function() {
        $(sliderClass).slider("value" , $(this).val().replace(currency, ''));
      });
    }
  };
})(jQuery);
