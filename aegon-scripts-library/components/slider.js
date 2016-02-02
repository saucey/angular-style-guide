// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.slider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep,linearArray,currency, options) {
      if (linearArray !== "") {
        sliderMax = linearArray.length - 1;
      }
      var inputValue =  $(inputClass).val().replace('.', '');
      // Default options
      var defaults = {
        range: "max",
        value: 0,
        //min: sliderMin,
        max: sliderMax,
        //step: sliderStep,
        slide: function( event, ui ) {
          if (linearArray !== "") {
            $(inputClass).val(linearArray[ui.value]);
          }
          else {
            $(inputClass).val(ui.value);
          }
        }
      };

      // Extend default options (optional)
      var settings = $.extend({}, defaults, options);

      // Init slider
      $(sliderClass).slider(settings);

      $(inputClass).change(function() {
        $(sliderClass).slider("value" , inputValue);
      });
    }
  };
})(jQuery);
