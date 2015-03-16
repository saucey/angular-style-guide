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

        window.edit = function (show) {
          jQuery('.details').toggleClass('edit', show);
          jQuery('.actions').toggleClass('edit', show);
        }

        $("button").focus(function () {this.blur()})  //avoid the blue (on mac) frame around a button when it is clicked

        $("#lhfs_widget .tip").removeClass("visible");
        $("#lhfs_widget .tip").addClass("visible");
        $("#lhfs_widget li.payment").removeClass("data");
        $("#lhfs_widget li.payment").addClass("data");
        $("#lhfs_widget li.payment ul.horizontal").removeClass("visible");
        $("#lhfs_widget li.payment ul.horizontal").addClass("visible");
        $($("#lhfs_widget li.payment ul.horizontal")[0]).addClass("visible");
      }
    }
  };

})(jQuery);
