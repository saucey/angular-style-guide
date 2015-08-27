/**
 * Pensioen123 script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.pensioen123_widget = {
    attach: function () {

      //TODO:Demo functionality, have to change depending on the content we will get later
    	$('.icon').click(function() {
    		console.log($(this).closest('.row-fluid').find('.details'));
    		$(this).closest('.row-fluid').find('.details').slideToggle('fast');
    	});

    	$('.close').click(function(e) {
    		e.preventDefault();
    		$(this).closest('.row-fluid').find('.details').slideToggle('fast');
    	});

    	$('.more').click(function(e) {
    		e.preventDefault();
    		$(this).closest('.row-fluid').find('.more-details').slideToggle('fast');
    	});
    }
  };

})(jQuery);
