/*jshint multistr: true */
/**
 * Mijn Gegevens widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.personalDetailsWidget = {
    attach: function () {
      Drupal.behaviors.tooltip.activate("#personal_details_widget");

      var Validation = Drupal.behaviors.validation;
      var formSelector = "form[name=personal_details_form]";
      if (!Validation.IEFix(formSelector, false)) {
        Validation.otherFix(formSelector, false);
      }

      // activate the tabs for Dutch or foreign addresses
      // residential address
      $("input[name=ra_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]:checked").click();
      // communication address
      $("input[name=ca_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]:checked").click();

      // AJAX call on changing the postal code / house nr
      var $personalDetailsWidgetForm = $(formSelector);

      var $zipcodeField = $personalDetailsWidgetForm.find('#ra_NL_zip');
      var $zipcodeField_ca = $personalDetailsWidgetForm.find('#ca_NL_zip');

      var $housenumberField = $personalDetailsWidgetForm.find('#ra_NL_number');
      var $housenumberField_ca = $personalDetailsWidgetForm.find('#ca_NL_number');

      var $streetField = $personalDetailsWidgetForm.find("#ra_NL_street");
      var $streetField_ca = $personalDetailsWidgetForm.find("#ca_NL_street");

      var $cityField = $personalDetailsWidgetForm.find("#ra_NL_city");
      var $cityField_ca = $personalDetailsWidgetForm.find("#ca_NL_city");

      var getAddress = function(type) {
        var data;
        if(type !== 'ca') {
          data = {
            _AE_ADRES_HUISNR : $housenumberField.val(),
            _AE_ADRES_PCODE : $zipcodeField.val()
          };
        } else {
          data = {
            _AE_ADRES_HUISNR : $housenumberField_ca.val(),
            _AE_ADRES_PCODE : $zipcodeField_ca.val()
          };
        }
        data.AILHEADER_CLIENTID = Drupal.settings.site_name;

        $.ajax({
          url : Drupal.settings.aegon.endpoint_postalcode_service,
          timeout: Drupal.settings.aegon.timeout_postalcode_service, // Default 5000ms
          data : data,
          beforeSend: function( xhr ) {
              // Add HTTP Authentication.
              if (Drupal.settings.aegon.http_authorization_postalcode_service !== undefined) {
                  xhr.setRequestHeader("Authorization", "Basic " + Drupal.settings.aegon.http_authorization_postalcode_service);
              }
          },
          success: function(response){
              if (response.retrieveAddressResponse._AE_ADRES !== undefined) {
                if(type !== 'ca') {
                  $streetField.val(response.retrieveAddressResponse._AE_ADRES.STRAAT);
                  $cityField.val(response.retrieveAddressResponse._AE_ADRES.PLAATS);
                } else {
                  $streetField_ca.val(response.retrieveAddressResponse._AE_ADRES.STRAAT);
                  $cityField_ca.val(response.retrieveAddressResponse._AE_ADRES.PLAATS);
                }  
              }
              
              if (response.retrieveAddressResponse.PROCES.STATUS !== "0100") {
                if(type !== 'ca') {
                  $streetField.val('');
                  $cityField.val('');
                } else {
                  $streetField_ca.val('');
                  $cityField_ca.val('');
                } 
              }
          },
          error: function(response){
              console.log('Error:' + response);
          }
        });
      };

      
      $('#personal_details_widget input[rel^=address-lookup]').change(function(){
        if ($zipcodeField.val().length > 0 && $housenumberField.val().length > 0) {
          getAddress();
        }
      });

      $('#personal_details_widget input[rel^=ca-address-lookup]').change(function(){
        if ($zipcodeField_ca.val().length > 0 && $housenumberField_ca.val().length > 0) {
          getAddress('ca');
        }
      });

    this.attached = true;
    },
    attached: false,
  };

})(this.document, this, this.jQuery, this.Drupal);
