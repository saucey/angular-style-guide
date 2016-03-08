// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.nouislider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep,errorClass,errorText,currency, options) {
      var newSlider = document.getElementById(sliderClass);
      var inputSlider = document.getElementById(inputClass);

      var defaults = {
        start: [ sliderValue ],
        range: {
          'min': [  sliderMin ],
          '30%': [  sliderMin + 1000 ],
          '70%': [  sliderMax - 1000 ],
          'max': [ sliderMax ]
        },
        format: wNumb({
          decimals: 0,
          thousand: '.'
        })
      };

      var settings = $.extend({}, defaults, options);

      noUiSlider.create(newSlider, settings);

      newSlider.noUiSlider.on('update', function ( values, handle) {
        if ( handle === 0 ) {
          inputSlider.value = values[handle];
        }
        $(errorClass).hide();
      });

      inputSlider.addEventListener('change', function ( ) {
        var inputValue =  $(this).val().replace('.', '');
        if (inputValue < sliderMin || inputValue > sliderMax) {
          $(errorClass).show().text(errorText);
        }
        newSlider.noUiSlider.set(this.value);
      });
    }
  };
})(jQuery);
