/**
 * Pensioen123 script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.pensioen123_widget = {
    attach: function () {

      $.fn.setAllToMaxHeight = function(){
        return this.height( Math.max.apply(this, $.map( this , function(e){ return $(e).height() }) ) ); // jshint ignore:line
      };

      $('.user-details .span4').setAllToMaxHeight();

      //TODO:Demo functionality, have to change depending on the content we will get later
      $('.icon').click(function() {
        var that = $(this);
        var icon = that.data('icon');
        var el = '.details';
        var details = that.closest('.row-fluid').find(el + "[data-icon='" + icon + "']");

        $('.icon').each(function() {
          if($(this).hasClass('active')) {
            $(this).removeClass('active');
          }
        }).promise().done(function() {
          that.addClass('active');
        });

        $('.details').each(function() {
          if($(this).hasClass('open') && $(this).data('icon') != icon) {
            $(this).slideUp('fast');
          }
        }).promise().done( function(){ 
          details.slideDown('fast');
          details.addClass('open'); 
        });
        
      });

      $('.close').click(function(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        parent.slideUp('fast');
        parent.removeClass('open');

        // $(this).closest('.row-fluid').find('.details').slideToggle('fast');
      });

      $('.more').click(function(e) {
        e.preventDefault();
        $(this).closest('.details').find('.more-details').slideToggle('fast');
        $(this).css('display', 'none');
      });
    }
  };

})(jQuery);
