/*jshint multistr: true */
/**
 * User details script
 */

(function(doc, win) {

  'use strict';

  // Register vars for local scope
  var $ = win.jQuery,
      Drupal = win.Drupal;

  // Add new item to public Drupal object
  Drupal.behaviors.userDetailWidget = {

    attach: function (context, settings) {

      // setup
      this.setup(settings);
    },

    setup: function (settings) {

      // Set url API
      // this.apiUrl = settings.basePath + settings.pathToTheme +
      //   '/includes/fake-widgets.php?id=';
      // this.apiUrl = '/data/widgets/user_detail.json';
      this.apiUrl = 'http://localhost:3000/data/widgets/user_detail.json';
      // this.apiUrl = 'http://echo.jsontest.com/key/value/one/two';

      this.getData();
    },

    getDataType: function () {

      var apiUrlOrig = this.apiUrl.split('/').splice(0, 3).join('/'),
          sameDomain = doc.location.origin.indexOf(apiUrlOrig) !== -1;

      return sameDomain ? 'json' : 'jsonp';
    },

    getData: function () {

      var that = this;

      $.ajax({
        url: this.apiUrl,
        dataType: this.getDataType(),
        success: function(data){

          // Activate the widget
          that.initialize(data);
        }
      });
    },

    initialize: function (data) {

      // Check if is logged and go ahead
      if (data.logged_in) {

        // Cache the div
        this.widget = $('#user_detail_widget');

        this.parseWidget(data);
        this.events();
      }
    },

    parseWidget: function (data) {

      // Parse data
      $('span.user_detail_widget_name').text(data.username);
      $('span.user_detail_widget_last_access').text(data.last_access);

      // Show/hide logged's items
      $('body').addClass('widget-logged-in');
    },

    events: function (switchOff) {

      var isTapped,
          isMobile,
          mobileTapPresent,
          btnLoggedIn = this.widget.find('button.btn-login-loggedin');

      // Bind window resize
      var windowResize = function () {

        isTapped = btnLoggedIn.hasClass('tap');
        isMobile = doc.documentElement.offsetWidth < 640;
        mobileTapPresent = $('body').hasClass("mobile-tap");

        if (isMobile && !mobileTapPresent && !isTapped) {

          $('body').toggleClass("mobile-tap");
        
        } else if (!isMobile) {

          $('body').removeClass("mobile-tap");
        }
      };

      // Action for Hover on login button
      var loginButtonHover = function() {
        $(this).addClass( "off" ).off('hover');
      };

      // Action for Click on login button
      var loginButtonClick = function() {
        $(this).toggleClass("tap");

        // Toggle only if is not already present and mobile
        if (isMobile && !mobileTapPresent) {
          $('body').toggleClass("mobile-tap");
        } else if (!isMobile) {
          $('body').removeClass("mobile-tap");
        }
      };

      // Switch all OFF
      if (switchOff) {

        $(window).off('resize', windowResize);
        this.widget.find('button.btn-login-loggedin').off('hover', loginButtonHover);
        this.widget.find('button.btn-login-loggedin').off('click', loginButtonClick);

        // Stop here
        return;
      }

      // Bind resize window to add/remove body class .mobile-tap
      $(window).on('resize', windowResize).resize();

      // Hover on button login set class .off on itself and unbind
      btnLoggedIn.on('hover', loginButtonHover);

      // Click on button login toggle class .tap on itself
      btnLoggedIn.on('click', loginButtonClick);

      // In the end of animation of .highlight div, add class .processed to 
      // widget's container to hide itself
      this.widget.find('.highlight').one('webkitAnimationEnd oanimationend \
        msAnimationEnd animationend', function() {
          $(this).parents('.user_detail_widget').addClass('processed');
      });
    },

    deinitialize: function () {

      // Switch off all events
      this.events(true);
    }
  };

})(this.document, this);
