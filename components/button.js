/**
 * Example JavaScript component
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.button_example = {
    attach: function () {

      var button_var = {};

      return button_var;
    }
  };

})(jQuery);
