(function ($, win) {

  'use strict';

  /**
   * JS code for UI Elements
   * @type {Object}
   */
  Drupal.behaviors.uiElements = {

    attach: function () {

      // Run all UI helper functions
      this.globals()
        .backTop()
        .pointerEventsPolyfillInit();
    },

    globals: function () {

      // Copy jQuery to $ as item of window public object
      win.$ = $;

      return this;
    },

    backTop: function () {

      // Back to top for mobile
      if ($(win).scrollTop() === 0) {
        $('#back-top a').hide();
      }

      $('#back-top a').click(function() {
        $('body,html').animate({
          scrollTop: 0
        }, 600);
        if ($(win).scrollTop() === 0) {
          $('#back-top a').hide();
        }
        return false;
      });

      $(win).scroll(function() {
        if ($(win).scrollTop() > 100) {
          $('#back-top a').show();
        } else {
          $('#back-top a').hide();
        }
        clearTimeout($.data(this, 'scrollTimer'));
        $.data(this, 'scrollTimer', setTimeout(function() {
          // do something
          $('#back-top a').hide();
        }, 4e3));
      });

      return this;
    },

    pointerEventsPolyfillInit: function () {

      // Initialize polyfill for "pointer-events: none"
      PointerEventsPolyfill.initialize();

      return this;
    }
  };
  
})(jQuery, this);
