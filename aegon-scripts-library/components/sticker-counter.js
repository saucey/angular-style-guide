/**
 * Counter: replaces all characters inside a .counter element with <span>char</span>,
 * so all characters will be styled with a box around it.
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.sticker_counter = {
    attach: function (context) {

      // Iterate over all elements with class "counter"
      $('.sticker-counter .counter', context).each(function (index, counterElement) {
        var charsWithSpans = '',
            $counterElement = $(counterElement);

        // Trim number and replace with spans around each character
        $.each($counterElement.text().trim().split(''), function (index, char) {
          charsWithSpans += '<span>' + char + '</span>';
          $counterElement.html(charsWithSpans);
        });
      });
    }
  };
})(jQuery);

