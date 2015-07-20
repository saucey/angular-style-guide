/*jshint multistr: true */
/**
 * Mijn Gegevens widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  var testSelector = function (selector) {
    document.querySelector('*');  //checks if querySelector is implemented and raises an error if not
    try {document.querySelector(selector)} catch (e) {return false}
    return true;
  }

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.personalDetailsWidget = {
    validation: {  //  this is part of the form validation routine; when it is working correctly, this should be bumped to a general level
      zip: "^d+\w*$",
    },

    attach: function () {
      $(".help").mouseover(function () {
        if (this.title > " ") { //the temporary content has 2B " ", since "" will set display to "none" according to stylesheet definition, 
          //alert(this.title);
          $(".dialog.help").remove();
          var dialog = document.createElement("DIV");
          dialog.className = "help dialog";
          dialog.innerHTML = this.title;
          this.title = " ";
          $("#lhfs_widget").append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
          var offset = $(this).offset();
          offset.top = offset.top + $(this).height() + 10;
          offset.left = offset.left - $(dialog).width() / 2 - 18;
          $(dialog).offset(offset);
          var that = this;
          $(document).click(function () {
            $(dialog).remove();
             that.title = dialog.innerHTML;
          });
        }
      });

      if (!testSelector("form:invalid")) {  //if the userAgent does not know the :invalid pseudoclass, we need the validation workaround provided by validVal
        $("form[name=personal_details_form]").validVal({
          validate: {
            onKeyup: true,
          },
        });
      }

      $("input[name=ra_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .residential .NL").toggleClass("visible", NL);
        $(".address .residential .world").toggleClass("visible", !NL);
      });
      $("input[name=ra_NL]:checked").click();

      $("input[name=ca_NL]").click( function () {
        var NL = parseInt($(this).val()) > 0;
        $(".address .correspondential .NL").toggleClass("visible", NL);
        $(".address .correspondential .world").toggleClass("visible", !NL);
      });
      $("input[name=ca_NL]:checked").click();
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
