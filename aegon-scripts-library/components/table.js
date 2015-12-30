(function(doc, win, $, Drupal) {

  'use strict';

  /**
   * MyDocuments's Drupal script.
   * Add new item to public Drupal object
   */
  Drupal.behaviors.table_sort_filter = {

    attach: function () {
      this.createTable('.table');
    },

    createTable: function(table_class, options) {

      var defaults = {
        info: true,
        orderClasses: false,
        oLanguage: {
          sInfo: "_END_ van _TOTAL_ documenten",
          sInfoEmpty: "Geen resultaten gevonden",
          sInfoFiltered: "",
        },
        target: '.narrow-td',
        bFilter: true,
        aoColumns: [
            null,
            null,
            { sType: "date-eu" },
            null  
        ],
        ordering: true,
        responsive: true,
        pageLength: 5,
        order: [ 2, 'desc' ],
        "fnDrawCallback": function( oSettings ) {
          // Callback function, check if there are more or less than 5 queries and show/hide the Show all button
          if(oSettings.fnRecordsTotal() <= 5) {
            $(this).parent().next('.show-all-payments').hide();
          }
        },
        fnInitComplete: function() {
          var that = $(this),
              api = this.api(),
              showAllButton = that.parent().next('.show-all-payments');

          // Show less or more entires clicking on Toon alles
          showAllButton.on('click', function(){ 
            $(this).hasClass('changed') ? api.page.len(5).draw() : api.page.len(-1).draw();
            $(this).toggleClass('changed');
          });

          // Hide / show Toon alles button depending on the amount of results
          $(table_class).on( 'search.dt', function () {
            if(api.page.info().recordsDisplay <= 5) {
              showAllButton.hide();
            } else {
              showAllButton.show();
            }
          });

          // Set placeholder for searchbox 
          that.parent().find('.dataTables_filter input').attr("placeholder", "Zoeken");
        }
      };

      var settings = $.extend({}, defaults, options);

      // Init table
      $(table_class).DataTable(settings); 

    }

  };

})(this.document, this, this.jQuery, this.Drupal);

