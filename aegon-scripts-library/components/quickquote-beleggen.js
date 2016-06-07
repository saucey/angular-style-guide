/**
 * Quickquote Beleggen
 */
(function($) {
    'use strict';

    var interestSavings = 1.8,
        interestInvest = 4;

    var format = wNumb({
        mark: ',',
        thousand: '.',
        decimals: 2,
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


            var initializeSlider = function (name, bc) {
                // bc is for backwards compatibility when the values are not available on the element.

                var elm = $("#" + name + "-slider");

                Drupal.behaviors.newSlider.activate(
                    name + "-slider",
                    name + "-input",
                    elm.attr("data-value")         ? parseInt(elm.attr("data-value"))         : bc[0] || 0,
                    elm.attr("data-min")           ? parseInt(elm.attr("data-min"))           : bc[1] || 0,
                    elm.attr("data-max")           ? parseInt(elm.attr("data-max"))           : bc[2] || 0,
                    elm.attr("data-quarter")       ? parseInt(elm.attr("data-quarter"))       : bc[3] || 0,
                    elm.attr("data-half")          ? parseInt(elm.attr("data-half"))          : bc[4] || 0,
                    elm.attr("data-three-quarter") ? parseInt(elm.attr("data-three-quarter")) : bc[5] || 0,
                    "#" + name + "-error"
                );
            };

            // Initiate the Sliders, backwards compatible
            initializeSlider("one-off", [0,0,5000,1250,2500,3750]);
            initializeSlider("periodic", [50,10,250,37,75,125]);
            initializeSlider("duration", [10,10,30,7,15,22]);
        },

        onChange: function(paymentClass,interestClass,amountClass,investClass, interestInvestClass) {
            // Get the values from the sliders
            var singleInlay = $("#one-off-input").val().replace(/\./g , ''),
                duration = $("#duration-input").val(),
            //after selectperiod changes the period variable-value to calculate back to months - periodicinlay is calculated and set.
                period = Drupal.behaviors.quickquoteLijfrenteSparen.selectperiod(),
                periodicInlay = period;

            // Do the calculation
            var totalPension = Drupal.behaviors.quickquoteLijfrenteSparen.calculateBuiltUpPension(singleInlay, periodicInlay, 0, duration, 0, interestSavings),
                totalPensionInvest = Drupal.behaviors.quickquoteLijfrenteSparen.calculateBuiltUpPension(singleInlay, periodicInlay, 0, duration, 0, interestInvest),
                interestAmount = Drupal.behaviors.quickquoteLijfrenteSparen.calculateInterest(singleInlay, periodicInlay, duration , totalPension),
                totalInlay = totalPension - interestAmount;

            // Print the outcomes of the calculation
            $(paymentClass).text(format.to(totalPension));
            $(interestClass).text(interestSavings);
            $(amountClass).text(format.to(totalInlay));
            $(investClass).text(format.to(totalPensionInvest));
            $(interestInvestClass).text(interestInvest);
        }
    };
})(jQuery);

