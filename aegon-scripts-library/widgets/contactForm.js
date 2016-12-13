/**
 * Contact Form widget.
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.contactForm_widget = {
    attach: function (context) {

      var Validation = Drupal.behaviors.validation;
      var formSelector = "form.contact-form";
      if (!Validation.IEFix(formSelector, false)) {
        Validation.otherFix(formSelector, false);
      }

      var contactForm = $(formSelector, context),
          editBtn, saveBtn, inputText, inputValue, editableField;

      // Check if the form exists.
      if (contactForm.length > 0) {
        editBtn = contactForm.find('.editable-field__switch');
        saveBtn = contactForm.find('.editable-field__save');
        inputText = contactForm.find('.editable-field__input-text');
        inputValue = contactForm.find('.editable-field__field-value');
        editableField =  contactForm.find('.editable-field');
        // Keyup event on input.
        inputText.on('keyup', function() {
          var inputVal = $(this).val();
          inputValue.text(inputVal);
        });
        // Edit button click event.
        editBtn.on('click', function(e) {
          e.preventDefault();
          editableField.addClass('editable-field--edit');
          $(this).addClass('hidden');
        });
        // Save button click event.
        saveBtn.on('click', function(e) {
          e.preventDefault();
          editableField.removeClass('editable-field--editing');
          setTimeout(function() {
            console.log(inputText.hasClass('invalid'));
            if(!inputText.hasClass('invalid')) {
              editableField.removeClass('editable-field--edit');
              editBtn.removeClass('hidden');
            }
          }, 100);
        });
      }

      this.attached = true;
    },
    attached: false,
  };

})(jQuery);
