/**
 * Counter: replaces all characters inside a .counter element with <span>char</span>,
 * so all characters will be styled with a box around it.
 */
(function($) {
  'use strict';

  var $counterElement = $('.counter'),
    charsWithSpans = '';

  $.each(($counterElement.text().trim().split('')), function (index, char) {
    charsWithSpans += '<span>' + char + '</span>';
  });

  $counterElement.html(charsWithSpans);
})(jQuery);

