(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table_sort_filter = {

    attach: function () {
      this.sortTable('.sortabletable', '.sortable', 2);
    },

    sortTable: function (table_class, div_class, sortDefColumn) {

      var table = $(table_class).DataTable({
        "info": true,
        "oLanguage": {
          "sInfo": "_END_ van _TOTAL_ documenten",
          "sInfoEmpty": "Geen resultaten gevonden",
          "sInfoFiltered": "",
        },
        "orderClasses": false,
        "target": '.narrow-td',
        "aoColumns": [
          null,
          null,
          { "sType": "date-eu" },
          null  
          ],
        "ordering": true,
        "responsive": true,
        "pageLength": 5,
        "order": [ sortDefColumn, 'desc' ],
        "fnDrawCallback": function( oSettings ) {
          // Callback function, check if there are more or less than 5 queries and show/hide the Show all button
          if(oSettings.fnRecordsTotal() <= 5) {
            console.log(oSettings.fnRecordsTotal() );
            $('.docs-show-all'+div_class).hide();
          }
        }
      });

      var wrapperId = $(table_class).attr('id')+'_wrapper';
    
      // On search, check if there are more or less than 5 results , hide or show Show all button
      $(table_class).on( 'search.dt', function () {
        if(table.page.info().recordsDisplay <= 5) {
          $('.docs-show-all'+div_class).hide();
        } else {
          $('.docs-show-all'+div_class).show();
        }
      });

      // Adds placeholder to the search bar
      $('#' + wrapperId + ' .dataTables_filter input').attr("placeholder", "Zoeken");
   
      $('.docs-show-all'+div_class).on('click', function(){ 
        if($(this).hasClass('changed')) {
          $(this).removeClass('changed');
          table.page.len(5).draw();
        } else {
          $(div_class).toggleClass('changed');
          table.page.len(-1).draw();
        }
      });
    },
  };

})(this.document, this, this.jQuery, this.Drupal);

