/**
 * Example JavaScript component
 */
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.browser = {
    attach: function () {
      // ua[1] = msie, ua[2] = version, if msie
      var ua = navigator.userAgent.match(/^.*(msie)\s+(\d+).*$/i);
      var tri = navigator.userAgent.match(/^.*(Trident)\s*\/\s*(\d+).*$/i);
      // pre-define conditions for debugging purposes
      var gteie9 = (ua && (ua[1] == "MSIE") && (parseInt(ua[2]) > 8));
      var gtie10 = (!ua && tri);
      // tri but no ua mean IE 11, IE < 11 all have MSIE in the user agent
      if (gteie9 || gtie10) {
      //if (ua && ua[1] == "MSIE" && parseInt(ua[2]) > 8) {
//        $(document).ready(function () {
          $("html").addClass("gte-ie9");
//        });
      }
      else {
//        $(document).ready(function () {
          $("html").addClass("notgte-ie9");
//        });
      }   
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
  };
})(jQuery);