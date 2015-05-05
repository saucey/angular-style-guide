/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors["checkbox"] = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
console.log("checkbox init");
        $(this).addClass("visited");
      };
      $("span.checkbox").focus(visited);
      $("span.checkbox").click(visited);
    }
  };
})(jQuery);
