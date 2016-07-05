/**
 * Popup that contains an iframe functionality.
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.iframePopup = {
    attach: function () {
    var styleElm = document.createElement("STYLE");
    styleElm.innerHTML = "html, body { overflow: hidden; height: 100%; }";

      $('.show-iframe-popup').on('click', function () {
        $(".iframe-popup").addClass("popup-show");
        document.body.appendChild(styleElm);
      });

      $('.close-iframe-popup').on('click', function () {
        $(".iframe-popup").removeClass("popup-show");
        document.body.removeChild(styleElm);
      });
    },
    attached: false
  };
})(jQuery);