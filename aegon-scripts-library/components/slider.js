// /**
//  * jQuery UI Slider. This function is being commented out because the slider should be made generic from /components/quickquote-lijfrente.js
//  */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.slider = {
    activate: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep, options) {

      // Creates dot between thousands
      function readableNumber(number,location) {
        if (location === "slider") {
          var sliderNumber = number.toLocaleString();
          sliderNumber = sliderNumber.replace(/,/g, '.');
          return sliderNumber;
        }
        else if (location === "input") {
          console.log("in input function: " + number);
          var inputNumber = number.replace(/(,00)|\./g, "");
          console.log("in input function: " + inputNumber);
          return inputNumber;
        }
      }

      // Default options
      var defaults = {
        range: "max",
        value:sliderValue,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        slide: function( event, ui ) {
          $(inputClass).val(readableNumber(ui.value, "slider") );
        }
      };

      // Extend default options (optional)
      var settings = $.extend({}, defaults, options);

      // Init slider
      $(sliderClass).slider(settings);

      $(inputClass).val($(sliderClass).slider("value"));
      $(inputClass).change(function() {
        var inputValue = $(this).val();
        inputValue = readableNumber(inputValue, "input");
        console.log ("in change function: " + inputValue);
        $(sliderClass).slider("value" , $(this).val().replace(/(,00)|\./g, ""));
      });
    }
  };
})(jQuery);
