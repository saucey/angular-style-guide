(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table_sort_filter = {

    attach: function () {

      var table = $('.sortabletable').DataTable({
        "info": false,
        "orderClasses": false,
        "target": '.narrow-td',
        "order": [[ 3, "desc" ]],
        "responsive": true,
        "pageLength": 5,
        "columnDefs": [
        { type: 'date-dd-mm-yyyy', targets: 0 }
        ]
      }
    );

      $('.docs-show-all').on('click', function(){ 
        if($(this).hasClass('changed')) {
          $(this).removeClass('changed');
          table.page.len(5).draw();
        } else {
          $('.docs-show-all').toggleClass('changed');
          table.page.len(-1).draw();
        }
      });

    }
  };

})(this.document, this, this.jQuery, this.Drupal);

