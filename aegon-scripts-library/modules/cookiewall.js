/*
  Cookiewall usage.

  In the <head> of the pages right below where jquery is loaded add the cookiewall.js script import tag.

  After that add the following below the cookiewall.js import.
    * When a page needs to be excluded from the cookiewall, don't run the initialize function.

  <script>
    cookieWall.initialize();
  </script>

  The initialize will check if the cookie exists and if not will render the cookiewall. A choice then needs
  to be made for basis ('S') or optimaal ('E').

  Depending on what choice has been made scripts can be loaded or not. The cookiewall can
  handle this. Instead of injecting the js file with a normal <script> tag. Use the following:

  <script>cookieWall.addScript('scripts/aegon-somescript.js', 'E', { async: false, attrs: { some: 'thing'} })</script>

  The addScript function needs the url and cookie value (E or S) and loads js files async or not. Attrs will be added
  to the element being created.

*/


//create global namespace.
var cookieWall = {};

(function ($) {

  'use strict';
  // When retrieving the cookie and it exist, store the value.
  var cookieValue;
  var whitelisted = true;

  var path;
  var domain;

  var COOKIE_NAME = 'AEGON.Cookie.OptIn',
    COOKIE_VALUE_STANDARD = 'S',
    COOKIE_VALUE_EXTENDED = 'E';


  /* Cookie helper functions */
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();

    var _path = path || '/';
    var cookie = name + "=" + value + ";" + expires + ";path=" + _path;

    if (domain && domain !== 'localhost') {
        cookie += ';domain=' + domain;
    }
    cookie += '; ';

    document.cookie = cookie;
  }


  function getCookie(name) {
    name = name + "=";
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i];
      // Remove space between cookies.
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      // Cookie found? Return the cookie value.
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    // No cookie found.
    return null;
  }


  function showCookieWall(pageToShow) {
    if (pageToShow === void 0) {
      pageToShow = (cookieValue && cookieValue.toUpperCase() === COOKIE_VALUE_EXTENDED) ? 'advanced' : null
    }

    var cookieWallElm = $('.blocking-popup.cookie-wall');
    if (cookieWallElm[0]) {
      // The cookiewall is already visible.
      return;
    }

    // Create and add container elements for the cookiewall content.
    var rootElm = $('<div class="cookie-wall blocking-popup"></div>');
    var containerElm = $('<div class="popup-container"></div>').appendTo(rootElm);
    $("body").prepend(rootElm);

    // The cookiewall is going to be presented. Make sure the page cannot scroll.
    var styleElm = document.createElement("style");
    styleElm.innerHTML = "body, html { overflow: hidden; height: 100%; }";
    $("head").append(styleElm);

    // Fetch cookiewall content.
    $.ajax({
      type: 'GET',
      dataType: 'text',
      global: false,
      url: '/lpa/cookie/cookie/cookietext.json',
      success: function (response) {
        response = JSON.parse(response);
        if (response.cookietext) {
          containerElm.html(response.cookietext);
          showPopupContent(pageToShow);
        }
      }
    })
  }
  cookieWall.showCookieWall = showCookieWall;


  function showPopupContent(pageToShow) {
    // Name should be optimal or basic
    if (pageToShow !== 'advanced') {
      pageToShow = 'basic';
    }

    var elmToShow = $(".blocking-popup.cookie-wall .popup-content.cookiewall-" + pageToShow);
    var elmToHide = $(".blocking-popup.cookie-wall .popup-content.popup-show");

    if (elmToShow[0] === elmToHide[0]) {
      // The element to show is already visible. Do nothing.
      return;
    }

    // Hide the visible popup content
    if (elmToHide[0]) {
      elmToHide.removeClass("popup-show");
    }

    if (elmToShow[0]) {
      elmToShow.addClass("popup-show");
    }

    if (cookieValue && cookieValue.toUpperCase() === COOKIE_VALUE_STANDARD) {
      $(".blocking-popup.cookie-wall #cookie-choice-basic input[type='radio']").click();
    }
  }
  cookieWall.showPopupContent = showPopupContent;


  var cookieOptionSaved = false;
  function saveCookieChoice() {
    if (cookieOptionSaved) {
      return;
    }

  // By default always set optimal as option.
    var selectedOption = COOKIE_VALUE_EXTENDED;
    var selectedRadioButton = $(".blocking-popup.cookie-wall .popup-show input[type='radio']:checked");
    if (selectedRadioButton[0] && selectedRadioButton[0].value === 'basic-choice') {
      // Basic cookies are selected as option.
      selectedOption = COOKIE_VALUE_STANDARD;
    }
    setCookie(COOKIE_NAME, selectedOption, 100 * 365);
    cookieOptionSaved = true;

    $.ajax({
      type: 'POST',
      dataType: 'text',
      global: false,
      url: '/lpa/CookieVoorkeur',
      data: 'ans=' + selectedOption,
      success: function () {
        location.reload();
      }
    });

    // This time-out is a fallback to force the reload if the ajax call fails.
    setTimeout(function () {
      location.reload();
    }, 2000);
  }
  cookieWall.saveCookieChoice = saveCookieChoice;


  /*
   Run the initialize function prior to scripts that need to be included conditionally. Make sure Jquery is available.
   <script>cookieWall.initialize('/', 'aegon.nl')<script>
   */
  function initialize(_path, _domain, elmToShow) {
    path = _path;
    domain = _domain;

    whitelisted = false;
    cookieValue = getCookie(COOKIE_NAME);

    var styleElm = document.createElement("style");

    if (cookieValue === null) {
      styleElm.innerHTML = "[data-cookie-basic], [data-cookie-optimal] { display: none !important; } ";
      showCookieWall();
    } else {
      cookieWall.cookieValue = cookieValue;
      if (cookieValue.toUpperCase() === COOKIE_VALUE_STANDARD) {
        styleElm.innerHTML = "[data-cookie-optimal] { display: none !important; } ";
      }
    }
    $("head").append(styleElm);

    if (elmToShow && cookieValue) {
      showCookieWall(name);
    }
  }
  cookieWall.initialize = initialize;


  function addScript(url, cookieOption, options) {
    /* Add the following line in the head to load a script in the page.
     <script>cookieWall.addScript('scripts/aegon-angular2.js', 'E', { async: false, attrs: {} })</script>
     Scripts with async false will be loaded immediately before dom rendering.
     Attrs will be added on the generated element if needed.
     */
    var append = false;
    if (cookieOption === void 0) {
      cookieOption = COOKIE_VALUE_STANDARD;
    }
    if (options === void 0) {
      options = {};
    }
    if (options.async === void 0) {
      options.async = true;
    }
    if (options.attrs === void 0) {
      options.attrs = {};
    }
    if (!cookieValue) {
      cookieValue = getCookie(COOKIE_NAME);
    }
    if (cookieValue) {
      // The cookie choice was already made. Compare the cookie value with the desired cookie option.
      if (cookieValue.toUpperCase() === COOKIE_VALUE_EXTENDED) {
        // Optimal value; every script can be appended.
        append = true;
      } else if (cookieOption.toUpperCase() === COOKIE_VALUE_STANDARD) {
        // Desired option is standard, and so is the cookie value.
        append = true;
      }
    } else if (whitelisted && cookieOption.toUpperCase() === COOKIE_VALUE_STANDARD) {
      // No cookie was set, but because the page is whitelisted (the initialize function hasn't been called yet)
      // and the desired cookie option is standard, we can append the script.
      append = true;
    }
    if (append) {
      var elm = document.createElement("script");
      elm.src = url;
      var attrKeys = Object.keys(options.attrs);
      for (var i = 0; i < attrKeys.length; i++) {
        elm[attrKeys[i]] = options.attrs[attrKeys[i]];
      }
      if (options.async) {
        $('head').append(elm);
      } else {
        document.write(elm.outerHTML);
      }
    }
  }
  // Add to the namespace.
  cookieWall.addScript = addScript;

})(jQuery);