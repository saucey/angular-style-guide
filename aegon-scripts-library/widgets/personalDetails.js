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
      $('#personal_details_widget input[rel^=address-lookup]').change(function(){
        
        var $personalDetailsWidgetForm = $(formSelector);

        var $zipcodeField = $personalDetailsWidgetForm.find('#ra_NL_zip');
        var $housenumberField = $personalDetailsWidgetForm.find('#ra_NL_number');

        var $streetField = $personalDetailsWidgetForm.find("#ra_NL_street");
        var $cityField = $personalDetailsWidgetForm.find("#ra_NL_city");

        if ($zipcodeField.val().length > 0 && $housenumberField.val().length > 0) {

            $.ajax({
                url : Drupal.settings.aegon.endpoint_postalcode_service,
                timeout: Drupal.settings.aegon.timeout_postalcode_service, // Allow for a 2 second lookup.
                data : {
                    _AE_ADRES_HUISNR : $housenumberField.val(),
                    _AE_ADRES_PCODE : $zipcodeField.val(),
                    AILHEADER_CLIENTID : Drupal.settings.site_name
                },
                beforeSend: function( xhr ) {
                    // Add HTTP Authentication.
                    if (Drupal.settings.aegon.http_authorization_postalcode_service != undefined) {
                        xhr.setRequestHeader("Authorization", "Basic " + Drupal.settings.aegon.http_authorization_postalcode_service);
                    }
                },
                success: function(response){
                    if (response.retrieveAddressResponse._AE_ADRES !== undefined) {
                        $streetField.val(response.retrieveAddressResponse._AE_ADRES.STRAAT);
                        $cityField.val(response.retrieveAddressResponse._AE_ADRES.PLAATS);
                    }
                    
                    if (response.retrieveAddressResponse.PROCES.STATUS !== "0100") {
                        $streetField.val('');
                        $cityField.val('');
                        // TODO: The value from response.retrieveAddressResponse.PROCES.STATUST field has to be shown
                    }
                },
                error: function(response){
                    console.log(response);
                }
            });
          }
        });
    this.attached = true;
    },
    attached: false,
  };

})(this.document, this, this.jQuery, this.Drupal);
