// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.newSlider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,quarterValue,halfValue,threeQuarterValue,errorClass,errorText) {
      var sliderElement = document.getElementById(sliderClass);
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
      noUiSlider.create(sliderElement, settings);

      sliderElement.noUiSlider.on('update', function ( values, handle) {
        if ( handle === 0 ) {
          inputSlider.value = values[handle];
          if ($('.quickquote.lijfrente.uitkeren').length) {
            Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
          }
          if ($('.quickquote.lijfrente.sparen').length) {
            //console.log(Drupal.behaviors.quickquoteLijfrenteSparen.synchronizingSlider());
          }
        }
        $(errorClass).hide();
      });

      inputSlider.addEventListener('change', function ( ) {
        var inputValue =  $(this).val().replace('.', '');
        if (inputValue < sliderMin || inputValue > sliderMax) {
          $(errorClass).show().text(errorText);
        }
        sliderElement.noUiSlider.set(this.value);
      });

    }
  };
})(jQuery);
