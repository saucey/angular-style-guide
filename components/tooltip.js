/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.tooltip = {
    attach: function () {
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
    activate: function (selector) {
      $(selector + " .help").mouseover(function () {
        if (this.title !== " " && this.title.length > 0) { //the temporary content has 2B " ", since "" will set display to "none" according to stylesheet definition, 
          //alert(this.title);
          $(".dialog.help").remove();
          var dialog = document.createElement("DIV");
          dialog.className = "help dialog";
          dialog.innerHTML = this.title;
          this.title = " ";
          $(selector).append(dialog); //this has 2 happen b4 measurements of dialog are taken, otherwise they won't be initialized
          var offset = $(this).offset();
          offset.top = offset.top + $(this).height() + 20;
          offset.left = offset.left - $(dialog).width() / 2 - 18;
          $(dialog).offset(offset);
          var that = this;
          $(document).click(function () {
            $(dialog).remove();
             that.title = dialog.innerHTML;
          });
          $(".dialog.help").mouseout(function(){
            $(dialog).remove();
             that.title = dialog.innerHTML;
          });
        }
      });
    },
  };
})(jQuery);
