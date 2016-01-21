/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';
  var interest = {5: 1.0, 6: 1.5, 7: 2.0, 8: 2.5, 9: 3.0, 10: 3.5, 11: 1.0, 12: 1.5, 13: 2.0, 14: 2.5, 15: 3.0, 16: 3.5, 17: 1.0, 18: 1.5, 19: 2.0, 20: 2.5, 21: 3.0, 22: 3.5, 23: 1.0, 24: 1.5, 25: 2.0, 26: 2.5, 27: 3.0, 28: 3.5, 29: 2.5, 30: 3.0};

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {

      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",10000,1000,100000,100,"€",{
        change: function( event, ui ) {
          $("#amount-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteCalculation(interest, "#payment-calculated", "#interest-calculated", "€");
        }
      });

      Drupal.behaviors.slider.activate("#time-slider","#time-input",10,5,30,1,"", {
        change: function( event, ui ) {
          $("#time-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteCalculation(interest, "#payment-calculated", "#interest-calculated", "€");
        }
      });
    },

    lijfrenteCalculation: function(interest,paymentClass,interestClass,Currency) {
      var round = function(input, decimals) {
        return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
      };
      var money = $("#amount-slider").slider("value"),
        duration = $("#time-slider").slider("value"),
        months = duration * 12;
      if (isNaN(money) || months === 0 || isNaN(months)) {
        return 0;
      }
      var interestPerMonth = round(Math.pow(1 + (interest[duration] / 100), 1 / 12) - 1, 6),
          formulaPart1 = round(1 / Math.pow(1 + interestPerMonth, months), 6),
          formulaComplete = round((1 - formulaPart1) / interestPerMonth, 3),
          monthlyPayment = round(money / formulaComplete, 2),
          totalInterest = round(((monthlyPayment * months) - money), 2).toFixed(2);
      $(paymentClass).text( Currency + monthlyPayment);
      $(interestClass).text( Currency + totalInterest);
    },
  };
})(jQuery);
