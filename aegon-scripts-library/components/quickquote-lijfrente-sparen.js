/**
 * Quickquite Lijfrente Sparen
 */
(function($) {
  'use strict';

  var interestLijfrenteSparen = [1.1,1.2,1.3,1.35,1.45,1.6,1.7,1.8,1.8,1.25,1.95,1.95,1.95,1.95,1.95,2.05,2.05,2.05,2.05,2.05,2.20,2.20,2.20,2.20,2.45,2.20,2.20,2.20,2.20,2.20],
      interestDeposito = [0,1.1,1.2,1.3,1.35,1.45,1.6,1.7,1.8,1.8,1.8,1.95,1.95,1.95,1.95,1.95,2.05,2.05,2.05,2.05,2.05,2.20,2.20,2.20,2.20,2.45,2.20,2.20,2.20,2.20,2.20];

  var format = wNumb({
    mark: ',',
    thousand: '.',
    prefix: '€ '
  });

  // Add new item to public Drupal object
  Drupal.behaviors.quickquoteLijfrenteSparen = {

    attach: function() {
      if ($('.quickquote.lijfrente.sparen').length === 0) {
        return;
      }
      // Parse the data attribute to object
      var dataInterest = $('.quickquote');
      if (dataInterest.attr("data-interestLijfrenteSparen") !== undefined) {
        interestLijfrenteSparen = JSON.parse("[" + dataInterest.attr("data-interestLijfrenteSparen") + "]");
      }
      if (dataInterest.attr("data-interestDeposito") !== undefined) {
        interestDeposito = JSON.parse("[" + dataInterest.attr("data-interestDeposito") + "]");
      }

      this.toggle("#toggle-container","label.checkbox > input");
      //this.toggleError("#one-off-error","#periodic-error","#duration-error","#deposit-duration-error");
      // Initiate the Tooltip
      Drupal.behaviors.tooltip.activate(".quickquote");

      // Initiate the Sliders
      Drupal.behaviors.newSlider.activate("one-off-slider","one-off-input",25000,4000,1000000,10000,25000, 100000,"#one-off-error","Het bedrag voor Lijfrente Uitkeren is  minimaal€ 4000,- en maximaal 1.000.000,-");
      Drupal.behaviors.newSlider.activate("periodic-slider","periodic-input",200,0,5000,100,200,2500,"#periodic-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("duration-slider","duration-input",1,1,30,7,10,15,"#duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("amount-one-off-slider","amount-one-off-input",0,0,1000000,10000,25000, 100000,"#amount-one-off-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("deposit-duration-slider","deposit-duration-input",0,0,30,7,10,15,"#deposit-duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");
    },
    toggle: function(toggleContainer,toggleCheckBox) {
      // Toggle container with extra sliders for deposit and duration when checkbox is checked
      $(toggleCheckBox).click(function() {
        $(toggleContainer).slideToggle(this.checked);
        if (!this.checked) {
          var inputs = $(toggleContainer).find("input");
          inputs.each(function(){
            this.value = 0;
          });
        }
      });
    },

      removeErrorText: function(element, duration) {
          setTimeout(function () {
              element.empty();
          }, duration);
      },

    onChange: function(paymentClass, interestClass,amountClass,interestDepositoClass) {
      // Get the values from the sliders
      var singleInlay = $("#one-off-input").val().replace(/\./g , ''),
          periodicInlay = $("#periodic-input").val().replace(/\./g , ''),
          depositoInlay = $("#amount-one-off-input").val().replace(/\./g , ''),
          depositoDuration = $("#deposit-duration-input").val(),
          duration = $("#duration-input").val();
      // Do the calculation
      var monthlyPayment = this.calculateMonthlyPayment(singleInlay, periodicInlay, depositoInlay, duration, depositoDuration);
      var interestAmount = this.calculateInterest(singleInlay, periodicInlay, duration , monthlyPayment);

            // Print the outcomes of the calculation
      $(paymentClass).text(format.to(monthlyPayment));
      $(interestClass).text(interestLijfrenteSparen[duration - 1]);
      $(amountClass).text(format.to(interestAmount));
      $(interestDepositoClass).text(interestDeposito[depositoDuration]);
    },

    round: function(input, decimals) {
      return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    calculateOneTimeInlay: function(singleInlay, depositoInlay, duration, depositoDuration, newinterestLijfrenteSparen) {
      // Calculate the On-off-Inlay with our wihout the deposito added
      var newinterestDeposito = 1 + (interestDeposito[depositoDuration] / 100),
          formulaPart1 = Math.pow(newinterestLijfrenteSparen, duration),
          formulaPart2 = Math.pow(newinterestDeposito, depositoDuration),
          formulaPart3 = Math.pow(newinterestDeposito, (duration - depositoDuration)),
          formulaPart4 = (singleInlay - depositoInlay) * formulaPart1,
          formulaPart5 = depositoInlay * formulaPart2,
          depositoOpbouw = formulaPart4 + (formulaPart5 * formulaPart3);
      return depositoOpbouw;
    },

    calculateMonthlyPayment: function (singleInlay, periodicInlay, depositoInlay, duration, depositoDuration) {
      // Calculation for Lijfrente Sparen
      if (isNaN(singleInlay) || duration === 0 || isNaN(duration)) {
        return 0;
      }

      // Caltulate the Periodic (Monthly) inlay
      var newinterestLijfrenteSparen = 1 + (interestLijfrenteSparen[duration - 1] / 100),
        formulaPart0 = Math.pow(newinterestLijfrenteSparen, 1 / 12) - 1,
        formulaPart1 = this.round(formulaPart0, 8),
        formulaPart2 = Math.pow(1 + formulaPart1, duration * 12) - 1,
        formulaComplete = (periodicInlay* (formulaPart2 / formulaPart1)) * (1 + formulaPart1);
      if (singleInlay) {
        formulaComplete = formulaComplete + this.calculateOneTimeInlay(singleInlay, depositoInlay, duration, depositoDuration, newinterestLijfrenteSparen);
      }
      var formulaRounded = this.round(formulaComplete,2);
      return formulaRounded;
    },

    calculateInterest: function (singleInlay, periodicInlay, duration , monthlyPayment) {
      //calculation for the amount of interest expressed in Euro's
      var periodicTotal = (periodicInlay * 12),
          durationTotal = (periodicTotal * duration),
          totalInlay = parseInt(singleInlay) + durationTotal,
          calculatedAmount = this.round(monthlyPayment - totalInlay, 2);
      return calculatedAmount;

    }

  };
})(jQuery);

