/**
 * Drupal.behaviors.iframeResizeHeight created on 15/11/16.
 *
 * @description Dynamic resize function for iframes.
 * All iframes with class .resizable or property [resizable]
 * will be affected.
 */

// Closure with jQuery and Drupal support.
(function($, Drupal) {
  'use strict';

  // Add Drupal behavior that is triggered on document.ready.
  Drupal.behaviors.iframeResizeHeight = {
    // Active iframe.
    targerIframe: null,
    // Function that runs on DOMContentLoaded.
    attach: function (context) {
      this.attachWindowEvents();
      this.attachIframeEvents(context);
      this.attached = true;
    },
    // Window's event listeners.
    attachWindowEvents: function() {
      // Events functions.
      var windowEvents = {
        default: function() {
          // Instance of Drupal behavior.
          var that = top.Drupal.behaviors.iframeResizeHeight;

          // Check if target iframe exists.
          if( that.targerIframe ) {
            that.resizeHeight(that.targerIframe);
          }
        },
        // Message event API for cross-domain support.
        message: function(e) {
          // Instance of Drupal behavior.
          var that = top.Drupal.behaviors.iframeResizeHeight;
          // Check if the target iframe is set.
          if( that.targerIframe ) {
            var iframe = $(that.targerIframe),
                origin = e.origin || e.originalEvent.origin;
            // Check if the domain is same as iframe src.
            if((iframe.attr('src').charAt(0) === '/' || iframe.attr('src').indexOf(origin) === 0) && !isNaN(e.data)) {
              that.resizeHeight(null, e.data);
            }
          }
        }
      };
      // Attach only once.
      if(!this.attached) {
        // This will be triggerd when the iframe is clicked.
        this.addEvent(top, 'blur', windowEvents.default);
        this.addEvent(top, 'focus', windowEvents.default);
        // Usage from iframe: top.postMessage(456, "http://localhost:3000");
        // More info: http://javascript.info/tutorial/cross-window-messaging-with-postmessage
        this.addEvent(top, 'message', windowEvents.message);
      }
    },
    attachIframeEvents: function(context) {
      var that = this,
          iframes = $(document, context).find('iframe.resizable, iframe[resizable]');

      iframes.each(function() {
        // Sets the target iframe with the element.
        that.targerIframe = this;
        var iframe = $(this);
        // Initial height resize.
        iframe.on('load', function() {
          that.resizeHeight(this);
        });
        // Sets the target iframe with the element
        // in case there are more than one.
        iframe.on('mouseover', function() {
          that.targerIframe = this;
        });
      });
    },
    /*
     * Resize the active iframe.
     */
    resizeIframe: function() {
      setTimeout( function() {
        top.Drupal.behaviors.iframeResizeHeight.resizeHeight();
      }, 500);
    },
    /*
     * Resize the height of an iframe.
     *
     * @param {object} iframe: the iframe element object.
     * @param {number} height: the height to resize to.
     */
    resizeHeight: function(iframe, height) {
      // Check if the iframe element is passed.
      if(!iframe || typeof iframe === 'undefined') {
        iframe = top.Drupal.behaviors.iframeResizeHeight.targerIframe;
      }

      iframe = $(iframe);
      // Default height.
      var newHeight = iframe[0].offsetHeight; 
      // Check second parameter.
      if(typeof height !== 'undefined' && !isNaN(height)) {
        newHeight = Math.abs(+height);
      }
      else {
        // Attempt to read the body of the iframe.
        // It doesn't work with cross-origin without origin headers.
        try {
          newHeight = iframe[0].contentWindow.document.body.offsetHeight;
        }
        catch(e) {
          console.log(e);
        }
      }

      iframe.animate({'height': newHeight + 'px'}, 400);
    },
    /*
     * Function to attach events to elements.
     *
     * @param {object} obj: the DOM element object to attach events to.
     * @param {string} evt: the event to be attached.
     * @param {function} func: the function to run when the event is triggered.
     */
    addEvent: function(obj, evt, func) {
      if ('addEventListener' in window){
        obj.addEventListener(evt, func, false);
      } else if ('attachEvent' in window){//IE
        obj.attachEvent('on' + evt, func);
      }
    },
    attached: false
  };
})(jQuery, Drupal);