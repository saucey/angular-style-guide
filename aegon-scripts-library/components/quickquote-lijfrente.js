/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {
      Drupal.behaviors.quickquote.slider("#amount-slider","#amount-input",1000,0,100000,100,"€");
      Drupal.behaviors.quickquote.slider("#time-slider","#time-input",10,0,30,1,"");
    },
    slider: function(sliderClass,inputClass,sliderValue,sliderMin,sliderMax,sliderStep,Currenty) {
      Drupal.behaviors.tooltip.activate(".quickquote");
      $(sliderClass).slider({
        range: "max",
        value:sliderValue,
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        slide: function( event, ui ) {
          $(inputClass).val( Currenty + ui.value );
          Drupal.behaviors.quickquote.lijfrenteCalculation(3.05, "#payment-calculated", "#interest-calculated", "€");
        }
      });
      $(inputClass).val( Currenty + $(sliderClass).slider("value"));
      $(inputClass).keyup(function() {
        $(sliderClass).slider("value" , $(this).val().replace(Currenty, ''));
      });
    },
    lijfrenteCalculation: function(interest,paymentClass,interestClass,Currenty) {
      var roundingDecimals = function(input, decimals) {
        return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
      };
      var money = $("#amount-slider").slider("value"),
          time = $("#time-slider").slider("value"),
          months = time * 12;   
      if (isNaN(money) || months === 0 || isNaN(months)) {
          return 0;
      }
      var interestPerMonth = roundingDecimals(Math.pow(1 + (interest / 100), 1 / 12) - 1, 6),
          formulaPart1 = roundingDecimals(1 / Math.pow(1 + interestPerMonth, months), 6),
          formulaComplete = roundingDecimals((1 - formulaPart1) / interestPerMonth, 3),  
          montlyPayment = roundingDecimals(money / formulaComplete, 2),
          totalInterest = roundingDecimals(((montlyPayment * months) - money), 2); 
      $(paymentClass).text( Currenty + montlyPayment);
      $(interestClass).text( Currenty + totalInterest);
    },
  };
})(jQuery); 