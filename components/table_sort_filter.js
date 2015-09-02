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
  Drupal.behaviors.table_sort_filter = {

    attach: function () {
      $('#sortabletable').DataTable({
      	"info": false,
      /*	"orderFixed": [ 2, 'asc' ], */
      	"orderClasses": false
  		}
      );

      // show max 5 rows
      $('#sortabletable tr:gt(5)').hide();
        $(".docs-show-all").click(function(){
          $('#sortabletable tr:gt(5)').toggle();
          // rotate arrow
          $('.docs-show-all').toggleClass('changed');
        });
    }
  };

})(this.document, this, this.jQuery, this.Drupal);

