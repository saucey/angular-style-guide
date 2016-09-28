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
    attach: function (context) {
      Drupal.behaviors.tooltip.activate("#personal_details_widget");
      Drupal.behaviors.tooltip.activate("#mobile_number");

      var Validation = Drupal.behaviors.validation;
      var formSelector = "form[name=personal_details_form]";
      if (!Validation.IEFix(formSelector, false)) {
        Validation.otherFix(formSelector, false);
      }

      // activate the tabs for Dutch or foreign addresses
      // residential address
      $("input[name=ra_NL]", context).click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]:checked", context).click();
      // communication address
      $("input[name=ca_NL]", context).click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]:checked", context).click();

      // AJAX call on changing the postal code / house nr

      var data,
          $personalDetailsWidgetForm = $(formSelector),
          $zipcodeField = $personalDetailsWidgetForm.find('#ra_NL_zip'),
          $zipcodeField_ca = $personalDetailsWidgetForm.find('#ca_NL_zip'),
          $housenumberField = $personalDetailsWidgetForm.find('#ra_NL_number'),
          $housenumberField_ca = $personalDetailsWidgetForm.find('#ca_NL_number'),
          $streetField = $personalDetailsWidgetForm.find("#ra_NL_street"),
          $streetField_ca = $personalDetailsWidgetForm.find("#ca_NL_street"),
          $cityField = $personalDetailsWidgetForm.find("#ra_NL_city"),
          $cityField_ca = $personalDetailsWidgetForm.find("#ca_NL_city");

      // Removes classes from fields that are added on by Validval
      var removeAttr = function(type) {
        if(type !== 'ca') {
          $streetField.removeClass('invalid inactive');
          $cityField.removeClass('invalid inactive');
        } else {
          $streetField_ca.removeClass('invalid inactive');
          $cityField_ca.removeClass('invalid inactive');
        }
      };

      var getAddress = function(type) {
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
          cache : false,
          url : '/mijnservices/US_RestGatewayWeb/rest/requestResponse/BS_UtillitiesPostalArea_03/retrieveAddress',
          timeout: 5000, // Default 5000ms
          data : data,
          success: function(response){
              if (response.retrieveAddressResponse._AE_ADRES !== undefined) {
                if(type !== 'ca') {
                  $streetField.val(response.retrieveAddressResponse._AE_ADRES.STRAAT);
                  $cityField.val(response.retrieveAddressResponse._AE_ADRES.PLAATS);
                  removeAttr();
                } else {
                  $streetField_ca.val(response.retrieveAddressResponse._AE_ADRES.STRAAT);
                  $cityField_ca.val(response.retrieveAddressResponse._AE_ADRES.PLAATS);
                  removeAttr('ca');
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

      
      $('#personal_details_widget input[rel^=address-lookup]', context).change(function(){
        if ($zipcodeField.val().length > 0 && $housenumberField.val().length > 0) {
          getAddress();
        }
      });

      $('#personal_details_widget input[rel^=ca-address-lookup]', context).change(function(){
        if ($zipcodeField_ca.val().length > 0 && $housenumberField_ca.val().length > 0) {
          getAddress('ca');
        }
      });

    this.attached = true;
    },
    attached: false
  };

})(this.document, this, this.jQuery, this.Drupal);
