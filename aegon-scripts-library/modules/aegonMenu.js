(function(Drupal, $) {

  'use strict';

  /**
   * JS code for Aegon Menu
   * Dependencies: $.browser
   */
  Drupal.behaviors.aegonMenu = {

    /**
     * Istructions for Menu Global.
     * (Desktop and other devices, apart mobile with screen below < 640 pixels)
     */
    menuDesktop: function (menu, context) {

      // Click on backdrop or a#close
      menu.find('.nav-backdrop').add('a.close').on('click', function () {
        $('body').removeClass('pushmenu-to-right');
        menu.removeClass('open');
        menu.find('.level-2-item').removeClass('item-open');
      });

      // Push menu instructions
      menu.find("#showLeftPush").click(function () {

        $('body', context).toggleClass('pushmenu-to-right');

        if (menu.hasClass('open') && !$('body').hasClass('pushmenu-to-right')) {

          menu.removeClass('open');

        } else {

          menu.addClass('open');
        }

        menu.find('.level-2-item').removeClass('item-open');
      });

      // Clicks on .level-2-item
      menu.find('.level-2-item').on('click', function (e) {

        var isSubmenu = $(e.target).is('ul') || $(e.target).is('li');

        // Stop propagation if not .close
        if ($(e.target).hasClass('close') || isSubmenu) { return; }

        $('body', context).removeClass('pushmenu-to-right');

        if ($(this).hasClass('item-open')) {

          // Remove class .open to hide backdrop
          menu.removeClass('open');

        } else {

          // Add class .open to show backdrop
          menu.addClass('open');
        }

        // Remove all .item-open apart this
        menu.find('.level-2-item').not(this).removeClass('item-open');

        // Toggle .item-open only for this
        $(this).toggleClass('item-open');

        // Position fixed is not used anymore. But to be sure, I leave this
        // source code here.
        // Fix for Safari on Mac with wrong position fixed support.
        // if ($.browser.safari === true) {
        //   var layoutHeaderHeight = $('header.header').height();
        //   var newTop = $(this).position().top + layoutHeaderHeight;
        //   $(this).children("ul").css("top", -newTop + "px");
        // }
      });

      return this;
    },

    /**
     * Istructions for Menu Mobile.
     * (All screens below < 640 pixels)
     */
    menuMobile: function (menu, context) {

      // Mobile navigation
      $('#openmenu', context).on('click', function() {

        $('body', context).toggleClass('pushmenu-to-right');

        if (menu.hasClass('open') && !$('body').hasClass('pushmenu-to-right')) {

          menu.removeClass('open');

        } else {

          menu.addClass('open');
        }
      });

      // All clicks on #scroll div
      $('#scroll', context).on('mousedown touchmove', function (e) {

        if (e.target.id === 'openmenu') { return; }

        if ($('body').hasClass('pushmenu-to-right')) {

          $('body').removeClass('pushmenu-to-right');
        }
      });

      // Menu back links
      menu.find('.mm-back').on('click', function() {

        if ($(this).hasClass('menu')) {
          menu.find('nav').addClass('slide-to-left').removeClass('slide-to-right');
          return;
        }

        menu.find('nav').removeClass('slide-to-left slide-to-right');
      });

      // Links in mobile-level2
      menu.find('.mobile-level2 a[class*="menu-"]').on('click', function (e) {

        // Local scope vars
        var targetLevel3Class, level3;

        targetLevel3Class = e.target.className.split(' ')[0];

        level3 = menu.find('.mobile-level3.' + targetLevel3Class);

        // If the related level3 is present do stuff and block the normal 
        // behaviour of the link
        if (level3.length > 0) {

          menu.find('nav').addClass('slide-to-right');

          level3.addClass('show').siblings('.mobile-level3')
            .removeClass('show');

          e.preventDefault();
        }
      });

      // Exception in case there is only one mobile-level.
      // Slide the nav menu to left
      var mobileLevel2sCount = menu.find('.mobile-level2').length;

      if (mobileLevel2sCount < 1) {
        menu.find('nav').addClass('slide-to-left');
      }

      return this;
    },

    /**
     * Drupal's attach method
     */
    attach: function(context) {

      // Register DOMs of aside menus
      var menuDesktopDOM = $('aside.desktop', context),
          menuMobileDOM = $('aside.mobile', context);

      // Run all instructions for different breakpoints
      this.menuDesktop(menuDesktopDOM, context).menuMobile(menuMobileDOM, context);
    }
  };

}(this.Drupal, this.jQuery));