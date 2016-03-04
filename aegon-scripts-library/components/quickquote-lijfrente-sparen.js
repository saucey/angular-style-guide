/**
 * Quickquite Lijfrente Sparen
 */
(function($) {
  'use strict';

  var interestRates = [1.8,1.9,2,2.1,2.1,2.2,2.25,2.3,2.4,2.5,2.6,2.65,2.7,2.8,2.9,2.9,2.9,2.9,2.9,2.9,3,3.2,3.2,3.2,3.2,3.2];

  // Creates dot between thousands
  function readableNumber(number) {
    var newNumber = number.toLocaleString();
    newNumber = newNumber.replace(/,/g, '.');
    return newNumber;
  }

  // Add new item to public Drupal object
  Drupal.behaviors.quickquoteLijfrenteSparen = {

    attach: function() {
      if ($('.quickquote.lijfrente.sparen').length === 0) {
        return;
      }

      // Toggle container with extra sliders for deposit and duration
      // Hide on click span.checkbox , cause no proper checkbox to be found ( weird behaviour for a checkbox )
      var toggleContainer = $("#toggle-container");
      var toggleCheckBox = $('span.checkbox');

      if ($(toggleCheckBox).click(function(){
        $(toggleContainer).slideToggle(300);
      }));

      // Parse the data attribute to object
      var dataInterest = $('.quickquote');
      if (dataInterest.attr("data-interests") !== undefined) {
        interestRates = JSON.parse("[" + dataInterest.attr("data-interests") + "]");
      }

      Drupal.behaviors.tooltip.activate(".quickquote");

      // Extend default behaviour of the slider plugin
      Drupal.behaviors.slider.activate("#one-off-slider","#one-off-input",25000,4000,1000000,1000,"#one-off-error","Het bedrag voor Lijfrente Uitkeren is  minimaal€ 4000,- en maximaal 1.000.000,-","€",{
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","", "€");
          $("#one-off-input").val(readableNumber(ui.value));
        }
      });

      Drupal.behaviors.slider.activate("#periodic-slider","#periodic-input",6,5,30,1,"#periodic-error","De looptijd is minimaal 5 en maximaal 30 jaar","", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
          $("#periodic-input").val(readableNumber(ui.value));
        }
      });

      Drupal.behaviors.slider.activate("#duration-slider","#duration-input",6,5,30,1,"#duration-error","De looptijd is minimaal 5 en maximaal 30 jaar","", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
          $("#duration-input").val(readableNumber(ui.value));
        }
      });
      Drupal.behaviors.slider.activate("#amount-one-off-slider","#amount-one-off-input",6,5,30,1,"#amount-one-off-error","De looptijd is minimaal 5 en maximaal 30 jaar","", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
          $("#amount-one-off-input").val(readableNumber(ui.value));
        }
      });
      Drupal.behaviors.slider.activate("#deposit-duration-slider","#deposit-duration-input",6,5,30,1,"#deposit-duration-error","De looptijd is minimaal 5 en maximaal 30 jaar","", {
        change: function( event, ui ) {
          Drupal.behaviors.quickquoteLijfrente.onChange("#payment-calculated","#interest-amount", "€");
          $("#deposit-duration-input").val(readableNumber(ui.value));
        }
      });
    },

    onChange: function(paymentClass, interestClass, Currency) {
      var money = $("#amount-slider").slider("value"),
        duration = $("#time-slider").slider("value");

      if (isNaN(money) || duration === 0 || isNaN(duration)) {
        return 0;
      }

      var monthlyPayment = this.calculateMonthlyPayment(money, duration);

      $(paymentClass).text( Currency + monthlyPayment);
      $(interestClass).text(interestRates[duration - 5]);
    },

    round: function(input, decimals) {
      return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    // Calculation for Lijfrente Uitkeren
    calculateMonthlyPayment: function (money, duration) {
      if (isNaN(money) || duration === 0 || isNaN(duration)) {
        return 0;
      }

      var interestPerMonth = this.round(Math.pow(1 + (interestRates[duration - 5] / 100), 1 / 12) - 1, 6),
        months = duration * 12,
        formulaPart1 = this.round(1 / Math.pow(1 + interestPerMonth, months), 6),
        formulaComplete = this.round((1 - formulaPart1) / interestPerMonth, 3),
        monthlyPayment = this.round(money / formulaComplete, 2).toFixed(2);

      return monthlyPayment.replace('.', ',');
    }
  };
})(jQuery);
