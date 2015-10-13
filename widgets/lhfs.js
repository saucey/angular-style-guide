/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.lhfs_widget = {
    attach: function () {

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


        $(".help").mouseover(function () {
          if (this.title > " ") { //the temporary content has 2B " ", since "" will set display to "none" according to stylesheet definition, 
            //alert(this.title);
            $(".dialog.help").remove();
            var dialog = document.createElement("DIV");
            dialog.className = "help dialog";
            dialog.innerHTML = this.title;
            this.title = " ";
            $("#lhfs_widget").append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
            var offset = $(this).offset();
            offset.top = offset.top + $(this).height() + 10;
            offset.left = offset.left - $(dialog).width() / 2 - 18;
            $(dialog).offset(offset);
            var that = this;
            $(document).click(function () {
              $(dialog).remove();
              that.title = dialog.innerHTML;
            });
          }
        });

        var form = $('#lhfs_widget').find('form'),
            $iban = form.find('ul.account'),
            $incasso = form.find('.incasso'),
            ibanInputField = $iban.find('input'),
            incassoCheckbox = $incasso.find('input'),
            selectDefaultValue = $('select').val();

        var showIbanField = function() {
            $iban.show();
            ibanInputField.show();
        };

        var hideIbanField = function() {
            $iban.hide();
            ibanInputField.hide();
        };

        var showIncassoField = function() {
            $incasso.show();
            incassoCheckbox.show();
        };

        var hideIncassoField = function() {
            $incasso.hide();
            incassoCheckbox.hide();
        };

        var enableSubmitButton = function() {
          $('.disabler').css('z-index', '2');
        };

        var disableSubmitButton = function() {
          $('.disabler').css('z-index', '3');
        };

        ibanInputField.keyup(function() {
          if($('select').val() === 'd' || $('select').val() === 'D') {
            if(ibanInputField.val().length > 0 && incassoCheckbox.is(':checked')){
              enableSubmitButton();
            } else {
              disableSubmitButton();
            }
          } else if(ibanInputField.val().length > 0){
              enableSubmitButton();
            } else  {
              disableSubmitButton();
          }
        });

        incassoCheckbox.change(function() {
          if($('select').val() === 'd' || $('select').val() === 'D') {
            if(ibanInputField.val().length > 0 && incassoCheckbox.is(':checked')){
              enableSubmitButton();
            } else {
              disableSubmitButton();
            }
          } else {
            if(incassoCheckbox.is(':checked')) {
              enableSubmitButton();
            } else {
              disableSubmitButton();
            }
          }
        });
          
        // Check for default value of the select dropdown and show/hide fields accordingly
        if (selectDefaultValue === 'f' || selectDefaultValue === 'F') {
            hideIbanField();
            hideIncassoField();
            enableSubmitButton();
        } else if(selectDefaultValue === 'p' || selectDefaultValue === 'P' || selectDefaultValue === 'i' || selectDefaultValue === 'I'){
            hideIncassoField();
            // Checks if user already has a value filled in
            if(ibanInputField.val()) {
              enableSubmitButton();
            } else {
              disableSubmitButton();
            }
        }

        // Behaviour when switching payment methods
        $("select").change(function () {
          var val = $(this).val();

          // Disable submit button and uncheck checkbox by default
          disableSubmitButton();
          incassoCheckbox.attr('checked', false);
          // Show iban field only if value = p, d or i
          if(val === 'p' || val === 'P' ||  val === 'd' || val === 'D' || val === 'i' || val === 'I') {
            showIbanField();
            hideIncassoField();
          } 
          // Hide iban and show checkbox
          if(val === 'd' || val === 'D') {
            showIbanField();
            showIncassoField();
          }

          // On switching between payment methods check if there is already a value filled in and enable the button
          if(val === 'p' || val === 'P' || val === 'i' || val === 'I') {
            if(ibanInputField.val()) {
              enableSubmitButton();
            } else {
              disableSubmitButton();
            }
          }
          // Hide iban and checkbox and enable submit button
          if(val === 'f' || val === 'F') {
            hideIbanField();
            hideIncassoField();
            enableSubmitButton();
          }
          
        });
      }
      this.attached = true;
    },
    attached: false,
  };

})(jQuery);
  