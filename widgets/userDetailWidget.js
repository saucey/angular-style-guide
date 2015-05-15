/*jshint multistr: true */
/**
 * User details script
 * Dependencies: 
 * - vendors/jquery.cookie.js (Cookie jQuery handlers)
 * - modernizr.custom.js (Proper cross-browser style)
 */

(function(doc, win) {

  'use strict';

  /**
   * Register global variables for local scope
   */
  var $ = win.jQuery,
      Drupal = win.Drupal;

  /**
   * User widget's configuration
   */

  // services => mijnservices

  // This is the template of user_detail_widget wrapper taken from Aegon 
  // Technical Design Libraryand converted in JavaScript string.
  var template = '<div id="user_detail_widget" class="user_detail_widget">\n<div class="inplace">\n<button class="btn-login-loggedin">Ingelogd</button>\n<div class="dropdown">\n<div class="highlight mobile">\n<div class="text">\n<p class="welcome">\n<strong>Welcome <span class="user_detail_widget_name">username</span>.</strong> Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n<p class="action">\n<a href="#" class="button arrow responsive-approach">Uitloggen</a>\n<a href="#" class="button white responsive-approach myaegon">Mijn Overzicht</a>\n</p>\n</div>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n</div>\n<div class="highlight desktop">\n<div class="text">\n<p class="welcome">Welcome <span class="user_detail_widget_name">username</span>.</p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n</div>';

  // User widget JSON endpoint (hostname is declared in 
  // Drupal.settings.onlineAegonNl.hostname object's item).
  var realEndpoint = '/services/US_RestGatewayWeb/rest/requestResponse/BS_PARTIJ_03/retrieve';

  // ID string where the user widget will be appended
  var appendUserWidgetTo = '#shw-user-details';

  // MijnAegon cookie's name
  var mijnAegonCookieLoggedInName = 'mijn_last_login';

  /**
   * User widget's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.userDetailWidget = {

    attach: function (context, settings) {

      // setup
      this.setup(settings);
    },

    setup: function (settings) {

      // Set url API for local and real environments
      if (settings.onlineAegonNl.hostname === 'local') {
        this.apiUrl = '/file/example/user_detail_bs.json';
      } else {
        this.apiUrl = settings.onlineAegonNl.hostname + realEndpoint;
      }

      this.getData();
    },

    getData: function () {

      // Local variables
      var that = this,
          dataType = this.getDataType(),
          jsonpPayload,
          retreiveBSPartij,
          checkSanityOfJson;

      // Payload for JSONP
      jsonpPayload = {
        'retrieveRequest': {
          'AILHEADER': {
            'CLIENTID': 'MijnAegonUserWidget',
            'CORRELATIONID': '##UAT##'
          }
        }
      };

      checkSanityOfJson = function (jsonObject) {

        // Check for retrieveResponse in the passed object
        if ('retrieveResponse' in jsonObject) {
          return true;
        }

        // Return false by default
        return false;
      };

      // AJAX Success function
      retreiveBSPartij = function (jsonData) {

        // Local variables
        var isString, parsedJson, data, isLogged;

        // Check is jsonData is string that need to be parsed
        isString = typeof parsedJson === 'string';

        // Parse the JSON if needed
        parsedJson = isString ? $.parseJSON(jsonData) : jsonData;

        // Check if container and output of JSON is properly setup
        if (!checkSanityOfJson(parsedJson)) { return; }

        // Boolean to declare and check is user is logged in
        isLogged = (parsedJson.retrieveResponse.PROCES.STATUS === '00000');
        
        // Data ready to be passed to initialize() below
        data = {

          // Set flag for user logged in
          'loggedIn': isLogged && 1 || 0,

          // Get user's name from json object
          'userName': parsedJson.retrieveResponse.PARTIJ._AE_PERSOON._AE_SAMNAAM,

          // Get last login time from cookie or from now()
          'lastAccess': $.cookie('mijn_last_login') || $.now()
        };

        // Activate the widget
        that.initialize(data);
      };

      // Load AJAX request
      $.ajax({
        timeout: 10000,
        type: (dataType === 'jsonp' ? 'POST' : 'GET'),
        url: this.apiUrl,
        data: (dataType === 'jsonp' ? jsonpPayload : null),
        dataType: dataType,
        success: retreiveBSPartij,
        error: this.clearCookie()
      });
    },

    initialize: function (data) {

      // Local variables
      var that = this;

      // Callback to prevent appendTo before correct end of parseWidget()
      var callback = function (domWidget) {

        // Append the template and cache it
        that.widget = $(domWidget).appendTo(appendUserWidgetTo);        
      };

      // Check if is logged and go ahead
      if (data.loggedIn === 1) {

        // Parse the DOM before appendTo
        this.parseWidget(data, callback);

        // Load events
        this.events();
      }
    },

    parseWidget: function (data, callback) {

      // Convert template in jQuery DOM
      var $template = $(template);

      // Convert lastAcess in formatted date
      var dateFormatted = this.formatDatetime(data.lastAccess);

      // Parse data
      $template.find('span.user_detail_widget_name').text(data.userName);
      $template.find('span.user_detail_widget_last_access').text(dateFormatted);

      // Show/hide logged's items
      $('body').addClass('widget-logged-in');

      // Cross-browser imlementation to provide workaround for no CSS animation
      if ($('html').hasClass('no-cssanimations')) {

        // For desktop
        $template.find('.highlight.desktop').delay(3000)
          .animate({'margin-top': '-500px', 'bottom': '500px'}, 1000);

        // For mobile
        $template.find('.highlight.mobile').delay(3000).slideUp(500);
      }

      // Finally run the callback
      if (typeof callback === 'function') { callback($template); }
    },

    events: function (switchOff) {

      // Cache the button in local variable
      var btnLoggedIn = this.widget.find('button.btn-login-loggedin');

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

        // Add class off and deinitialize the mouseenter event
        $(this).addClass( "off" ).off('mouseenter');
      };

      // Action for Click on login button
      var loginButtonClick = function() {

        // Toggle only if is not already present and mobile
        if (Fn.isMobile() && !Fn.mobileTapPresent()) {
          $('body').toggleClass("mobile-tap");
        } else {
          $('body').removeClass("mobile-tap");
        }

        $(this).toggleClass("tap");
      };

      // Action on click of section.content to handle properly .tap on 
      // buttonlink and class mobile-tap on body in case is on mobile view
      var sectionContentClick = function() {
        if ($('body').hasClass('mobile-tap')) {
          $('body').removeClass('mobile-tap');
          btnLoggedIn.addClass('tap');
        }
      };

      // Switch all OFF
      if (switchOff) {

        $(window).off('resize', windowResize);
        this.widget.find('button.btn-login-loggedin')
          .off('mouseenter', loginButtonHover);
        this.widget.find('button.btn-login-loggedin')
          .off('click', loginButtonClick);

        // Stop here
        return;
      }

      // Bind resize window to add/remove body class .mobile-tap
      $(window).on('resize', windowResize).resize();

      // Hover on button login set class .off on itself and unbind
      btnLoggedIn.on('mouseenter', loginButtonHover);

      // Click on button login toggle class .tap on itself
      btnLoggedIn.on('click', loginButtonClick);

      // Bind click on section.content to remove the dark overlay related to
      // body.mobile-tap and run the logic 
      $('section.content').on('click', sectionContentClick);

      // In the end of animation of .highlight div, add class .processed to 
      // widget's container to hide itself
      this.widget.find('.highlight').one('webkitAnimationEnd oanimationend \
        msAnimationEnd animationend', function() {
          $(this).parents('.user_detail_widget').addClass('processed');
      });
    },

    formatDatetime: function (date) {

      // Local variables
      var dateFormatted, day, month, year, hours, minutes;
      
      // Istantiate Date object
      var dateIstance = new Date(date);

      // Extraxt single date elements
      day = dateIstance.getDate();
      month = dateIstance.getMonth();
      year = dateIstance.getFullYear();
      hours = dateIstance.getHours();
      minutes = dateIstance.getMinutes();

      // Generate right format in Dutch
      dateFormatted = day+'-'+month+'-'+year+' om '+hours+':'+minutes+' uur';

      return dateFormatted;
    },

    getDataType: function () {

      var apiUrlOrig = this.apiUrl.split('/').splice(2, 1).join('/'),

          // Check if is a relative address without protocol http/https
          localDomain = this.apiUrl.indexOf('://') === -1,

          // Check if current apiUrl is the same domain of current address
          sameDomain = doc.location.host.indexOf(apiUrlOrig) !== -1;

      return (sameDomain || localDomain) ? 'json' : 'jsonp';
    },

    clearCookie: function () {

      // Remove mijn_last_login's cookie
      $.removeCookie(mijnAegonCookieLoggedInName);
    },

    deinitialize: function () {

      // Remove classes to hide logged's items
      $('body').removeClass('widget-logged-in mobile-tap');

      // Remove mijn_last_login's cookie
      this.clearCookie();

      // Switch off all events
      this.events(true);
    }
  };

})(this.document, this);
