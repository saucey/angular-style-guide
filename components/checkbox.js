/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.checkbox = {
    attach: function () {
      var blurred = Drupal.behaviors["text-input"].prepareBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      var focussed = Drupal.behaviors["text-input"].endBlurred; //this is to implement a different error behaviour between when the form is loaded and once an element has been visited
      $("span.checkbox, input[type=checkbox]")
        .blur(blurred) //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity
        .focus(focussed).click(focussed); //strictly speaking, this line with only the checkbox selector should be put into checkbox.js as well, but accompanied by all the previous lines this seems to be an awful lot of baggage just to maintain the appearance of modularity

      this.attached = true;
    },
    attached: false,
  };
})(jQuery);
