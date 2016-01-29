/**
 * Quickquite Lijfrente Uitkeren
 */
(function($) {
  'use strict';

  // Parse the data attribute to object
  var dataInterest = $('.quickquote');
  var interest = JSON.parse("[" + dataInterest.attr("data-interests") + "]");

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {
      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",10000,1000,100000,100,"€",{
        change: function( event, ui ) {
          $("#amount-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteUitkerenCalculation(interest, "#payment-calculated", "€");
        }
      });

      Drupal.behaviors.slider.activate("#time-slider","#time-input",10,5,30,1,"", {
        change: function( event, ui ) {
          $("#time-slider").val( "euro" + ui.value );
          Drupal.behaviors.quickquote.lijfrenteUitkerenCalculation(interest, "#payment-calculated", "€");
        }
      });
    },

    lijfrenteUitkerenCalculation: function(interest,paymentClass,Currency) {

      // Callculation for Lijfrente Uitkeren
      var round = function(input, decimals) {
        return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
      };
      var money = $("#amount-slider").slider("value"),
        duration = $("#time-slider").slider("value"),
        months = duration * 12;
      if (isNaN(money) || months === 0 || isNaN(months)) {
        return 0;
      }
      var interestPerMonth = round(Math.pow(1 + (interest[duration - 5] / 100), 1 / 12) - 1, 6),
          formulaPart1 = round(1 / Math.pow(1 + interestPerMonth, months), 6),
          formulaComplete = round((1 - formulaPart1) / interestPerMonth, 3),
          monthlyPayment = round(money / formulaComplete, 2).toFixed(2);
      $(paymentClass).text( Currency + monthlyPayment.replace('.', ','));
    },
  };
})(jQuery);
