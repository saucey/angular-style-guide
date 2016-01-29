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
      // the plugin on load adds the class that changes the color.
      // we need to add the class to the clicked button for UX purposes.
      $(".rate-button").on("click", function(){
        var $this = $(this),
            parent = $this.parent().parent();
        parent.find(".rate-voted").removeClass("rate-voted");
        $this.addClass("rate-voted");
      });
    }
  };

})(jQuery);
