/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.lhfs_widget = {
    attach: function () {

      // Check if div#lhfs_widget exist
      if ($('#lhfs_widget').length > 0) {

        // Run your DOM manipulation stuff
        $(".tip").removeClass("visible");
        $(".tip").addClass("visible");
        $("li.payment").removeClass("data");
        $("li.payment").addClass("data");
      }
    }
  };

})(jQuery);
