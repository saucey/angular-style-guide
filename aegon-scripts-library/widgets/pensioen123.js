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

      var openDetails = function() {
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
      };

      var openMoreDetails = function(e) {
        var that = $(this);

        e.preventDefault();

        // Hide layer1 and show layer2
        that.closest('.details').find('.description').slideToggle('fast').promise().done(function() {
            that.closest('.details').find('.more-details').slideToggle('slow');
        });

        // Hide lees meer
        that.hide();
      };

      var closeDetails = function(e) {
        var parent = $(this).parent().parent();

        e.preventDefault();

        // Set opacity 1 to all icons
        $('.product-overview').find('.icon').not('.icon.big').css('opacity', '1');

        parent.slideUp('fast');
      };

      var openMobileTab = function() {

        if($(window).width() <= 640) {
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
        } 
      };

      // Open details
      $('.icon').not('.icon.big').click(openDetails);

      // Open icon tab on mobile devices
      $('.span6 .title').click(openMobileTab);

      // Close details 
      $('.close').click(closeDetails);

      // Open more details
      $('.more').click(openMoreDetails);
    }
  };

})(jQuery);
