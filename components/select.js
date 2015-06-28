/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.select = {
    attach: function () {
      $("select").msDropDown();
      //console.log("initializing msDD");
      //$(".lhfs_widget select").msDropDown();

      //transfer classes from select to root object of msDropDown (conserve .half, for example)
      $(".ddOutOfVision > select").each(function() {
        $(this).parent().next().addClass(this.className);
      });

      //put all selects treat by msDropDown into the .dd container, and out of the .ddOutOfVision containter, so that frontend error marking has a chance (so far, tests show this does not affect the functionality of the dd)
      var $select = $(".ddOutOfVision select").detach();
      var $dd = $(".dd");
      //move select into the .dd container
      $select.each(function (i) {
        this.style.display = "none";
        $($dd[i].firstChild).before(this);
      });
      //move the selects' errorText to the end of the .dd container
      var $ETs = $(".dd + .errorText");
      $ETs.each(function () {
        var $dd = $(this).prev();
        $dd.find("select").after(this);
      });
    }
  };
})(jQuery);
