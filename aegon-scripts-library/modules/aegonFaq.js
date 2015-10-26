/**
 * Aegon Faq script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.aegonFaq = {
    attach: function () {

      // Little refactor for deprecated use of $('selector').click
      $(".faq .title").on('click', function (evt) {
        evt.stopPropagation();
        var radio = $("input[name=show]", this.parentNode)[0];
        if (radio.checked) {
          radio.checked = false;
          return false; //prevents, together with .stopPropagation, bubbling, which could keep the radio button checked, instead of having it set to false here
        }
      });
    }
  };

})(jQuery);
