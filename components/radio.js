/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.radio = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
//console.log("radio init");
        $(this).addClass("visited");
      };
      $("span.radio").focus(visited);
      $("span.radio").click(visited);
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
  };
})(jQuery);
