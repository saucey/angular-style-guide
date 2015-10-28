/**
 * Copy of the anchors of the situation element to a mobile element
 */
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.situation_element = {
    attach: function () {
      $('.situation-element').each(function() {
        var sitationLink = $(this).find('a').clone().addClass('button arrow');
        var mobileElement = $(this).find('.situation-text-mobile');
        mobileElement.append(sitationLink);
     });
    }
  };

})(jQuery);