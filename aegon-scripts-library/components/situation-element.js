/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.situation_element = {
    attach: function () {
      $('.situation-element').each(function(index, container) {

        // Clone all links as a collection of buttons
        var situationAnchors = $(container).find('a').clone().addClass('button arrow'),
            // create new container for the buttons
            buttonsContainer = $('<div class="situation-buttons"></div>');

        // Append buttons to new element and append that to parent container
        $(container).append(buttonsContainer.append(situationAnchors));
     });
    }
  };
})(jQuery);