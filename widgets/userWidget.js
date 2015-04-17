/**
 * User details script
 */

(function($, doc) {

  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.userWidget = {

    attach: function (context, settings) {

      // TEMP: stop everything in case we aren't under vps-rhino-1 or localhost
      // if (doc.domain === '10.120.32.22') { return; }
      // if (doc.domain.search('rhino.aegon.nl') === -1) { return; }
      // if (doc.domain.search('localhost') === -1) { return; }

      // Setup
      this.setup(settings);
      
      // Simulation TEMP
      this.simulation();
    },

    setup: function (settings) {

      // Setp url API
      this.apiUrl = settings.basePath + settings.pathToTheme +
        '/includes/fake-widgets.php?id=';
    },

    showLogged: function () {

      // $("#shw-user-details").load(this.apiUrl + 'user');
      // $("#shw-contract-overview").load(this.apiUrl + 'contract_overview');
      $('#shw-user-details').html('<div id="user_widget" class="user_widget">
      <div id="user_widget_topmenu" class="topmenu">
        <div class="username">Michiel van der Most Spijk</div>
      </div>

      <div id="user_widget_dropdown" class="frame bubbleTopRight">
        <div class="username">user name</div>
        <div class="email">usermail@somesite.com</div>
        <div class="lastlogin">Uw vorige bezoek was op 08-01-2015 om 14:11 uur</div>
        <button class="arrow">Mijn overzicht</button>
        <button class="white">uitloggen</button>
      </div>
    </div>');
    },

    simulation: function () {

      var that = this;

      // that.showLogged();

      if (location.pathname.indexOf('mijnaegon') === -1) {
        return;
      }

      setTimeout(function () {

        if (window.confirm('Do you want simulate session logged?')) { 

          setTimeout(function () {
            that.showLogged();
          }, 1000);
        }

      }, 2000);
    }
  };

})(jQuery, this.document);
