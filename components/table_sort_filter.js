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
        "orderClasses": true,
        "type": 'column',
        "target": '.narrow-td',
        "order": [[ 3, "desc" ]],
        "responsive": true
      }
    );

      // show max 5 rows
      $('#sortabletable tr:gt(5)').hide();
      // add placeholder to input
      $('.dataTables_filter input').attr("placeholder", "Zoeken");
        $(".docs-show-all").click(function(){
          $('#sortabletable tr:gt(5)').toggle();
          // rotate arrow
          $('.docs-show-all').toggleClass('changed');
     });

    }
  };

})(this.document, this, this.jQuery, this.Drupal);

