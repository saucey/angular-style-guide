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
            allIcons = that.closest('.row-fluid').find('.icon').not('.icon.big'),
            details = that.closest('.row-fluid').find(el + "[data-icon='" + icon + "']");

        // Set all icons back to opacity 1
        $('.product-overview').find('.icon').not('.icon.big').css('opacity', '1');
        
        // Check if the selected details tab is already open
        if(details.is(':visible')) {
          // If so; close it
          details.slideUp('fast'); 
        } else {
          // Set all the icons in the row to opacity 0.25
          allIcons.not(that).css('opacity', '0.25');
          // Close all open details tabs
          $('.details').slideUp('fast').promise().done(function() {
            // Remove styles from .description, .more and .more-details if they were clicked before
            details.find('.description').removeAttr('style');
            details.find('.more').removeAttr('style');
            details.find('.more-details').removeAttr('style');
            // Open details tab
            details.slideDown('fast');
          });
        }          
      });

      // Open icon tab on mobile devices
      $('.span6 .title').click(function() {
        var that = $(this),
            el = that.closest('.row-fluid').find('.tab');
        
        // Animate arrow when opening the tab
        $('.title').not(that).removeClass('arrowup');
        that.addClass('arrowup');

        if(el.is(':visible')) {
          el.slideUp('fast');
          that.removeClass('arrowup');
        } else {
          // Close all open tabs
          $('.tab').slideUp('fast').promise().done(function() {
            // Open selected tab
            el.slideDown('fast');
          });
        }    
      });

      // Close details tab
      $('.close').click(function(e) {
        e.preventDefault();

        // Set opacity 1 to all icons
        $('.product-overview').find('.icon').not('.icon.big').css('opacity', '1');

        var parent = $(this).parent().parent();
        parent.slideUp('fast');

        // Loop through all elements with the class icon
        $('.icon').each(function() {
          // If there is an img with the class selected, remove it from the dom
          $(this).find('.active').remove();
        });
      });

      // Open more-details
      $('.more').click(function(e) {
        e.preventDefault();
        // Hide layer1 and show layer2
        $(this).closest('.details').find('.description').slideToggle('fast').promise().done(function() {
            $(this).closest('.details').find('.more-details').slideToggle('slow');
        });
        // Hide lees meer
        $(this).hide();
      });
    }
  };

})(jQuery);
