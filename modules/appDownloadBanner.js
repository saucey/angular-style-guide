(function ($) {

  'use strict';

  /**
   * Smart banner implementation
   * Dependency: $.smartbanner
   * @type {Object}
   */
  Drupal.behaviors.smartBanner = {

    attach: function () {

      $.smartbanner({
        // days to hide banner after close button is clicked (defaults to 15)
        daysHidden: 15,
        // days to hide banner after "VIEW" button is clicked (defaults to 90)
        daysReminder: 90,
        // language code for the App Store (defaults to us)
        appStoreLanguage: 'nl',
        title: 'Mijn Aegon',
        author: 'AEGON Nederland N.V.',
        button: 'Bekijk',
        store: {
          ios: 'On the App Store',
          android: 'In Google Play'
        },
        price: 'Gratis'
        // , force: 'android' // Uncomment for platform emulation
      });
    }
  };

})(jQuery);
