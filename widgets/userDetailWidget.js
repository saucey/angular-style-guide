/*jshint multistr: true */
/**
 * User details script
 */

(function(doc, win) {

  'use strict';

  // Register vars for local scope
  var $ = win.jQuery,
      Drupal = win.Drupal;

  var template = '<div id="user_detail_widget" class="user_detail_widget">\n<div class="inplace">\n<button class="btn-login-loggedin">Ingelogd</button>\n<div class="dropdown">\n<div class="highlight mobile">\n<div class="text">\n<p class="welcome">\n<strong>Welcome <span class="user_detail_widget_name">username</span>.</strong> Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n<p class="action">\n<a href="#" class="button arrow responsive-approach">Uitloggen</a>\n<a href="#" class="button white responsive-approach myaegon">Mijn Overzicht</a>\n</p>\n</div>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n</div>\n<div class="highlight desktop">\n<div class="text">\n<p class="welcome">Welcome <span class="user_detail_widget_name">username</span>.</p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n</div>';

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
      this.apiUrl = '/data/widgets/user_detail.json';

      this.getData();
    },

    getDataType: function () {

      var apiUrlOrig = this.apiUrl.split('/').splice(2, 1).join('/'),
          // Check if is a relative address without protocol http/https
          localDomain = this.apiUrl.indexOf('://') === -1,
          // Check if current apiUrl is the same domain of current address
          sameDomain = doc.location.host.indexOf(apiUrlOrig) !== -1;

      return (sameDomain || localDomain) ? 'json' : 'jsonp';
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

      // Append the template
      $(template).appendTo('#shw-user-details');

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

      var that = this,
          btnLoggedIn = this.widget.find('button.btn-login-loggedin');

      // Local functions
      var Fn = {

        isMobile: function () {
          return doc.documentElement.offsetWidth <= 640;
        },

        mobileTapPresent: function () {
          return $('body').hasClass("mobile-tap");
        },

        isTapped: function () {
          return btnLoggedIn.hasClass('tap');
        }
      };

      // Bind window resize
      var windowResize = function () {

        if (Fn.isMobile() && !Fn.mobileTapPresent() && !Fn.isTapped()) {

          $('body').toggleClass("mobile-tap");
        
        } else if (!Fn.isMobile()) {

          $('body').removeClass("mobile-tap");
        }
      };

      // Action for Hover on login button
      var loginButtonHover = function() {
        $(this).addClass( "off" ).off('hover');
      };

      // Action for Click on login button
      var loginButtonClick = function() {

        // console.log(Fn.isMobile(), Fn.mobileTapPresent());

        // Toggle only if is not already present and mobile
        if (Fn.isMobile() && !Fn.mobileTapPresent()) {
          $('body').toggleClass("mobile-tap");
        } else {
          $('body').removeClass("mobile-tap");
        }

        $(this).toggleClass("tap");
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
