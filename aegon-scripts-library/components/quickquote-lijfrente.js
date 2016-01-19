/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {
      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",1000,0,100000,100,"€",{
        change: function( event, ui ) {
          $("#amount-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteCalculation(3.05, "#payment-calculated", "#interest-calculated", "€");
        }
      });

      Drupal.behaviors.slider.activate("#time-slider","#time-input",10,0,30,1,"", {
        change: function( event, ui ) {
          $("#time-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteCalculation(3.05, "#payment-calculated", "#interest-calculated", "€");
        }
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
