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
      var formSelector = "form[name=lhfs_form]";
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
        $("select").change(function () {
          // var index = this.selectedIndex;
          var $details = $(this).closest(".details");
          var $interval = $details.find('ul.interval');
          var $iban = $details.find("ul.account");
          var $form = $(this).closest("form");
          var $incasso = $form.find('.incasso');
          var form = this.form;
          var val = $(this).val();

          // $iban.toggle(index != 1);
          // $(form).find("ul.incasso").toggle(index != 2);

          // Show iban field only if value = p, d or i
          $iban.show(val === 'p' || val === 'P' ||  val === 'd' || val === 'D' || val === 'i' || val === 'I');

          // Toggle incasso checkbox if value = d
          $(form).find("ul.incasso").toggle(val === 'd' || val === 'D');       

          // If value of select box = f , delete the iban field (required because of the validation)
          if(val === 'f' || val === 'F') {
            $iban.remove();
          }

          // If value of select box != d , delete the incasso checkbox (required because of the validation)
          if(val !== 'd' || val !== 'D') {
            $incasso.remove();
          }

          // If value = d and the incasso checkbox was removed, append it again
          if((val === 'd' || val === 'D') && $incasso.length === 0) {
            $('.products').after('<ul class="horizontal visible edit incasso row-fluid">' +
                                '<li class="label span6">' +
                                '<span class="middle-enforcer"></span>&nbsp;' +
                                '</li>' +
                                '<li class="value sxpan6">' +
                                '<span class="middle-enforcer"></span>' +
                                '<span class="help"></span>' +
                                '<label class="checkbox required">' +
                                '<input type="checkbox" name="colCheckInput" value="lorem" required/>' +
                                '<span class="checkbox"></span>' +
                                '<span class="label">Payment incasso text</span>' +
                                '<span class="errorText">some error message visible</span>' +
                                '</label>' +
                                '</li>' +
                                '</ul>');
          }

          // If value != f and the iban field was removed, append it again 
          if((val !== 'f' || val !== 'F') && $iban.length === 0) {
            $($interval).after('<ul class="horizontal account row-fluid">' +
                              '<li class="label required span6">' +
                              '<span class="middle-enforcer"></span>Account number label' +
                              '</li>' +
                              '<li id="accountNumberField" class="value sxpan6">' +
                              '<span class="help"></span>' +
                              '<input type="text" name="accountNumberValue" id="accountNumberValue" data-validate="iban.nl" required/>' +
                              '<span class="errorText">some error message visible</span>' +
                              '</li>' +
                              '</ul>');
            // Set the iban field to display block after appending (by default it has display)
            $details.find("ul.account").css('display', 'block');
          }
          
        });
      }
      this.attached = true;
    },
    attached: false,
  };

})(jQuery);
  