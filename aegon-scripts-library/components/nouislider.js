// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.nouislider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,quarterValue,halfValue,threeQuarterValue,errorClass,errorText) {
      var newSlider = document.getElementById(sliderClass);
      var inputSlider = document.getElementById(inputClass);
      var settings = {
        start: [ sliderValue ],
        range: {
          'min': [  sliderMin ],
          '25%': [  quarterValue ],
          '50%': [  halfValue ],
          '75%': [  threeQuarterValue ],
          'max': [ sliderMax ]
        },
        format: wNumb({
          decimals: 0,
          thousand: '.'
        })
      };

      noUiSlider.create(newSlider, settings);

      newSlider.noUiSlider.on('update', function ( values, handle) {
        if ( handle === 0 ) {
          inputSlider.value = values[handle];
        }
        $(errorClass).hide();
        Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
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
