/**
 * Counter: replaces all characters inside a .counter element with <span>char</span>,
 * so all characters will be styled with a box around it.
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.sticker_counter = {
    attach: function (context) {
      var $counterElement = $('.counter', context),
          charsWithSpans = '';

      $.each(($counterElement.text().trim().split('')), function (index, char) {
        charsWithSpans += '<span>' + char + '</span>';
      });

      $counterElement.html(charsWithSpans);
    }
  };

})(jQuery);

