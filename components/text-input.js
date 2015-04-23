/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors["text-input"] = {
    attach: function () {
    	var visited = function () {
    		console.log("visiting");
    		if ($(this).is(".dd")) {
    			$(this).find("select").addClass("visited");
    		}
    		else {
        		$(this).addClass("visited");
        	}
        };
        $("input, textarea").focus(visited);
        $("input, select, textarea, div.dd, span.checkbox").click(visited);
    }
  };
})(jQuery);
