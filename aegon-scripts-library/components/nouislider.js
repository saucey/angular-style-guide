// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.newSlider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,quarterValue,halfValue,threeQuarterValue,errorClass) {
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


      //Synchronizing slider ranges on change of first slider.
      //TODO: remove from slider.js
      var oneOffSlider = document.getElementById('one-off-slider');
      var oneOffSliderInput = document.getElementById('one-off-input');
      var depositSlider = document.getElementById('amount-one-off-slider');
      function updateDepositRange (min, max ) {
        depositSlider.noUiSlider.updateOptions({
          range: {
            'min': min,
            'max': max
          }
        });
      }
      oneOffSlider.noUiSlider.on('change', function ( values, handle) {
        if ( handle === 0 ) {
          oneOffSliderInput.value = values[handle];
          if ($('.quickquote.lijfrente.sparen').length) {
            var sliderValue = oneOffSlider.noUiSlider.get().replace(/\./g , '');
            updateDepositRange(0, parseInt(sliderValue));
          }
        }
      });

      sliderElement.noUiSlider.on('update', function ( values, handle) {
        if ( handle === 0 ) {
          inputSlider.value = values[handle];
          if ($('#qqUitkeren').length) {
            Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount");
          }
          if ($('#qqSparen').length) {
            Drupal.behaviors.quickquoteLijfrenteSparen.onChange("#pension-calculated","#interest-amount","#interest-calculated", "#interest-amount-deposito");
          }
          if ($('#qqBeleggen').length) {
            Drupal.behaviors.quickquoteBeleggen.onChange("#savings-calculated","#interestSavings","#inlay-calculated","#investment-calculated", "#interestInvest");
          }
        }
      });


      inputSlider.addEventListener('change', function ( ) {
        var inputValue =  $(this).val().replace('.', '');
        if (inputValue < sliderMin || inputValue > sliderMax) {
          $(errorClass).css("display","block");
            setTimeout(function () {
                $(errorClass).fadeOut(1500);
            }, 1500);
        }
        sliderElement.noUiSlider.set(this.value);
      });

    }
  };
})(jQuery);
