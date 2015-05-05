/*jshint multistr: true */
/**
 * User details script
 */

(function($, doc) {

  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.userDetailWidget = {

    attach: function (context, settings) {

      // Cache the div
      this.widget = $('#user_detail_widget');

      // Setup
      this.setup(settings);
    },

    setup: function (settings) {

      // Set url API
      // this.apiUrl = settings.basePath + settings.pathToTheme +
      //   '/includes/fake-widgets.php?id=';
      // this.apiUrl = '/data/widgets/user_detail.json';
      this.apiUrl = 'http://localhost:3000/data/widgets/user_detail.json';
      // this.apiUrl = 'http://echo.jsontest.com/key/value/one/two';

      // If widget exist go ahead
      if (this.widget.length > 0) {
        this.events();
      }

      this.getUserData();
    },

    getDataType: function () {

      var apiUrlOrig = this.apiUrl.split('/').splice(0, 3).join('/');

      return doc.location.origin.indexOf(apiUrlOrig) !== -1 ? 'json' : 'jsonp';
    },

    getUserData: function () {

      var that = this;

      $.ajax({
        url: this.apiUrl,
        dataType: this.getDataType(),
        success: function(data){
          var text = '';
          var len = data.length;

          // Parse data into widget
          that.parseWidget(data);
        }
      });
    },

    parseWidget: function (data) {

      $('span[data-id="user_detail_widget_name"]').text(data.username);
      $('span[data-id="user_detail_widget_last_access"]').text(data.last_access);

      // console.log(data);
    },

    events: function () {

      // Hover on button login set class .off on itself and unbind
      this.widget.find('button.btn-login-loggedin').on('hover', function() {
        $(this).addClass( "off" ).off('hover');
      });

      // Click on button login toggle class .tap on itself
      this.widget.find('button.btn-login-loggedin').on('click', function() {
        $(this).toggleClass("tap");
      });

      // In the end of animation of .highlight div, add class .processed to 
      // widget's container to hide itself
      this.widget.find('.highlight').one('webkitAnimationEnd oanimationend \
        msAnimationEnd animationend', function() {
          $(this).parents('.user_detail_widget').addClass('processed');
      });
    }
  };

})(jQuery, this.document);
