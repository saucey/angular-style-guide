(function($, Drupal) {

	'use strict';

	Drupal.behaviors.smoothScrolling = {
		attach: function(){
			$(document).on('click', 'a.smooth-scroll', function (e) {
				e.preventDefault();

				var target = $('' + $(this).attr('href'));
			    $('html, body').animate({
			        scrollTop: target.offset().top - 20 
			    }, 500);
			});
		},
		scrollTo: function(id) {
			if(typeof id !== 'undefined') {
				id = id.indexOf('#') === 0 ? id : '#' + id; 
				var ele = $(document).find(id);
				if(ele.length) {
					var i = ele.offset().top;
			        $("html, body").animate({
			            scrollTop: i
			        }, 500);
				}
			}
		}
	};
})(this.jQuery, this.Drupal);