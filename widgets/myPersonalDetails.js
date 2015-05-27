/*jshint multistr: true */
/**
 * Mijn Gegevens widget script
 * Dependencies: null
 */
(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyPersonalDetails's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.MyPersonalDetailsWidget = {

    attach: function () {

      $('.my_personal_details article h2').on('click', function () {
        $(this).parent('article').toggleClass('open')
          .siblings().removeClass('open');
      });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);
