/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors["text-input"] = {
    attach: function () {
      // the function on visited is disabled, but keep until it is reasonably sure that everybody is certain that this is what they want
    	//var visited = Drupal.behaviors["text-input"].prepareVisited; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      //$("input, textarea").focus(visited);
      //$("input, select, textarea, div.dd, span.checkbox").click(visited); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity

      var blurred = Drupal.behaviors["text-input"].prepareBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      var focussed = Drupal.behaviors["text-input"].endBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      $("input, select, textarea, div.dd, span.checkbox")
        .blur(blurred) //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
        .focus(focussed).click(focussed); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
      

      this.attached = true;
    },
    attached: false,
    prepareVisited: function () {
      // console.log("text-input init");
      if ($(this).is(".dd")) {
        $(this).find("select").addClass("visited");
      }
      else {
        $(this).addClass("visited");
      }
    },
    prepareBlurred: function () {
      // console.log("text-input init");
      if ($(this).is(".dd")) {
        $(this).find("select").addClass("blurred");
      }
      else {
        $(this).addClass("blurred");
      }
    },
    endBlurred: function () {
      // console.log("text-input init");
      if ($(this).is(".dd")) {
        $(this).find("select").removeClass("blurred");
      }
      else {
        $(this).removeClass("blurred");
      }
    },
  };
})(jQuery);
