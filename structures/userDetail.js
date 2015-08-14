/*jshint multistr: true */
/**
 * User details script
 * Dependencies:
 * - vendors/jquery.cookie.js (Cookie jQuery handlers)
 * - modernizr.custom.js (Proper cross-browser style)
 *
 * Events trigger on window object: shwUserLogout, shwUserLoggedIn.
 * Usage:
 * $(window).on('shwUserLoggedIn', function() {
 *   // Do whatever you want here
 * });
 */

(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * Register or retrieve the public container for our shw widgets.
   * Purpose of this window global object is for register some public functions.
   * Need to be initialized on top of each widgets.
   */
  win.shwGlobal = win.shwGlobal || {};

  /**
   * User widget's configuration
   */

  // Path links handled by the script below for templating. (no initial slash)
  var logoutPathLink = 'pkmslogout?filename=WSBLogout.html';
  var mijnaegonPathLink = 'mijnaegon/';

  // This is the template of user_detail_widget wrapper taken from Aegon
  // Technical Design Library and converted in JavaScript string.
  // back to including the html via template file; separation of concerns is still a thing and debugging the layout is a lot easier this way
  // var template = '<div id="user_detail_widget" class="user_detail_widget">\n<div class="inplace">\n<button class="btn-login-loggedin">Ingelogd</button>\n<div class="dropdown">\n<div class="highlight mobile">\n<div class="text">\n<p class="welcome">\n<strong>Welcome <span class="user_detail_widget_name">username</span>.</strong> <span class="last_access_wrapper">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></span></p>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n<p class="action">\n<a href="#" class="user_detail_widget_logout_link button arrow">Uitloggen</a>\n<a href="#" class="user_detail_widget_mijnaegon_link button white myaegon">Mijn Overzicht</a>\n</p>\n</div>\n</div>\n</div>\n<div class="text">\n<p class="name"><span class="user_detail_widget_name">username</span></p>\n</div>\n<div class="highlight desktop">\n<div class="text">\n<p class="welcome">Welcome <span class="user_detail_widget_name">username</span>.</p>\n<p class="log">Uw vorige bezoek was op <span class="user_detail_widget_last_access">00-00-0000 om 00:00 uur</span></p>\n</div>\n</div>\n</div>';

  // User widget JSON endpoint (hostname is declared in
  // Drupal.settings.onlineAegonNl.hostname object's item).
  var realEndpoint = '/mijnservices/US_RestGatewayWeb/rest/requestResponse/BS_PARTIJ_03/retrieve';

  // ID string where the user widget will be appended
  // var appendUserWidgetTo = '#shw-user-details';

  // MijnAegon cookie's name
  var mijnAegonCookieLoggedInName = 'mijn_last_login';
  // hasBeenShown cookie name
  var hasBeenShownCookieName = "hasBeenShown";

  // Set the seconds to force not showing the green bar animated
  var secondsForProcessedStatus = 15;

  /**
   * User widget's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.userDetailWidget = {

    // Initial container for data object
    shwData: null,

    // Initial container for entire raw json object
    shwRawData: null,

    attach: function (context, settings) {
      // Run before real initialization
      this.setup(settings);

      // Register a public method for deinitialize
      win.shwGlobal.userLogout = (function(onlyLocal) {
        return this.deinitialize(onlyLocal);
      }).bind(this);

      // Register a public method for loggedin
      win.shwGlobal.userLoggedIn = (function() {
        return this.userLoggedIn();
      }).bind(this);

      // Register a public method for getRelNumByType
      win.shwGlobal.getRelNumByType = (function(type) {
        return this.getRelNumByType(type);
      }).bind(this);
    },

    setup: function (settings) {

      // Check if current website is not local or DEV environment
      var notLocalOrDev = (
        settings.onlineAegonNl.hostname !== 'local' &&
        win.location.hostname.search('www.dev.') !== -1
      );

      // Try to avoid multiple requests to the backend environment, if the
      // browser never ever had a logged session. Implement the block only for
      // Testing, UAT and Production environments.
      if (notLocalOrDev) {
        if (!this.lastLogin()) {
          return;
        }
      }

      // Set url API for local and real environments
      if (settings.onlineAegonNl.hostname === 'local') {
        this.apiUrl = '/file/example/user_detail_bs.json';
      } else {
        this.apiUrl = realEndpoint;
      }

      // Update path links
      logoutPathLink = settings.basePath + logoutPathLink;
      mijnaegonPathLink = settings.basePath + mijnaegonPathLink;

      // Start retrieving data
      this.getData();
    },

    getData: function () {

      // Local variables
      var that = this,
          jsonPayload,
          retreiveBSPartij,
          checkSanityOfJson;

      // Payload for JSONP
      jsonPayload = {
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
      retreiveBSPartij = function (json) {

        // Local variables
        var isString, parseJSON, data, isLogged;

        // Check is json is string that need to be parsed
        isString = typeof json === 'string';

        // Parse the JSON if needed
        parseJSON = isString ? $.parseJSON(json) : json;
        var userObj = parseJSON.retrieveResponse;
        // Check if container and output of JSON is properly setup
        if (!checkSanityOfJson(parseJSON)) {

          return;

        } else {

          // Register raw json data if OK
          that.shwRawData = userObj;
        }

        // Boolean to declare and check is user is logged in
        isLogged = (userObj.PROCES.STATUS === '00000');

        // Data ready to be passed to initialize() below
        data = {

          // Set flag for user logged in
          'loggedIn': isLogged,

          // Get user's name from json object
          'userName': userObj.PARTIJ._AE_PERSOON._AE_SAMNAAM || "n.a.", //this is actually not the username but the fullname, but since it has already available under this name, keep this designation
          'name': userObj.PARTIJ._AE_PERSOON._AE_SAMNAAM || "n.a.",
          'firstName': userObj.PARTIJ._AE_PERSOON.VOORL || "",
          'nameAddition': userObj.PARTIJ._AE_PERSOON.VOORV || "",
          'lastName': userObj.PARTIJ.ANAAM || "",

          // Get last login time from cookie or give false
          'lastAccess': that.lastLogin()
        };
        // append akos number to utag_data, if it exists, if not, at least create it (and hope tealium appends, instead of re-creating)
        win.utag_data = win.utag_data || {};
        win.utag_data.customer_akos = that.getRelNumByType('akos');

        // Activate the widget
        that.initialize(data);
      };

      // Load AJAX request
      $.ajax({
        timeout: 10000,
        type: 'GET',
        encoding:"UTF-8",
        url: this.apiUrl,
        data: jsonPayload,
        dataType: 'json',
        success: retreiveBSPartij,
        error: this.clearLastLogin
      });
    },

    initialize: function (data) {

      // Local variables
      var that = this;

      // Update the global shwData
      this.shwData = data;

      // Callback to prevent appendTo before correct end of parseWidget()
      var callback = function (domWidget) {

        // Append the template and cache it
        that.widget = domWidget;  //$(domWidget).appendTo(appendUserWidgetTo);
      };

      // Check if is logged and go ahead
      if (data.loggedIn) {

        // Parse the DOM before appendTo
        this.parseWidget(data, callback);

        // Load events
        this.events();
      }
      else {
        $(".login-link").addClass("visible");
      }
    },

    parseWidget: function (data, callback) {

      // Vars for local scope
      var $template, dateFormatted;

      // Convert template in jQuery DOM
      $template = $(".user_detail_widget"); //$(template);

      // Templating data

      // hide the ugly white box initially
      $(".inplace").hide();

      $template.find('span.user_detail_widget_name').text(data.userName);
      var that = this;
      $template.find('a.user_detail_widget_logout_link').click( function () {
        that.deinitialize();
      });
      $template.find('a.user_detail_widget_mijnaegon_link').attr(
        'href', mijnaegonPathLink);
      // Exception in case data.lastAccess is empty
      if (data.lastAccess === false) {

        // Remove span.last_access_wrapper and mobile p.log
        $template.find('span.last_access_wrapper').remove();
        $template.find('p.log').remove();

      } else {

        // Convert lastAcess in formatted date
        dateFormatted = this.formatDatetime(data.lastAccess);
        $template.find(".user_detail_widget_last_access").text(dateFormatted);
      }

      // Launch also the function to append the user name in menu
      this.shwUserDetailsInmenu(data.userName);

      // Trigger an event

      $(win).trigger('shwUserLoggedIn');

      // Show/hide logged's items
      $('body').addClass('shw-widgets-logged-in');

      // show the element nicely
      $(".inplace").show(1000);

      // Cross-browser implementation to provide workaround for no CSS animation
      if ( $('html').hasClass('no-cssanimations') && !this.hasBeenShown() ) {

        $template.find('.btn-login-loggedin').addClass('ieChangeColors');

        // For desktop
        $template.find('.highlight.desktop').delay()
      //  $template.find('.highlight.desktop').delay(3000)
          .animate({'margin-top': '-500px', 'bottom': '500px'},
            250,
            'linear',
            function () {
              $template.find('.btn-login-loggedin')
                .removeClass('ieChangeColors');
            }
          );

        // For mobile
        $template.find('.highlight.mobile').delay(3000).slideUp();
     //   $template.find('.highlight.mobile').delay(3000).slideUp(500);
      }

      if ( this.hasBeenShown() ) {
        $template.addClass('processed');
      }

      // set the cookie to make sure that the next time this template is shown,
      // the welcome animation is off
      this.hasBeenShown(true);

      // Finally run the callback to append all our shw-DOM in the proper
      // shw place
      if (typeof callback === 'function') { callback($template); }
    },

    expiredTimeFromLogin: function () {

      var timeCookie = this.lastLogin();
      // Stop execution and return false if no mijnaegon cookie registered
      if (!timeCookie) { return false; }

      // If is not the first time after login, don't show the animation by
      // adding the .processed class.
      var futureTMS = this.formatDatetime(timeCookie, true) +
                      (secondsForProcessedStatus * 1000);
      return ($.now() > futureTMS) && true;
    },

    shwUserDetailsInmenu: function (name) {

      // Create DOM for the link
      var linkDesktop = $('<a />', {'class': 'icon-user-link'});
      var linkMobile = $('<a />', {'class': 'icon-user-link'});

      // Set the text with user's name passed
      linkDesktop.text(name).attr('href', mijnaegonPathLink);
      linkMobile.text(name).attr('href', mijnaegonPathLink);

      // Append the DOM for the link just created and remove old login link
      $('li[data-id="shw-user-details-inmenu"]').append(linkDesktop)
        .find('.login-link-inv').remove();
      $('li[data-id="shw-mob-user-details-inmenu"]').append(linkMobile)
        .find('.login-link-inv').remove();
    },

    events: function (switchOff) {

      // Stop execution if this.widget is empty
      if(typeof this.widget === 'undefined') { return; }

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

    formatDatetime: function (date, timestamp) {

      // Local variables
      var dateFormatted, day, month, year, hours, minutes;
      //AESSO writes the cookie value surrounded by double quotes; the following RegEx will take care of that, but it also won't break if that error is corrected
      if (date) {
        var dp = date.match(/(\d+)/g);
        //the expected format of the date string is YYYY-MM-DD HH:MM:SS, indices in dp start with 0
        //we convert the date to English format, aka MM/DD/YYYY HH:MM:SS
        //this is drop-dead-ugly, but it does the job
        date = dp[1] + "/" + dp[2] + "/" + dp[0] + " " + dp[3] + ":" + dp[4] + ":" + dp[5] + " UTC";
      }
      // Convert string into Date object
      date = new Date(date);
      // Return the timestamp if true is passed as param
      if (timestamp) { return date.getTime(); }

      // Extraxt single date elements
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
      hours = date.getHours();
      minutes = date.getMinutes();

      // Convert time elements with proper zero prefix
      month = String(month).length < 2 && '0'+month || month;
      hours = String(hours).length < 2 && '0'+hours || hours;
      minutes = String(minutes).length < 2 && '0'+minutes || minutes;

      // Generate right format in Dutch
      dateFormatted = day+'-'+month+'-'+year+' om '+hours+':'+minutes+' uur';

      return dateFormatted;
    },

    lastLogin: function () {

      // Return cookie value or FALSE
      return $.cookie(mijnAegonCookieLoggedInName) || false;
    },

    // manage the cookie which handles if the green bar has been shown or not
    hasBeenShown: function (value) {
      // hasBeenShown() returns the current value
      // hasBeenShown(true) sets the value to 1
      // hasBeenShown(false) removes the cookie
      if (arguments.length) {
        if (value) {
          $.cookie(hasBeenShownCookieName, "1", {path: "/"});
        }
        else {
          $.removeCookie(hasBeenShownCookieName, {path: "/"});
        }
      }
      return $.cookie(hasBeenShownCookieName) || false; //make sure that a false value is returned for every false-ish (undefined, "", 0) value
    },

    // clearLastLogin: function (response) {
    clearLastLogin: function () {

      // Remove mijn_last_login's cookie as first
      $.removeCookie(mijnAegonCookieLoggedInName);

      // Then throw an error in console
      //if (response) { throw response.responseText; }
    },

    /**
     * Method to logout an user
     * @param  {boolean} onlyLocal  Pass true if you want destroy only local session
     * @return {boolean} wrapper for this.userLoggedIn()
     */
    deinitialize: function (onlyLocal) {
      // Remove classes to hide logged's items
      $('body').removeClass('shw-widgets-logged-in mobile-tap');
      $('body').removeClass('sliding-popup-processed');
      $('body').removeClass('section-particulier');

      // Remove mijn_last_login's cookie
      this.clearLastLogin();
      
      // remove the cookie that determines if the green bar is shown
      this.hasBeenShown(false);

      // Switch off all events
      this.events(true);

      // Set loggedIn to false
      this.shwData.loggedIn = false;

      // Trigger an event
      $(win).trigger('shwUserLogout');

      // Logout also remotely
      if (!onlyLocal) { location.href = logoutPathLink; }

      // Return current status
      return this.userLoggedIn();
    },

    /**
     * Check if the user is loggen in or not
     * @return {boolean} true or false if user is logged or not
     */
    userLoggedIn: function () {

      // Return loggedIn value or false if not existent
      return this.shwData.loggedIn || false;
    },

    /**
     * This method permit to retrieve all elements associated with
     * _AE_RELNUM_TYPE present in json data, retrieved from remote API.
     *
     * @param  {string} type   Pass a string af filter parameter
     * @return {string|array}  Return a numeric string or array collection
     */
    getRelNumByType: function (type) {

      // Force to uppercase
      type = type.toUpperCase();

      // Return null if no _AE_PARTIJ_IDENTIFICATIE
      if (!this.shwRawData || !this.shwRawData.PARTIJ ||
        !this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE) { return null; }

      // Create a local variable with identificatie array
      var arrIdentifications = this.shwRawData.PARTIJ._AE_PARTIJ_IDENTIFICATIE;

      // If no type param, return the whole array
      if (!type) { return arrIdentifications; }

      // Filter the array based on type param passed
      var arrFiltered = arrIdentifications.filter(function(obj){
        return obj._AE_RELNUM_TYPE === type ? true : false;
      });

      // Create empty values array
      var values = [];

      // Populate values array with all values present in the filtered array
      arrFiltered.forEach(function(value){
        values.push(value.RELNUM);
      });

      // Return single value or multiple values as array
      return values.length <= 1 ? values[0] : values;
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
