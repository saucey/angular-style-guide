/**
 * Pensioen123 script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.pensioen123_widget = {
    attach: function () {

      // Public function to set divs with the same class to the same height
      $.fn.setAllToMaxHeight = function(){
        return this.height( Math.max.apply(this, $.map( this , function(e){ return $(e).height() }) ) ); // jshint ignore:line
      };

      // Set all divs with class span4 inside .user-details same height
      $('.user-details .span4').setAllToMaxHeight();

      $('.icon').click(function() {
        var that = $(this),
            icon = that.data('icon'),
            el = '.details',
            details = that.closest('.row-fluid').find(el + "[data-icon='" + icon + "']"),
            selectedImg = '<img src="https://s3-eu-west-1.amazonaws.com/anl-ma-staticcontent/content/pensioen123/general/selected.png" class="selected">';


        // Loop through all elements with the class icon
        $('.icon').each(function() {
          // If there is an img with the class selected, remove it from the dom
          $(this).find('.selected').remove();
        }).promise().done(function() {
          // Append overlay image to the clicked icon
          that.append(selectedImg);
        });

        // Close all open details tabs
        $('.details').not(details).slideUp('fast').promise().done(function() {
          // Remove styles from .more and .more-details if they were clicked before
          details.find('.more').removeAttr('style');
          details.find('.more-details').removeAttr('style');
          // Open details tab
          details.slideDown('fast');
        });
                 
      });

      // Open icon tab on mobile devices
      $('.title').click(function() {
        var that = $(this),
            el = that.closest('.row-fluid').find('.tab');
        
        // Animate arrow when opening the tab
        $('.title').not(that).removeClass('arrowup');
        that.addClass('arrowup');

        // Close all open tabs
        $('.tab').not(el).slideUp('fast').promise().done(function() {
          // Open selected tab
          el.slideDown('fast');
        });
      });

      // Close details tab
      $('.close').click(function(e) {
        e.preventDefault();
        var parent = $(this).parent().parent();
        parent.slideUp('fast');

        // Loop through all elements with the class icon
        $('.icon').each(function() {
          // If there is an img with the class selected, remove it from the dom
          $(this).find('.selected').remove();
        });
      });

      // Open more-details
      $('.more').click(function(e) {
        e.preventDefault();
        $(this).closest('.details').find('.more-details').slideToggle('fast');
        // Hide lees meer
        $(this).hide();
      });
    }
  };

})(jQuery);
