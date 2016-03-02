/**
 * Quickquite Lijfrente Uitkeren
 */
(function($) {
  'use strict';

  var dataInterest, interest;

  // Creates dot between thousands
  function readableNumber(number) {
    var newNumber = number.toLocaleString();
    newNumber = newNumber.replace(/,/g, '.');
    return newNumber;
  }

  // Add new item to public Drupal object
  Drupal.behaviors.quickquoteLijfrente = {
    attach: function() {
      if ($('.quickquote.lijfrente').length === 0) {
        return;
      }

      // Parse the data attribute to object
      dataInterest = $('.quickquote');
      interest = (dataInterest.attr("data-interests") !== undefined) ? JSON.parse("[" + dataInterest.attr("data-interests") + "]") : [1.8,1.9,2,2.1,2.1,2.2,2.25,2.3,2.4,2.5,2.6,2.65,2.7,2.8,2.9,2.9,2.9,2.9,2.9,2.9,3,3.2,3.2,3.2,3.2,3.2];

      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#amount-slider","#amount-input",25000,4000,1000000,1000,"#amount-error","Het bedrag voor Lijfrente Uitkeren is  minimaal€ 4000,- en maximaal 1.000.000,-","€",{
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.lijfrenteUitkerenCalculation(interest, "#payment-calculated","", "€");
          $("#amount-input").val(readableNumber(ui.value));
        }
      });

      Drupal.behaviors.slider.activate("#time-slider","#time-input",6,5,30,1,"#time-error","De looptijd is minimaal 5 en maximaal 30 jaar","", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.lijfrenteUitkerenCalculation(interest, "#payment-calculated","#interest-amount", "€");
          $("#time-input").val(readableNumber(ui.value));
        }
      });
    },

    lijfrenteUitkerenCalculation: function(interest,paymentClass,interestClass, Currency) {

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
      $(interestClass).text(interest[duration - 5]);
    }
  };
})(jQuery);
