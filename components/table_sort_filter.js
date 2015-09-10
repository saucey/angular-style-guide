(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table_sort_filter = {

    attach: function () {

      var table = $('#sortabletable').DataTable({
        "info": false,
        "orderClasses": false,
        "type": 'column',
        "target": '.narrow-td',
        "order": [[ 3, "desc" ]],
        "responsive": true,
        "pageLength": 5
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

     //  // show max 5 rows
     //  $('#sortabletable tr:gt(5)').hide();
     //  // add placeholder to input
     //  $('.dataTables_filter input').attr("placeholder", "Zoeken");
     //    $(".docs-show-all").click(function(){
     //      $('#sortabletable tr:gt(5)').toggle();
     //      // rotate arrow
     //      $('.docs-show-all').toggleClass('changed');
     // });

    }
  };

})(this.document, this, this.jQuery, this.Drupal);

