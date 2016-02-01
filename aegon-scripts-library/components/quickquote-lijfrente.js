/**
 * Quickquite Lijfrente Uitkeren
 */
(function($) {
  'use strict';

  // Parse the data attribute to object
  var dataInterest = $('.quickquote');
  var interest = JSON.parse("[" + dataInterest.attr("data-interests") + "]");

  // Creates dot between thousands
  function readableNumber(number) {
    var newNumber = number.toLocaleString();
    newNumber = newNumber.replace(/,/g, '.');
    return newNumber;
  }

  // Add new item to public Drupal object
  Drupal.behaviors.quickquote = {
    attach: function() {
      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",25000,4000,1000000,1000,"€",{
        change: function( event, ui ) {
          Drupal.behaviors.quickquote.lijfrenteUitkerenCalculation(interest, "#payment-calculated", "€");
          $("#amount-input").val(readableNumber(ui.value));
        }
      });

      Drupal.behaviors.slider.activate("#time-slider","#time-input",6,5,30,1,"", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquote.lijfrenteUitkerenCalculation(interest, "#payment-calculated", "€");
          $("#time-input").val(readableNumber(ui.value));
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
