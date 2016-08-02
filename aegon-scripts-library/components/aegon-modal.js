/**
 * AegonModal function declaration
 *
 * @param action (string)(optional): 'open' (default) || 'position' || 'update' || 'close'
 * @param options (object): options for the modal
 * @param callback (function)(optional): what to do after the modal is open
 */
// Closure with jQuery support
(function(Drupal, $) {
  'use strict';

  Drupal.aegonModal = function(action, options, callback) {
    var modal,
    defaults = {
      id: 'aegon-modal', // @string: unique id.
      title: '', // @string: title text, no HTML
      body: '', // @string: HTML for the body
      close: true, // @boolean: Add close button
      ajax: false, // @boolean: whether to add the loader or not
      ajaxText: '', // @string: Text to show while waiting for ajax if ajax === true
      overlay: true, // @boolean: dark overlay behind the modal
      overlayClose: false, // @boolean: close the modal by clicking the overlay.
      timeOut: 0, // @number (miliseconds): the amount of time of wait till show the message if ajax === true
      timeOutMessage: '', // @string: message to show after time out if ajax === true
      width: '' // @int: the width of the modal (it has a max-width of 100% so there won't be scroll).
    };

    // if the second param is the callback
    if(typeof options === 'function') {
      callback = options;
      options = null;
    }

    // if only the options are passed 
    if(typeof action === 'object') {
      options = action;
      // Will be the default action.
      action = null;
    }

    if(action === 'open' || action === 'update' || action === null) {
      // options are mandatory for open and update
      if(typeof options === 'undefined' || typeof options === null) {
        throw new Error('No options were passed');
      }
    }

    var settings = $.extend({}, defaults, options);
    /*
     * Creates the modal layout according to
     * the settings
     */
    function createModal() {
      // delete the modal
      if(action !== 'update') {
        closeModal();
      }else{
        if(window.aegonModalTimeout !== 'undefined') {
          clearTimeout(window.aegonModalTimeout);
          delete window.aegonModalTimeout;
        }
      }
      // Layout setting.
      var modalInner = '',
      $modal;

      // Modal layout
      if(typeof settings.title === 'string' && settings.title.trim() !== '') {
        modalInner += '<h2>' + settings.title + '</h2>';
      }
      if(typeof settings.body === 'string' && settings.body.trim() !== '') {
        // all the HTML of the body is wrapped
        modalInner += '<div class="modal-content">' + settings.body + '</div>';
      }
      // loader for ajax content
      if(typeof settings.ajax === 'boolean' && settings.ajax) {
        modalInner += '<div class="modal-loader"></div>';
        // Optional text to show with loader only if ajax is true
        if(typeof settings.ajaxText === 'string' && settings.ajaxText.trim() !== '') {
          modalInner += '<p class="ajax-text">' + settings.ajaxText + '</p>';
        }
        // timeout for ajax
        if(! isNaN(settings.timeOut) && parseInt(settings.timeOut) > 0) {
          window.aegonModalTimeout = setTimeout(function(){ 
            // loader for ajax content
            if(typeof settings.timeOutMessage === 'string' && settings.timeOutMessage.trim() !== '') {
              if($(document).find('.aegon-modal').length > 0) {
                $(document).find('.aegon-modal').append('<p class="ajax-timeout">' + settings.timeOutMessage + '</p>');
              }
            }
          }, 
          parseInt(settings.timeOut));
        }
      }

      // Makes sure it contains something
      if(modalInner !== '') {
        // add additional elements to modal
        if(typeof settings.close === 'boolean' && settings.close) {
          modalInner += '<a class="icon-uniE60D close-modal" data-close="modal"></a>';
        }
        /*
         * Creates the element in the DOM
         */
        if(action !== 'update') {
          var modalEle = document.createElement('DIV');
          modalEle.id = settings.id;
          modalEle.className = 'aegon-modal visible';
          modalEle.innerHTML = modalInner;
          // add inline width css
          if(! isNaN(settings.width) && parseInt(settings.width) > 0) {
            modalEle.style.width = settings.width + 'px';
          }

          // Insert the modal
          $('body').append(modalEle);

          $modal = $(modalEle);
          // Add click event to close modal
          $(document).on('click', '.aegon-modal .close-modal, .aegon-modal-overlay.close-modal', function() {
            Drupal.aegonModal('close');
          });        
        }else{
          $modal = $(document).find('.aegon-modal');
          // updates the content of the modal
          $modal.html(modalInner);
        }

        // overlay layout
        if(settings.overlay) {
          if(! $(document).find('.aegon-modal-overlay').length) {
            if(! settings.close || settings.overlayClose) {
              // if the close button is not desire, attache click event to overlay
              $('body').append('<div class="aegon-modal-overlay close-modal lightbox"></div>');
            } else {
              $('body').append('<div class="aegon-modal-overlay lightbox"></div>');
            }
          }
        } else {
          if($(document).find('.aegon-modal-overlay').length) {
            $('.aegon-modal-overlay').remove();
          }
        }
        // center position modal
        positionModal();

        // return element
        return $modal;

      } else {
        var e = new Error('No options were passed for the modal content'); 
        throw e;
      }
    }
    /*
     * Positions the modal in the 
     * middle of the screen
     */
    function positionModal() {
      var $modal = $(document).find('.aegon-modal'),
      $window = $(window);

      if($modal.length){
        // Reset CSS
        $modal.css({'bottom':'auto', 'overflow-y':'visible', 'margin-left': - ($modal.outerWidth() / 2) });

        if($window.height() < $modal.outerHeight()) {
          $modal.css({'top': 20, 'bottom': 20, 'overflow-y':'auto'});
        }else{
          $modal.css({
            top: (($window.height() - $modal.outerHeight()) / 2)
          });
        }
      }
      // return something
      return true;
    }
    /*
     * Remove the modal and the overlay
     * elements from DOM
     */
    function closeModal() {
      $(document).find('.aegon-modal, .aegon-modal-overlay').remove();

      return true;
    }

    // Actions.
    switch( action ) {
      case 'open':
      case 'update':
        modal = createModal();
        if(typeof callback === 'function') {
          callback();
        }
        break;
      case 'position':
        modal = positionModal();
        break;
      case 'close':
        modal = closeModal();
        break;
      default:
        modal = createModal();
        if(typeof callback === 'function') {
          callback();
        }
        break;
    }

    /*
     * Return the element for further manipulation
     * or true when closed.
     */
    return modal;
  };

  /*
   * Autorun function when elements have 
   * attribute data-aegon="modal"
   * The options for the modal will be set
   * by the data-modal attributes.
   */

  Drupal.behaviors.aegonModalRun = {
    attach: function(context) {
      $(document, context).on('click', '[data-aegon="modal"]', function(e) {
        e.preventDefault();

        var $this = $(this),
            $ops = {},
            $boolRexExp = /(true|false)/;
        // Title content.
        if( $this.attr('data-modal-title') !== undefined && $this.attr('data-modal-title').trim() !== '' ) {
          $ops.title = $this.attr('data-modal-title');
        }
        // Body content.
        if( $this.attr('data-modal-body') !== undefined && $this.attr('data-modal-body').trim() !== '' ) {
          $ops.body = $this.attr('data-modal-body');
        }
        // ID.
        if( $this.attr('data-modal-id') !== undefined && $this.attr('data-modal-id').trim() !== '' ) {
          $ops.id = $this.attr('data-modal-id');
        }
        // Close button.
        if( $this.attr('data-modal-close') !== undefined && $this.attr('data-modal-close').match($boolRexExp) ) {
          $ops.close = $this.attr('data-modal-close') === 'true';
        }
        // Ajax.
        if($this.attr('data-modal-ajax') !== undefined && $this.attr('data-modal-ajax').match($boolRexExp)) {
          $ops.ajax = $this.attr('data-modal-ajax') === 'true';
        }
        // ajaxText.
        if( $this.attr('data-modal-ajaxText') !== undefined && $this.attr('data-modal-ajaxText').trim() !== '' ) {
          $ops.ajaxText = $this.attr('data-modal-ajaxText');
        }
        // Overlay.
        if( $this.attr('data-modal-overlay') !== undefined && $this.attr('data-modal-overlay').match($boolRexExp) ) {
          $ops.overlay = $this.attr('data-modal-overlay') === 'true';
        }
        // OverlayClose.
        if( $this.attr('data-modal-overlayClose') !== undefined && $this.attr('data-modal-overlayClose').match($boolRexExp) ) {
          $ops.overlayClose = $this.attr('data-modal-overlayClose') === 'true';
        }
        // timeOut.
        if( $this.attr('data-modal-timeOut') !== undefined && ! isNaN($this.attr('data-modal-timeOut')) ) {
          $ops.timeOut = parseInt($this.attr('data-modal-timeOut'));
        }
        // timeOutMessage.
        if( $this.attr('data-modal-timeOutMessage') !== undefined && $this.attr('data-modal-timeOutMessage').trim() !== '' ) {
          $ops.timeOutMessage = $this.attr('data-modal-timeOutMessage');
        }
        // width.
        if( $this.attr('data-modal-width') !== undefined && ! isNaN($this.attr('data-modal-width')) ) {
          $ops.width = parseInt($this.attr('data-modal-width'));
        }
        /* href attr check for existing element.
         * If it finds the element, the body options
         * is overwritten with the content of the div.
         */
        if($this.attr('href').indexOf('#') === 0) {
          var $target = $(document).find($this.attr('href'));
          if($($target).length) {
            $ops.body = $target.html();
          }
        }
        
        // If the options object has valid options, opens the modal.
        if(Object.keys($ops).length > 0) {
          Drupal.aegonModal($ops);
        }
      });
    }
  };

  $(window).on('resize', function() {
    Drupal.aegonModal('position');
  });

})(Drupal, jQuery);
