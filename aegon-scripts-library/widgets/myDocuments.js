/*jshint multistr: true */
/**
 * Mijn Documenten widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.myDocumentsWidget = {

    attach: function (context) {

      $('.my_documents_widget article h2', context).on('click', function () {
        $(this).parent('article').toggleClass('open')
          .siblings().removeClass('open');
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
