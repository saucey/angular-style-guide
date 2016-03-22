/**
 * Quickquite Beleggen
 */
(function($) {
    'use strict';

    var interestSavings = 1.8,
        interestInvest = 4;

    var format = wNumb({
        mark: ',',
        thousand: '.',
        prefix: '€ '
    });

    // Add new item to public Drupal object
    Drupal.behaviors.quickquoteBeleggen = {

        attach: function() {
            if ($('#qqBeleggen').length === 0) {
                return;
            }
            // Parse the data attribute to object
            var dataInterest = $('.quickquote');
            if (dataInterest.attr("data-interestSavings") !== undefined) {
              interestSavings = JSON.parse(dataInterest.attr("data-interestSavings"));
            }
            if (dataInterest.attr("data-interestInvest") !== undefined) {
              interestInvest = JSON.parse(dataInterest.attr("data-interestInvest"));
            }


            // Initiate the Tooltip
            Drupal.behaviors.tooltip.activate(".quickquote");

            // Initiate the Sliders
            Drupal.behaviors.newSlider.activate("one-off-slider","one-off-input",25000,1,1000000,10000,25000,100000,"#one-off-error");
            Drupal.behaviors.newSlider.activate("periodic-slider","periodic-input",0,0,1000000,250,500,1000,"#periodic-error");
            Drupal.behaviors.newSlider.activate("duration-slider","duration-input",1,1,40,5,10,20,"#duration-error");
        },

        onChange: function(paymentClass,interestClass,amountClass,investClass, interestInvestClass) {
            // Get the values from the sliders
            var singleInlay = $("#one-off-input").val().replace(/\./g , ''),
                duration = $("#duration-input").val(),
            //after selectperiod changes the period variable-value to calculate back to months - periodicinlay is calculated and set.
                period = Drupal.behaviors.quickquoteLijfrenteSparen.selectperiod(),
                periodicInlay = period;

            // Do the calculation
            var monthlyPayment = Drupal.behaviors.quickquoteLijfrenteSparen.calculateMonthlyPayment(singleInlay, periodicInlay, 0, duration, 0, interestSavings),
                investPayment = Drupal.behaviors.quickquoteLijfrenteSparen.calculateMonthlyPayment(singleInlay, periodicInlay, 0, duration, 0, interestInvest),
                interestAmount = Drupal.behaviors.quickquoteLijfrenteSparen.calculateInterest(singleInlay, periodicInlay, duration , monthlyPayment),
                totalInlay = monthlyPayment - interestAmount;

            // Print the outcomes of the calculation
            $(paymentClass).text(format.to(monthlyPayment));
            $(interestClass).text(interestSavings);
            $(amountClass).text(format.to(totalInlay));
            $(investClass).text(format.to(investPayment));
            $(interestInvestClass).text(interestInvest);
        }
    };
})(jQuery);
