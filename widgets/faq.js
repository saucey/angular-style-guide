/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.faq = {
    attach: function () {

      // Check if div#lhfs_widget exist
      if ($('.faq').length > 0) {
        $(".faq .title").click(function (event) {
          event.stopPropagation();
          var radio = $("input[name=show]", this.parentNode)[0];
          if (radio.checked) {
            radio.checked = false;
            return false; //prevents, together with .stopPropagation, bubbling, which could keep the radio button checked, instead of having it set to false here
          }
        });
      }
    }
  };

})(jQuery);
