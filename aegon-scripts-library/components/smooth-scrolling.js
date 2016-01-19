(function($, Drupal) {

	'use strict';

	Drupal.behaviors.smoothScrolling = {
		attach: function(){
			$('a.smooth-scroll').on('click',function (e) {
				e.preventDefault();

				var target = $('' + $(this).attr('href'));
		    $('html, body').animate({
		        scrollTop: target.offset().top - 20 
		    }, 500);
			});
		}
	};
})(this.jQuery, this.Drupal);