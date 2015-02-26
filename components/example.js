/**
 * Example JavaScript component
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.example = {
    attach: function () {

      var button_var = {};

      return button_var;
    }
  };

  // You could add additional behaviors here.
  Drupal.behaviors.myModuleMagic = {
    attach: function (context, settings) { },
    detach: function (context, settings) { }
  };

})(jQuery);
