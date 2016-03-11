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
      Drupal.behaviors.newSlider.activate("periodic-slider","periodic-input",200,0,5000,100,200,2500,"#periodic-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("duration-slider","duration-input",1,1,30,7,10,15,"#duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("amount-one-off-slider","amount-one-off-input",0,0,1000000,10000,25000, 100000,"#amount-one-off-error","De looptijd is minimaal 5 en maximaal 30 jaar");
      Drupal.behaviors.newSlider.activate("deposit-duration-slider","deposit-duration-input",0,0,5,1,2,3,"#deposit-duration-error","De looptijd is minimaal 5 en maximaal 30 jaar");
    },

    onChange: function(paymentClass, interestClass, Currency) {
      var jaarruimte = 1,
          singleInlay = $("#one-off-input").val().replace(/\./g , ''),
          periodicInlay = $("#periodic-input").val(),
          depositoInlay = $("#amount-one-off-input").val().replace(/\./g , ''),
          depositoDuration = $("#deposit-duration-input").val(),
          duration = $("#duration-input").val(),
          interestOpbouw = 1.5;

      var monthlyPayment = this.calculateMonthlyPayment(jaarruimte, singleInlay, periodicInlay, depositoInlay, depositoDuration, duration, interestOpbouw);
      $(paymentClass).text( Currency + monthlyPayment);
      $(interestClass).text(interestRates[duration - 5]);
    },

    round: function(input, decimals) {
      return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    calculateOneTimeInlay: function(singleInlay, depositoInlay, duration, depositoDuration, newInterestOpbouw) {
      console.log("deposito variabelen" +
       singleInlay,
       depositoInlay,
       duration,
       depositoDuration,
       newInterestOpbouw);
      var interestUitstel = 1.5,
          newinterestUitstel = 1 + (interestUitstel / 100),
          formulaPart1 = Math.pow(newinterestUitstel, duration),
          formulaPart2 = Math.pow(newInterestOpbouw, depositoDuration),
          formulaPart3 = Math.pow(newinterestUitstel, (duration - depositoDuration)),
          formulaPart4 = (singleInlay - depositoInlay) * formulaPart1,
          formulaPart5 = depositoInlay * formulaPart2;
      var depositoOpbouw = formulaPart4 + (formulaPart5 * formulaPart3);

      console.log("Berekening Deposito = " +
        "newinterestUitstel = " + newinterestUitstel,
        "Part1 = " + formulaPart1,
        "Part2 = " +  formulaPart2,
        "Part3 = " + formulaPart3,
        "Part4 = " + formulaPart4,
        "Part5 = " + formulaPart5,
        "depositoOpbouw = " + depositoOpbouw
        );

      return depositoOpbouw;
    },

    // Calculation for Lijfrente Uitkeren
    calculateMonthlyPayment: function (jaarruimte, singleInlay, periodicInlay, depositoInlay, depositoDuration, duration, interestOpbouw) {
      if (isNaN(singleInlay) || duration === 0 || isNaN(duration)) {
        return 0;
      }
      //console.log("calculatie variabelen" + jaarruimte,
      //  singleInlay,
      //  periodicInlay,
      //  depositoInlay,
      //  depositoDuration,
      //  duration,
      //  interestOpbouw);

      var newInterestOpbouw = 1 + (interestOpbouw / 100),
        formulaPart0 = Math.pow(newInterestOpbouw, 1 / 12) - 1,
        formulaPart1 = this.round(formulaPart0, 8),
        formulaPart2 = Math.pow(1 + formulaPart1, duration * 12) - 1,
        formulaComplete = (periodicInlay* (formulaPart2 / formulaPart1)) * (1 + formulaPart1);
      //console.log("Berekening Zonder deposito= " +
      //  "Part0 = " + formulaPart0,
      //  "Part1 = " + formulaPart1,
      //  "Part2 = " + formulaPart2,
      //  "Complete = " + formulaComplete
      //  );
      if (singleInlay) {
        formulaComplete = formulaComplete + this.calculateOneTimeInlay(singleInlay, depositoInlay, duration, depositoDuration, newInterestOpbouw);
        console.log("Berekening + deposito= " + formulaComplete);
      }
      var formulaRounded = formulaComplete.toFixed(2);
      console.log("Formule afgerond = " + formulaRounded);
      return formulaRounded.replace('.', ',');
    }
  };
})(jQuery);
