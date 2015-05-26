/*jshint multistr: true */
/**
 * User details script
 * Dependencies: 
 */

(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * Register or retrieve the public container for our shw widgets.
   * Purpose of this window global object is for register some public functions.
   * Need to be initialized on top of each widgets.
   */
  win.shwGlobal = win.shwGlobal || {};

  /**
   * MyDocuments's configuration
   */

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.myDocuments = {

    attach: function (context, settings) {

      $('.my_documents_widget article h2').on('click', function () {
        $(this).parent('article').toggleClass('open')
          .siblings().removeClass('open');
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
