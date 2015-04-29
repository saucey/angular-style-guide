/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors["text-input"] = {
    attach: function () {
    	var visited = function () {  //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
console.log("text-input init");
    		if ($(this).is(".dd")) {
    			$(this).find("select").addClass("visited");
    		}
    		else {
        		$(this).addClass("visited");
        	}
        };
      $("input, textarea").focus(visited);
      $("input, select, textarea, div.dd, span.checkbox").click(visited); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
    }
  };
})(jQuery);
