/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.situation_element = {
    attach: function () {
      if ($(window).width() < 640) {
        $('.situation-element').each(function() {
          var situationAnchors = $(this).find('a').clone().addClass('button arrow');
          var textElement = $(this).find('.situation-text');
            textElement.empty();
            textElement.append(situationAnchors);
       });
      }
    } 
  };
})(jQuery);