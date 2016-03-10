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
      var toggleCheckBox = $('label.checkbox input[type="checkbox"]');

      $(toggleCheckBox).click(function(){
        if($(toggleCheckBox).prop("checked") === true){
          $(toggleContainer).slideDown(300);
        }
        else if($(this).prop("checked") === false){
          $(toggleContainer).slideUp(300);
        }
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
      $(paymentClass).text( Currency + "Working on it" + monthlyPayment);
      $(interestClass).text("Working on it");
    },

    round: function(input, decimals) {
      return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    calculateDepositoOpbouw: function(p, i, l, o) {
      var interestUitstel = 2,
          scalesUitstel = 2;

      var n = scalesUitstel;
      var q = 1 + (interestUitstel / 100),
        m = 1 + (n / 100),
        f = 1 + (interestUitstel / 100);
      var g = Math.pow(q, l),
        h = Math.pow(m, o),
        j = Math.pow(f, (l - o));
      var k = (p - i) * g,
        newi = i * h;
      p = k + (newi * j);
      return p;
    },

    // Calculation for Lijfrente Uitkeren
    calculateMonthlyPayment: function (jaarruimte, singleInlay, periodicInlay, depositoInlay, depositoDuration, duration, interestOpbouw) {
      if (isNaN(singleInlay) || duration === 0 || isNaN(duration)) {
        return 0;
      }

      var newInterest = 1 + (interestOpbouw / 100),
        formulaPart0 = Math.pow(newInterest, 1 / 12) - 1,
        formulaPart1 = this.round(formulaPart0, 8),
        formulaPart2 = Math.pow(1 + formulaPart1, duration * 12) - 1,
        formulaComplete = (periodicInlay* (formulaPart2 / formulaPart1)) * (1 + formulaPart1);
      if (singleInlay) {
        formulaComplete = formulaComplete + this.calculateDepositoOpbouw(singleInlay, depositoInlay, duration, depositoDuration);
      }
      var formulaRounded = formulaComplete.toFixed(2);
      return formulaRounded.replace('.', ',');
    }
  };
})(jQuery);
