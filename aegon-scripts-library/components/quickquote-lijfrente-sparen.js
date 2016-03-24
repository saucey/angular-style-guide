/**
 * Quickquite Lijfrente Sparen
 */
(function($) {
  'use strict';

  var interestLijfrenteSparen = 1.8,
      interestDeposito = [0,1.1,1.2,1.3,1.35,1.45,1.6,1.7,1.8,1.8,1.8,1.95,1.95,1.95,1.95,1.95,2.05,2.05,2.05,2.05,2.05,2.20,2.20,2.20,2.20,2.45,2.20,2.20,2.20,2.20,2.20];

  var format = wNumb({
    mark: ',',
    thousand: '.',
    decimals: 2,
    prefix: '€ '
  });

  // Add new item to public Drupal object
  Drupal.behaviors.quickquoteLijfrenteSparen = {

    attach: function() {
      if ($('#qqSparen').length === 0) {
        return;
      }
      // Parse the data attribute to object
      var dataInterest = $('.quickquote');
      if (dataInterest.attr("data-interestLijfrenteSparen") !== undefined) {
        interestLijfrenteSparen = JSON.parse(dataInterest.attr("data-interestLijfrenteSparen"));
      }
      if (dataInterest.attr("data-interestDeposito") !== undefined) {
        interestDeposito = JSON.parse("[" + dataInterest.attr("data-interestDeposito") + "]");
      }

      //Toggle deposit container on checked checkbox
      this.toggle("#toggle-container","label.checkbox > input");

      // Initiate the Tooltip
      Drupal.behaviors.tooltip.activate(".quickquote");

      // Initiate the Sliders
      Drupal.behaviors.newSlider.activate("one-off-slider","one-off-input",25000,0,1000000,10000,25000,100000,"#one-off-error");
      Drupal.behaviors.newSlider.activate("periodic-slider","periodic-input",0,0,1000000,250,500,1000,"#periodic-error");
      Drupal.behaviors.newSlider.activate("duration-slider","duration-input",1,1,40,5,10,20,"#duration-error");
      Drupal.behaviors.newSlider.activate("amount-one-off-slider","amount-one-off-input",0,0,1000000,10000,25000,100000,"#amount-one-off-error");
      Drupal.behaviors.newSlider.activate("deposit-duration-slider","deposit-duration-input",0,0,30,7,10,15,"#deposit-duration-error");
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

    onChange: function(paymentClass, interestClass,amountClass,interestDepositoClass) {
      // Get the values from the sliders
      var singleInlay = $("#one-off-input").val().replace(/\./g , ''),
          depositoInlay = $("#amount-one-off-input").val().replace(/\./g , ''),
          depositoDuration = $("#deposit-duration-input").val(),
          duration = $("#duration-input").val(),
          //after selectperiod changes the period variable-value to calculate back to months - periodicinlay is calculated and set.
          period = this.selectperiod(),
          periodicInlay = period;



      // Do the calculation
      var monthlyPayment = this.calculateMonthlyPayment(singleInlay, periodicInlay, depositoInlay, duration, depositoDuration,interestLijfrenteSparen);
      var interestAmount = this.calculateInterest(singleInlay, periodicInlay, duration , monthlyPayment);

      // Print the outcomes of the calculation
      $(paymentClass).text(format.to(monthlyPayment));
      $(interestClass).text(interestLijfrenteSparen);
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

    calculateMonthlyPayment: function (singleInlay, periodicInlay, depositoInlay, duration, depositoDuration, interest) {
      // Calculation for Lijfrente Sparen
      if (isNaN(singleInlay) || duration === 0 || isNaN(duration)) {
        return 0;
      }

      // Caltulate the Periodic (Monthly) inlay
      var newinterestLijfrenteSparen = 1 + (interest / 100),
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
    },

    selectperiod: function(){
        var selectedPeriod = $("#periodic-selector_child").find(".selected"),
            selectedPeriodText = selectedPeriod.text(),
            periodicInlay = $("#periodic-input").val().replace(/\./g , ''),
            division = 1;

        switch (selectedPeriodText) {
          case 'Maand':
            division = 1;
            break;
          case 'Kwartaal':
            division = 3;
            break;
          case 'Half jaar':
            division = 6;
            break;
          case 'Jaar':
            division = 12;
            break;
          default:
            division = 1;
        }
        return periodicInlay / division;
    },

    updateSliderRange: function(min, max) {

      this.noUiSlider.updateOptions({
        range: {
          'min': min,
          'max': max
        }
      });
    }
  };
})(jQuery);

