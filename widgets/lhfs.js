/**
 * LHFS script
 */

// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.lhfs_widget = {
    attach: function () {

      // Check if div#lhfs_widget exist
      if ($('.lhfs_widget').length > 0) {
        $("#lhfs_widget .tip").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal").removeClass("visible");
        $("#lhfs_widget li.product ul.horizontal").addClass("visible");
        $("#lhfs_widget li.product ul.horizontal.error").removeClass("visible");

        $(".success")
          .appendTo("body") //move .success to the body, so that it can be centered and fixed to the screen
          .css("top", (($(window).height() - $(".success").height()) / 2) + "px");  //center .success vertically
        $(".lightbox")
          .appendTo("body"); //move .lightbox to the body & after .success so that the visible style for .success still applies


        $(".help").mouseover(function () {
          if (this.title) {
            //alert(this.title);
            $(".dialog.help").remove();
            var dialog = document.createElement("DIV");
            dialog.className = "help dialog";
            dialog.innerHTML = this.title;
            this.title = "";
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

      }
    }
  };

})(jQuery);
