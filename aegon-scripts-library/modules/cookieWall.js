(function ($) {
    'use strict';

    // When retrieving the cookie and it exist, store the value.
    var cookieValue;


    /* Cookie helper functions */

    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }


    function getCookie(name) {
        name = name + "=";

        var cookieArray = document.cookie.split(';');

        for(var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];

            // Remove space between cookies.
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }

            // Cookie found? Return the cookie value.
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length,cookie.length);
            }
        }

        // No cookie found.
        return null;
    }


    function showCookieWall() {

        var cookieWallElm = $('.blocking-popup.cookie-wall');

        if (!cookieWallElm[0]) {
            $.ajax({
                type: 'GET',
                dataType: 'text',
                global: false,
                url: '______________FILL_IN______________',
                success: function (response) {
                    response = JSON.parse(response);

                    if (response.cookietext) {
                        var body = $("body");

                        body.css("overflow", "hidden");
                        body.prepend(response.cookietext);

                        showPopupContent(cookieValue.toUpperCase() === 'E' ? 'advanced' : null);
                    }
                }
            })
        }

    }


    function showPopupContent(name) {
        // Name should be advanced or basic
        if (name !== 'advanced') {
            name = 'basic';
        }

        // Hide the visible popup content
        var visibleContent = $(".blocking-popup.cookie-wall .popup-content.show");
        var hiddenContent = $(".blocking-popup.cookie-wall .popup-content." + name);

        if (visibleContent[0] && hiddenContent[0] && visibleContent[0] !== hiddenContent[0]) {
            visibleContent.removeClass("show");
            hiddenContent.addClass("show");

            $('#open-cookies-advanced').on('click', function () {
                showPopupContent('dynamic');
            });

            $('#accept-cookie-choice, #accept-custom-cookie-choice').on('click', function () {
                saveCookieChoice();
            });
        }
    }


    function saveCookieChoice() {
        // By default always set optimal as option.
        var selectedOption = 'E';

        var selectedRadioButton = $(".blocking-popup.cookie-wall .show input[type='radio']:checked");
        if (selectedRadioButton[0]) {
            if (selectedRadioButton[0].value === 'basic-choice') {
                // Basic cookies are selected as option.
                selectedOption = 'S';
            }
        }

        $.ajax({
            type: 'POST',
            dataType: 'text',
            global: false,
            url: '/lpa/CookieVoorkeur',
            data: 'ans=' + selectedOption,
            success: function () {
                setCookie('AEGON.Cookie.OptIn', selectedOption, 100);
                location.reload();
            }
        });
    }


    function initialize() {
        cookieValue = getCookie('AEGON.Cookie.OptIn');

        if (cookieValue === null) {
            showCookieWall();
        }
    }


    function addScript(url, cookieOption, options) {
        var append = false;

        if (options === void 0) {
            options = {};
        }

        if (options.async === void 0) {
            options.async = true;
        }

        if (options.attrs === void 0) {
            options.attrs = {};
        }

        if (cookieValue.toUpperCase() === 'E') {
            // Optimal option, all script are appended.
            append = true;
        } else if (cookieValue.toUpperCase() === 'S' && cookieOption.toUpperCase() === 'S') {
            // Only basic scripts are appended.
            append = true;
        }

        var keys = Object.keys(options.attrs);

        if (append && options.async) {
            var elm = document.createElement("script");
            elm.async = true;
            elm.src = url;
            
            // TODO attrs toevoegen.


            $('head').append(elm);
        } else if (append) {
            // TODO document.write.
        }
    }

})(jQuery);