/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.select = {
    attach: function () {
      $("select").msDropDown(); //activate custom drop down functionalities

      //transfer classes from select to root object of msDropDown (conserve .half, for example)
      $(".ddOutOfVision > select").each(function() {
        $(this).parent().next().addClass(this.className);
      });

      //put all selects treated by msDropDown into the .dd container, and out of the .ddOutOfVision containter, so that frontend error marking has a chance (so far, tests show this does not affect the functionality of the dd)
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

      var blurred = Drupal.behaviors["text-input"].prepareBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      var focussed = Drupal.behaviors["text-input"].endBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      $("select, div.dd")
        .blur(blurred) //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
        .focus(focussed).click(focussed); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
    }
  };
})(jQuery);
