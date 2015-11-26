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
        button: 'Bekijk',
        inAppStore: 'App Store', // Text of price for iOS
        inGooglePlay: 'Google Play', // Text of price for Android
        inAmazonAppStore: 'Amazon Appstore',
        inWindowsStore: 'Windows Store', //Text of price for Windows
        price: 'Gratis'
        // , force: 'android' // Uncomment for platform emulation
      });
    }
  };

})(jQuery);
