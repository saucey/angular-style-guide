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


  function showCookieWall(name) {
    if (!name) {
      name = (cookieValue && cookieValue.toUpperCase() === 'E') ? 'advanced' : null
    }

    var cookieWallElm = $('.blocking-popup.cookie-wall');
    if (!cookieWallElm[0]) {
      $.ajax({
        type: 'GET',
        dataType: 'text',
        global: false,
        url: '/lpa/cookie/cookie/cookietext.json',
        success: function (response) {
          response = JSON.parse(response);
          if (response.cookietext) {
            $(document).ready(function () {
              var styleElm = document.createElement("style");
              styleElm.innerHTML = "body, html { overflow: hidden; position: fixed; min-width: 100%; }";
              $("head").append(styleElm);
              $("body").prepend(response.cookietext);
              showPopupContent(name);
            });
          }
        }
      })
    }
  }
  cookieWall.showCookieWall = showCookieWall;


  function showPopupContent(name) {
    // Name should be optimal or basic
    if (name !== 'advanced') {
      name = 'basic';
    }
    // Hide the visible popup content
    var visibleContent = $(".blocking-popup.cookie-wall .popup-content.show");
    var hiddenContent = $(".blocking-popup.cookie-wall .popup-content." + name);
    if (visibleContent[0] && hiddenContent[0] && visibleContent[0] !== hiddenContent[0]) {
      visibleContent.removeClass("show");
      hiddenContent.addClass("show");
    }
  }
  cookieWall.showPopupContent = showPopupContent;


  function saveCookieChoice() {
    // By default always set optimal as option.
    var selectedOption = 'E';
    var selectedRadioButton = $(".blocking-popup.cookie-wall .show input[type='radio']:checked");
    if (selectedRadioButton[0] && selectedRadioButton[0].value === 'basic-choice') {
      // Basic cookies are selected as option.
      selectedOption = 'S';
    }
    setCookie('AEGON.Cookie.OptIn', selectedOption, 100 * 365);
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
  }
  cookieWall.saveCookieChoice = saveCookieChoice;


  /*
   Run the initialize in the head prior to scripts that need to be included. Make sure Jquery is available.
   <script>cookieWall.initialize()<script>
   */
  function initialize(_path, _domain) {
    path = _path;
    domain = _domain;
      
    whitelisted = false;
    cookieValue = getCookie('AEGON.Cookie.OptIn');

    var styleElm = document.createElement("style");

    if (cookieValue === null) {
      styleElm.innerHTML = "[data-cookie-basic], [data-cookie-optimal] { display: none;} ";
      showCookieWall();
    } else {
      cookieWall.cookieValue = cookieValue;
      if (cookieValue === 'S') {
        styleElm.innerHTML = "[data-cookie-optimal] { display: none;} ";
      }
    }
    $("head").append(styleElm);
  }
  cookieWall.initialize = initialize;


  function addScript(url, cookieOption, options) {
    /* Add the following line in the head to load a script in the page.
     <script>cookieWall.addScript('scripts/aegon-angular2.js', 'E', { async: false, attrs: {} })</script>
     Scripts with async false will be loaded immediately before dom rendering.
     Attrs will be added on the generated element if needed.
     */
    var append = false;
    if (!cookieOption) {
      cookieOption = 'S';
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
    if (cookieValue) {
      if (cookieOption.toUpperCase() === 'S') {
        if (whitelisted || cookieValue.toUpperCase() === 'S') {
          // Only basic scripts are appended (also on whitelisted pages).
          append = true;
        }
      } else if (cookieValue.toUpperCase() === 'E') {
        // Optimal option, all script can be appended.
        append = true;
      }
    } else if (whitelisted && cookieOption.toUpperCase() === 'S') {
      // The page is whitelisted, append the basic scripts.
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