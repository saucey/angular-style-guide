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

    jQuery( document ).ready(function() {//check the screen size and perform screen specific action
        //To check the width of the screen
        jQuery('#portraitwidth').val(jQuery(window).width());
        check_screen_size();
        checkspace_costelement();
        check_retinaimage();
        document_download_properties();
        check_image_properties();

        // header main menu
        var oput = '<div class="custom-menu-dropdown"><span class="selected">Meer</span><ul>';
        $('#block-menu-menu-home-main-menu ul.menu li.leaf').each(function() {
            var nwin = '';
            if ($(this).text() === 'Particulier' || $(this).text() === 'Meer' || ($(this).text() === 'Zakelijk' && $(window).width() >= 870)) { // ()
                return;
            }
            if ($(this).text() === 'Intermediair') {
                nwin = 'target = "_blank"';
            }
            oput += '<li><a href="' + $('a', this).attr('href') + '" ' + nwin + ' >' + $(this).text() + '</a></li>';
        });
        oput += '</ul></div>';
        $('#block-menu-menu-home-main-menu').append(oput);

        $('.custom-menu-dropdown').click(function() {
            $(this).children('ul').slideToggle(150);
        });

        $('.custom-menu-dropdown ul li').click(function() {
            // var sitem = $(this).html();
            $(this).siblings('li').removeClass('selected');
            $(this).addClass('selected');
        });

        $('body').bind('click touchstart', function(event) {
            var $target = $(event.target);
            if (!($target.is('.custom-menu-dropdown') || $target.parents().is('.custom-menu-dropdown'))) {
                $('.custom-menu-dropdown ul').hide();
            }
        });

        adjust_header_menu();

    });

    jQuery( window ).resize(function() {
        adjust_header_menu();
        if(window.matchMedia("(min-width:641px)").matches) {
            jQuery(".mobile-banner").removeClass("home-mobile-bg");
            jQuery(".banner-background").addClass("home-desktop-bg");
        }
        else{
            jQuery(".banner-background").removeClass("home-desktop-bg");
            jQuery(".mobile-banner").addClass("home-mobile-bg");
        }
        var old_width = jQuery('#portraitwidth').val();
        var height = jQuery(window).height();
        var width = jQuery(window).width();
        //jQuery('h1#page-title div.field-item').html(WURFL.complete_device_name);
        if (old_width !== width) {
            //To check the portrait & landscape view
            if (width > height) {
                jQuery('#portraitwidth').val(jQuery(window).width());
                /**
                 * Width 768 and greater should LandScape view & Desktop View
                 * Width 600 should be Samsamg Tab 2 7inch
                 */
                if (jQuery(window).width() >= 768) {
                    //To check ipad device on the userAgent
                    if (navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
                        window.addEventListener("orientationchange", function(event) {// jshint ignore:line
                            check_screen_size();  // capture the exact width of the screen and perform action
                            jQuery('.toggle-title').removeClass('open');
                        });
                    }
                    else {
                        check_screen_size();  // capture the exact width of the screen and perform action
                        jQuery('.toggle-title').removeClass('open');
                    }
                }
            }
            else {
                //jQuery('h1#page-title div.field-item').html(WURFL.complete_device_name);
                var storedweightval = jQuery('#portraitwidth').val();
                if (jQuery(window).width() === storedweightval) {
                    jQuery('.toggle-title').removeClass('open');
                }
                else {
                    if (jQuery(window).width() >= 768 || jQuery(window).width() === 600) {
                        jQuery('.toggle-title').removeClass('open');
                        check_screen_size();
                        jQuery('#portraitwidth').val(jQuery(window).width());
                    }
                }
            }
        }
    });

    function check_screen_size() {
        if (window.matchMedia("(min-width:1351px)").matches) { // if width is greater then 1351 then call trigger_1351(). NO code will be written here. All code should go within the trigger_1351 function, so don't change anything here
            trigger_1351();
        }
        else if (window.matchMedia("(min-width:1024px)").matches) { // if width is greater then 1024 then call trigger_1024(). NO code will be written here. All code should go within the trigger_1024 function, so don't change anything here
            trigger_1024();
        }
        else if (window.matchMedia("(min-width:901px)").matches) { // if width is greater then 901 then call trigger_901(). NO code will be written here. All code should go within the trigger_901 function, so don't change anything here
            trigger_901();
        }
        else if (window.matchMedia("(min-width:641px)").matches) { // if width is is greater then 601 then call trigger_641(). NO code will be written here. All code should go within the trigger_641 function, so don't change anything here
            trigger_641();
        }
        else {
            trigger_599();// else treat this as a mobile and call trigger_599();All code should go within the trigger_599 function, so don't change anything here
        }
    }

// Only code & function related to screen view port 1351 and above
    function trigger_1351(){
        open_collapsed_item(); // On Desktop, all element should be open
        comparision_table_hide_on_desktop(); // Hide the Mobile version of Comparision Table
        situation_element_desktop_view();
        change_pbb_view('desktop');
        jQuery("ul.first-level-item").find('li:eq(3)').addClass("border-Bblue");
        jQuery("ul.first-level-item li:last-child" ).addClass("border-Bblue");
    }

// Only code & function related to screen view port 1024 and above
    function trigger_1024(){
        open_collapsed_item();// On Desktop, all element should be open
        comparision_table_hide_on_desktop();// Hide the Mobile version of Comparision Table
        situation_element_desktop_view();
        change_pbb_view('desktop');
        jQuery("ul.first-level-item").find('li:eq(3)').addClass("border-Bblue");
        jQuery("ul.first-level-item li:last-child" ).addClass("border-Bblue");
    }

// Only code & function related to screen view port 901 and above
    function trigger_901(){
        // In ipad and tablet top task element should be open by default
        var elementSize = jQuery(".node--service-home .toggle-content").size();
        if(elementSize > 1) {
            open_collapsed_item();
        } else  {
            closed_collapsed_item();// On Mobile, all element should be collapsed
        }
        comparision_table_show_on_mobile();// Hide the Desktop version of Comparision Table
        situation_element_desktop_view(); // Show the Situation element mobile view
        change_pbb_view('desktop');
        jQuery("ul.first-level-item").find('li:eq(3)').addClass("border-Bblue");
        jQuery("ul.first-level-item li:last-child" ).addClass("border-Bblue");
    }

// Only code & function related to screen view port 601 and above
    function trigger_641(){
        // In ipad and tablet top task element should be open by default
        var elementSize = jQuery(".node--service-home .toggle-content").size();
        if(elementSize > 1) {
            open_collapsed_item();
        } else  {
            closed_collapsed_item();// On Mobile, all element should be collapsed
        }
        comparision_table_show_on_mobile();// Hide the Desktop version of Comparision Table
        situation_element_desktop_view(); // Show the Situation element mobile view
        change_pbb_view('tablet');
        jQuery("ul.first-level-item").find('li:eq(3)').addClass("border-Bblue");
        jQuery("ul.first-level-item li:last-child" ).addClass("border-Bblue");
    }

// Only code & function related to screen view port 599 and less
    function trigger_599(){
        closed_collapsed_item();// On Mobile, all element should be collapsed
        comparision_table_show_on_mobile();// Hide the Desktop version of Comparision Table
        situation_element_mobile_view(); // Show the Situation element mobile view
        change_pbb_view('mobile');
        jQuery(".banner-background").removeClass("home-desktop-bg");
        jQuery(".mobile-banner").addClass("home-mobile-bg");
        jQuery("ul.first-level-item").find('li:eq(3)').addClass("border-Bwhite");
        jQuery("ul.first-level-item li:last-child" ).addClass("border-Bwhite");
    }


    function open_collapsed_item(){
        jQuery(".toggle-content").show();  // Show all elements as open.
    }

    function closed_collapsed_item(){
        jQuery(".toggle-content").hide();// Collapsed all elements.
    }

    function comparision_table_show_on_mobile(){ // Show mobile version and hide Desktop Version
        jQuery('.node--product-comparision-table .comp-table-desktop').hide();
        jQuery('.node--product-comparision-table .comp-table-mobile').show();

        var n = jQuery(".node--specifications-table table.first_table tr").size();
        if(n > 1) {
            jQuery('.node--specifications-table .comp-table-desktop').hide();
            jQuery('.node--specifications-table .comp-table-mobile').show();
        } else {
            jQuery('.node--specifications-table .comp-table-desktop').show();
            jQuery('.node--specifications-table .comp-table-mobile').hide();
        }
    }

    function comparision_table_hide_on_desktop(){  // Show Desktop version and hide Mobile Version
        jQuery('.node--product-comparision-table .comp-table-desktop').show();
        jQuery('.node--product-comparision-table .comp-table-mobile').hide();

        jQuery('.node--specifications-table .comp-table-desktop').show();
        jQuery('.node--specifications-table .comp-table-mobile').hide();
    }

    function change_pbb_view(device) {
        jQuery('.pbb-view div.sm').show();
        jQuery(".pbb-view .span4 .content").height('auto');
        switch(device) {
          case 'desktop':
            jQuery('.pbb-view div.sm:gt(2)').hide();
            //jQuery('.pbb-view div.sm:nth-child(3n)').hide();
            jQuery('.pbb-sm a').attr('numitems', '2');
            //jQuery('.ppb-view div.sm:gt(2)').css('color', 'red');
          break;
          case 'tablet':
            jQuery('.pbb-view div.sm:gt(1)').hide();
            jQuery('.pbb-sm a').attr('numitems', '1');
          break;
          case 'mobile':
            jQuery('.pbb-view div.sm:gt(2)').hide();
            jQuery('.pbb-sm a').attr('numitems', '2');
          break;
        }
    }

    /**
     * Situation Element mobile view
     **/
    function situation_element_mobile_view() {
        jQuery('.situations-desktop .field--name-field-description-type1').hide();
        jQuery('.more-situations .field--name-field-label-text').remove();
        jQuery('.situations-mobile').show();
    }

    /**
     * Situation Element desktop view
     **/
    function situation_element_desktop_view() {
        jQuery('.situations-desktop .field--name-field-description-type1').show();
        jQuery('.situations-desktop .field--name-field-label-text').show();
        jQuery('.situations-mobile').hide();
    }

    /**
     * To add the last child class name in cost element
     */
    function checkspace_costelement(){
        jQuery("div.field--name-field-cost-element-cost-table div.field-items :last").parents('.field-item').addClass("last-child");
    }

    /*
     * Header main menu
     */
    function adjust_header_menu() {
        if ($('#block-menu-menu-home-main-menu').length > 0 && $(window).width() <= 1340) {
            if ($(window).width() <= 870) {
                if( $('.custom-menu-dropdown').length <= 0) {
                    $('#block-menu-menu-home-main-menu ul.menu').find('li:gt(0)').hide();
                }
                else {
                    $('#block-menu-menu-home-main-menu ul.menu').find('li:gt(0)').hide();
                    $('.custom-menu-dropdown').show();
                }
            }
            else {
                if ($('.custom-menu-dropdown').length <= 0) {
                    $('#block-menu-menu-home-main-menu ul.menu').find('li:gt(1)').hide();
                }
                else {
                    $('#block-menu-menu-home-main-menu ul.menu').find('li:gt(1)').hide();
                    $('.custom-menu-dropdown').show();
                }
            }
        }

        else {
            if( $('.custom-menu-dropdown').length > 0) {
                $('.custom-menu-dropdown').hide();
                $('#block-menu-menu-home-main-menu ul.menu').find('li').show();
            }
        }
    }

    /**
     * Open/Collapse behaviour for jQuery toggle
     */
    (function($) {
        var n = jQuery(".node--service-home #categories-list .toggle-content").size();
        $("article .toggle-title").click(function() {
            if(n > 1) {
                //To check the slideToggle function will not work for min-width of 901px & 641px
                if (!window.matchMedia("(min-width:901px)").matches && !window.matchMedia("(min-width:641px)").matches){
                    $(this).toggleClass("open");
                    $(this).next(".toggle-content").slideToggle();
                }
            }
            else{
                //To check the slideToggle function will not work for min-width of 1024 & 1351px
                if (!window.matchMedia("(min-width:1024px)").matches && !window.matchMedia("(min-width:1351px)").matches){
                    $(this).toggleClass("open");
                    $(this).next(".toggle-content").slideToggle();
                }
            }
            //$.cookie('form_visible', $('.toggle-title').is(':visible').toString());
        });
    })(jQuery);

    function check_retinaimage() {
        if (window.devicePixelRatio > 1) {
            jQuery('img#service-icon').each(function() {
                var src_retina = jQuery(this).attr("src-retina");
                jQuery(this).attr("src", src_retina);
            });
        }
    }

    /**
     * To get the ddevice type (android/ipad/iphone)
     */
    function get_device_type() {
        var device_type = '';
        if(navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            device_type = 'android';
        } else if(navigator.userAgent.toLowerCase().indexOf("iphone") > -1) {
            device_type = 'iphone';
        } else if(navigator.userAgent.toLowerCase().indexOf("ipad") > -1) {
            device_type = 'ipad';
        }
        return device_type;
    }

    /**
     * To do some changes for download links inside editor
     */
    function document_download_properties() {
        var device_type = get_device_type();
        jQuery('.field--name-body .img__view_mode__default').each(function() {
            if (device_type === 'ipad' || device_type === 'iphone') {
                jQuery('.field--name-body .img__view_mode__default a').attr('target', '_blank');
            }
        });

        jQuery('.field--name-field-downloads .field-item').each(function() {
            if (device_type === 'ipad' || device_type === 'iphone') {
                jQuery('.field--name-field-downloads .field-item a').attr('target', '_blank');
            }
        });
    }
    /* jshint ignore:start */
    function inpagechatclose(){
        jQuery('#inpage-chat').hide();
    }
    /* jshint ignore:end */
    function check_image_properties(){
        jQuery("div.field--name-body img").each(function() {
            var img_align = jQuery(this).attr('data-picture-align');
            if(img_align === 'left') {
                jQuery(this).addClass("image-left");
            }
            if(img_align === 'right') {
                jQuery(this).addClass("image-right");
            }
        });
    }

}(this.Drupal, this.jQuery));
