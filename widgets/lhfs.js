/**
 * LHFS script
 */

// Closure
(function($, window) {
  'use strict';

  // Shortcut for on DOM ready
  $(function () {

    // Check if div#lhfs_widget exist
    if ($('#lhfs_widget').length > 0) {

      // Run your DOM manipulation stuff
      $(".tip").removeClass("visible");
      $(".tip").addClass("visible");
      $("li.payment").removeClass("data");
      $("li.payment").addClass("data");
    }
  });

})(jQuery, this);
