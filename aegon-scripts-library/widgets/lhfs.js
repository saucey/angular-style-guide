/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.lhfs_widget = {
    attach: function () {

      Drupal.behaviors.tooltip.activate("#lhfs_widget");

      var Validation = Drupal.behaviors.validation;
      var formSelector = "form[name=modifyBetaalGegevensForm]";
      if (!Validation.IEFix(formSelector, false)) {
        Validation.otherFix(formSelector, false);
      }

      // Check if div#lhfs_widget exist
      if ($('.lhfs_widget').length > 0) {
        $("#lhfs_widget .tip").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal").removeClass("visible");
        $("#lhfs_widget li.product ul.horizontal").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal.error").removeClass("visible");

        $(".success")
          .appendTo("body") //move .success to the body, so that it can be centered and fixed to the screen
          .css("top", (($(window).height() - $(".success").height()) / 2) + "px");  //center .success vertically
        $(".lightbox")
          .appendTo("body"); //move .lightbox to the body & after .success so that the visible style for .success still applies

        var form = $('#lhfs_widget').find('form'),
            $incasso = form.find('.incasso'),
            incassoCheckbox = $incasso.find('input');

        var val,
            parent,
            $iban,
            ibanInputField;

        var showIncassoField = function() {
            $incasso.show();
            incassoCheckbox.show();
        };

        var hideIncassoField = function() {
            $incasso.hide();
            incassoCheckbox.hide();
        };

        // Multiple select elements on the page are possible
        // Loop through all of them and change the closest input field according to the value
        $('#lhfs_widget select').each(function() {
          val = $(this).val(),
          parent = $(this).closest('.product'),
          $iban = parent.find('ul.account'),
          ibanInputField = $iban.find('input');

          // Check for default value of the select elements and show/hide fields accordingly
          if (val === 'f' || val === 'F') {
            $iban.hide();
            ibanInputField.hide();
            hideIncassoField();
          } else if(val === 'd' || val === 'D'){
            showIncassoField();
          } else if(val === 'p' || val === 'P' || val === 'i' || val === 'I'){
            hideIncassoField();
          }
        });  

        // Behaviour when switching payment methods
        $('#lhfs_widget  select').change(function () {
          val = $(this).val(),
          parent = $(this).closest('.product'),
          $iban = parent.find('ul.account'),
          ibanInputField = $iban.find('input');

          // Disable submit button and uncheck checkbox by default
          incassoCheckbox.attr('checked', false);
          
          // Check all select elements if there is one selected with a value 'd', hide incasso field if this is the case
          if(val !== 'd' || val !== 'D') {
            var dSelected = 0;
            $('select').each(function() {
              if($(this).val() === 'd' || $(this).val() === 'D') {
                dSelected++;
              }
            }).promise().done(function() {
              if(dSelected === 0) {
                hideIncassoField();
              }
            });
          }

          // Show iban field only if value = p, d or i
          if(val === 'p' || val === 'P' ||  val === 'd' || val === 'D' || val === 'i' || val === 'I') {
            $iban.show();
            ibanInputField.show();
          } 

          // Show iban and show checkbox
          if(val === 'd' || val === 'D') {
            $iban.show();
            ibanInputField.show();
            showIncassoField();
          }

          // Hide iban and checkbox and enable submit button
          if(val === 'f' || val === 'F') {
            $iban.hide();
            ibanInputField.hide();
          }
                    
        });
        
        // Used only for the lhfs payment table in our technical library
        Drupal.behaviors.table_sort_filter.createTable('.lhfsPaymentDemo', {ordering: false});
    
      }
      this.attached = true;
    },
    attached: false,
  };

})(jQuery);
  