/**
 * Popup that contains an iframe functionality.
 */
// Closure with jQuery support
(function($, Drupal) {
  'use strict';

  // Add Drupal behavior that is triggered on document.ready.
  Drupal.behaviors.iframePopup = {
    attach: function (context, settings) {
      var styleElm = document.createElement("style");
      styleElm.innerHTML = "html, body { overflow: hidden; height: 100%; }";

      // The popup element holder is used to add and remove the popup from the body.
      var popupElm;

      var removeIframePopup = function () {
        document.head.removeChild(styleElm);
        document.body.removeChild(popupElm);
        popupElm = null;
      };

      var generatePopupElm = function (url) {
        // Generate the popup element. When added to the dom it will start loading the iframe data.
        popupElm = document.createElement("div");
        popupElm.className = "iframe-popup popup-show";
        popupElm.innerHTML = '<div class="popup-container">' +
          '<a class="close-popup close-iframe-popup"></a>' +
            '<div class="popup-content">' +
              '<iframe src="' + url + '"></iframe>' +
            '</div>' +
          '</div>';
      };

      var showIframePopup = function (url) {
        // Generate popup element.
        generatePopupElm(url);

        // Add the elements to the dom.
        document.body.appendChild(popupElm);
        document.head.appendChild(styleElm);

        // Bind close event to the added iframe popup close button.
        $('.close-iframe-popup').on('click', function () {
          removeIframePopup();
        });
      };
      // Expose this function to call it from Drupal.behaviors.
      Drupal.behaviors.iframePopup.showIframePopup = showIframePopup;

      // Find buttons or links that need to open the iframe popup.
      $('.show-iframe-popup').on('click', function () {
        showIframePopup();
      });
    }
  };
})(jQuery, Drupal);