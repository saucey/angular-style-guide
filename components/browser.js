/**
browser sniffer for all those cases where feature sniffing just does not help
use sparingly!
**/
// Closure with jQuery support
(function($) {
  'use strict';

  // Add new item to public Drupal object
  Drupal.behaviors.browser = {
    attach: function () {
      // ie[1] = msie, ie[2] = version, if msie
      var ie = navigator.userAgent.match(/^.*(msie)\s+(\d+).*$/i);
      var tri = navigator.userAgent.match(/^.*(Trident)\s*\/\s*(\d+).*$/i);
      // pre-define conditions for easier debugging
      var gteie9 = (ie && (ie[1] === "MSIE") && (parseInt(ie[2]) > 8));
      var gtie10 = (!ie && tri);
      // tri but no ie mean IE 11, IE < 11 all have MSIE in the user agent
      $("html").addClass(gteie9 || gtie10 ? "gte-ie9" : "");
      
      var safari = navigator.userAgent.match(/^.*(safari)\s*\/\s*([\d.]+).*$/i);
      var chrome = navigator.userAgent.match(/^.*(chrome)\s*\/\s*([\d.]+).*$/i);
      // chrome has safari and chrome in its userAgent, safari only safari
      $("html").addClass(chrome ? "chrome" : (safari ? "safari" : ""));
 
      this.attached = true;  //used to determine if this function has already run
    },
    attached: false,
  };
})(jQuery);