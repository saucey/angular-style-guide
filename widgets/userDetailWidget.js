/**
 * User details script
 */

(function($, doc) {

  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.userDetailWidget = {

    attach: function (context, settings) {

      // Setup
      this.setup(settings);
      
      if (this.widget.length > 0) {
        this.events();
      }
    },

    setup: function (settings) {

      this.widget = $('.user_detail_widget');

      // Setp url API
      this.apiUrl = settings.basePath + settings.pathToTheme +
        '/includes/fake-widgets.php?id=';
    },

    showLogged: function () {

      // $("#shw-user-details").load(this.apiUrl + 'user');
      // $('#shw-user-details').html('<div id="user_widget" class="user_widget">
      //     <div id="user_widget_topmenu" class="topmenu">
      //       <div class="username">Michiel van der Most Spijk</div>
      //     </div>

      //     <div id="user_widget_dropdown" class="frame bubbleTopRight">
      //       <div class="username">user name</div>
      //       <div class="email">usermail@somesite.com</div>
      //       <div class="lastlogin">Uw vorige bezoek was op 08-01-2015 om 14:11 uur</div>
      //       <button class="arrow">Mijn overzicht</button>
      //       <button class="white">uitloggen</button>
      //     </div>
      //   </div>');
    },

    simulation: function () {

      var that = this;

      that.showLogged();

      // if (location.pathname.indexOf('mijnaegon') === -1) {
      //   return;
      // }

      // setTimeout(function () {

      //   if (window.confirm('Do you want simulate session logged?')) { 

      //     setTimeout(function () {
      //       that.showLogged();
      //     }, 1000);
      //   }

      // }, 2000);
    },

    events: function () {

      this.widget.find('button.btn-login').on('hover', function() {
        $(this).addClass( "off" ).off('hover');
      });

      this.widget.find('button.btn-login').on('click', function() {
        $(this).toggleClass("tap");
      });

      this.widget.find('.highlight').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {

        // console.log($(this));
        $(this).parent().addClass('processed');

      });
    }
  };

})(jQuery, this.document);
