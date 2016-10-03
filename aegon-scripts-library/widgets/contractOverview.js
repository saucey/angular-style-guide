/*jshint multistr: true */
/**
 * Contract Overview
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * Contract Overview's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.contractOverview = {
    attach: function (context, settings) {
      Drupal.behaviors.tooltip.activate(".contract_overview_widget");

      var mobileBanner = $('.request_mobile_number', context);
      // Checks if mobile number banner is in DOM
      if(mobileBanner.length) {
        // Check if current website is backend.
        if (window.location.hostname.search('.aegon.com') !== -1) {
          return;
        }
        var apiUrl = '/mijnservices/US_RestGatewayWeb/rest/requestResponse/BS_PARTIJ_04/retrieve';
        // Check if current website is local or DEV environment.
        var localOrDev = (
          settings.onlineAegonNl.hostname === 'local' ||
          win.location.hostname.search('www.dev.') !== -1 ||
          win.location.hostname.search('.local') !== -1
        );
        // otherwise, use real endpoint.
        if (localOrDev) {
          apiUrl = '/file/example/user_detail_bs.json';
        }        
        // Payload for JSONP.
        var now = new Date(),
        jsonPayload = {
          'retrieveRequest': {
            'AILHEADER': {
              'CLIENTID': 'MijnAegonUserWidget',
              'CORRELATIONID': '## MijnAegon_UserWidget ## ' + now.getTime() + ' ##'
            }
          }
        };
        // Load AJAX request.
        $.ajax({
          cache: false,
          timeout: 10000,
          type: 'GET',
          encoding:"UTF-8",
          url: apiUrl,
          data: jsonPayload,
          dataType: 'json',
          success: function(data) {
\            if(typeof data === 'string') {
              data = $.parseJSON(data);
            }
            // Check for retrieveResponse in the passed object.
            if (typeof data !== 'object' || !('retrieveResponse' in data)) {
              return;
            }

            var userData = data.retrieveResponse.PARTIJ;
            if(userData.MOBIEL === '') {
              mobileBanner.fadeIn();
            }
            else {
              mobileBanner.hide();
            }
          }
        });
      }
    }
  };

})(this.document, this, this.jQuery, this.Drupal);