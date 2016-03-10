/**
 * Quickquite Lijfrente Uitkeren
 */
(function($) {
  'use strict';

  var interestRates = [1.8,1.9,2,2.1,2.1,2.2,2.25,2.3,2.4,2.5,2.6,2.65,2.7,2.8,2.9,2.9,2.9,2.9,2.9,2.9,3,3.2,3.2,3.2,3.2,3.2];

  // Add new item to public Drupal object
  Drupal.behaviors.quickquoteLijfrenteSparen = {

    attach: function() {
      if ($('.quickquote.lijfrente.sparen').length === 0) {
        return;
      }
      // Toggle container with extra sliders for deposit and duration when checkbox is checked
      var toggleContainer = $("#toggle-container");
      var toggleCheckBox = $('label.checkbox > input');
      $(toggleCheckBox).click(function() {
        $(toggleContainer).slideToggle(this.checked);
      });

      // Parse the data attribute to object
      var dataInterest = $('.quickquote');
      if (dataInterest.attr("data-interests") !== undefined) {
        interestRates = JSON.parse("[" + dataInterest.attr("data-interests") + "]");
      }
      Drupal.behaviors.tooltip.activate(".quickquote");
      Drupal.behaviors.newSlider.activate("one-off-slider","one-off-input",25000,4000,1000000,10000,25000, 100000,"#one-off-error","Het bedrag voor Lijfrente Uitkeren is  minimaal€ 4000,- en maximaal 1.000.000,-");
      Drupal.behaviors.newSlider.activate("periodic-slider","periodic-input",6,5,30,7,10,15,"#periodic-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("duration-slider","duration-input",6,5,30,7,10,15,"#duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");

      //Function for updating the input value of the whole deposit > this value should be the max possible value for SOLE deposit
      //function updateInput() {
      var oneOffValue = $("#one-off-input").val().replace(/\./g , '');
      var maxValOneOffInput = (oneOffValue);
      var inputQuarter = (maxValOneOffInput) / 4 ;
      var inputHalf = maxValOneOffInput / 2 ;
      var inputThreeQuarter = (maxValOneOffInput / 4) * 3 ;
      var inputMax = Number(oneOffValue);


      Drupal.behaviors.newSlider.activate("amount-one-off-slider", "amount-one-off-input", 25000, 4000, this.synchronizingSlider(), inputQuarter, inputHalf, inputThreeQuarter, "#amount-one-off-error", "De looptijd is minimaal 5 en maximaal 30 jaar");

      Drupal.behaviors.newSlider.activate("deposit-duration-slider","deposit-duration-input",6,5,30,7,10,15,"#deposit-duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");


    },

    synchronizingSlider: function() {
      //Function for updating the input value of the whole deposit > this value should be the max possible value for SOLE deposit
      var oneOffValue = $("#one-off-input").val().replace(/\./g , '');
      var maxValOneOffInput = (oneOffValue);

      var inputQuarter = (maxValOneOffInput) / 4 ;
      var inputHalf = maxValOneOffInput / 2 ;
      var inputThreeQuarter = (maxValOneOffInput / 4) * 3 ;
      var inputMax = Number(oneOffValue);

      return parseInt(Number(oneOffValue)), inputQuarter, inputHalf, inputThreeQuarter;
    },



    onChange: function(paymentClass, interestClass, Currency) {
      var money = $("#amount-input").val().replace(/\./g , ''),
        duration = $("#time-input").val().replace(/\./g , '');

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
