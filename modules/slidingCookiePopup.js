(function ($, Drupal, win, doc) {

  'use strict';

  /**
   * Sliding cookie popup implementation.
   * Dependency: Drupal.settings.eu_cookie_compliance object
   * @type {Object}
   */
  Drupal.behaviors.slidingCookiePopup = {

    attach: function () {

      // Retrieve CookieOptIn setting
      var ext_cookie_val = this.getCookie('AEGON.CookieOptIn.setting');

      var runCreatePopup = $('body.logged-in').length < 1 &&
                           $('body.imce').length < 1 &&
                           ext_cookie_val === 'nocookie';

      console.log('runCreatePopup', runCreatePopup);

      if (runCreatePopup) {

        // Create and append the popup div
        this.createPopup(Drupal.settings.eu_cookie_compliance.popup_html_info);
      }
    },

    createPopup: function (html) {
      var height;
      var popup = $(html)
        .attr({"id": "sliding-popup"})
        .height(Drupal.settings.eu_cookie_compliance.popup_height)
        .width(Drupal.settings.eu_cookie_compliance.popup_width)
        .hide();

      popup.prependTo("body");
      height = popup.height();
      popup.show()
        .attr({"class": "sliding-popup-top"})
        .css({"top": -1 * height})
        .animate({top: 0}, Drupal.settings.eu_cookie_compliance.popup_delay);

      // In the end attach events
      this.attachEvents();
    },

    getCookie: function(name) {
      var search = name + '=';
      var returnValue, offset;

      if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset !== -1) {
          offset += search.length;
          var end = document.cookie.indexOf(';', offset);
          if (end === -1) {
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(offset, end).replace(/\+/g, '%20'));
        } else {
          returnValue = 'nocookie';
        }
      }

      return returnValue;
    },

    getCurrentStatus: function () {
      var name = 'cookie-agreed';
      return this.getCookie(name);
    },

    setStatus: function (status) {
      var date = new Date();
      date.setDate(date.getDate() + 100);
      var cookie = "cookie-agreed=" + status + ";expires=" + date.toUTCString() + ";path=" + Drupal.settings.basePath;
      if(Drupal.settings.eu_cookie_compliance.domain) {
        cookie += ";domain="+Drupal.settings.eu_cookie_compliance.domain;
      }
      document.cookie = cookie;
    },

    changeStatus: function (value) {
      var that = this;
      var status = that.getCurrentStatus();
      if (status === value) { return; }

      // Memorize sliding popup
      var SlidingPopup = $('#sliding-popup');

      // Animate sliding popup
      SlidingPopup.animate({top: SlidingPopup.height() * -1}, Drupal.settings.eu_cookie_compliance.popup_delay, function () {
        if(status === 0) {
          SlidingPopup.html(Drupal.settings.eu_cookie_compliance.popup_html_agreed).animate({top: 0}, Drupal.settings.eu_cookie_compliance.popup_delay);
          that.attachEvents();
        }
        if(status === 1) {
          SlidingPopup.remove();
        }
      });

      that.setStatus(value);
    },

    attachEvents: function () {

      var that = this;

      // Retrieve CookieOptIn setting
      var ext_cookie_val = this.getCookie('AEGON.CookieOptIn.setting'),
          loc_cookie_val = this.getCurrentStatus();

      // Social hiding based on cookie's privacy preference
      that.socialShowHide(ext_cookie_val);

      // Launch offclick to unbind multiple clicks after saving cookie
      var offClicks = function () {

        $('#no-thankx')
          .add('a')
          .not('.find-more-button')
          .not('.level-2-item a, .home-tap a')
          .add('.level-2-item .level3 a')
          .add('.level-2-item a:first-child')
          .add('.custom-menu-dropdown a')
          .off('click');
      };

      // Function to save cookie on the client
      var saveCookieOptIn = function (selVal) {

        var cookie, date;

        date = new Date();
        date.setTime(date.getTime() + 100 * 24 * 60 * 60 * 1e3);
        date.setDate(date.getDate() + 100);
        cookie  = 'AEGON.CookieOptIn.setting = ' + selVal + ';';
        cookie += 'expires=' + date.toUTCString() + '; path=/';
        if (Drupal.settings.eu_cookie_compliance.domain) {
          cookie += ';domain=' + Drupal.settings.eu_cookie_compliance.domain;
        }

        // Memorize it
        doc.cookie = cookie;
      };

      // Save cookie's preference on backend
      var savePreference = function (e, preference, newLocation) {

        var cookieOpslaan, cookieType, dataVal, popupWrapper, req, selVal,
            statusVal;

        // Unbind clicks on all links
        offClicks();

        // Set to false newLocation if undefined or null
        newLocation = newLocation || false;

        // Cache #popup-wrapper
        popupWrapper = $('#popup-wrapper');

        // Force selVal as 'preference' parameter or get the choice of user
        selVal = preference || $('input[name=optIn]:radio:checked').val();

        // Prepare vars
        if (selVal === 'external') {
          cookieType = 'extern|instellingen';
          cookieOpslaan = 'extern cookie opslaan';
          dataVal = 'E';
          statusVal = 2;
        } else if (selVal === 'visit') {
          cookieType = 'statistiek|bezoek';
          cookieOpslaan = 'statistiek cookie opslaan';
          dataVal = 'S';
          statusVal = 'nocookie';
        } else {
          cookieType = 'statistiek|instellingen';
          cookieOpslaan = 'statistiek cookie opslaan';
          dataVal = 'S';
          statusVal = 1;
        }

        // Save third part cookie if different from 'visit'
        if (statusVal !== 'nocookie') { saveCookieOptIn(selVal); }

        // Save local cookie
        that.setStatus(statusVal);

        // Run socialShowHide
        if (dataVal === 'E') { that.socialShowHide('external'); }

        // Save in the backend if is not the first visit
        if (selVal !== 'visit') {
          req = $.ajax({
            type: 'GET',
            dataType: 'text',
            global: false,
            url: '/lpa/CookieVoorkeur',
            data: 'ans=' + dataVal,
            success: function () {

              // Close jquery ui dialog only if #popup-wrapper exist
              if (popupWrapper.hasClass('ui-dialog-content')) {
                popupWrapper.dialog('close');
              }
            }
          });
        }

        // Trigger tealium to record 'cookie settings changed' event
        if (typeof win.utag === 'object') {
          win.utag.view({
            page_cat_1_type: 'cookie',
            page_cat_2_name: cookieOpslaan,
            page_cat_3_section: 'cookie',
            page_cat_6_businessline: 'algemeen',
            cookie_type: cookieType,
            event: 'cookie_accepted'
          }, function() {

            // Stop if no newLocation passed
            if (!newLocation) { return; }

            // Wait until the previous ajax end
            req.always(function () {

              // Navigate to new location
              win.location.href = newLocation;
            });
          });

          // Stop everything here
          return;
        }

        // If we are passing an href as parameter make a check on ajax end
        if (newLocation && selVal !== 'visit') {

          // Wait until the previous ajax end
          req.always(function () {

            // Navigate to new location
            win.location.href = newLocation;
          });
        }
      };

      // No thanks behavoiur
      var noThanksPreference = function (e) {

        // Check if target is a link with a proper href
        var newLocation = e.target.href || null;

        // Change status of main cookie and hide the sliding cookie popup
        that.changeStatus(2);

        // Trigger to save preference in backend
        savePreference(null, 'external', newLocation);

        // Only if no-thankx
        if (e.target.id === 'no-thankx') {

          // Trigger tealium call to record 'cookie pop up closed' event
          if (typeof win.utag === 'object') {
            win.utag.view({
              page_cat_1_type: 'cookie',
              page_cat_2_name: 'cookiemelding sluiten',
              page_cat_3_section: 'cookie',
              page_cat_4_productgroup: '',
              page_cat_5_product: '',
              page_cat_6_businessline: 'algemeen',
              cookie_type: 'statistiek|melding',
              event: 'cookie_accepted'
            });
          }

        } else {

          // IMPORTANT:
          // Since we are hooking all links, prevent to go further till when the
          // next AJAX calls in savePreference() is not completed
          e.preventDefault();
        }
      };

      var findMore = function () {
        $(this).off('click');
        $(this).removeClass('find-more-button');
        $.ajax({
          type: 'GET',
          dataType: 'text',
          global: false,
          url: '/lpa/getconfirm',
          success: function (data) {

            // Trigger tealium to record 'cookies settings screen viewed' event
            if (typeof win.utag === 'object') {
              win.utag.view({
                page_cat_1_type: 'cookie',
                page_cat_2_name: 'cookie instellingen',
                page_cat_3_section: 'cookie',
                page_cat_6_businessline: 'algemeen'
              });
            }

            // Cache #popup-wrapper
            var popupWrapper = $('#popup-wrapper');

            // Remove style attribute and append data
            popupWrapper.removeAttr('style').append(data);

            // Open jQuery UI Dialog
            popupWrapper.dialog({
              closeOnEscape: false,
              open: function () {
                $('.ui-dialog-titlebar-close').hide();
              },
              width: 'auto',
              maxWidth: 600,
              height: 'auto',
              modal: true,
              fluid: true,
              resizable: false
            });

            // Hide title
            $('.ui-dialog-titlebar').hide();

            // Remove SlidingPopup DOM
            SlidingPopup.remove();
          },
          error: function () {
            // Adding back the class and binding
            $(this).addClass('find-more-button').on('click');
          }
        });
      };

      // Handling in best way the aspect of sidemenu and EU compliance popup.
      // Memorize sliding popup
      var SlidingPopup = $('#sliding-popup');

      // Check if exist the version for top of page
      if (SlidingPopup.is('.sliding-popup-top')) {

        var StickyML = $('aside.stickleft'),
            StickySL = $('#cbp-spmenu-s1'),
            StickyIR = $('#scroll .inpage-navigation'),
            SIRTopPosOrig = (StickyIR.length > 0) && 
              Number(StickyIR.css('top').replace('px', ''));

        // Add .wrapper class to div wrapper
        $('#sliding-popup > div').addClass('wrapper');

        // Hook resize/scroll event of window to set properly css of elements
        $(win).on('resize scroll', function () {

          // Make some calculation for proper top position of side menu
          var spH = SlidingPopup.height(),
              scrollYval = win.navigator.userAgent.indexOf('MSIE') !== -1 ? 
                doc.documentElement.scrollTop : win.scrollY;
              // checkPos = scrollYval + spH;

          // Update the position of side menu
          StickyML.css({'top': scrollYval >= spH ? 0 : spH - scrollYval});
          StickySL.css({'top': scrollYval >= spH ? 0 : spH - scrollYval});

          // Check if StickyIR exist
          if (StickyIR.length > 0) {

            // Update the position of inpage navigation
            StickyIR.css({
              'top': scrollYval >= spH ? 
                SIRTopPosOrig : SIRTopPosOrig + (spH - scrollYval)
            });
          }

        }).resize();

        $('body').on('click', '#no-thankx, #cookie-opt-in-save', function () {

          // Remove #sliding-popup and css style from aside.stickleft in the end
          // of CSS transition of sliding popup eu_cookie_compliance
          SlidingPopup.css({'position': 'absolute'});
          StickyML.removeAttr('style');
          StickySL.removeAttr('style');
          StickyIR.removeAttr('style');

          // Remove events binding
          $('body').off('click', '#no-thankx, #cookie-opt-in-save');
          $(win).off('resize scroll');
        });
      }

      if ($('body.logged-in').length < 1 && $('body.imce').length < 1 && ext_cookie_val === 'nocookie') {

        if (ext_cookie_val === 'external') {

          that.changeStatus(2);

        } else if (ext_cookie_val === 'analytics') {

          that.changeStatus(1);

        } else if (loc_cookie_val === 'nocookie' && ext_cookie_val === 'nocookie') {

          // If local cookie 'cookie-agreed' is not set to zero yet, and
          // external cookie is not set, then trigger telium by default
          savePreference(null, 'visit');
        }

        // Check if sliding popup is loaded or not
        if (SlidingPopup.is('.sliding-popup-top')) {

          // Cookie pop up
          $('.find-more-button').off('click').on('click', findMore);

          // Save cookie's preferences on click
          $(doc).on('click', '#cookie-opt-in-save', savePreference);

          // Cookie no-thanks close button.
          // Any click on links to hook navigation on any other pages
          $('#no-thankx')
            .add('a')
            .not('.find-more-button')
            .not('.level-2-item a, .home-tap a')
            .add('.level-2-item .level3 a')
            .add('.level-2-item a:first-child')
            .add('.custom-menu-dropdown a')
            .on('click', noThanksPreference);
        }
      }

      // Remove sliding popu for backoffice
      var st = doc.domain.split('nl.aegon.'),
          isAdmin = doc.location.pathname.search('/admin');

      if (st[1] === 'com' || isAdmin !== -1) {
        SlidingPopup.remove();
      }
    },

    socialShowHide: function (value) {

      var newsSocial = $('#news-social');

      if (newsSocial.length > 0) {

        if (value === 'external') {
          newsSocial.show();
        } else {
          newsSocial.hide();
        }
      }
    }
  };

})(jQuery, Drupal, this, this.document);