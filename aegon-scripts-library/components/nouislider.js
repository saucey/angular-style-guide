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
            Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount");
          }
          if ($('.quickquote.lijfrente.sparen').length) {
            Drupal.behaviors.quickquoteLijfrenteSparen.onChange("#pension-calculated","#interest-amount","#interest-calculated", "#interest-amount-deposito");


          }
        }
      });



        sliderElement.noUiSlider.on('slide', function(){
            // Remove text from errors ( with css :empty remove with keyframes animation - this code should be optimized later : DRY method )
            var oneOffError = $("#one-off-error");
            var periodicError = $("#periodic-error");
            var durationError = $("#duration-error");
            var amountOneOffError = $("#amount-one-off-error");
            var depositDurationError = $("#deposit-duration-error");

            Drupal.behaviors.quickquoteLijfrenteSparen.removeErrorText(oneOffError, 5000);
            Drupal.behaviors.quickquoteLijfrenteSparen.removeErrorText(periodicError, 5000);
            Drupal.behaviors.quickquoteLijfrenteSparen.removeErrorText(durationError, 5000);
            Drupal.behaviors.quickquoteLijfrenteSparen.removeErrorText(amountOneOffError, 5000);
            Drupal.behaviors.quickquoteLijfrenteSparen.removeErrorText(depositDurationError, 5000);
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
