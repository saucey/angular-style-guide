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
          $('.details').toggleClass('edit', show);
          $('.actions').toggleClass('edit', show);
        }

        //$("#lhfs_widget .tip").removeClass("visible");
        //$("#lhfs_widget .tip").addClass("visible");
        //$("#lhfs_widget li.payment").removeClass("data");
        //$("#lhfs_widget li.payment").addClass("data");
        $("#lhfs_widget li.payment ul.horizontal").removeClass("visible");
        $("#lhfs_widget li.payment ul.horizontal").addClass("visible");
        //$($("#lhfs_widget li.payment ul.horizontal")[0]).addClass("visible");
        $("#lhfs_widget li.payment ul.horizontal.error").removeClass("visible");

        $(".lhfs_widget select").msDropDown();

        //transfer classes from select to root object of msDropDown (conserve .half, for example)
        $(".ddOutOfVision > select").each(function() {
          $(this).parent().next().addClass(this.className);
        });

        //put an event listener on the invalid element for inputs (to display the error text, if necessary)
        $("input").bind("invalid", function(event) {
          console.log($(this).closest("ul").prev("ul.error").addClass("visible"));
        });

        $("form [name=lhfs_form]").validate({errorClass: "errorText"});
      }
    }
  };

})(jQuery);
