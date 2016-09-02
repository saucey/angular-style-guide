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

    // Create a deferred object, which will be resolved when the data is retrieved
    deferredData: $.Deferred(),

    // Context passed by Drupal.
    context: null,

    attach: function (context, settings) {
      if(! this.attached) {
        this.context = context;
        // Run before real initialization
        this.setup(settings);
      }

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

      // Register a public method for getAkos
      win.shwGlobal.getAkos = (function() {
        return this.getAkos();
      }).bind(this);

      // Register a public method for deferred userData (promise)
      win.shwGlobal.userData = (function() {
        return this.deferredData.promise();
      }).bind(this);

      this.attached = true;
    },
    attached: false,

    setup: function (settings) {
      var context = this.context;
      // Check if current website is backend
      if (window.location.hostname.search('.aegon.com') !== -1) {
        return;
      }

      // Check if current website is local or DEV environment
      var localOrDev = (
        settings.onlineAegonNl.hostname === 'local' ||
        win.location.hostname.search('www.dev.') !== -1 ||
        win.location.hostname.search('.local') !== -1
      );

      // If LOCAL or DEV env use sample json file for user details
      // otherwise, use real endpoint
      if (localOrDev) {
        this.apiUrl = '/file/example/user_detail_bs.json';
      }
      else {
        if (!this.lastLogin()) {
          // Make sure the button is always shown, later on we will check against login status
          $('.login-link-wrapper', context).css('display', 'block');
          
          return;
        }
        this.apiUrl = realEndpoint;
      }

      // Update path links
      logoutPathLink = (logoutPathLink.indexOf(settings.basePath) !== 0) ? settings.basePath + logoutPathLink : logoutPathLink;
      mijnaegonPathLink = (mijnaegonPathLink.indexOf(settings.basePath) !== 0) ? settings.basePath + mijnaegonPathLink : mijnaegonPathLink;

      // Start retrieving data
      this.getData();
    },

    getData: function () {
      var that = this,
      now = new Date(),
      // Payload for JSONP
      jsonPayload = {
        'retrieveRequest': {
          'AILHEADER': {
            'CLIENTID': 'MijnAegonUserWidget',
            'CORRELATIONID': '## MijnAegon_UserWidget ## ' + now.getTime() + ' ##'
          }
        }
      };

      function parseResponse(json) {
        // Check is json is string that need to be parsed
        var isString = typeof json === 'string',
          // Parse the JSON if needed
          parsedJSON = isString ? $.parseJSON(json) : json;

        // Check for retrieveResponse in the passed object
        if (!('retrieveResponse' in parsedJSON)) {
          return;
        }

        // Register raw json data if OK
        return that.shwRawData = parsedJSON.retrieveResponse;
      }

      function formatToDutchDate(date) {
        date = new Date(date);

        function pad(n) {
          return n < 10 ? '0' + n : n;
        }

        return pad(date.getUTCDate()) + '-' +
            pad(date.getUTCMonth() + 1) + '-' +
            date.getUTCFullYear();
      }

      function populateUserData(userData, isLoggedIn) {
        var person = userData._AE_PERSOON,
          dutchDate = formatToDutchDate(person.GEBDAT),
          address = userData._AE_ADRES;

        // Some the address variable is an array, when there are multiple address lines available, if this is the case we want the first item
        if (address.constructor === Array) {
          address = address[0];
        }

        var completeAddress = address.STRAAT + " " + address.HUISNR + (address.TOEVOEG ? (" " + address.TOEVOEG) : "");

        // Data ready to be passed to initialize() below
        return {
          // Set flag for user logged in
          'loggedIn': isLoggedIn,

          // Get user's name from json object
          'userName': person._AE_SAMNAAM || "n.a.", //this is actually not the username but the fullname, but since it has already available under this name, keep this designation
          'name': person._AE_SAMNAAM || "n.a.",
          'firstName': userData._AE_PERSOON.VOORL || "",
          'nameAddition': userData._AE_PERSOON.VOORV || "",
          'lastName': userData.ANAAM || "",
          'gender': person.GESLACH || '',
          'initials': person.VOORL || '',
          'connection': person.VOORV || '',
          'tel': userData.TELNUM || '',
          'postal': address.PCODE || '',
          'street': address.STRAAT || '',
          'houseNumber': address.HUISNR || '',
          'addition': address.TOEVOEG || '',
          'city': address.PLAATS || '',
          'email': userData.EMAIL || '',
          'birthDate': dutchDate || '',
          'address': completeAddress || '',

          // Get user's mobile from json object
          'userMobile': userData.MOBIEL || "", //we need this later to verify if a mobile number is available

          // Get last login time from cookie or give false
          'lastAccess': that.lastLogin()
        };
      }

      // AJAX Success function
      function retrieveBSPartij(json) {
        var isLoggedIn,
            rawData = parseResponse(json);

        if (typeof rawData === 'undefined') {
          return;
        }

        // Boolean to declare and check if user is logged in
        isLoggedIn = (rawData.PROCES.STATUS === '00000');
        that.shwData = populateUserData(rawData.PARTIJ, isLoggedIn);

        // Resolve the promise so that external sources can also use the retrieved data
        that.deferredData.resolve(that.shwData);

        // append akos number to utag_data, if it exists, if not, at least create it (and hope tealium appends, instead of re-creating)
        win.utag_data = win.utag_data || {};
        win.utag_data.customer_akos = that.getRelNumByType('akos');

        // Activate the widget
        that.initialize(that.shwData);
      }

      // Load AJAX request
      $.ajax({
        cache: false,
        timeout: 10000,
        type: 'GET',
        encoding:"UTF-8",
        url: this.apiUrl,
        data: jsonPayload,
        dataType: 'json',
        success: retrieveBSPartij,
        error: this.clearLastLogin
      });
    },

    initialize: function (data) {

      // Local variables
      var that = this,
          context = that.context;

      // Callback to prevent appendTo before correct end of parseWidget()
      var callback = function (domWidget) {

        // Append the template and cache it
        that.widget = domWidget;  //$(domWidget).appendTo(appendUserWidgetTo);
      };

      // Check if is logged and go ahead
      if (data.loggedIn) {

        // User is logged in, so we can get rid of the button
        $('.login-link-wrapper', context).css('display', 'none');

        // User has not given a mobile number thus we need the banner asking for it
        if (!data.userMobile) {
          $('.messages.messages--attention.request_mobile_number', context).css('display', 'block');
        }

        // Parse the DOM before appendTo
        this.parseWidget(data, callback);

        // Load events
        this.events();
      }
      else {
        // If not loggedIn, show login button
        $(".login-link-wrapper", context).css('display', 'block');
      }
    },

    parseWidget: function (data, callback) {

      // Vars for local scope
      var $template, dateFormatted, 
          context = this.context;

      // Convert template in jQuery DOM
      $template = $(".user_detail_widget", context); //$(template);

      // Templating data

      // hide the ugly white box initially
      //$(".inplace").hide();

      $template.find('span.user_detail_widget_name').text(data.userName);
      var that = this;
      $template.find('a.user_detail_widget_logout_link').click( function () {
        that.deinitialize();
      });
      $template.find('a.user_detail_widget_mijnaegon_link').attr(
        'href', mijnaegonPathLink);
      $template.find('#UDW_dd_show').on('change', function() {
        if ($(this).prop('checked') === true) {
          $template.addClass('open');
        } else {
          $template.removeClass('open');
        }
      });
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
      $('body', context).addClass('shw-widgets-logged-in');

      // show the element nicely
      //$(".inplace").show(1000);

      // Shows and hides the dropdown menu and grey overlay on mobile (< 641px) when logging in (only once)
      if(!this.hasBeenShown() && $(window).width() < 641) {
        $('section.content', context).prepend('<div class="greyoverlay"></div>').promise().done(function() {
          // Hide .text when collapsing menu for the first time
          $('.dropdown > .text').css('display', 'none');
          // Show dropdown and greyoverlay
          $('.dropdown, .greyoverlay').css('display', 'block');
        });
        $('.dropdown', context).delay(3000).slideUp(500).promise().done(function(){
          // Remove display block from .dropdown
          $('.dropdown').css('display', '');
          // Fadeout greyoverlay
          $('.greyoverlay').fadeOut(100);
          // Hide hightlight mobile
          $('.highlight.mobile').css('display', 'none');
          // Set .text back to display block
          $('.dropdown > .text').css('display', 'block');
        });
      }

      // Cross-browser implementation to provide workaround for no CSS animation
      if ( $('html').hasClass('no-cssanimations') && !this.hasBeenShown() ) {

        $template.find('.btn-login-loggedin').addClass('ieChangeColors');

        // For desktop
        $template.find('.highlight.desktop').delay(3000)
          .animate({'margin-top': '-500px', 'bottom': '500px'},
            250,
            'linear',
            function () {
              $template.find('.btn-login-loggedin')
                .removeClass('ieChangeColors');
            }
          );

        // For mobile
        // $template.find('.highlight.mobile').delay(3000).slideUp(500);
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
      $('li[data-id="shw-user-details-inmenu"]').empty().append(linkDesktop);
      //.find('.login-link-inv').remove();
      $('li[data-id="shw-mob-user-details-inmenu"]').empty().append(linkMobile);
      //.find('.login-link-inv').remove();
    },

    events: function (switchOff) {

      // Stop execution if this.widget is empty
      if(typeof this.widget === 'undefined') { return; }

      // Cache the button in local variable
      var btnLoggedIn = this.widget.find('button.btn-login-loggedin'),
          context = this.context;

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

          var dummy = true; // jshint ignore:line
          //$('body').toggleClass("mobile-tap");

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
      $(window, context).on('resize', windowResize).resize();

      // Hover on button login set class .off on itself and unbind
      btnLoggedIn.on('mouseenter', loginButtonHover);

      // Click on button login toggle class .tap on itself
      btnLoggedIn.on('click', loginButtonClick);

      // Bind click on section.content to remove the dark overlay related to
      // body.mobile-tap and run the logic
      $('section.content', context).on('click', sectionContentClick);

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
      var context = this.context;
      // Remove mijn_last_login's cookie as first
      $.removeCookie(mijnAegonCookieLoggedInName, { path: '/' });

      // On logout or if user is not logged in show login button
      $('.login-link-wrapper', context).css('display', 'block');

      // Then throw an error in console
      //if (response) { throw response.responseText; }
    },

    /**
     * Method to logout an user
     * @param  {boolean} onlyLocal  Pass true if you want destroy only local session
     * @return {boolean} wrapper for this.userLoggedIn()
     */
    deinitialize: function (onlyLocal) {
      var context = this.context;
      // Remove classes to hide logged's items
      $('body', context).removeClass('shw-widgets-logged-in mobile-tap sliding-popup-processed section-particulier');

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
        return obj._AE_RELNUM_TYPE === type;
      });

      // Create empty values array
      var values = [];

      // Populate values array with all values present in the filtered array
      arrFiltered.forEach(function(value){
        values.push(value.RELNUM);
      });

      // Return single value or multiple values as array
      return values;  //values.length <= 1 ? values[0] : values;
    },

    getAkos: function () {  //if just the highest number is required, use .getAkos()[0]
      var akos = this.getRelNumByType('akos');

      if (akos === null) {
        return null;
      }
      return akos.sort(function (x, y){
        return parseInt(y) - parseInt(x);
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
